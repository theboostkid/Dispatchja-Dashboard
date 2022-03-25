export default [
  {
    path: "/dashboard",
    name: "Dashboard",
    meta: {
      allowedRoles: ['superuser', 'admin', 'restaurant-staff', 'restaurant-admin'],  
      authRequired: true 
    },
    component: () => import("../pages/views/dashboard/index"),
  },
  {
    path: "/statements",
    name: "Statements",
    meta: {
      allowedRoles: ['superuser', 'admin', 'restaurant-staff', 'restaurant-admin'],  
      authRequired: true 
    },
    component: () => import("../pages/views/dashboard/statements"),
  },
  {
    path: "/reports",
    name: "Report",
    meta: { 
      authRequired: true,
      allowedRoles: ['superuser', 'admin'] 
    },
    component: () => import("../pages/views/dashboard/restaurant-report"),
  },
  {
    path: "/agent-reckon",
    name: "Riders Reckon",
    meta: { 
      authRequired: true, 
      allowedRoles: ['superuser'] 
    },
    component: () => import("../pages/views/dashboard/riders-reckon"),
  },
  {
    path: "/profile",
    name: "Profile",
    meta: { 
      authRequired: true,
      allowedRoles: ['superuser', 'admin', 'restaurant-staff', 'restaurant-admin'] 
    },
    component: () => import("../pages/views/dashboard/profile"),
  },
  {
    path: "/settings/statement-frequency",
    name: "Statement Frequency",
    meta: { 
      authRequired: true,
      allowedRoles: ['superuser']  
    },
    component: () => import("../pages/views/dashboard/statement-frequency"),
  }, 
  {
    path: "/settings/users",
    name: "Users",
    meta: { 
      authRequired: true,
      allowedRoles: ['superuser', 'restaurant-admin']  
    },
    component: () => import("../pages/views/dashboard/users"),
  }
]