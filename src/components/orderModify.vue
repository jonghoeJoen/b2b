<template>
    <v-dialog
        scrollable
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
                    {{wholesaleStore.store_name}}
                </v-col>
                <v-col cols="6" md="2" class="d-flex justify-center align-center pa-4">
                    매장 주소
                </v-col>
                <v-col cols="6" md="10" class="d-flex justify-start align-center pa-4">
                    {{wholesaleStore.name}} {{wholesaleStore.store_location}}
                </v-col>
                <v-col cols="12">
                    <v-divider></v-divider>
                </v-col>
                <v-col cols="12">
                    <v-row class="ma-1">
                        <v-col cols="12" md="2" class="d-flex justify-center align-center pa-4 text--order">
                            픽업희망일
                        </v-col>
                        <v-col cols="12" md="10" class="d-flex justify-center pa-0">
                            <v-menu
                                v-model="menu"
                                :close-on-content-click="true"
                                :nudge-right="40"
                                transition="scale-transition"
                                offset-y
                                min-width="auto"
                            >
                                <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                    v-model="date"
                                    prepend-icon="mdi-calendar"
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                ></v-text-field>
                                </template>
                                <v-date-picker
                                v-model="date"
                                locale="ko-KR"
                                no-title
                                scrollable
                                >
                                <!-- <v-btn
                                    text
                                    color="primary"
                                    @click="menu = false"
                                >
                                    Cancel
                                </v-btn>
                                <v-btn
                                    text
                                    color="primary"
                                    @click="$refs.menu.save(date)"
                                >
                                    OK
                                </v-btn> -->
                                </v-date-picker>
                            </v-menu>
                        </v-col>
                    </v-row>
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
                                                    label="메모"
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
        wholesaleStore: {
            type: Object,
            default: null,
        },
    },
    data() {
        return {
            number: 1,
            valueData: this.value,
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
            date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
            menu: false,
            modal: false,
            menu2: false,
        };
    },
    watch: {
        value(n) {
            console.log("value", n);
            this.valueData = n;
            this.$emit('input', n);
        },
        valueData(newValue) {
            this.$emit('input', newValue);
        },
        // wholesaleStore(newValue) {
        //     if(newValue != null) {
        //         console.log(newValue)
        //         // this.loadStore(newValue);
        //         for (let i = 0; i < this.order.length; i++) {
        //             this.order[i].store_id = newValue;
        //         }
        //     }
        // }
    },
    methods: {
        async modalCheck() {
        },
        async closeModal() {
            this.order = [ { item: '', user_id: this.userId , store_id: this.requestId, color: '', size: '', quantity: null, comment: '' } ];
            this.$emit('update:value', false);
            this.$emit('update:reque', null);
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
        createdOrderCheck() {
            let data = [];
            for (let i = 0; i < this.order.length; i++) {
                if (this.order[i].item != '' && this.order[i].item != null) {
                    data.push({...this.order[i], store_id: this.wholesaleStore.id, pickupDate: this.date});
                }
            }
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
                if(response.data) {
                    alert('주문이 완료되었습니다.');
                    this.modalClose();
                } else {
                    alert('주문을 넣지 못하였습니다.');
                    this.modalClose();
                }
            })
            .catch(err =>{
            });
        },
        modalClose() {
            this.clean();
            this.valueData = false;
            this.$emit('update:value', false);

            console.log(this.valueData, this.value)
        },
        clean() {
            for (let i = 0; i < this.order.length; i++) {
                this.order[i] = { item: '', store_id: '', color: '', size: '', quantity: null, comment: '' };
            }
        }
    },
    mounted() {
        for (let i = 0; i < this.order.length; i++) {
            this.order[i].user_id = this.$store.getters['GET_USER_ID'];
        }
    },
    created() {
    },
});
</script>

<style scoped>
</style>
