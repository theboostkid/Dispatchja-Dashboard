import store from '@/state/store'

export default [
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/pages/account/login'),
        meta: {
            beforeResolve(routeTo, routeFrom, next) {
                // If the user is already logged in
                if (store.getters['auth/loggedIn']) {
                    // Redirect to the home page instead
                    next({ name: 'home' })
                } else {
                    // Continue to the login page
                    next()
                }
            },
        },
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('../views/pages/account/register'),
        meta: {
            beforeResolve(routeTo, routeFrom, next) {
                // If the user is already logged in
                if (store.getters['auth/loggedIn']) {
                    // Redirect to the home page instead
                    next({ name: 'home' })
                } else {
                    // Continue to the login page
                    next()
                }
            },
        },
    },
    {
        path: '/forgot-password',
        name: 'Forgot-password',
        component: () => import('../views/pages/account/forgot-password'),
        meta: {
            beforeResolve(routeTo, routeFrom, next) {
                // If the user is already logged in
                if (store.getters['auth/loggedIn']) {
                    // Redirect to the home page instead
                    next({ name: 'home' })
                } else {
                    // Continue to the login page
                    next()
                }
            },
        },
    },
    {
        path: '/logout',
        name: 'logout',
        meta: {
            authRequired: true,
            beforeResolve(routeTo, routeFrom, next) {
                if (process.env.VUE_APP_DEFAULT_AUTH === "firebase") {
                    store.dispatch('auth/logOut')
                } else if (process.env.VUE_APP_DEFAULT_AUTH === "fakebackend") {
                    store.dispatch('authfack/logout')
                }
                const authRequiredOnPreviousRoute = routeFrom.matched.some(
                    (route) => route.push('/login')
                )
                // Navigate back to previous page, or home as a fallback
                next(authRequiredOnPreviousRoute ? { name: 'home' } : { ...routeFrom })
            },
        },
    },
    {
        path: '/',
        name: 'home',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/dashboard/sales/index')
    },
    {
        path: '/dashboard/crm',
        name: 'crm-dashboard',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/dashboard/crm/index')
    },
    {
        path: '/dashboard/analytics',
        name: 'analytics-dashboard',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/dashboard/analytics/index')
    },
    {
        path: '/apps/calendar',
        name: 'calendar',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/apps/calendar/index')
    },
    {
        path: '/apps/chat',
        name: 'chat',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/apps/chat')
    },
    {
        path: '/apps/companies',
        name: 'companies',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/apps/companies')
    },
    {
        path: '/apps/tickets',
        name: 'tickets',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/apps/tickets')
    },
    {
        path: '/apps/file-manager',
        name: 'file-manager',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/apps/file-manager')
    },
    {
        path: '/ecommerce/customers',
        name: 'customers',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/ecommerce/customers/index')
    },
    {
        path: '/ecommerce/orders',
        name: 'orders',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/ecommerce/orders/index')
    },
    {
        path: '/ecommerce/product-detail/:id',
        name: 'product-detail',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/ecommerce/product-detail')
    },
    {
        path: '/ecommerce/products',
        name: 'products',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/ecommerce/products/index')
    },
    {
        path: '/ecommerce/cart',
        name: 'cart',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/ecommerce/cart')
    },
    {
        path: '/ecommerce/checkout',
        name: 'checkout',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/ecommerce/checkout')
    },
    {
        path: '/ecommerce/order-detail',
        name: 'order-detail',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/ecommerce/order-detail')
    },
    {
        path: '/ecommerce/product-create',
        name: 'product-create',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/ecommerce/product-create')
    },
    {
        path: '/ecommerce/products-grid',
        name: 'products-grid',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/ecommerce/products-grid')
    },
    {
        path: '/ecommerce/sellers',
        name: 'sellers',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/ecommerce/sellers')
    },
    {
        path: '/email/inbox',
        name: 'email-inbox',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/email/inbox')
    },
    {
        path: '/email/reademail/:id',
        name: 'reademail',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/email/reademail')
    },
    {
        path: '/email/templates',
        name: 'email-templates',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/email/templates')
    },
    {
        path: '/task/list',
        name: 'task-list',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/task/list')
    },
    {
        path: '/task/detail',
        name: 'task-detail',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/task/detail')
    },
    {
        path: '/task/kanban',
        name: 'kanban-board',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/task/kanban/index')
    },
    {
        path: '/contacts/list',
        name: 'contacts-list',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/contacts/list')
    },
    {
        path: '/contacts/profile',
        name: 'contacts-profile',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/contacts/profile')
    },
    {
        path: '/auth/login-1',
        name: 'auth-login-1',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/auth/login-1')
    },
    {
        path: '/auth/register-1',
        name: 'auth-register-1',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/auth/register-1')
    },
    {
        path: '/auth/recoverpwd',
        name: 'auth-recoverpwd',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/auth/recoverpwd')
    },
    {
        path: '/auth/lock-screen',
        name: 'auth-lock-screen',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/auth/lock-screen')
    },
    {
        path: '/auth/signin-signup',
        name: 'auth-signin-signup',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/auth/signin-signup')
    },
    {
        path: '/auth/logout-1',
        name: 'auth-logout-1',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/auth/logout-1')
    },
    {
        path: '/auth/login-2',
        name: 'auth-login-2',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/auth/login-2')
    },
    {
        path: '/auth/register-2',
        name: 'auth-register-2',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/auth/register-2')
    },
    {
        path: '/auth/recoverpwd-2',
        name: 'auth-recoverpwd-2',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/auth/recoverpwd-2')
    },
    {
        path: '/auth/lock-screen-2',
        name: 'auth-lock-screen-2',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/auth/lock-screen-2')
    },
    {
        path: '/auth/signin-signup-2',
        name: 'auth-signin-signup-2',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/auth/signin-signup-2')
    },
    {
        path: '/auth/logout-2',
        name: 'auth-logout-2',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/auth/logout-2')
    },
    {
        path: '/extras/starter',
        name: 'extras-starter',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/extras/starter')
    },
    {
        path: '/extras/timeline',
        name: 'extras-timeline',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/extras/timeline')
    },
    {
        path: '/extras/sitemap',
        name: 'extras-sitemap',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/extras/sitemap')
    },
    {
        path: '/extras/invoice',
        name: 'extras-invoice',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/extras/invoice')
    },
    {
        path: '/extras/faqs',
        name: 'extras-faqs',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/extras/faqs')
    },
    {
        path: '/extras/search-results',
        name: 'extras-search-results',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/extras/search-results')
    },
    {
        path: '/extras/pricing',
        name: 'extras-pricing',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/extras/pricing')
    },
    {
        path: '/extras/maintenance',
        name: 'extras-maintenance',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/extras/maintenance')
    },
    {
        path: '/extras/coming-soon',
        name: 'extras-coming-soon',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/extras/coming-soon')
    },
    {
        path: '/extras/lightbox',
        name: 'extras-lightbox',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/extras/lightbox')
    },
    {
        path: '/error/404',
        name: 'error-404',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/error/404')
    },
    {
        path: '/error/500',
        name: 'error-500',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/error/500')
    },
    {
        path: '/error/404-alt',
        name: 'error-404-alt',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/error/404-alt')
    },
    {
        path: '/ui/avatars',
        name: 'ui-avatars',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/ui/avatars')
    },
    {
        path: '/ui/buttons',
        name: 'ui-buttons',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/ui/buttons')
    },
    {
        path: '/ui/cards',
        name: 'ui-cards',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/ui/cards')
    },
    {
        path: '/ui/carousel',
        name: 'ui-carousel',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/ui/carousel')
    },
    {
        path: '/ui/dropdowns',
        name: 'ui-dropdowns',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/ui/dropdowns')
    },
    {
        path: '/ui/general',
        name: 'ui-general',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/ui/general')
    },
    {
        path: '/ui/grid',
        name: 'ui-grid',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/ui/grid')
    },
    {
        path: '/ui/images',
        name: 'ui-images',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/ui/images')
    },
    {
        path: '/ui/list-group',
        name: 'ui-list-group',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/ui/list-group')
    },
    {
        path: '/ui/modals',
        name: 'ui-modals',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/ui/modals')
    },
    {
        path: '/ui/notifications',
        name: 'ui-notifications',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/ui/notifications')
    },
    {
        path: '/ui/portlets',
        name: 'ui-portlets',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/ui/portlets')
    },
    {
        path: '/ui/progress',
        name: 'ui-progress',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/ui/progress')
    },
    {
        path: '/ui/ribbons',
        name: 'ui-ribbons',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/ui/ribbons')
    },
    {
        path: '/ui/spinners',
        name: 'ui-spinners',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/ui/spinners')
    },
    {
        path: '/ui/tabs-accordions',
        name: 'ui-tabs-accordions',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/ui/tabs-accordions')
    },
    {
        path: '/ui/tooltips-popovers',
        name: 'ui-tooltips-popovers',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/ui/tooltips-popovers')
    },
    {
        path: '/ui/typography',
        name: 'ui-typography',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/ui/typography')
    },
    {
        path: '/ui/video',
        name: 'ui-video',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/ui/video')
    },
    {
        path: '/extended/rangeslider',
        name: 'rangeslider',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/extended/rangeslider')
    },
    {
        path: '/extended/sweet-alert',
        name: 'sweet-alert',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/extended/sweet-alert')
    },
    {
        path: '/extended/tour',
        name: 'tour',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/extended/tour')
    },
    {
        path: '/extended/scrollspy',
        name: 'scrollspy',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/extended/scrollspy')
    },
    {
        path: '/widgets',
        name: 'widgets',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/widgets')
    },
    {
        path: '/icons/feather',
        name: 'feather',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/icons/feather')
    },
    {
        path: '/icons/remix',
        name: 'remix',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/icons/remix')
    }, {
        path: '/icons/boxicons',
        name: 'boxicons',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/icons/boxicons')
    },
    {
        path: '/icons/mdi',
        name: 'mdi',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/icons/mdi')
    },
    {
        path: '/icons/font-awesome',
        name: 'font-awesome',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/icons/font-awesome')
    },
    {
        path: '/icons/weather',
        name: 'weather',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/icons/weather')
    },
    {
        path: '/forms/elements',
        name: 'elements',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/forms/elements')
    },
    {
        path: '/forms/advanced',
        name: 'advanced-form',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/forms/advanced')
    },
    {
        path: '/forms/validation',
        name: 'validation',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/forms/validation')
    },
    {
        path: '/forms/wizard',
        name: 'wizard',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/forms/wizard')
    },
    {
        path: '/forms/mask',
        name: 'mask',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/forms/mask')
    },
    {
        path: '/forms/quill',
        name: 'quill',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/forms/quill')
    },
    {
        path: '/forms/file-uploads',
        name: 'file-uploads',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/forms/file-uploads')
    },
    {
        path: '/tables/basic',
        name: 'basic',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/tables/basic')
    },
    {
        path: '/tables/advanced',
        name: 'advanced',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/tables/advanced')
    },
    {
        path: '/charts/apex',
        name: 'charts-apex',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/charts/apex')
    },
    {
        path: '/charts/chartjs',
        name: 'charts-chartjs',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/charts/chartjs')
    },
    {
        path: '/charts/c3',
        name: 'charts-c3',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/charts/c3')
    },
    {
        path: '/charts/chartist',
        name: 'charts-chartist',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/charts/chartist')
    },
    {
        path: '/charts/knob',
        name: 'charts-knob',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/charts/knob')
    },
    {
        path: '/maps/google',
        name: 'maps-google',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/maps/google')
    }
]