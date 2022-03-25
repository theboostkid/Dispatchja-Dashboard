import store from "@/state/store";

export default [
  {
    path: "/login",
    name: "login",
    component: () => import("../pages/views/account/login")
  },
  {
    path: "/forgot-password",
    name: "Forgot password",
    component: () => import("../pages/views/account/forgot-password"),
    meta: {
      beforeResolve(routeTo, routeFrom, next) {
        // If the user is already logged in
        if (store.getters["auth/loggedIn"]) {
          // Redirect to the home page instead
          next({ name: "default" });
        } else {
          // Continue to the login page
          next();
        }
      },
    },
  },
  {
    path: "/logout",
    name: "logout",
    beforeEnter(routeTo, routeFrom, next) {
      store.dispatch('auth/logOut', store.state.auth.currentUser.id);
      next('/login');
    },
  },
]