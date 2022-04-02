export const menuItems = [
  {
      id: 1,
      label: "menuitems.dashboard.text",
      icon: "bx-bar-chart-square",
      link: "/dashboard",
      linkName: "Dashboard",
      allowed:['superuser', 'admin']
  },
  {
      id: 2,
      label: "menuitems.statements.text",
      icon: "bx-pie-chart-alt",
      link: "/statements",
      linkName: "Statements",
      allowed:['superuser', 'admin', 'restaurant-staff', 'restaurant-admin']
  },
  
  {
      id: 3,
      label: "menuitems.reports.text",
      icon: "bx-trending-up",
      link: "/reports",
      linkName: "Report",
      allowed:['superuser', 'admin']
  },
  {
      id: 4,
      label: "menuitems.agentreckon.text",
      icon: "mdi mdi-bike-fast",
      link: "/reckon",
      linkName: "Riders Reckon",
      allowed:['superuser']
  },
  {
    id: 5,
    label: 'menuitems.settings.text',
    icon: 'bx-cog',
    allowed:['superuser', 'restaurant-admin'],
    subItems: [
      {
          id: 6,
          label: 'menuitems.settings.list.users',
          link: 'dashboard/settings/users',
          linkName: "Users",
          allowed:['superuser', 'restaurant-admin'],
          parentId: 5
      },
      {
          id: 7,
          label: 'menuitems.settings.list.statement-frequency',
          link: '/dashboard/settings/statement-frequency',
          linkName: "Statement Frequency",
          allowed:['superuser', 'restaurant-admin'],
          parentId: 5
      },
      {
        id: 8,
        label: 'menuitems.settings.list.merchant-information',
        link: '/dashboard/settings/merchants',
        linkName: "Merchants",
        allowed:['superuser', 'restaurant-admin'],
        parentId: 5
    },
    ]
  },
];

