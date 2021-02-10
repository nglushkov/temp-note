import axios from 'axios';
import {router} from '../../router';

const state = {
    user: {
        email: '',
        password: '',
    },
    isLoggedIn: false,
};
const getters = {};
const mutations = {
    setUser: (state, payload) => {
        state.user = payload;
    },
    setLoggedIn: (state, payload) => {
        state.isLoggedIn = payload;
    },
};
const actions = {
    loginUser: (context, user) => {
        axios.post('/api/v1/login', {
            email: user.email,
            password: user.password,
        }).then(response => {
            if (response.data.access_token) {
                context.commit('setUser', response.data.user);
                context.commit('setLoggedIn', true);
                localStorage.setItem(
                    'token',
                    response.data.access_token
                );
                axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.access_token;

                router.push('/main');
            }
        }).catch(error => {
            alert(error);
        });
    },
    logoutUser(context) {
        context.commit('setLoggedIn', false);
        localStorage.removeItem('token');
        window.location.replace('/');
    },
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};
