import AuthRoutes from "./auth.routes";
import DashboardRoutes from "./dashboard.routes";

export default [
  
  {
    path: "/",
    name: "default",
    redirect: { name: 'login' }
  },
  ...AuthRoutes, 
  ...DashboardRoutes, 
  {
    path: "/404",
    name: "404",
    component: ()=> import("../pages/utility/404"),
  },
  // Redirect any unmatched routes to the 404 page. This may
  // require some server configuration to work in production:
  // https://router.vuejs.org/en/essentials/history-mode.html#example-server-configurations
  {
    path: "*",
    redirect: "404",
  },
];