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
                <v-col cols="8">
                    <v-row>
                        <v-col cols="12">
                            <div class="d-block text-start">
                                <h3>도매처 등록</h3>
                            </div>
                        </v-col>
                        <v-col cols="3">
                            매장명
                        </v-col>
                        <v-col cols="9">
                            <v-text-field
                                dense
                                outlined
                                autocomplete="on"
                                type="text"
                                hide-details="auto"
                                v-model="data.storeName"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="3">
                            건물 명
                        </v-col>
                        <v-col cols="9">
                            <v-select
                                dense
                                outlined
                                autocomplete="on"
                                type="text"
                                hide-details="auto"
                                v-model="data.buildingNum"
                                :items="building.items"
                                item-text="name"
                                item-value="id"
                            ></v-select>
                        </v-col>
                        <v-col cols="3">
                            대표자명
                        </v-col>
                        <v-col cols="9">
                            <v-text-field
                                dense
                                outlined
                                autocomplete="on"
                                type="text"
                                hide-details="auto"
                                v-model="data.ceoName"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="3">
                            담당자명
                        </v-col>
                        <v-col cols="9">
                            <v-text-field
                                dense
                                outlined
                                autocomplete="on"
                                type="text"
                                hide-details="auto"
                                v-model="data.managerName"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="3">
                            매장 주소
                        </v-col>
                        <v-col cols="9">
                            <v-text-field
                                dense
                                outlined
                                autocomplete="on"
                                type="text"
                                hide-details="auto"
                                v-model="data.address1"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="3">
                            우편 번호
                        </v-col>
                        <v-col cols="9">
                            <v-text-field
                                dense
                                outlined
                                autocomplete="on"
                                type="text"
                                hide-details="auto"
                                v-model="data.postcode"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="3">
                            상세주소
                        </v-col>
                        <v-col cols="9">
                            <v-text-field
                                dense
                                outlined
                                autocomplete="on"
                                type="text"
                                hide-details="auto"
                                v-model="data.address2"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="3">
                            매장 위치
                        </v-col>
                        <v-col cols="9">
                            <v-text-field
                                dense
                                outlined
                                autocomplete="on"
                                type="text"
                                hide-details="auto"
                                v-model="data.storeLocation"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="3">
                            매장 유선번호
                        </v-col>
                        <v-col cols="9">
                            <v-text-field
                                dense
                                outlined
                                autocomplete="on"
                                type="text"
                                hide-details="auto"
                                v-model="data.phoneNo"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="3">
                            매장 휴대전화
                        </v-col>
                        <v-col cols="9">
                            <v-text-field
                                dense
                                outlined
                                autocomplete="on"
                                type="text"
                                hide-details="auto"
                                v-model="data.mobileNo"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="10">
                    <div style="display: flex; justify-content: end">
                        <v-btn class="btn-order" @click="createCheck()">업체 등록</v-btn>
                        <v-btn @click="modalClose()">취소</v-btn>
                    </div>
                </v-col>
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
            data: {
                storeName : '',
                storeLocation : '',
                phoneNo : '',
                mobileNo : '',
                accountNumber : '',
                buildingNum : '',
                address1: '',
                ceoName : '',
                managerName : '',
                address2 : '',
                postcode : '',
            },
            valueData: null,
            searchData: {
                parent_id: '1',
            },
            building: {
                items: [],
            }
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
        modalClose() {
            this.valueData = false;
            this.$emit('update:value', false);
            this.$emit('update:requestId', null);
        },
        createCheck() {
            console.log(this.data);
            if (this.data.storeName == '') {
                alert('업체명을 입력해주세요');
                return;
            }
            if (this.data.storeLocation == '') {
                alert('업체 위치를 입력해주세요');
                return;
            }
            if (this.data.phoneNo == '' && this.data.mobileNo) {
                alert('전화번호를 입력해주세요');
                return;
            }
            if (this.data.address2 == '' && this.data.address1 == '') {
                alert('업체 주소를 입력해주세요');
                return;
            }
            if (this.data.managerName == '') {
                alert('매장 CEO명을 입력해주세요');
                return;
            }
            if (this.data.managerName == '') {
                alert('매장 매니저명을 입력해주세요');
                return;
            }
            if (this.data.managerName == '') {
                alert('매장 우편번호를 입력해주세요');
                return;
            }
            this.createStore();
        },
        createStore() {
            axios("/shop/create-store", {
                method: "post",
                data: this.data,
            })
            .then((response) => {
                if(response.data == 'sucess') {
                    alert('업체를 등록완료 하였습니다.');
                    this.clean();
                    this.modalClose();
                    this.$router.go(0);
                } else {
                    alert('업체 등록에 실패하였습니다.');
                    this.clean();
                    this.modalClose();
                    this.$router.go(0);
                }
            })
            .catch((error) => {
                console.log(error);
            });
        },
        loadCodeList() {
            console.log(this.searchData)
            axios("http://127.0.0.1:5000/code/get-all", {
                method: "post",
                data: this.searchData,
            })
            .then((response) => {
                console.log(response);
                this.building.items = response.data.data
            })
            .catch((error) => {
                console.log(error);
            });
        },
        clean() {
            this.data = {
                storeName : '',
                storeLocation : '',
                phoneNo : '',
                mobileNo : '',
                accountNumber : '',
                buildingNum : '',
                address1: '',
                ceoName : '',
                managerName : '',
                address2 : '',
                postcode : '',
            };
        },
    },
    mounted() {
    },
    created() {
        this.loadCodeList()
    },
});
</script>

<style scoped>
</style>
