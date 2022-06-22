<template>
    <v-dialog
        scrollable
        persistent
        width="1400px"
        v-model="valueData"
        style="overflow-y: scroll"
        @click:outside="closeModal()"
        @keydown.esc="closeModal()">
        <v-card class="pa-5">
        <v-row dense class="d-flex justify-center">
            <v-col cols="10">
                <v-row>
                    <div class="col-12">
                        <div class="d-block text-start">
                            <h3>도매처 등록</h3>
                        </div>
                    </div>
                    <v-col cols="2" class="d-flex justify-center align-center">
                        매장명
                    </v-col>
                    <v-col cols="10" class="d-flex justify-center align-center">
                        <v-text-field 
                            dense
                            outlined
                            type="text" 
                            class="form-control" 
                            hide-details="auto"
                            v-model="searchData.text"
                            >
                        </v-text-field>
                        <v-btn
                            class="pa-0 btn-black"
                            @click="submit()">
                        검색 </v-btn>
                    </v-col>
                    <v-col cols="12">
                        <data-table-custom-component
                            class="th-center"
                            dense
                            itemsPerPageHide
                            countHide
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
                            content-class="tableline equipment-table td50"
                            @click:multiButton="clickMultiButton($event)"
                        >
                        </data-table-custom-component>
                    </v-col>
                </v-row>
            </v-col>
            <div class="col-10">
                <div style="display: flex; justify-content: end">
                    <v-btn @click="closeModal()">추가</v-btn>
                    <v-btn @click="closeModal()">취소</v-btn>
                </div>
            </div>
        </v-row>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import axios from 'axios';
import Vue from 'vue';

export default Vue.component('new-account', {
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
                        text: '매장명', sortable: true, value: 'store_name', align: 'center', cellClass: 'w-10 text-center',
                    },
                    {
                        text: '주소', sortable: true, value: 'postcode', align: 'center', cellClass: 'w-10 text-center',
                    },
                    {
                        text: '매장 휴대전화', sortable: true, value: 'phone_no', align: 'center', cellClass: 'w-10 text-center',
                    },
                    {
                        text: '매장 유선번호', sortable: true, value: 'mobile_no', align: 'center', cellClass: 'w-10 text-center',
                    },
                    {
                        text: '주문하기', value: 'order', align: 'center', cellClass: 'w-10 text-center', type: 'multiButton',
                    },
				],
				items: [],                
                cell: {
                    multiButton: {
                        order: {
                            buttonList: [
                                {
                                    contentClass: 'elevation-1 btn-order',
                                    title: '주문하기',
                                },
                            ]
                        },
                    },
                },
                page: 1,
                itemsPerPage: 10,
                totalRows: 10,
                loading: false,
			},
            searchData: {
                startTime: '',
                endTime: '',
                text: '',
            },
            item: [],
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
        item(n) {
            console.log(n)
            this.dataTable.items = this.item;
        }
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
        },
        async submit() {
            this.dataTable.loading = true;
            axios("http://127.0.0.1:5000/order/get-all", {
              method: "post",
              data: this.searchData
            })
            .then((response) => {
                console.log(response.data.data)
                this.item = response.data.data;
            })
            .catch((error) => {
                console.log(error);
            });
            this.dataTable.loading = false;
        },
    },
    mounted() {
    },
    created() {
    },
});
</script>

<style scoped>
</style>
