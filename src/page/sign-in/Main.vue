<template>
    <v-container class="fill-height">
        <v-row>
            <v-col align="center">
                <v-card max-width="400">
                    <v-card-title class="d-flex justify-center">B2B</v-card-title>
                    <v-card-subtitle class="d-flex justify-start mt-5 px-4">로그인</v-card-subtitle>
                    <v-card-text>
                        <v-form>
                            <v-text-field
                                autocomplete="on"
                                placeholder="아이디"
                                type="text"
                                hide-details="auto"
                                v-model="data.username"
                                @keydown.enter="login();"
                            ></v-text-field>
                            <v-text-field
                                autocomplete="on"
                                placeholder="비밀번호"
                                type="password"
                                hide-details="auto"
                                v-model="data.password"
                                @keydown.enter="login();"
                            ></v-text-field>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <div style="width:100%">
                        <v-spacer></v-spacer>
                        <v-btn
                            href="/"
                            color="primary"
                            width="100%"
                            @click="login();"
                        >로그인</v-btn>
                        <br/>
                        <br/>
                        <v-btn
                            href="/sign-up"
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
            }
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
