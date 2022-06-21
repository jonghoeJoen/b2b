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
                            itemsPerPageHide
                            countHide
                            :headers="dataTable.headers"
                            :items="dataTable.items"
                            :totalRows="dataTable.totalRows"
                            :loading="dataTable.loading"
                            :page="dataTable.page"
                            :search="dataTable.search"
                            :items-per-page="dataTable.itemsPerPage"
                            :cell="dataTable.cell"
                            :sort-by="dataTable.sortBy"
                            :sort-desc="dataTable.sortDesc"
                            multi-sort
                            content-class="tableline equipment-table td50"
                            @click:multiButton="clickMultiButton($event)"
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
                        text: '매장명', sortable: true, value: 'storeName', align: 'center', cellClass: 'w-10 text-center',
                    },
                    {
                        text: '주소', sortable: true, value: 'postcode', align: 'center', cellClass: 'w-10 text-center',
                    },
                    {
                        text: '매장 휴대전화', sortable: true, value: 'phone1', align: 'center', cellClass: 'w-10 text-center',
                    },
                    {
                        text: '매장 유선번호', sortable: true, value: 'phone2', align: 'center', cellClass: 'w-10 text-center',
                    },
                    {
                        text: '주문하기', value: 'order', align: 'center', cellClass: 'w-10 text-center', type: 'multiButton',
                    },
				],
				items: [
                    { id: 1, storeName: 'test', postcode: 'tewstsetsets', phone1: '010-0000-0000', phone2: '02)000-0000'},
                    { id: 2, storeName: 'test', postcode: 'tewstsetsets', phone1: '010-0000-0000', phone2: '02)000-0000'},
                    { id: 3, storeName: 'test', postcode: 'tewstsetsets', phone1: '010-0000-0000', phone2: '02)000-0000'},
                ],
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
                orderValue: false,
            }
		};
	},
	methods: {
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
                console.log(data);
                this.dialog.orderValue = true; 
            }
        },
		submit() {
			const path = 'http://127.0.0.1:5000/store'
			const data = axios.post(path, {
				name:this.dataentry.name,
				department:this.dataentry.department,
			}
		    )
            data.then(response => {
                console.log(response);
                this.items = response;
            })
            .catch(err =>{
                console.log(err);
            });
		},
	},
	mounted() {
        this.submit();
	}
})
</script>

<style>
.sign-up-title {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 700;
    font-size: 50px;
    line-height: 61px;
}

.sign-up-subtitle {
    font-family: 'Work Sans';
    font-style: normal;
    font-weight: 700;
    font-size: 20px;
    line-height: 23px;
    letter-spacing: -0.02em;
}

.sign-up-menu {
    font-family: 'Noto Sans KR';
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 29px;
}
</style>