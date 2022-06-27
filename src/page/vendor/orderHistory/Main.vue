<template>
	<v-card class="pa-3" rounded flat>
        <v-row>
            <v-col class="col-12">
                <v-row dense class="d-flex justify-center">
                    <v-col cols="12" md="10" xs="12" class="pa-3">
                        <v-row dense class="d-flex justify-space-between bg-search">
                            <v-col cols=12 md="6" xs="12" class="d-flex justify-start align-center pa-3">
                                <div class="sign-up-subtitle d-flex align-center pa-3">주문내역 리스트</div>
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
                            <v-col cols=12 class="d-flex justify-start align-center">
                                <div class="d-flex align-center"> 
                                    <span class="d-flex align-center mr-3 pa-3" style="font-size: 12px;">도매처 url 복사</span>
                                    <v-btn
                                    x-small
                                    @click="copyUrl()"
                                    >복사하기</v-btn>
                                </div>
                            </v-col> 
                        </v-row>
                    </v-col>
                    <v-col cols="12" md="10" xs="12">
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
                </v-row>
            </v-col>
        </v-row>
    </v-card>
</template>
<script>

import Vue from "vue";
import axios from 'axios';
import DataTableCustom from '@/components/DataTableCustom.vue';
import DatePicker from '@/components/DatePicker.vue';
import moment from 'moment';
import isValidJwt from '@/utils';
import VueClipboard from 'vue-clipboard2';
import store from '@/store'

Vue.use(VueClipboard)

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
                        text: '주문일자', value: 'orderDate', align: 'center', cellClass: 'minw-10  text-center',
                    },
                    {
                        text: '매장명', value: 'store_name', align: 'center', cellClass: 'minw-10  text-center',
                    },
                    {
                        text: '주소', value: 'store_location', align: 'center', cellClass: 'minw-10  text-center',
                    },
                    {
                        text: '상품명', value: 'item', align: 'center', cellClass: 'minw-20 text-center',
                    },
                    {
                        text: '색상', value: 'color', align: 'center', cellClass: 'minw-10  text-center',
                    },
                    {
                        text: '사이즈', value: 'size', align: 'center', cellClass: 'minw-10  text-center',
                    },
                    {
                        text: '가능여부', value: 'availableText', align: 'center', cellClass: 'minw-10  text-center'
                    },
                    {
                        text: '비고', value: 'comment', align: 'center', cellClass: 'minw-15 text-center'
                    },
				],
                page: 1,
                itemsPerPage: 10,
                totalRows: 10,
                loading: false,
				items: [],
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
		};
	},
	methods: {
        copyUrl() {
            let url = window.location.protocol + "//" + window.location.host + "/orderNow?customer=" + store.getters['GET_USER_ROLE'];
            this.$copyText(url).then(function(e) {
                alert('복사 완료');
            }, function (e) {
                alert('복사 실패');
            })
        },
		async submit() {
            this.dataTable.loading = true;
            axios("/order/get-all", {
              method: "post",
              data: {...this.searchData, page: this.page},
            })
            .then((response) => {
                this.item = response.data.data;
            })
            .catch((error) => {
            });
            this.dataTable.loading = false;
            this.searchData.startTime = '';
            this.searchData.endTime = '';
            this.searchData.text = '';
        },
        tablePage(page) {
            this.page = page;
        },
	},
	mounted() {
        this.searchData.userId = this.$store.getters['GET_USER_ID'];
        this.submit();
	},
    created() {
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