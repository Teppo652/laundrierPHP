import Vue from 'vue'
import VueRouter from 'vue-router'
import Booking from '@/components/Booking'
import Login from '@/components/Login'
import Register from '@/components/Register'
import Help from '@/components/Help'
import Management from '@/components/Management'
import Users from '@/components/Users'

Vue.use(VueRouter)

//const routes = [
let router = new VueRouter({
  /*mode: 'history',
  base: process.env.BASE_URL, */
  routes: [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/booking',
    name: 'booking',
    component: Booking
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/help',
    name: 'help',
    component: Help
  },
  {
    path: '/management',
    name: 'management',
    component: Management
  },
  {
    path: '/users',
    name: 'users',
    component: Users,
    meta: {
      requiresAuth: true
    }
  }
]
});

var IS_LOGGED_IN = true; // ------------------ TEMP ------------------------

// Nav Guard 
router.beforeEach((to, from, next) => {
  // Check for requiresAuth guard
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Check if NO logged user
    if (IS_LOGGED_IN) {
      // Go to login
      next({
        path: '/help',
        query: {
          redirect: to.fullPath
        }
      }), () => {}; // catches promise rejection
    } else {
      next(), () => {};
    }
  } else if (to.matched.some(record => record.meta.requiresGuest)) {
    // Check if NO logged user
    if (IS_LOGGED_IN) {
      // Go to login
      next({
        path: '/',
        query: {
          redirect: to.fullPath
        }
      }), () => {}; 
    } else {
      next(), () => {};
    }
  } else {
    next(), () => {}; 
  }
});

export default router

