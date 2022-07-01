<template>
	<v-card class="pa-3" rounded flat>
    </v-card>
</template>
<script>
import store from '@/store';
import isValidJwt from '@/utils';

export default{
	data(){
		return {
		};
	},
	methods: {
	},
	mounted() {
		if (isValidJwt()) {
			let data = JSON.parse(atob(localStorage.token.split('.')[1]))
			this.username = data.username;
			this.userRole = data.role;
			this.userId = data.userId;
			this.storeId = data.storeId;
			console.log(data)
			store.commit('SET_USER_ROLE', this.userRole);
			store.commit('SET_USER_ID', this.userId);
			store.commit('SET_STORE_ID', this.storeId);
		} else {
			// console.log(dd)
			store.commit('SET_URL_BEFORE_LOGIN', window.location.pathname + window.location.search);
			// 로그인페이지로 이동
			this.$router.push({
				path: '/sign-in'
			}).catch(error => {})
		}
		if (store.getters['GET_USER_ROLE'] == 3) {
			let returnURL = store.getters['GET_URL_BEFORE_LOGIN'];
			console.log(returnURL);
			store.commit('SET_URL_BEFORE_LOGIN', null);
			if (returnURL) {
				this.$router.push({
					path: returnURL
				}).catch(error => {});
			} else {
				this.$router.push({
					path: '/orderNow'
				}).catch(error => {});
			}
		} else {
			this.$router.push({
				path: '/wholesaler'
			}).catch(error => {})
		}
	},
    watch: {
    }
}
</script>

<style>
</style>