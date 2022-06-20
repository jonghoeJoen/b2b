import Vue from "vue";
import VueRouter from "vue-router";
import Base from "../page/base/Main.vue";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        redirect: '/wholesaler',
        name: "home",
        component: () => import("../page/base/Main.vue"),
        children: [
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
                component: () => import('../page/wholesaler/orderNow/Main.vue'),
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
