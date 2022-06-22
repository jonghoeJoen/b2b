<template>
    <v-dialog
        scrollable
        persistent
        width="1400px"
        v-model="valueData"
        style="overflow-y: scroll"
        @click:outside="closeModal()"
        @keydown.esc="closeModal()">
        <v-card class="pa-3" style="overflow-y: scroll">
            <v-row dense class="d-flex justify-center">
                <v-col cols="12">
                    <div class="d-block text-center">
                        <h3>상품 주문</h3>
                    </div>
                </v-col>
                <v-col cols="2" class="d-flex justify-center align-center pa-4">
                    주문 매장
                </v-col>
                <v-col cols="10" class="d-flex justify-start align-center pa-4">
                    {{store.store_name}}
                </v-col>
                <v-col cols="2" class="d-flex justify-center align-center pa-4">
                    매장 주소
                </v-col>
                <v-col cols="10" class="d-flex justify-start align-center pa-4">
                </v-col>
                <v-col cols="12">
                    <v-divider></v-divider>
                </v-col>
                <v-col cols="12">
                    <template v-for="i in order.length">
                        <v-row :key="i" class="ma-1">
                            <v-col cols="2" class="d-flex justify-center align-center pa-4 text--order">
                                주문 {{ i }}
                            </v-col>
                            <v-col cols="10" class="d-flex justify-center pa-0">
                                <v-card>
                                    <v-card-title class="d-flex justify-end">
                                        <div>
                                            <v-btn @click="minNumber(i)">
                                                X
                                            </v-btn>
                                        </div>
                                    </v-card-title>
                                    <v-card-text class="d-flex justify-center align-center">
                                        <v-text-field
                                            dense
                                            outlined
                                            label="상품명"
                                            v-model="order[i-1].item"
                                            hide-details="auto"
                                            :rules="[rules.required]"
                                        ></v-text-field>
                                        <v-text-field
                                            dense
                                            outlined
                                            label="색상"
                                            class="pa-1"
                                            v-model="order[i-1].color"
                                            hide-details="auto"
                                            :rules="[rules.required]"
                                        ></v-text-field>
                                        <v-text-field
                                            dense
                                            outlined
                                            label="사이즈"
                                            class="pa-1"
                                            v-model="order[i-1].size"
                                            hide-details="auto"
                                            :rules="[rules.required]"
                                        ></v-text-field>
                                        <v-text-field
                                            dense
                                            outlined
                                            label="수량"
                                            class="pa-1"
                                            v-model="order[i-1].quantity"
                                            hide-details="auto"
                                            :rules="[rules.required]"
                                        ></v-text-field>
                                        <v-text-field
                                            dense
                                            outlined
                                            label="비고"
                                            class="pa-1"
                                            v-model="order[i-1].comment"
                                            hide-details="auto"
                                        ></v-text-field>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>
                    </template>
                </v-col>
                <v-col cols="12" class="d-flex justify-end">
                    <v-btn @click="addNumber()">+ 주문추가</v-btn>
                </v-col>
                <v-col cols="10">
                    <div class="d-flex justify-center">
                        <v-btn @click="createdOrderCheck()">주문 완료</v-btn>
                    </div>
                </v-col>
            </v-row>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
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
                        text: '번호', sortable: true, value: 'id', align: 'center', cellClass: 'w-10 text-center',
                    },
                    {
                        text: '매장명', sortable: true, value: 'storeName', align: 'center', cellClass: 'w-10 text-center',
                    },
                    {
                        text: '주소', sortable: true, value: 'postcode', align: 'center', cellClass: 'w-10 text-center',
                    },
                    {
                        text: '매장 휴대전화', sortable: true, value: 'phone1', align: 'center', cellClass: 'w-10 text-center',
                    },
                    {
                        text: '매장 유선번호', sortable: true, value: 'phone2', align: 'center', cellClass: 'w-10 text-center',
                    },
                    {
                        text: '주문하기', sortable: true, value: 'phone2', align: 'center', cellClass: 'w-10 text-center',
                    },
				],
                page: 1,
                itemsPerPage: 10,
                totalRows: 10,
				items: [],
			},
            order: [
                { item: '', store_id: '', color: '', size: '', quantity: '', comment: '' }
            ],
            rules: {
                required: (value) => !!value || '필수',
            },
            store: [],
            flag: false,
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
                this.order[0].store_id = newValue;
            }
        }
    },
    methods: {
        async modalCheck() {
        },
        async closeModal() {
            this.order = [ { item: '', store_id: this.requestId, color: '', size: '', quantity: '', comment: '' } ];
            this.$emit('update:value', false);
            this.$emit('update:requestId', null);
        },
        async dialogChange(data) {
            console.log(data);
        },
        addNumber() {
            const orderAdd = { item: '', store_id: this.requestId , color: '', size: '', quantity: '', comment: '' };
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
        createdOrderCheck() {
            console.log(this.order);
            let count = 0;
            for (let i = 0; i < this.order.length; i++) {
                if (this.order[i].item == '') {
                    alert('상품명을 입력해 주세요');
                    return;
                }
                else if (this.order[i].color == '') {
                    alert('색상을 입력해 주세요');
                    return;
                }
                else if (this.order[i].size == '') {
                    alert('사이즈를 입력해 주세요');
                    return;
                }
                else if (this.order[i].quantity == '') {
                    alert('수량을 입력해 주세요');
                    return;
                } else {
                    count +=1
                }
            }
            if (count == this.order.length) {
                this.flag = true;
                this.createdOrder();
            }
		},
        createdOrder() {
            if (this.flag) {
                const path = 'http://127.0.0.1:5000/order/create-order'
                const test = this.order
                const data = axios.post(path, {
                    data: test
                    }
                )      
                data.then((response) => {
                    console.log(response);
                })
                .catch(err =>{
                    console.log('err: ' + err);
                });
            }
        }
    },
    mounted() {
    },
    created() {
    },
});
</script>

<style scoped>
</style>
