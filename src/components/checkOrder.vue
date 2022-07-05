<template>
    <v-dialog
        scrollable
        :max-width="Number.parseInt($vuetify.breakpoint.width * 0.9, 10) < 1000 ? Number.parseInt($vuetify.breakpoint.width * 0.9, 10) : 1000"
        v-model="valueData"
        style="overflow-y: scroll"
        @click:outside="modalClose()"
        @keydown.esc="modalClose()">
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
                                                    @click="loadOrderHistory()"
                                                >검색</v-btn>
                                            </div>
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col cols="12" md="10">
                            <div v-for="pickupDate in Object.keys(cardList)" :key="pickupDate">
                                <v-card class="mb-2">
                                    <v-card-title class="d-flex">
                                        <v-row>
                                            <v-col cols="12" md="6">
                                                <span>{{pickupDate}}</span>
                                            </v-col>
                                        </v-row>
                                    </v-card-title>
                                    <v-card-text>
                                        <div v-for="(orderList, orderIdx) in cardList[pickupDate]" :key="orderIdx">
                                            <v-col cols="12" class="d-flex justify-end">
                                                <span class="mr-3" style="font-size: 14px; text-align: end;">{{orderList.storeName}}</span>
                                                <v-btn x-small @click="copyUrl(orderList.storeId)">공유 URL 복사</v-btn>
                                            </v-col>
                                            <div class="table-container">
                                                <v-simple-table dense>
                                                    <template v-slot:default>
                                                    <thead>
                                                        <tr>
                                                            <th style="min-width: 150px;" class="text-center">
                                                                상품명
                                                            </th>
                                                            <th style="min-width: 80px;" class="text-center">
                                                                색상
                                                            </th>
                                                            <th style="min-width: 75px;" class="text-center">
                                                                사이즈
                                                            </th>
                                                            <th style="min-width: 75px;" class="text-center">
                                                                수량
                                                            </th>
                                                            <th style="width: 130px;" class="text-center">
                                                                가능 여부
                                                            </th>
                                                            <th style="min-width: 150px;" class="text-center">
                                                                메모
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr
                                                        v-for="(item, index) in orderList.order"
                                                        :key="index"
                                                        >
                                                            <td class="text-center">{{ item.item }}</td>
                                                            <td class="text-center">{{ item.color }}</td>
                                                            <td class="text-center">{{ item.size }}</td>
                                                            <td class="text-center">{{ item.quantity }}</td>
                                                            <td v-if="item.status === 'T'" class="text-center">가능</td>
                                                            <td v-else-if="item.status === 'P'" class="text-center">부분가능</td>
                                                            <td v-else-if="item.status === 'A'" class="text-center">추후가능</td>
                                                            <td v-else-if="item.status === 'X'" class="text-center">품절</td>
                                                            <td v-else class="text-center"> </td>
                                                            <td class="text-center">{{ item.comment ? item.comment : "" }}</td>
                                                        </tr>
                                                    </tbody>
                                                    </template>
                                                </v-simple-table>
                                            </div>
                                        </div>
                                    </v-card-text>
                                </v-card>
                            </div>
                            <div class="text-center">
                                <v-pagination
                                v-model="page"
                                :length="dataTable.totalRows / dataTable.itemsPerPage"
                                ></v-pagination>
                            </div>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import axios from 'axios';
import DataTableCustom from '@/components/DataTableCustom.vue';
import DatePicker from '@/components/DatePicker.vue';
import moment from 'moment';
import store from '@/store';
import isValidJwt from '@/utils';

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
            DataTableCustom,
            DatePicker,	
			dataentry:{
                name:"",
				department:"",
			},
            dataTable: {
				headers : [
                    {
                        text: '주문고객', value: 'user_name', align: 'center', cellClass: 'minw-10 text-center',
                    },
                    {
                        text: '연락처', value: 'user_mobile_no', align: 'center', cellClass: 'minw-10 text-center',
                    },
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
                        text: '메모', value: 'comment', align: 'center', cellClass: 'minw-15 text-center', type: 'textField'
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
            items: [],
            searchData: {
                userId: '',
                startTime: '',
                endTime: '',
                text: '',
                storeId: '',
            },
            page: 1,
            urlShared: false,
            orderList: [],
            customerInfo: {
                name: '',
            },
            userId: null,
            storeId: null,
            status: [
                {text: '가능', value: 'T'},
                {text: '부분 가능', value: 'P'},
                {text: '추후 가능', value: 'A'},
                {text: '품절', value: 'X'}
            ],
            cardList: [],
            valueData: this.value,
            
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
        // requestId(newValue) {
        //     if(newValue != null) {
        //         this.loadStore(newValue);
        //         this.searchData.storeId = newValue.toString();
        //         this.loadOrder();
        //     }
        // },
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
    },
    methods: {
        async modalCheck() {
        },
        async closeModal() {
            // this.order = [ { item: '', user_id: this.userId , store_id: this.requestId, color: '', size: '', quantity: null, comment: '' } ];
            this.$emit('update:value', false);
            this.$emit('update:requestId', null);
        },
        tablePage(page) {
            this.page = page;
        },
		async loadOrderList() {
            this.dataTable.loading = true;
            let response = await axios("/api/order/get-all-date", {
              method: "post",
              data: {...this.searchData, page: this.page, userType: 'wholesaleStore'},
            })
                this.items = response.data.data;
                this.items.forEach((x) => { 
                    x.ids = x.grouped_id.split('~#~');
                    x.items = x.grouped_item.split('~#~');
                    x.colors = x.grouped_color ? x.grouped_color.split('~#~') : [];
                    x.sizes = x.grouped_size ? x.grouped_size.split('~#~') : [];
                    x.quantities = x.grouped_quantity ? x.grouped_quantity.split('~#~') : [];
                    x.status = x.grouped_status ? x.grouped_status.split('~#~') : [];
                    x.comments = x.grouped_comment? x.grouped_comment.split('~#~') : [];
                });

                let orderObject = {};
                this.items.forEach(x => { 
                    let orderItem = {};
                    let itemInfo = [];
                    for (let i = 0; i < x.items.length; i++) {
                        itemInfo.push ({
                            id: x.ids[i],
                            item: x.items[i],
                            color: x.colors.length > i ? x.colors[i] : null,
                            size: x.sizes.length > i ? x.sizes[i] : null,
                            quantity: x.quantities.length > i ? x.quantities[i] : null,
                            status: x.status.length > i ? x.status[i] : null,
                            comment: x.comments.length > i ? x.comments[i] : null,
                        });
                    }
                    orderItem = {
                        userName: x.user_name,
                        userMobileNo: x.user_mobile_no,
                        pickupDate: x.pickup_date,
                        order: itemInfo, 
                        userId: x.user_id,
                        storeId: x.store_id,
                        storeName: x.store_name,
                        createdDate: x.created_date,
                        userStoreName: x.user_store_name,
                    };
                    if (Object.prototype.hasOwnProperty.call(orderObject, orderItem.pickupDate) === false) 
                        orderObject[orderItem.pickupDate] = [];
                    orderObject[orderItem.pickupDate].push(orderItem);
                })
                this.cardList = orderObject;
        },
        saveOrder(orderIdx) {
            // this.dataTable.loading = true;

            let saveData = [];

            this.orderList[orderIdx].order.forEach(e => {
                let temp = {
                    id: e.id, 
                    store_id: this.orderList[orderIdx].storeId, 
                    user_id: this.orderList[orderIdx].userId, 
                    item: e.item, 
                    color: e.color, 
                    size: e.size, 
                    quantity: e.quantity, 
                    available_status: e.status ? e.status : null, 
                    comment: e.comment, 
                    created_date: this.orderList[orderIdx].createdDate,
                }
                saveData.push(temp);
            });

            axios("/api/order/update-order-list", {
              method: "post",
              data: saveData,
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
        async loadCustomerInfo() {
            axios.get('/user/get-user', {
                params: {
                    id: this.userId,
                }
            })
            .then((response) => {
                this.customerInfo = response.data;
            })
            .catch((error) => {
            });
        },
        loginCheck() {
            // 도매처에 url 공유한 경우 자동 로그인
            if (Object.keys(this.$route.query).includes('shared')) {
                    this.urlShared = true;
                    axios("/api/login/wholesaler-login", {
                        method: "post",
                        data: {
                        storeId: this.$route.query.store
                        },
                    }).then((res) => {
                        localStorage.token = res.data.token

                        if (isValidJwt()) {
                        let data = JSON.parse(atob(localStorage.token.split('.')[1]))
                        this.username = data.username;
                        this.userRole = data.role;
                        this.userId = data.userId;
                        this.storeId = data.storeId;
                        store.commit('SET_USER_ROLE', this.userRole);
                        store.commit('SET_USER_ID', this.userId);
                        store.commit('SET_STORE_ID', this.storeId);
                    }
                    }).catch((error) => {
                        alert("로그인 실패!");
                        return;
                    });
                }

            else if (isValidJwt()) {
                let data = JSON.parse(atob(localStorage.token.split('.')[1]))
                this.username = data.username;
                this.userRole = data.role;
                this.userId = data.userId;
                this.storeId = data.storeId;
                store.commit('SET_USER_ROLE', this.userRole);
                store.commit('SET_USER_ID', this.userId);
                store.commit('SET_STORE_ID', this.storeId);
            } else {
                store.commit('SET_URL_BEFORE_LOGIN', window.location.pathname + window.location.search);
                // 로그인페이지로 이동
                this.$router.push({
                    path: '/sign-in'
                }).catch(error => {})
            }
        },
    },
    mounted() {
        // this.searchData.userId = this.$store.getters['GET_USER_ID'];
        this.loadOrderList();
    },
    created() {
    },
});
</script>

<style scoped>
</style>
