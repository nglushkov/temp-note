/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

import Vue from "vue";

require('./bootstrap');

window.Vue = require('vue');

/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

// const files = require.context('./', true, /\.vue$/i)
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default))

Vue.component('example-component', require('./components/ExampleComponent.vue').default);
Vue.component('login-form', require('./components/LoginForm.vue').default);

import VModal from 'vue-js-modal'
import TimeAgo from 'javascript-time-ago'
import ru from 'javascript-time-ago/locale/ru'
import {store} from './store';
import axios from "axios";
import App from "./views/App";
import {router} from './router';
import VueRouter from "vue-router";


Vue.prototype.$http = axios;
Vue.use(VModal);
Vue.use(VueRouter);

TimeAgo.addDefaultLocale(ru);

const token = localStorage.getItem('token')
if (token) {
    Vue.prototype.$http.defaults.headers.common['Authorization'] = 'Bearer ' + token;
}

let loggedIn = !!token;
store.commit('currentUser/setLoggedIn', loggedIn);

const app = new Vue({
    el: '#app',
    components: { App },
    router,
    store,
});
