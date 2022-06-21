<template>
	<v-card class="pa-3" rounded flat>
        <v-row>
            <v-col class="col-12">
                <v-row class="d-flex justify-center">
                    <v-col cols="10" class="d-flex justify-space-between">
                        <div class="sign-up-subtitle">주문 현황</div>
                        <div class="d-flex justify-center align-center">
                            조회 기간
                            <picker-date-picker-component
                                prepend-inner-icon="mdi-calendar"
                                dense
                                outlined
                                hide-details
                            >
                            </picker-date-picker-component>
                            ~
                            <picker-date-picker-component
                                prepend-inner-icon="mdi-calendar"
                                dense
                                outlined
                                hide-details
                            >
                            </picker-date-picker-component>
                            <v-text-field
                                dense
                                outlined
                                class="pa-0"
                                hide-details="auto"    
                            ></v-text-field>
                            <v-btn>검색</v-btn>
                        </div>
                    </v-col>
                    <v-col cols="10">
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
                            @click:multiButton="clickMultiButton($event)"
                        ></data-table-custom-component>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-card>
</template>
<script>
import DataTableCustom from '@/components/DataTableCustom.vue';
import DatePicker from '@/components/DatePicker.vue';
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
                        text: '주문일자', sortable: true, value: 'id', align: 'center', cellClass: 'w-10 text-center',
                    },
                    {
                        text: '매장명', sortable: true, value: 'storeName', align: 'center', cellClass: 'w-10 text-center',
                    },
                    {
                        text: '주소', sortable: true, value: 'postcode', align: 'center', cellClass: 'w-10 text-center',
                    },
                    {
                        text: '상품명', sortable: true, value: 'goods', align: 'center', cellClass: 'w-10 text-center',
                    },
                    {
                        text: '색상', sortable: true, value: 'color', align: 'center', cellClass: 'w-10 text-center',
                    },
                    {
                        text: '사이즈', sortable: true, value: 'size', align: 'center', cellClass: 'w-10 text-center',
                    },
                    {
                        text: '가능여부', sortable: true, value: 'possible', align: 'center', cellClass: 'w-10 text-center',
                    },
                    {
                        text: '비고', sortable: true, value: 'possible', align: 'center', cellClass: 'w-10 text-center',
                    },
				],
                page: 1,
                itemsPerPage: 10,
                totalRows: 10,
				items: [
                    { id: 1, storeName: 'test', postcode: 'tewstsetsets', phone1: '010-0000-0000', phone2: '02)000-0000'}
                ],
			},
            value: null,
		};
	},
	methods: {
		// submit() {
		// 	const path = 'http://127.0.0.1:5000/dataentry'
		// 	const data = axios.post(path, {
		// 		name:this.dataentry.name,
		// 		department:this.dataentry.department,
		// 	}
		// )
		// data.then(response => {
		// 	console.log(response);
		// 	this.items = response;
		// })
		// .catch(err =>{
		// 	console.log(err);
		// });
		// },
	},
	mounted() {
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