<template>
    <v-card class="pa-3" rounded flat>
        <v-row>
            <v-col class="col-12">
                <v-row class="d-flex justify-center" dense>
                    <v-col cols="10" class="d-flex justify-space-between">
                        <div class="sign-up-subtitle">즐겨찾기</div>
                        <div class="d-flex justify-center align-center">
                        </div>
                    </v-col>
                    <v-col cols="10" class="pa-0">
                        <data-table-custom-component
                            class="th-center"
                            dense
                            download-hide
                            upload-hide
                            add-hide
                            remove-hide
                            countHide
                            itemsPerPageHide
                            :headers="dataTableFavorites.headers"
                            :items="dataTableFavorites.items"
                            :totalRows="dataTableFavorites.totalRows"
                            :loading="dataTable.loading"
                            :page="dataTable.page"
                            :search="dataTable.search"
                            :items-per-page="dataTableFavorites.itemsPerPage"
                            :cell="dataTableFavorites.cell"
                            multi-sort
                            content-class="tableline equipment-table td50"
                            @click:multiButton="clickMultiButton($event)"
                            @tablePage="favorTablePage"
                        >
                        </data-table-custom-component>
                    </v-col>
                    <v-col cols="10" class="d-flex justify-space-between">
                        <v-row dense class="d-flex justify-center align-center">
                            <v-col cols="12" md="4" sm="12" class="d-flex justify-start align-center">
                                <div class="sign-up-subtitle">도매처 리스트</div>
                            </v-col>
                            <v-col cols="12" md="8" sm="12" class="d-flex justify-end align-center pl-2">
                                <div>
                                    <v-select
                                        dense
                                        outlined
                                        autocomplete="on"
                                        type="text"
                                        hide-details="auto"
                                        :items="building.items"
                                        v-model="searchData.buildingNum"
                                        item-text="name"
                                        item-value="id"
                                    ></v-select>
                                </div>
                                <div class="d-flex jusitfy-center align-center w-40">
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
        <order-modify
            :value.sync="orderDialog.orderValue"
            :wholesaleStore.sync="orderDialog.store"
        ></order-modify>
    </v-card>
</template>
<script>
import Vue from 'vue';
import axios from 'axios';
import newAccount from '../../../components/newAccount.vue';
import OrderModify from '../../../components/orderModify.vue';
import DataTableCustom from '@/components/DataTableCustom.vue';
import isValidJwt from '@/utils';
export default {
  components: { newAccount, OrderModify},
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
                        text: '번호', value: 'id', align: 'center', cellClass: 'minw-10 text-center',
                    },
                    {
                        text: '건물명', value: 'name', align: 'center', cellClass: 'minw-10 text-center',
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
                    {
                        text: '즐겨찾기', value: 'favorAdd', align: 'center', cellClass: 'minw-10 text-center', type: 'multiButton',
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
                                    contentClass: 'elevation-1 btn-order',
                                    title: '주문하기',
                                },
                            ]
                        },
                        favorAdd: {
                            buttonList: [
                                {
                                    color: 'view',
                                    contentClass: 'elevation-1 btn-order',
                                    title: '등록하기',
                                },
                            ]
                        },
                    },
                },
			},
            dataTableFavorites: {
				headers : [
                    {
                        text: '매장명', value: 'store_name', align: 'center', cellClass: 'minw-10 text-center',
                    },
                    {
                        text: '건물명', value: 'name', align: 'center', cellClass: 'minw-10 text-center',
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
                    {
                        text: '즐겨찾기', value: 'favorDel', align: 'center', cellClass: 'minw-10 text-center', type: 'multiButton',
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
                                    contentClass: 'elevation-1 btn-order',
                                    title: '주문하기',
                                },
                            ]
                        },
                        favorDel: {
                            buttonList: [
                                {
                                    color: 'view',
                                    contentClass: 'elevation-1 btn-order',
                                    title: '삭제하기',
                                },
                            ]
                        },
                    },
                },
			},
            orderDialog: {
                accountValue: false,
                store: null,
            },
            dialog: {
                accountValue: false,
                requestId: null,
                orderValue: false,
            },
            item: [],
            page: 1,
            favorPage: 1,
            searchData: {
                userId: '',
                startTime: '',
                endTime: '',
                text: '',
                storeId: '',
                buildingNum: '',
            },
            buildingSearchData: {
                parent_id: '1',
            },
            building: {
                items: [],
            },
		};
	},
	methods: {
        tablePage(page) {
            this.page = page;
        },
        favorTablePage(page) {
            this.favorPage = page;
        },
        dialogChange() {
            this.dialog.accountValue = true;
        },
        order(data) {
            this.dialog.orderValue = true;
            ;
        },
        clickMultiButton(data) {
            // 주문하기
            if(data.header == 'order') {
                this.orderDialog.store = data.item;
                this.orderDialog.orderValue = true; 
                console.log(this.orderDialog)
            } else if (data.header == 'favorAdd') {
                ;
                for(let i = 0; i < this.dataTableFavorites.items.length; i++) {
                    if(data.item.id == this.dataTableFavorites.items[i].store_id) {
                        alert('이미 즐겨찾기에 등록된 업체입니다.')
                        return;
                    }
                }
                let userData = { userId : this.searchData.userId, storeId: String(data.item.id)}
                this.createFavor(userData);
            } else if (data.header == 'favorDel') {
                let userData = { userId : this.searchData.userId, storeId: String(data.item.id)}
                this.delFavor(userData);
            }
        },
		async loadStore() {
            let totalRows = 0;
            this.dataTable.loading = true;
            axios("/shop/get-all", {
              method: "post",
              data: {...this.searchData, page: this.page},
            })
            .then((response) => {
                this.dataTable.totalRows = response.data.total_pages;
                this.dataTable.loading = false;
                this.searchData.startTime = '';
                this.searchData.endTime = '';
                this.searchData.text = '';
                this.item = response.data.data;
                this.dataTable.items = this.item;
            })
            .catch((error) => {
            });
        },
		async createFavor(data) {
            this.dataTableFavorites.loading = true;
            axios("/favor/create", {
              method: "post",
              data: data,
            })
            .then((response) => {
            })
            .catch((error) => {
            });
            this.dataTableFavorites.loading = false;
            alert('등록되었습니다.')
            this.$router.go(0);
        },
		async delFavor(data) {
            this.dataTableFavorites.loading = true;
            axios("/favor/delete", {
              method: "post",
              data: data,
            })
            .then((response) => {
            })
            .catch((error) => {
            });
            this.dataTableFavorites.loading = false;
            alert('즐겨찾기가 해제 되었습니다.')
            this.$router.go(0);
        },
		async loadFavor() {
            this.dataTableFavorites.loading = true;
            axios("/favor/get-all", {
              method: "post",
              data: {search: this.searchData, page: this.favorPage},
            })
            .then((response) => {
                this.dataTableFavorites.items = response.data.data;
                this.dataTableFavorites.totalRows = response.data.total_pages;
            })
            .catch((error) => {
            });
            this.dataTableFavorites.loading = false;
		},
        loadCodeList() {
            axios("/code/get-all", {
                method: "post",
                data: this.buildingSearchData,
            })
            .then((response) => {
                this.building.items = response.data.data
            })
            .catch((error) => {
            });
        },
	},
	mounted() {
        console.log(this.date)
        this.searchData.userId = this.$store.getters['GET_USER_ID'];
        console.log(this.searchData)
        this.loadCodeList();
        this.loadStore();
        this.loadFavor();
    },
    watch: {
        "page": {
            handler(n) {
                this.loadStore();
            },
            deep: true
        },
        "favorPage": {
            handler(n) {
                this.loadFavor();
            },
            deep: true
        },
    },
}
</script>

<style>
</style>