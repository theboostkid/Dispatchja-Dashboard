export default [
  {
    path: "/settings/statement-frequency",
    name: "Statement Frequency",
    meta: { 
      authRequired: true,
      allowedRoles: ['superuser']  
    },
    component: () => import("../pages/views/dashboard/settings/statement-frequency"),
  }, 
  {
    path: "/settings/users",
    name: "Users",
    meta: { 
      authRequired: true,
      allowedRoles: ['superuser', 'restaurant-admin']  
    },
    component: () => import("../pages/views/dashboard/settings/users"),
  },
  {
    path: "/settings/merchants",
    name: "Merchants",
    meta: { 
      authRequired: true,
      allowedRoles: ['superuser']  
    },
    component: () => import("../pages/views/dashboard/settings/merchant-information"),
  }
]