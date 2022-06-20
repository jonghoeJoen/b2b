<template>
    <v-dialog
        scrollable
        persistent
        width="600px"
        v-model="valueData"
        @click:outside="closeModal()"
        @keydown.esc="closeModal()">
        <v-row>
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
                    <b-button class="mt-3" block @click="closeModal()" style="margin-right: 3px">추가</b-button>
                    <b-button class="mt-3" block @click="closeModal()">취소</b-button>
                </div>
            </v-col>
        </v-row>
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
				fields : [
					{ label: '건물명', key: 'id', thClass: 'text-center', tdClass: 'text-center', sortable: false },
					{ label: '매장명', key: 'storeName', thClass: 'text-center', tdClass: 'text-center',  sortable: false },
					{ label: '주소', key: 'postcode', thClass: 'text-center', tdClass: 'text-center', sortable: false },
					{ label: '매장 유선번호', key: 'phone1', thClass: 'text-center', tdClass: 'text-center', sortable: false },
					{ label: '매장 휴대전화', key: 'phone2', thClass: 'text-center', tdClass: 'text-center', sortable: false },
					{ label: '선택', key: 'order', thClass: 'text-center', tdClass: 'text-center', sortable: false },
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
            if(newValue) {
                this.$refs['order-modify'].show()
            } else {
                this.$refs['order-modify'].hide()
            }
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
