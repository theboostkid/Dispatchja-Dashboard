export default [
  {
    path: "/dashboard",
    name: "Dashboard",
    meta: { authRequired: true },
    component: () => import("../pages/views/dashboard/index"),
  },
  {
    path: "/invoices",
    name: "Invoices",
    meta: { authRequired: true },
    component: () => import("../pages/views/dashboard/invoices"),
  },
  {
    path: "/reports",
    name: "Report",
    meta: { authRequired: true },
    component: () => import("../pages/views/dashboard/restaurant-report"),
  },
  {
    path: "/agent-reckon",
    name: "Riders Reckon",
    meta: { authRequired: true },
    component: () => import("../pages/views/dashboard/riders-reckon"),
  },
  {
    path: "/profile",
    name: "Profile",
    meta: { authRequired: true },
    component: () => import("../pages/views/dashboard/profile"),
  },
  {
    path: "/users",
    name: "Users",
    meta: { authRequired: true },
    component: () => import("../pages/views/dashboard/users"),
  },
]