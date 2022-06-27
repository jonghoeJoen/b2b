<template>
	<v-card class="pa-3" rounded flat>
    </v-card>
</template>
<script>
import store from '@/store';
export default{
	data(){
		return {
		};
	},
	methods: {
	},
	mounted() {
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