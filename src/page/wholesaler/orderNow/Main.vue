<template>
	<v-card class="pa-3" rounded flat>
        <v-row dense>
            <v-col cols="12">
                <v-row dense class="d-flex justify-center">
                    <v-col cols="12" md="10" xs="12">
                        <v-row dense class="d-flex justify-space-between bg-search pa-3">
                            <v-col cols=12 md="6" xs="12" class="d-flex justify-start align-center">
                                <div class="sign-up-subtitle d-flex align-center">주문 현황</div>
                            </v-col> 
                            <v-col cols=12 md="6" sm="12" class="d-flex justify-center align-center">
                                <v-row dense>
                                    <v-col cols="12" md="8" sm="12" class="d-flex justify-center align-center">
                                        <span class="ma-0 pa-1 font-size-8" style="font-weight: bold;">조회 기간</span>
                                        <div class="d-flex jusitfy-center align-center w-30">
                                            <picker-date-picker-component
                                                prepend-inner-icon="mdi-calendar"
                                                dense
                                                outlined
                                                hide-details
                                                v-model="searchData.startTime"
                                            >
                                            </picker-date-picker-component>
                                            ~
                                            <picker-date-picker-component
                                                prepend-inner-icon="mdi-calendar"
                                                dense
                                                outlined
                                                hide-details
                                                v-model="searchData.endTime"
                                            >
                                            </picker-date-picker-component>
                                        </div>
                                    </v-col>
                                    <v-col cols="12" md="4" sm="12" class="d-flex justify-end align-center pl-2">
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
                                                @click="submit()"
                                            >검색</v-btn>
                                        </div>
                                    </v-col>
                                </v-row>
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
                            :sort-by="dataTable.sortBy"
                            :sort-desc="dataTable.sortDesc"
                            multi-sort
                            @click:multiButton="clickMultiButton($event)"
                            @tablePage="tablePage"
                        ></data-table-custom-component>
                    </v-col>
                    <v-col cols="10" class="d-flex justify-end">
                        <v-btn class="btn-order" @click="saveOrder()">저장</v-btn>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-card>
</template>
<script>
import isValidJwt from '@/utils';
import axios from 'axios';
import DataTableCustom from '@/components/DataTableCustom.vue';
import DatePicker from '@/components/DatePicker.vue';
import moment from 'moment';
export default{
	data(){
		return {
            DataTableCustom,
            DatePicker,	
			dataentry:{
                name:"",
				department:"",
			},
            dataTable: {
				headers : [
                    {
                        text: '주문일자', value: 'orderDate', align: 'center', cellClass: 'minw-10 text-center',
                    },
                    {
                        text: '주문고객', value: 'user_name', align: 'center', cellClass: 'minw-10 text-center',
                    },
                    {
                        text: '연락처', value: 'user_mobile_no', align: 'center', cellClass: 'minw-10 text-center',
                    },
                    // {
                    //     text: '매장명', value: 'store_name', align: 'center', cellClass: 'minw-10 text-center',
                    // },
                    // {
                    //     text: '주소', value: 'store_location', align: 'center', cellClass: 'minw-10 text-center',
                    // },
                    {
                        text: '상품명', value: 'item', align: 'center', cellClass: 'minw-20 text-center',
                    },
                    {
                        text: '색상', value: 'color', align: 'center', cellClass: 'minw-10 text-center',
                    },
                    {
                        text: '사이즈', value: 'size', align: 'center', cellClass: 'minw-10 text-center',
                    },
                    {
                        text: '가능여부', value: 'available_status', align: 'center', cellClass: 'minw-10 w-10 text-center', type: 'autocomplete'
                    },
                    {
                        text: '비고', value: 'comment', align: 'center', cellClass: 'minw-15 text-center', type: 'textField'
                    },
				],
                page: 1,
                itemsPerPage: 10,
                totalRows: 10,
                loading: false,
				items: [
                ],
                cell: {
                    autocomplete: {
                        available_status: {
                            items: [
                                {text: '가능', value: 'T'},
                                {text: '부분 가능', value: 'P'},
                                {text: '추후 가능', value: 'A'},
                                {text: '품절', value: 'X'}
                            ],
                        },
                    },
                }
			},
            value: null,
            item: [],
            searchData: {
                userId: '',
                startTime: '',
                endTime: '',
                text: '',
                storeId: '',
            }
		};
	},
	methods: {
        tablePage(page) {
            this.page = page;
        },
		async submit() {
            this.dataTable.loading = true;
            axios("/order/get-all", {
              method: "post",
              data: {...this.searchData, page: this.page},
            })
            .then((response) => {
                console.log(response);
                this.item = response.data.data;
            })
            .catch((error) => {
                console.log(error);
            });
            this.dataTable.loading = false;
            this.searchData.startTime = '';
            this.searchData.endTime = '';
            this.searchData.text = '';
        },
        saveOrder() {
            this.dataTable.loading = true;
            axios("http://127.0.0.1:5000/order/save-order-list", {
              method: "post",
              data: this.dataTable.items,
            })
            .then((response) => {
                console.log(response.data);
                if (response.data === true) {
                    alert("저장완료");
                    this.$router.go(0);
                }
                else alert("저장실패");
            })
            .catch((error) => {
                console.log(error);
            });
        this.dataTable.loading = false;
            this.searchData.startTime = '';
            this.searchData.endTime = '';
            this.searchData.text = '';
        },
        loginCheck() {
			if (isValidJwt()) {
				let data = JSON.parse(atob(localStorage.token.split('.')[1]))
                // this.searchData.userId = String(data.userId);
                this.searchData.storeId = String(data.storeId);
				;
                this.submit();
			} else {
				this.$router.push({
					path: '/sign-in'
				}).catch(error => {})
			}
		},
	},
	mounted() {
        this.searchData.userId = this.$route.query.customer ? this.$route.query.customer : null;
        console.log(this.searchData);
        this.loginCheck();
	},
    watch: {
        "item": {
            handler(n) {
                this.dataTable.totalRows = n.length
                n.forEach(e => {
                    e.orderDate = moment(e.created_date).format('YYYY-MM-DD');
                })
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
}
</script>

<style>
</style>