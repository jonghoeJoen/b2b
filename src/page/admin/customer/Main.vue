<template>
    <v-card class="pa-3" rounded flat>
        <v-row>
            <v-col class="col-12">
                <v-row class="d-flex justify-center" dense>
                    <v-col cols="10" class="d-flex justify-space-between">
                        <v-row dense class="d-flex justify-center align-center">
                            <v-col cols="12" md="4" sm="12" class="d-flex justify-start align-center">
                                <div class="sign-up-subtitle">판매처 리스트</div>
                            </v-col>
                            <v-col cols="12" md="8" sm="12" class="d-flex justify-end align-center pl-2">
                                <div class="d-flex jusitfy-center align-center" style="width:100%">
                                    <v-text-field
                                        dense
                                        outlined
                                        class="pr-2"
                                        hide-details="auto" 
                                        v-model="searchData.text"  
                                    ></v-text-field>
                                    <v-btn
                                        class="pa-0 btn-black"
                                        @click="loadRetails()"
                                    >검색</v-btn>
                                </div>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col cols="10">
                        <data-table-custom-component
                            class="th-center"
                            dense
                            download-hide
                            upload-hide
                            add-hide
                            remove-hide
                            countHide
                            itemsPerPageHide
                            :headers="dataTable.headers"
                            :items="dataTable.items"
                            :totalRows="dataTable.totalRows"
                            :loading="dataTable.loading"
                            :page="dataTable.page"
                            :search="dataTable.search"
                            :items-per-page="dataTable.itemsPerPage"
                            :cell="dataTable.cell"
                            multi-sort
                            content-class="tableline equipment-table td50"
                            @click:multiButton="clickMultiButton($event)"
                            @tablePage="tablePage"
                        >
                        </data-table-custom-component>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
        <new-account
            :value.sync="dialog.accountValue"
        ></new-account>
        <check-order
            :value.sync="dialog.orderValue"
            :requestId.sync="dialog.requestId"
        >
        </check-order>
    </v-card>
</template>
<script>
import Vue from 'vue';
import axios from 'axios';
import newAccount from '../../../components/newAccount.vue';
import CheckOrder from '../../../components/checkOrder.vue';
import DataTableCustom from '@/components/DataTableCustom.vue';
import isValidJwt from '@/utils';
import store from '@/store';

export default {
  components: { newAccount, CheckOrder},
	data(){
		return {
            DataTableCustom,
			dataentry:{
				name:"",
				department:"",
			},
            dataTable: {
				headers : [
                    {
                        text: '업체명', value: 'store_name', align: 'center', cellClass: 'minw-10 text-center',
                    },
                    {
                        text: '아이디', value: 'username', align: 'center', cellClass: 'minw-10 text-center',
                    },
                    {
                        text: '주소', value: 'address', align: 'center', cellClass: 'minw-10 text-center',
                    },
                    {
                        text: '전화번호', value: 'mobile_no', align: 'center', cellClass: 'minw-10 text-center',
                    },
                    {
                        text: '주문 내역', value: 'orderHistory', align: 'center', cellClass: 'minw-10 text-center', type: 'multiButton',
                    },
				],
				items: [],
                loading: false,
                page: 1,
                itemsPerPage: 20,
                totalRows: 10,
                cell: {
                    multiButton: {
                        orderHistory: {
                            buttonList: [
                                {
                                    color: 'view',
                                    contentClass: 'elevation-1 rounded-sm btn-black',
                                    title: '주문현황',
                                },
                            ]
                        },
                    },
                },
			},
            dialog: {
                accountValue: false,
                requestId: null,
                orderValue: false,
                testValue:false,
            },
            item: [],
            page: 1,
            searchData: {
                userId: '',
                startTime: '',
                endTime: '',
                text: '',
                storeId: '',
                buildingNum: '',
                retailName: '',
            },
		};
	},
	methods: {
        tablePage(page) {
            this.page = page;
        },
        dialogChange() {
            this.dialog.accountValue = true;
        },
        clickMultiButton(data) {
            if(data.header == 'orderHistory') {
                this.dialog.requestId = data.item.user_id;
                this.dialog.orderValue = true; 
            } else if (data.header == 'favorAdd') {
                for(let i = 0; i < this.dataTableFavorites.items.length; i++) {
                    if(data.item.id == this.dataTableFavorites.items[i].store_id) {
                        alert('이미 즐겨찾기에 등록된 업체입니다.')
                        return;
                    }
                }
                let userData = { userId : this.searchData.userId, storeId: String(data.item.id)}
                this.creatdFavor(userData);
            } else if (data.header == 'favorDel') {
                let userData = { userId : this.searchData.userId, storeId: String(data.item.id)}
                this.delFavor(userData);
            }
        },
		async loadRetails() {
            this.dataTable.loading = true;
            let response = await axios("/api/user/get-retail-stores", {
              method: "post",
              data: {...this.searchData, page: this.page},
            });
            this.item = response.data.data;
            this.dataTable.items = this.item;
            this.dataTable.totalRows = response.data.total_rows;
            this.dataTable.loading = false;
            this.searchData.startTime = '';
            this.searchData.endTime = '';
            this.searchData.text = '';
        },
        loginCheck() {
            // 도매처에 url 공유한 경우 자동 로그인
            if (Object.keys(this.$route.query).includes('shared')) {
                    this.urlShared = true;
                    axios("/api/login/wholesaler-login", {
                        method: "post",
                        data: {
                        storeId: this.$route.query.store
                        },
                    }).then((res) => {
                        localStorage.token = res.data.token

                        if (isValidJwt()) {
                        let data = JSON.parse(atob(localStorage.token.split('.')[1]))
                        this.username = data.username;
                        this.userRole = data.role;
                        this.userId = data.userId;
                        this.storeId = data.storeId;
                        store.commit('SET_USER_ROLE', this.userRole);
                        store.commit('SET_USER_ID', this.userId);
                        store.commit('SET_STORE_ID', this.storeId);
                    }
                    }).catch((error) => {
                        alert("로그인 실패!");
                        return;
                    });
                }

            else if (isValidJwt()) {
                let data = JSON.parse(atob(localStorage.token.split('.')[1]))
                this.username = data.username;
                this.userRole = data.role;
                this.userId = data.userId;
                this.storeId = data.storeId;
                store.commit('SET_USER_ROLE', this.userRole);
                store.commit('SET_USER_ID', this.userId);
                store.commit('SET_STORE_ID', this.storeId);
            } else {
                store.commit('SET_URL_BEFORE_LOGIN', window.location.pathname + window.location.search);
                // 로그인페이지로 이동
                this.$router.push({
                    path: '/sign-in'
                }).catch(error => {})
            }
        },
	},
	mounted() {
        this.loginCheck();

        this.searchData.userId = this.$store.getters['GET_USER_ID'];
        // this.searchData.storeId = store.getters['GET_STORE_ID'];
        this.loadRetails();
    },
    watch: {
        "page": {
            handler(n) {
                this.loadRetails();
            },
            deep: true
        }
    },
    created() {
    }
}
</script>

<style>
</style>