import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userId: null,
    storeId: null,
    userRole: null,
    urlBeforeLogin: null,
  },
  getters: {
    GET_USER_ID: (state) => state.userId,
    GET_STORE_ID: (state) => state.storeId,
    GET_USER_ROLE: (state) => state.userRole,
    GET_URL_BEFORE_LOGIN: (state) => state.urlBeforeLogin,
  },
  mutations: {
    SET_USER_ID(state, payload) {
      state.userId = payload;
    },
    SET_STORE_ID(state, payload) {
      state.storeId = payload;
    },
    SET_USER_ROLE(state, payload) {
      state.userRole = payload;
    },
    SET_URL_BEFORE_LOGIN(state, payload) {
      state.urlBeforeLogin = payload;
    },
  },
  actions: {},
  modules: {},
});
