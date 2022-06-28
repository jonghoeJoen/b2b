<template>
	<v-card class="pa-3" rounded flat>
        <v-row dense>
            <v-col cols="12">
                <v-row dense class="d-flex justify-center">
                    <v-col cols="12" md="10" xs="12" class="pa-3">
                        <v-row dense class="d-flex justify-space-between bg-search">
                            <v-col cols=12 md="6" xs="12" class="d-flex justify-start align-center pa-3">
                                <template v-if="urlShared === false">
                                    <div class="sign-up-subtitle d-flex align-center">주문 현황</div>
                                </template>
                                <template v-else>
                                    <div class="sign-up-subtitle d-flex align-center">주문 현황 - {{ user_name }}</div>
                                </template>
                            </v-col> 
                            <v-col cols=12 md="6" sm="12" class="d-flex justify-center align-center pa-3">
                                <v-row dense>
                                    <v-col cols="3" md="2" sm="3" class="d-flex justify-center align-center">
                                        <span class="ma-0 pa-1 font-size-8" style="font-weight: bold;">조회 기간</span>
                                    </v-col>
                                    <v-col cols="9" md="6" sm="9" class="d-flex justify-center align-center">
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
                                                @click="loadOrderList()"
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
import store from '@/store';

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
                        text: '가능여부', value: 'available_status', align: 'center', cellClass: 'minw-15 w-15 text-center', type: 'autocomplete'
                    },
                    {
                        text: '비고', value: 'comment', align: 'center', cellClass: 'minw-15 text-center', type: 'textField'
                    },
				],
                page: 1,
                itemsPerPage: 20,
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
            },
            page: 1,
            urlShared: false,
		};
	},
	methods: {
        tablePage(page) {
            this.page = page;
        },
		async loadOrderList() {
            console.log({...this.searchData, page: this.page})
            this.dataTable.loading = true;
            axios("/order/get-all", {
              method: "post",
              data: {...this.searchData, page: this.page},
            })
            .then((response) => {
                this.item = response.data.data;
                this.dataTable.items = this.item;
                this.dataTable.totalRows = response.data.total_rows;
            })
            .catch((error) => {
            });
            this.dataTable.loading = false;
            this.searchData.startTime = '';
            this.searchData.endTime = '';
            this.searchData.text = '';
        },
        saveOrder() {
            this.dataTable.loading = true;
            axios("/order/save-order-list", {
              method: "post",
              data: this.dataTable.items,
            })
            .then((response) => {
                if (response.data === true) {
                    alert("저장완료");
                    this.$router.go(0);
                }
                else alert("저장실패");
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
        // 도매처에 url 공유한 경우
        console.log(this.$route.query)
        if (this.$route.query.shared) {
            console.log("shared true");
            this.urlShared = true;
        }
        this.searchData.userId = this.$route.query.customer ? this.$route.query.customer : null;
        this.searchData.storeId = store.getters['GET_STORE_ID'];
        this.loadOrderList();
	},
    watch: {
        "item": {
            handler(n) {
                // this.dataTable.totalRows = n.length
                n.forEach(e => {
                    e.orderDate = moment(e.created_date).format('YYYY-MM-DD');
                })
                // this.dataTable.items = n;
            },
            deep: true
        },
        "page": {
            handler(n) {
                this.loadOrderList();
            },
            deep: true
        }
    }
}
</script>

<style>
</style>