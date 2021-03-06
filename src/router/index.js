import Vue from "vue";
import VueRouter from "vue-router";
import Base from "@/page/base/Main.vue";
import store from '@/store';

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        redirect: '/page',
        name: "home",
        component: () => import("../page/base/Main.vue"),
        children: [
            {
                path:'/page',
                component: () => import('../page/base/DefaultPage.vue'),
            },
            {
                path:'/wholesaler',
                component: () => import('../page/vendor/wholesaleList/Main.vue'),
            },
            {
                path:'/orderHistory',
                component: () => import('../page/vendor/orderHistory/Main.vue'),
            },
            {
                path:'/orderNow',
                // component: () => import('../page/wholesaler/orderNow/Main.vue'),
                component: () => import('../page/wholesaler/OrderHistory.vue'),
            },
            {
                path:'/store/orderhistory',
                component: () => import('../page/wholesaler/OrderHistory.vue'),
            },
            {
                path:'/admin-wholesaler',
                component: () => import('../page/admin/wholesaleList/Main.vue'),
            },
            {
                path:'/admin-orderHistory',
                component: () => import('../page/admin/orderHistory/Main.vue'),
            },
            {
                path:'/admin-customer',
                component: () => import('../page/admin/customer/Main.vue'),
            },
        ]
    },
    {
        path: "/base",
        name: "base",
        component: Base,
    },
    {
        path: "/sign-in",
        name: "sign-in",
        component: () => import("../page/sign-in/Main.vue"),
    },
    {
        path: "/sign-up",
        name: "sign-up",
        component: () => import("../page/sign-up/Main.vue"),
    },
    {
        path: "/about",
        name: "about",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import("../views/AboutView.vue"),
    },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  
});

export default router;
