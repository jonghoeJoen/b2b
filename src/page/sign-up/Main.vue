<template>
    <v-container class="fill-height">
        <v-row>
            <v-col align="center">
                <v-card max-width="600">
                    <v-card-title class="d-flex justify-center">회원가입</v-card-title>
                    <v-card-subtitle class="d-flex justify-start mt-5 px-4">회원정보 입력</v-card-subtitle>
                    <v-card-text>
                        <v-form ref="form">
                            <v-row class="d-flex justify-center align-center">
                                <v-col cols="12" class="d-flex align-center">
                                    <v-radio-group 
                                        row 
                                        dense
                                        v-model="data.roleId"
                                        class="d-flex ma-0"
                                        :rules="[rules.role]"
                                        hide-details="auto">
                                        <v-radio label="판매처" value = 2></v-radio>
                                        <v-radio label="도매처" value = 3></v-radio>
                                    </v-radio-group>
                                </v-col>
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
                                        v-model="data.username"
                                        :rules="[rules.required]"
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
                                        :rules="[rules.required]"
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
                                        :rules="[rules.required, rules.passwordCheck]"
                                    ></v-text-field>
                                </v-col>
                                <template v-if="data.roleId == 3">
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
                                </template>
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
                                        v-model="data.name"
                                        :rules="[rules.name]"
                                    ></v-text-field>
                                </v-col>
                                <template v-if="data.roleId == 3">
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
                                            v-model="data.address"
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
                                </template>
                            </v-row>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <div style="width:100%">
                        <v-btn
                            color="primary"
                            width="100%"
                            @click="signUp();"
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
import axios from 'axios'

export default Vue.extend({
    data() {
        return {
            drawer: true,
            data: {
                username: null,  
                password: null,
                storeName: null,
                name: null,
                managerName: null,
                address: null,
                phoneNo: null,
                mobileNo: null,
                roleId: "2",

            },
            passwordCheck: null,
            rules: {
                required: (value) => !!value || '필수',
                // password: (value) => {
                //     let message; 
                //     let flag;
                //     flag = false;
                //     if (value == null || value.length < 8) {
                //         message = '비밀번호 8자 이상';
                //     } else if (/(\w)\1\1/.test(value)) {
                //         message = '동일한 3자리 문자';
                //     } else {
                //         flag = true;
                //     }
                //     return flag || message;
                // },
                passwordCheck: (value) => {
                    let message; 
                    let flag;
                    flag = false;
                    if (this.$data.data.password != null && this.$data.data.password != '' && value !== this.$data.data.password) {
                        message = '비밀번호와 일치하지 않습니다.';
                    } else {
                        flag = true;
                    }
                    return flag || message
                },
                name: (value) => !!value || '필수',
                role: (value) => !!value || '필수',
            },
        };
    },
    watch: {
    },
    computed: {
    },
    methods: {
        async signUp() {
            const validate = this.$refs.form.validate();
            if (validate === false) return;
            if (this.data.roleId == 2) {
                axios("/api/user/customer-sign-up", {
                method: "post",
                data: this.data,
                })
                .then((response) => {
                    if (response.data === "success") {
                        alert("회원가입이 완료되었습니다.");
                        this.$router.push("/sign-in");
                    } else {
                        alert("회원가입 실패");
                    }
                })
                .catch((error) => {
                });
            } else {
                axios("/api/user/seller-sign-up", {
                method: "post",
                data: this.data,
                })
                .then((response) => {
                    if (response.data === "success") {
                        alert("회원가입이 완료되었습니다.");
                        this.$router.push("/sign-in");
                    } else {
                        alert("회원가입 실패");
                    }
                })
                .catch((error) => {
                });
            }
        },
    },
    mounted() {
    },
    async created() {
    },
});
</script>
