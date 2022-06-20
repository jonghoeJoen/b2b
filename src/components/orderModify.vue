<template>
    <v-dialog
        scrollable
        persistent
        width="600px"
        v-model="valueData"
        @click:outside="closeModal()"
        @keydown.esc="closeModal()">
        <v-card class="pa-3">
            <v-row dense class="d-flex justify-center">
                <v-col cols="10">
                    <v-row>
                        <v-col cols="12">
                            <div class="d-block text-center">
                                <h3>상품 주문</h3>
                            </div>
                        </v-col>
                        <v-col cols="3" class="d-flex justify-start pa-4">
                            주문 매장
                        </v-col>
                        <v-col cols="9" class="d-flex justify-center pa-4">
                        </v-col>
                        <v-col cols="3" class="d-flex justify-start pa-4">
                            매장 주소
                        </v-col>
                        <v-col cols="9" class="d-flex justify-center pa-4">
                        </v-col>
                        <v-col cols="12">
                            <!-- <b-table striped hover :items="dataTable.item" :fields="dataTable.fields">
                                <template #cell(order)="row">
                                    <b-button size="sm" @click="dialogChange(row.item)" class="mr-2">
                                    선택
                                    </b-button>
                                </template>
                            </b-table> -->
                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="10">
                    <div class="d-flex justify-end">
                        <v-btn @click="closeModal()" style="margin-right: 3px">추가</v-btn>
                        <v-btn @click="closeModal()">취소</v-btn>
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
				item: [
                    { id: 1, storeName: 'test', postcode: 'tewstsetsets', phone1: '010-0000-0000', phone2: '02)000-0000'}
                ],
			},
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
    },
    methods: {
        async modalCheck() {
        },
        async closeModal() {
            this.$emit('update:value', false);
            this.$emit('update:requestId', null);
        },
        async dialogChange(data) {
            console.log(data);
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
