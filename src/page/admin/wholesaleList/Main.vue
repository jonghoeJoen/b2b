<template>
    <v-card class="pa-3" rounded flat>
        <v-row>
            <v-col class="col-12">
                <v-row class="d-flex justify-center" dense>
                    <v-col cols="10" class="d-flex justify-space-between">
                        <v-row dense class="d-flex justify-center align-center">
                            <v-col cols="12" md="4" sm="12" class="d-flex justify-start align-center">
                                <div class="sign-up-subtitle">도매처 리스트 - admin</div>
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
                                        @click="loadStore()"
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
                    <v-col cols="10">
                        <div style="width:100%; display:flex; justify-content: end;">
                            <v-btn 
                                @click="dialogChange()">
                                <v-icon
                                    small
                                    dark
                                >
                                    mdi-plus-circle-outline
                                </v-icon>
                                새 거래처 등록
                            </v-btn>
                        </div>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
        <new-account
            :value.sync="dialog.accountValue"
        ></new-account>
        <!-- <order-modify
            :value.sync="dialog.orderValue"
            :requestId.sync="dialog.requestId"
        ></order-modify> -->
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
// import OrderModify from '../../../components/orderModify.vue';
import CheckOrder from '../../../components/checkOrder.vue';
import DataTableCustom from '@/components/DataTableCustom.vue';
import isValidJwt from '@/utils';

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
                    // {
                    //     text: '번호', value: 'id', align: 'center', cellClass: 'minw-10 text-center',
                    // },
                    {
                        text: '건물명', value: 'building_num', align: 'center', cellClass: 'minw-10 text-center',
                    },
                    {
                        text: '매장명', value: 'store_name', align: 'center', cellClass: 'minw-10 text-center',
                    },
                    {
                        text: '주소', value: 'store_location', align: 'center', cellClass: 'minw-10 text-center',
                    },
                    {
                        text: '매장 휴대전화', value: 'phone_no', align: 'center', cellClass: 'minw-10 text-center',
                    },
                    {
                        text: '매장 유선번호', value: 'mobile_no', align: 'center', cellClass: 'minw-10 text-center',
                    },
                    {
                        text: '주문하기', value: 'order', align: 'center', cellClass: 'minw-10 text-center', type: 'multiButton',
                    },
				],
				items: [],
                loading: false,
                page: 1,
                itemsPerPage: 20,
                totalRows: 10,
                cell: {
                    multiButton: {
                        order: {
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
            if(data.header == 'order') {
                this.dialog.requestId = data.item.id;
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
		async loadStore() {
            this.dataTable.loading = true;
            axios("/shop/get-all", {
              method: "post",
              data: {...this.searchData, page: this.page},
            })
            .then((response) => {
                // console.log()
                this.item = response.data.data;
                this.dataTable.items = this.item;
                this.dataTable.totalRows = response.data.total_pages;
            })
            .catch((error) => {
            });
            this.dataTable.loading = false;
            this.searchData.startTime = '';
            this.searchData.endTime = '';
            this.searchData.text = '';
        },
	},
	mounted() {
        this.searchData.userId = this.$store.getters['GET_USER_ID'];
        // this.searchData.storeId = store.getters['GET_STORE_ID'];
        this.loadStore();
    },
    watch: {
        // "item": {
        //     handler(n) {
        //         this.dataTable.totalRows = n.length
        //         this.dataTable.items = n;
        //     },
        //     deep: true
        // },
        "page": {
            handler(n) {
                this.loadStore();
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