<template>
    <v-dialog
        scrollable
        persistent
        :max-height="Number.parseInt($vuetify.breakpoint.height * 0.9, 10) < 600 ? Number.parseInt($vuetify.breakpoint.height * 0.9, 10) : 600"
        :max-width="Number.parseInt($vuetify.breakpoint.width * 0.9, 10) < 1000 ? Number.parseInt($vuetify.breakpoint.width * 0.9, 10) : 1000"
        v-model="valueData"
        style="overflow-y: scroll"
        @click:outside="modalClose()"
        @keydown.esc="modalClose()">
        <v-card class="pa-3" style="overflow-y: scroll">
            <v-row dense class="d-flex justify-center">
                <v-col cols="12">
                    <div class="d-block text-center">
                        <h3>상품 주문</h3>
                    </div>
                </v-col>
                <v-col cols="6" md="2" class="d-flex justify-center align-center pa-4">
                    주문 매장
                </v-col>
                <v-col cols="6" md="10" class="d-flex justify-start align-center pa-4">
                    {{store.store_name}}
                </v-col>
                <v-col cols="6" md="2" class="d-flex justify-center align-center pa-4">
                    매장 주소
                </v-col>
                <v-col cols="6" md="10" class="d-flex justify-start align-center pa-4">
                    {{store.store_location}}
                </v-col>
                <v-col cols="12">
                    <v-divider></v-divider>
                </v-col>
                <v-col cols="12">
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
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import isValidJwt from '@/utils';
import axios from 'axios';
import moment from 'moment';
import Vue from 'vue';

export default Vue.component('check-order', {
    props: {
        value: {
            type: Boolean,
            default: false,
        },
        requestId: {
            type: Number,
            default: null,
        },
    },
    data() {
        return {
            number: 1,
            valueData: false,
            store: [],
            dataTable: {
				headers : [
                    {
                        text: '주문일자', value: 'orderDate', align: 'center', cellClass: 'minw-10 text-center',
                    },
                    {
                        text: '매장명', value: 'store_name', align: 'center', cellClass: 'minw-10 text-center',
                    },
                    {
                        text: '주소', value: 'store_location', align: 'center', cellClass: 'minw-10 text-center',
                    },
                    {
                        text: '상품명', value: 'item', align: 'center', cellClass: 'minw-10 text-center',
                    },
                    {
                        text: '색상', value: 'color', align: 'center', cellClass: 'minw-10 text-center',
                    },
                    {
                        text: '사이즈', value: 'size', align: 'center', cellClass: 'minw-10 text-center',
                    },
                    {
                        text: '가능여부', value: 'availableText', align: 'center', cellClass: 'minw-10 text-center',
                    },
                    {
                        text: '비고', value: 'comment', align: 'center', cellClass: 'minw-10 text-center',
                    },
				],
                page: 1,
                itemsPerPage: 10,
                totalRows: 10,
                loading: false,
				items: [],
			},
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
    watch: {
        value(newValue) {
            this.valueData = newValue;
            this.$emit('input', newValue);
        },
        valueData(newValue) {
            this.$emit('input', newValue);
        },
        requestId(newValue) {
            if(newValue != null) {
                this.loadStore(newValue);
                this.searchData.storeId = newValue.toString();
                this.loadOrder();
            }
        },
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
                console.log(n);
                this.dataTable.items = n;
            },
            deep: true
        },
    },
    methods: {
        async modalCheck() {
        },
        async closeModal() {
            // this.order = [ { item: '', user_id: this.userId , store_id: this.requestId, color: '', size: '', quantity: null, comment: '' } ];
            this.$emit('update:value', false);
            this.$emit('update:requestId', null);
        },
        addNumber() {
            const orderAdd = { item: '', user_id: this.userId ,store_id: this.requestId , color: '', size: '', quantity: null, comment: '' };
            this.order.push(orderAdd);
        },
        minNumber(data) {
            if (data != 1) {
                let index = data - 1;
                this.order.splice(index,1);
            } else {
                alert('주문량이 1개 미만일 수 없습니다.');
                return;
            }
        },
        loadOrder() {
            this.dataTable.loading = true;
            axios("http://127.0.0.1:5000/order/get-all", {
                method: "post",
                data: {...this.searchData, page: this.page},
            })
            .then((response) => {
                console.log(response)
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
        loadStore(data) {
            let str = data.toString();
            let test = { id: str };
            axios("http://127.0.0.1:5000/shop/load", {
                method: "post",
                data: test,
            })
            .then((response) => {
                this.store = response.data.data[0];
            })
            .catch((error) => {
                console.log(error);
            });
        },
        loginCheck() {
			if (isValidJwt()) {
				let data = JSON.parse(atob(localStorage.token.split('.')[1]))
                this.userId = String(data.userId);
				
			} else {
				// console.log(isValidJwt())
				// 로그인페이지로 이동
				this.$router.push({
					path: '/sign-in'
				}).catch(error => {})
			}
		},
        modalClose() {
            this.valueData = false;
            this.$emit('update:value', false);
            this.$emit('update:requestId', null);
        },
        clean() {
            for (let i = 0; i < this.order.length; i++) {
                this.order[i] = { item: '', store_id: '', color: '', size: '', quantity: null, comment: '' };
            }
            this.loginCheck();
        },
        tablePage(page) {
            this.page = page;
        },
    },
    mounted() {
    },
    created() {
        this.loginCheck();
    },
});
</script>

<style scoped>
</style>
