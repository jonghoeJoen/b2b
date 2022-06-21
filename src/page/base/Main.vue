<template>
	<v-app class="layout">
		<v-navigation-drawer app v-model="drawer" class="drawer pa-0" style="padding:0px; margin:0px;">
			<v-list-item to="/">
                <v-list-item-content>
					<v-list-item-title style=" backgroud-color:red" class="title">B2B</v-list-item-title>
					<v-list-item-subtitle class="title"></v-list-item-subtitle>
				</v-list-item-content>
			</v-list-item>
			<v-divider></v-divider>
			<v-list nav dense>
                <v-list-item-group
                    color="primary"
                >
                    <v-list-item
                    v-for="(item, i) in items"
                    :key="i"
					:href="item.href"
                    >
                    <v-list-item-icon>
                        <v-icon v-text="item.icon"></v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title v-text="item.text"></v-list-item-title>
                    </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
					<v-list-group
    					:value="true"
        				prepend-icon="mdi-account-circle">
						<template v-slot:activator>
							<v-list-item-title>관리자페이지</v-list-item-title>
						</template>
						<v-list-item
						v-for="(item, i) in admins"
						:key="i"
						:href="item.href"
						>
						<v-list-item-icon>
							<v-icon v-text="item.icon"></v-icon>
						</v-list-item-icon>
						<v-list-item-content>
							<v-list-item-title v-text="item.text"></v-list-item-title>
						</v-list-item-content>
						</v-list-item>
					</v-list-group>
			</v-list>
		</v-navigation-drawer>
		<v-app-bar app dense elevation="1">
			<v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
			<div class="d-flex align-center">
				<!-- <template v-if="client && client.imgFile">
					<v-img contain :src="'/api/app/data-uploads/image/' + subPath + '/' + client.imgFile" max-height="22px !important" max-width="55px !important"></v-img>
				</template> -->
			</div>
			<v-spacer></v-spacer>
			<!-- <span>{{ name }}</span> -->
			<v-menu left bottom>
				<template v-slot:activator="{ on, attrs }">
					<v-btn icon v-bind="attrs" v-on="on">
						<v-icon>mdi-dots-vertical</v-icon>
					</v-btn>
				</template>
				<v-list
					min-width="180px">
					<v-list-item href="/sign-in">
						<v-list-item-icon>
							<v-icon>mdi-logout</v-icon>
						</v-list-item-icon>
						<v-list-item-content>
							<v-list-item-title>로그아웃</v-list-item-title>
						</v-list-item-content>
					</v-list-item>
				</v-list>
			</v-menu>
			<!-- <div class="d-flex align-center">
				<v-switch
					hide-details
					v-model="themeDark"
					@change="themaChange()"
				></v-switch>
			</div> -->
        </v-app-bar>
		<v-main>
            <v-subheader>
            <!-- {{store.getters['app/GET_SHOW_MENU_PATH_NAME']}} -->
            </v-subheader>
            <v-fade-transition hide-on-leave>
                <router-view></router-view>
            </v-fade-transition>
        </v-main>
        <v-footer app absolute paddless inset>
            <v-row no-gutters>
                <v-col class="text-center">
                    <span class="text-overline"> © Copyright 2022 (주) 메타소프트</span>
                </v-col>
            </v-row>
        </v-footer>
	</v-app>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    data() {
        return {
            drawer: true,
            items: [
				{
					icon: 'mdi-inbox',
					text: '판매처 리스트',
					href: '/wholesaler'
				},
				{
					icon: 'mdi-star',
					text: '주문 내역',
					href: '/orderHistory'
				},
				{
					icon: 'mdi-star',
					text: '주문 현황',
					href: '/orderNow'
				},
			],
			admins: [
				{
					icon: 'mdi-inbox',
					text: '판매처 리스트',
					href: 'admin-wholesaler'
				},
				{
					icon: 'mdi-star',
					text: '주문 내역',
					href: 'admin-orderHistory'
				},
      		],
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
