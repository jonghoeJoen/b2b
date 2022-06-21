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
                        <h3 class="test">상품 주문</h3>
                    </div>
                </v-col>
                <v-col cols="2" class="d-flex justify-center align-center pa-4">
                    주문 매장
                </v-col>
                <v-col cols="10" class="d-flex justify-center align-center pa-4">
                </v-col>
                <v-col cols="2" class="d-flex justify-center align-center pa-4">
                    매장 주소
                </v-col>
                <v-col cols="10" class="d-flex justify-center align-center pa-4">
                </v-col>
                <v-col cols="12">
                    <v-divider></v-divider>
                </v-col>
                <v-col cols="12">
                    <template v-for="i in order.length">
                        <v-row :key="i" class="ma-1">
                            <v-col cols="2" class="d-flex justify-center align-center pa-4">
                                주문 {{ i }}
                            </v-col>
                            <v-col cols="10" class="d-flex justify-center pa-0">
                                <v-card>
                                    <v-card-title class="d-flex justify-space-between">
                                        <div>
                                            test
                                        </div>
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
                                            label="상품평"
                                            v-model="order[i-1].name"
                                            hide-details="auto"
                                        ></v-text-field>
                                        <v-text-field
                                            dense
                                            outlined
                                            label="색상"
                                            class="pa-1"
                                            v-model="order[i-1].color"
                                            hide-details="auto"
                                        ></v-text-field>
                                        <v-text-field
                                            dense
                                            outlined
                                            label="사이즈"
                                            class="pa-1"
                                            v-model="order[i-1].size"
                                            hide-details="auto"
                                        ></v-text-field>
                                        <v-text-field
                                            dense
                                            outlined
                                            label="수량"
                                            class="pa-1"
                                            v-model="order[i-1].count"
                                            hide-details="auto"
                                        ></v-text-field>
                                        <v-text-field
                                            dense
                                            outlined
                                            label="비고"
                                            class="pa-1"
                                            v-model="order[i-1].description"
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
                        <v-btn @click="closeModal()">주문 완료</v-btn>
                    </div>
                </v-col>
            </v-row>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
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
				items: [
                    { id: 1, storeName: 'test', postcode: 'tewstsetsets', phone1: '010-0000-0000', phone2: '02)000-0000'}
                ],
			},
            order: [
                { name: null, color: null, size: null, count: null, description: null }
            ]
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
        order: {
            handler(n) {
                console.log(n);
            },
            deep: true,
        }
    },
    methods: {
        async modalCheck() {
        },
        async closeModal() {
            this.order = [ { name: null, color: null, size: null, count: null, description: null } ];
            this.$emit('update:value', false);
            this.$emit('update:requestId', null);
        },
        async dialogChange(data) {
            console.log(data);
        },
        addNumber() {
            const orderAdd = { name: null, color: null, size: null, count: null, description: null };
            this.order.push(orderAdd);
        },
        minNumber(data) {
            let index = data - 1;
            this.order.splice(index,1);
            console.log(this.order)
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
