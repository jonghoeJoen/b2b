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
			this.$router.push({
				path: '/orderNow'
			}).catch(error => {});
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