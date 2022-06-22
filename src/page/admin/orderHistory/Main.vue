<template>
	<v-card class="pa-3" rounded flat>
        <v-row>
            <v-col class="col-12">
                <v-row class="d-flex justify-center">
                    <v-col cols="10" class="d-flex justify-space-between">
                        <div class="sign-up-subtitle">admin 주문내역 리스트</div>
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
                        ></data-table-custom-component>
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
                        text: '가능여부', sortable: true, value: 'availableText', align: 'center', cellClass: 'w-10 text-center',
                    },
                    {
                        text: '비고', sortable: true, value: 'comment', align: 'center', cellClass: 'w-10 text-center',
                    },
				],
                page: 1,
                itemsPerPage: 10,
                totalRows: 10,
                loading: false,
				items: [
                    { id: 1, storeName: 'test', postcode: 'tewstsetsets', phone1: '010-0000-0000', phone2: '02)000-0000'}
                ],
			},
            value: null,
            item: [],
            searchData: {
                userId: '',
                startTime: '',
                endTime: '',
                text: '',
            }
		};
	},
	methods: {
		async submit() {
            this.dataTable.loading = true;
            axios("http://127.0.0.1:5000/order/get-all", {
              method: "post",
              data: this.searchData
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
                    if (e.available_status == 'T') {
                        e.availableText = '가능'
                    } else if (e.available_status == 'P') {
                        e.availableText = '부분 가능'
                    } else if (e.available_status == 'A') {
                        e.availableText = '추후 가능'
                    } else if (e.available_status == 'X') {
                        e.availableText = '품절'
                    }
                })
                this.dataTable.items = n;
            },
            deep: true
        }
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