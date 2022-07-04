import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import VueClipboard from 'vue-clipboard2'
import axios from "axios";

VueClipboard.config.autoSetContainer = true
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  VueClipboard,
  axios,
  render: (h) => h(App),
}).$mount("#app");
