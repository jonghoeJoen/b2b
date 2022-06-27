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
                    <template v-for="i in order.length">
                        <v-row :key="i" class="ma-1">
                            <v-col cols="12" md="2" class="d-flex justify-center align-center pa-4 text--order">
                                주문 {{ i }}
                            </v-col>
                            <v-col cols="12" md="10" class="d-flex justify-center pa-0">
                                <v-card>
                                    <v-card-title class="d-flex justify-end py-0">
                                        <div>
                                            <v-icon @click="minNumber(i)">
                                                mdi-close
                                            </v-icon>
                                        </div>
                                    </v-card-title>
                                    <v-card-text class="d-flex justify-center align-center">
                                        <v-row class="d-flex justify-center align-center">
                                            <v-col cols="12" md="4">
                                                <v-text-field
                                                    dense
                                                    outlined
                                                    label="상품명"
                                                    v-model="order[i-1].item"
                                                    hide-details="auto"
                                                ></v-text-field>
                                            </v-col>
                                            <v-col cols="6" md="2">
                                                <v-text-field
                                                    dense
                                                    outlined
                                                    label="색상"
                                                    v-model="order[i-1].color"
                                                    hide-details="auto"
                                                ></v-text-field>
                                            </v-col>
                                            <v-col cols="6" md="2">
                                                <v-text-field
                                                    dense
                                                    outlined
                                                    label="사이즈"
                                                    v-model="order[i-1].size"
                                                    hide-details="auto"
                                                ></v-text-field>
                                            </v-col>
                                            <v-col cols="6" md="2">
                                                <v-text-field
                                                    dense
                                                    outlined
                                                    label="수량"
                                                    v-model="order[i-1].quantity"
                                                    hide-details="auto"
                                                ></v-text-field>
                                            </v-col>
                                            <v-col cols="6" md="2">
                                                <v-text-field
                                                    dense
                                                    outlined
                                                    label="비고"
                                                    v-model="order[i-1].comment"
                                                    hide-details="auto"
                                                ></v-text-field>
                                            </v-col>
                                        </v-row>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>
                    </template>
                </v-col>
                <v-col cols="12" class="d-flex justify-end">
                    <v-btn @click="addNumber()">
                        <v-icon
                            small
                            dark
                        >
                            mdi-plus-circle-outline
                        </v-icon>
                        주문추가
                    </v-btn>
                </v-col>
                <v-col cols="10">
                    <div class="d-flex justify-center">
                        <v-btn
                            large
                            class="btn-order minw-20" 
                            @click="createdOrderCheck()">
                        주문 완료</v-btn>
                    </div>
                </v-col>
            </v-row>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import isValidJwt from '@/utils';
import axios from 'axios';
import Vue from 'vue';

export default Vue.component('order-modify', {
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
            dataTable: {
				headers : [
                    {
                        text: '번호', sortable: true, value: 'id', align: 'center', cellClass: 'minw-10 text-center',
                    },
                    {
                        text: '매장명', sortable: true, value: 'storeName', align: 'center', cellClass: 'minw-10 text-center',
                    },
                    {
                        text: '주소', sortable: true, value: 'postcode', align: 'center', cellClass: 'minw-10 text-center',
                    },
                    {
                        text: '매장 휴대전화', sortable: true, value: 'phone1', align: 'center', cellClass: 'minw-10 text-center',
                    },
                    {
                        text: '매장 유선번호', sortable: true, value: 'phone2', align: 'center', cellClass: 'minw-10 text-center',
                    },
                    {
                        text: '주문하기', sortable: true, value: 'phone2', align: 'center', cellClass: 'minw-10 text-center',
                    },
				],
                page: 1,
                itemsPerPage: 10,
                totalRows: 10,
				items: [],
			},
            order: [
                { item: '', store_id: '', color: '', size: '', quantity: null, comment: '' },
                { item: '', store_id: '', color: '', size: '', quantity: null, comment: '' },
                { item: '', store_id: '', color: '', size: '', quantity: null, comment: '' },
                { item: '', store_id: '', color: '', size: '', quantity: null, comment: '' },
                { item: '', store_id: '', color: '', size: '', quantity: null, comment: '' }
            ],
            rules: {
                required: (value) => !!value || '필수',
            },
            store: [],
            flag: false,
            userId: null,
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
                for (let i = 0; i < this.order.length; i++) {
                    this.order[i].store_id = newValue;
                }
            }
        }
    },
    methods: {
        async modalCheck() {
        },
        async closeModal() {
            this.order = [ { item: '', user_id: this.userId , store_id: this.requestId, color: '', size: '', quantity: null, comment: '' } ];
            this.$emit('update:value', false);
            this.$emit('update:requestId', null);
        },
        async dialogChange(data) {
            ;
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
        loadStore(data) {
            let str = data.toString();
            let test = { id: str };
            axios("/shop/load", {
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
        createdOrderCheck() {
            console.log(this.order);
            let data = [];
            for (let i = 0; i < this.order.length; i++) {
                if (this.order[i].item != '' && this.order[i].item != null) {
                    data.push(this.order[i])
                }
            }
            ;
            this.createdOrder(data);
		},
        createdOrder(test) {
            const path = '/order/create-order'
            const orderData = test
            const data = axios.post(path, {
                data: orderData
                }
            )      
            data.then((response) => {
                console.log(response);
                if(response.data) {
                    alert('주문이 완료되었습니다.');
                    this.modalClose();
                } else {
                    alert('주문을 넣지 못하였습니다.');
                    this.modalClose();
                }
            })
            .catch(err =>{
                console.log('err: ' + err);
            });
        },
        loginCheck() {
			if (isValidJwt()) {
				let data = JSON.parse(atob(localStorage.token.split('.')[1]))
                this.userId = String(data.userId);
                for (let i = 0; i < this.order.length; i++) {
                    this.order[i].user_id = this.userId;
                }
				
			} else {
				// console.log(isValidJwt())
				// 로그인페이지로 이동
				this.$router.push({
					path: '/sign-in'
				}).catch(error => {})
			}
		},
        modalClose() {
            this.clean();
            this.valueData = false;
            this.$emit('update:value', false);
        },
        clean() {
            for (let i = 0; i < this.order.length; i++) {
                this.order[i] = { item: '', store_id: '', color: '', size: '', quantity: null, comment: '' };
            }
            this.loginCheck();
        }
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
