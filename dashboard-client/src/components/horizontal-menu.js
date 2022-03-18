export const menuItems = [
  {
      id: 1,
      label: "menuitems.dashboard.text",
      icon: "bx-home-circle",
      link: "/dashboard",
      linkName: "Dashboard",
      allowed:['superuser', 'admin']
  },
  {
      id: 2,
      label: "menuitems.statements.text",
      icon: "bx-home-circle",
      link: "/statements",
      linkName: "Statements",
      allowed:['superuser', 'admin', 'restaurant-staff', 'restaurant-admin']
  },
  
  {
      id: 3,
      label: "menuitems.reports.text",
      icon: "bx-home-circle",
      link: "/reports",
      linkName: "Report",
      allowed:['superuser', 'admin']
  },
  {
      id: 4,
      label: "menuitems.agentreckon.text",
      icon: "bx-home-circle",
      link: "/reckon",
      linkName: "Riders Reckon",
      allowed:['superuser']
  },
  {
    id: 5,
    label: 'menuitems.settings.text',
    icon: 'bx-home-circle',
    allowed:['superuser', 'restaurant-admin'],
    subItems: [
      {
          id: 6,
          label: 'menuitems.settings.list.users',
          link: '/settings/users',
          linkName: "Users",
          allowed:['superuser', 'restaurant-admin'],
          parentId: 5
      },
      {
          id: 7,
          label: 'menuitems.settings.list.statement-frequency',
          link: '/dashboard/statement-frequency',
          linkName: "Statement Frequency",
          allowed:['superuser', 'restaurant-admin'],
          parentId: 5
      },
    ]
  },
];

