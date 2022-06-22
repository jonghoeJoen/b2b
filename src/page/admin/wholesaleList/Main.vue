<template>
    <v-card class="pa-3" rounded flat>
        <v-row>
            <v-col class="col-12">
                <v-row class="d-flex justify-center">
                    <v-col cols="10" class="d-flex justify-space-between">
                        <div class="sign-up-subtitle">admin 도매처 리스트</div>
                        <div class="d-flex justify-center align-center">
                            <v-text-field
                                dense
                                outlined
                                class="pa-0"
                                hide-details="auto"   
                            ></v-text-field>
                            <v-btn
                                class="pa-0 btn-black"
                            >검색</v-btn>
                        </div>
                    </v-col>
                    <v-col cols="10">
                        <data-table-custom-component
                            class="th-center"
                            dense
                            countHide
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
                                + 새 거래처 등록
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
            :value.sync="dialog.orderValue"
            :requestId.sync="dialog.requestId"
        ></order-modify>
    </v-card>
</template>
<script>
import Vue from 'vue';
import axios from 'axios';
import newAccount from '../../../components/newAccount.vue';
import OrderModify from '../../../components/orderModify.vue';
import DataTableCustom from '@/components/DataTableCustom.vue';
export default Vue.extend({
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
                        text: '번호', sortable: true, value: 'id', align: 'center', cellClass: 'w-10 text-center',
                    },
                    {
                        text: '매장명', sortable: true, value: 'store_name', align: 'center', cellClass: 'w-10 text-center',
                    },
                    {
                        text: '주소', sortable: true, value: 'postcode', align: 'center', cellClass: 'w-10 text-center',
                    },
                    {
                        text: '매장 휴대전화', sortable: true, value: 'phone_no', align: 'center', cellClass: 'w-10 text-center',
                    },
                    {
                        text: '매장 유선번호', sortable: true, value: 'mobile_no', align: 'center', cellClass: 'w-10 text-center',
                    },
                    {
                        text: '주문하기', value: 'order', align: 'center', cellClass: 'w-10 text-center', type: 'multiButton',
                    },
				],
				items: [],
                loading: false,
                page: 1,
                itemsPerPage: 10,
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
                    },
                },
			},
            dialog: {
                accountValue: false,
                requestId: null,
                orderValue: false,
            },
            item: [],
            page: 1,
		};
	},
	methods: {
        tablePage(page) {
            this.page = page;
        },
        dialogChange() {
            this.dialog.accountValue = true;
        },
        order(data) {
            this.dialog.orderValue = true;
            console.log(data);
        },
        clickMultiButton(data) {
            console.log(data);
            if(data.header == 'order') {
                this.dialog.requestId = data.item.id;
                this.dialog.orderValue = true; 
            }
        },
		async submit() {
            this.dataTable.loading = true;
            axios("http://127.0.0.1:5000/shop/get-all", {
              method: "post",
              data: {page: this.page},
            })
            .then((response) => {
                this.item = response.data.data;
            })
            .catch((error) => {
                console.log(error);
            });
            this.dataTable.loading = false;
        },
	},
	mounted() {
        this.submit();
	},
    watch: {
        "item": {
            handler(n) {
                this.dataTable.totalRows = n.length
                this.dataTable.items = n;
            },
            deep: true
        },
        "page": {
            handler(n) {
                this.submit();
            },
            deep: true
        }
    }
})
</script>

<style>
</style>