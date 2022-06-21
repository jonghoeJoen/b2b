<template>
    <v-dialog
        scrollable
        persistent
        width="800px"
        v-model="valueData"
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
                    <v-col cols="3" class="d-flex justify-center align-center">
                        매장명
                    </v-col>
                    <v-col cols="9" class="d-flex justify-center align-center">
                        <v-text-field 
                            dense
                            outlined
                            type="text" 
                            class="form-control" 
                            hide-details="auto">
                        </v-text-field>
                        <v-btn> 검색 </v-btn>
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
                        text: '주문하기', sortable: true, value: 'order', align: 'center', cellClass: 'w-10 text-center',
                    },
				],
				items: [
                    { id: 1, storeName: 'test', postcode: 'tewstsetsets', phone1: '010-0000-0000', phone2: '02)000-0000', }
                ],
                page: 1,
                itemsPerPage: 10,
                totalRows: 10,
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
