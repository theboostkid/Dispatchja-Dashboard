export const menuItems = [
    {
        id: 1,
        label: "menuitems.dashboard.text",
        icon: "bx-home-circle",
        link: "/dashboard"
    },
    {
        id: 2,
        label: "menuitems.invoices.text",
        icon: "bx-home-circle",
        link: "/invoices"
    },
    {
        id: 3,
        label: "menuitems.reports.text",
        icon: "bx-home-circle",
        subItems: [
          {
            id: 4,
            label: "menuitems.reports.list.restaurant-reports",
            link: "/reports/overall",
            parentId: 3
          },
          {
            id: 5,
            label: "menuitems.reports.list.overall-reports",
            link: "/reports/restaurant",
            parentId: 3
          }
        ]
    },
    {
        id: 6,
        label: "menuitems.agentreckon.text",
        icon: "bx-home-circle",
        link: "/reckon"
    },
];