import VueRouter from 'vue-router';
import LoginForm from "./components/LoginForm";
import MainPage from "./components/MainPage";

const router = new VueRouter({
    mode: 'history',
    routes: [
        { path: '/', name: 'login', component: LoginForm },
        { path: '/main', name: 'main', component: MainPage }
    ]
});

export {router, VueRouter};
