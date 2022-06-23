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
		console.log(store.getters['GET_ROLE'] == 3)
		if (store.getters['GET_ROLE'] == 3) {
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