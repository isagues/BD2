import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {
      name: null,
      db: null,
    },
  },
  mutations: {
    insert(state, payload) {
      state.user.name = payload.name;
      state.user.db = payload.db;
    },
  },
  actions: {},
  modules: {},
});
