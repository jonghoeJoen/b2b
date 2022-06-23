<template>
	<v-card class="pa-3" rounded flat>
        <v-row>
            <v-col class="col-12">
                <v-row class="d-flex justify-center">
                    <v-col cols="10" class="d-flex justify-space-between">
                        <div class="sign-up-subtitle">주문 현황</div>
                        <div class="d-flex justify-center align-center">
                            조회 기간
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
                            <v-text-field
                                dense
                                outlined
                                class="pa-0"
                                hide-details="auto" 
                                v-model="searchData.text"  
                            ></v-text-field>
                            <v-btn
                                class="pa-0 btn-black"
                                @click="submit()"
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
                        text: '주문일자', sortable: true, value: 'orderDate', align: 'center', cellClass: 'w-10 text-center',
                    },
                    {
                        text: '매장명', sortable: true, value: 'store_name', align: 'center', cellClass: 'w-10 text-center',
                    },
                    {
                        text: '주소', sortable: true, value: 'postcode', align: 'center', cellClass: 'w-10 text-center',
                    },
                    {
                        text: '상품명', sortable: true, value: 'item', align: 'center', cellClass: 'w-10 text-center',
                    },
                    {
                        text: '색상', sortable: true, value: 'color', align: 'center', cellClass: 'w-10 text-center',
                    },
                    {
                        text: '사이즈', sortable: true, value: 'size', align: 'center', cellClass: 'w-10 text-center',
                    },
                    {
                        text: '가능여부', sortable: true, value: 'available_status', align: 'center', cellClass: 'w-10 text-center', type: 'autocomplete'
                    },
                    {
                        text: '비고', sortable: true, value: 'comment', align: 'center', cellClass: 'w-10 text-center', type: 'textField'
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
            },
            page: 1,
		};
	},
	methods: {
        tablePage(page) {
            this.page = page;
        },
		async submit() {
            this.dataTable.loading = true;
            axios("http://127.0.0.1:5000/order/get-all", {
              method: "post",
              data: {...this.searchData, page: this.page},
            })
            .then((response) => {
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
              data: {...this.dataTable.items, page: this.page},
            })
            .then((response) => {
                this.item = response.data.data;
            })
            .catch((error) => {
                console.log(error);
            });
        this.dataTable.loading = false;
            this.searchData.startTime = '';
            this.searchData.endTime = '';
            this.searchData.text = '';
        }
	},
	mounted() {
        this.submit();
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