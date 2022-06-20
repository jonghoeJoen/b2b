<template>
    <v-container class="fill-height">
        <v-row>
            <v-col align="center">
                <v-card max-width="600">
                    <v-card-title class="d-flex justify-center">회원가입</v-card-title>
                    <v-card-subtitle class="d-flex justify-start mt-5 px-4">회원정보 입력</v-card-subtitle>
                    <v-card-text>
                        <v-form>
                            <v-row class="d-flex justify-center align-center">
                                <v-col cols="3">
                                    아이디
                                </v-col>
                                <v-col cols="9">
                                    <v-text-field
                                        dense
                                        outlined
                                        autocomplete="on"
                                        placeholder="영문 소문자 또는 영문+숫자 조합 4~30자리"
                                        type="text"
                                        hide-details="auto"
                                        v-model="data.id"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="3">
                                    비밀번호
                                </v-col>
                                <v-col cols="9">
                                    <v-text-field
                                        dense
                                        outlined
                                        autocomplete="on"
                                        placeholder="영문 + 숫자 + 특수문자 조합 8~15자리"
                                        type="password"
                                        hide-details="auto"
                                        v-model="data.password"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="3">
                                    비밀번호 확인
                                </v-col>
                                <v-col cols="9">
                                    <v-text-field
                                        dense
                                        outlined
                                        autocomplete="on"
                                        placeholder="비밀번호 확인"
                                        type="password"
                                        hide-details="auto"
                                        v-model="passwordCheck"
                                    ></v-text-field>
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
                                    대표자명
                                </v-col>
                                <v-col cols="9">
                                    <v-text-field
                                        dense
                                        outlined
                                        autocomplete="on"
                                        type="text"
                                        hide-details="auto"
                                        v-model="data.representativeName"
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
                                    매장주소
                                </v-col>
                                <v-col cols="9">
                                    <v-text-field
                                        dense
                                        outlined
                                        autocomplete="on"
                                        type="text"
                                        hide-details="auto"
                                        v-model="data.postCode1"
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
                                        v-model="data.storeLineNumber"
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
                                        v-model="data.storePhoneNumber"
                                    ></v-text-field>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <div style="width:100%">
                        <v-btn
                            href="/sign-in"
                            color="primary"
                            width="100%"
                            @click="login();"
                        >회원가입</v-btn>
                        </div>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    data() {
        return {
            drawer: true,
            data: {
                id: null,  
                password: null,
                storeName: null,
                representativeName: null,
                managerName: null,
                postCode1: null,
                postCode2: null,
                storeLineNumber: null,
                storePhoneNumber: null,

            },
            passwordCheck: null,
        };
    },
    watch: {
    },
    computed: {
    },
    methods: {
    },
    mounted() {
    },
    created() {
    },
});
</script>
