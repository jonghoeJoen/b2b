import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userRole: null,

  },
  getters: {
    GET_ROLE: (state) => state.userRole,
  },
  mutations: {
    SET_ROLE(state, payload) {
      state.userRole = payload;
    },
  },
  actions: {},
  modules: {},
});
