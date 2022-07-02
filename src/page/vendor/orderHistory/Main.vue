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
                                                @click="submit()"
                                            >검색</v-btn>
                                        </div>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col cols="10">
                        <div v-for="order in orderList" :key="order.id">
                            <v-card class="mb-2">
                                <v-card-title class="d-flex">
                                    <v-row class="mx-3">
                                        <v-col>
                                            <span>{{order.pickupDate}}</span>
                                        </v-col>
                                        <v-col class="d-flex justify-end">
                                            <span class="mr-3" style="font-size: 14px; text-align: end;">{{order.storeName}}</span>
                                            <v-btn small @click="copyUrl(order.storeId)">공유 URL 복사</v-btn>
                                        </v-col>
                                    </v-row>
                                    
                                </v-card-title>
                                <v-card-text>
                                    <v-simple-table dense>
                                        <template v-slot:default>
                                        <thead>
                                            <tr>
                                                <th style="width: 20%;" class="text-center">
                                                    상품명
                                                </th>
                                                <th style="width: 15%;" class="text-center">
                                                    색상
                                                </th>
                                                <th style="width: 10%;" class="text-center">
                                                    사이즈
                                                </th>
                                                <th style="width: 10%;" class="text-center">
                                                    수량
                                                </th>
                                                <th style="width: 20%;" class="text-center">
                                                    가능 여부
                                                </th>
                                                <th style="width: 25%;" class="text-center">
                                                    메모
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr
                                            v-for="(item, index) in order.order"
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
                                                <td class="text-center">{{ item.comment }}</td>
                                            </tr>
                                        </tbody>
                                        </template>
                                    </v-simple-table>
                                </v-card-text>
                            </v-card>
                        </div>
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
                        text: '메모', value: 'comment', align: 'center', cellClass: 'minw-15 text-center'
                    },
				],
                page: 1,
                itemsPerPage: 20,
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
            orderList: [],
            userId: null,
            storeId: null,
		};
	},
	methods: {
        copyUrl(storeId) {
            let url = window.location.protocol + "//" + window.location.host + "/orderNow?customer=" + store.getters['GET_USER_ROLE'] + '&store=' + storeId + '&shared';
            this.$copyText(url).then(function(e) {
                alert('복사 완료');
            }, function (e) {
                alert('복사 실패');
            })
        },
		async submit() {
            this.dataTable.loading = true;
            let response = await axios("/order/get-all-date", {
              method: "post",
              data: {...this.searchData, page: this.page, userType: 'customer'},
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

                let orderItems = [];
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
                    };
                    orderItems.push(orderItem);
                })

                this.orderList = orderItems;
        },
        tablePage(page) {
            this.page = page;
        },
        loginCheck() {
            // 도매처에 url 공유한 경우 자동 로그인
            if (Object.keys(this.$route.query).includes('shared')) {
                    this.urlShared = true;
                    axios("/login/wholesaler-login", {
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
        this.loginCheck();
        this.searchData.userId = this.$store.getters['GET_USER_ID'];
        this.submit();
	},
    created() {
    },
    watch: {
        "item": {
            handler(n) {
                // this.dataTable.totalRows = n.length
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
                // this.dataTable.items = n;
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