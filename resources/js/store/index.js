import Vue from 'vue';
import Vuex from 'vuex';
import currentUser from "./modules/currentUser";

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {},
    getters: {},
    mutations: {},
    actions: {},
    modules: {
        currentUser
    }
});
