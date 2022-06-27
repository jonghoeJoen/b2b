import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userId: null,
    userRole: null,
  },
  getters: {
    GET_USER_ID: (state) => state.userId,
    GET_USER_ROLE: (state) => state.userRole,
  },
  mutations: {
    SET_USER_ID(state, payload) {
      state.userId = payload;
    },
    SET_USER_ROLE(state, payload) {
      state.userRole = payload;
    },
  },
  actions: {},
  modules: {},
});
