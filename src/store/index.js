import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {
      name: localStorage.getItem("user-name"),
      db: {
        name: localStorage.getItem("user-db-name"),
        url: localStorage.getItem("user-db-url"),
      },
    },
  },
  mutations: {
    insert(state, payload) {
      state.user.name = payload.name;
      state.user.db.name = payload.db.name;
      state.user.db.url = payload.db.url;
      localStorage.setItem("user-name", state.user.name);
      localStorage.setItem("user-db-name", state.user.db.name);
      localStorage.setItem("user-db-url", state.user.db.url);
    },
  },
  actions: {},
  modules: {},
});
