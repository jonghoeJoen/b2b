<template>
    <v-card class="pa-3" rounded flat>
        <v-row>
            <v-col class="col-12">
                <v-row class="d-flex justify-center">
                    <v-col cols="10" class="d-flex justify-space-between">
                        <div class="sign-up-subtitle">도매처 리스트</div>
                        <div class="d-flex justify-center align-center">
                                <v-text-field
                                    class="pa-0"
                                    hide-details="auto"    
                                ></v-text-field>
                                <v-btn>검색</v-btn>
                        </div>
                    </v-col>
                    <v-col cols="10">
                        <v-data-table
                            :headers="dataTable.headers"
                            :items="dataTable.item"
                            hide-default-footer
                            class="elevation-1"
                        ></v-data-table>
                    </v-col>
                    <v-col cols="10">
                        <div style="width:100%; display:flex; justify-content: end;">
                            <v-btn>
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
// import axios from 'axios';
import newAccount from '../../../components/newAccount.vue';
import OrderModify from '../../../components/orderModify.vue';
export default{
  components: { newAccount, OrderModify },
	data(){
		return {
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
                        text: '주문하기', sortable: true, value: 'phone2', align: 'center', cellClass: 'w-10 text-center',
                    },
				],
				item: [
                    { id: 1, storeName: 'test', postcode: 'tewstsetsets', phone1: '010-0000-0000', phone2: '02)000-0000'}
                ],
			},
            dialog: {
                accountValue: false,
                orderValue: false,
            }
		};
	},
	methods: {
        // dialogChange() {
        //     this.dialog.accountValue = true;
        // },
        // order(data) {
        //     this.dialog.orderValue = true;
        //     console.log(data);
        // },
		// submit() {
		// 	const path = 'http://127.0.0.1:5000/dataentry'
		// 	const data = axios.post(path, {
		// 		name:this.dataentry.name,
		// 		department:this.dataentry.department,
		// 	}
		// )
		// data.then(response => {
		// 	this.items = response;
		// })
		// .catch(err =>{
		// 	console.log(err);
		// });
		// },
	},
	mounted() {
	}
}
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