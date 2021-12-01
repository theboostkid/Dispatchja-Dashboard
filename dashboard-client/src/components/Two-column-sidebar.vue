<script>
export default {
    data() {
        return {
            activetab: 1,
        };
    },
    props: {
        type: {
            type: String,
            required: true,
        },
        width: {
            type: String,
            required: true,
        },
        size: {
            type: String,
            required: true,
        },
        menu: {
            type: String,
            required: true,
        },
        topbar: {
            type: String,
            required: true,
        }
    },
      watch: {
        type: {
            immediate: true,
            handler(newVal, oldVal) {
                if (newVal !== oldVal) {
                    switch (newVal) {
                        case "dark":
                            document.body.setAttribute("data-sidebar-color", "dark");
                            break;
                        case "light":
                            document.body.setAttribute("data-sidebar-color", "light");
                            break;
                        case "brand":
                            document.body.setAttribute("data-sidebar-color", "brand");
                            break;
                        case "gradient":
                            document.body.setAttribute("data-sidebar-color", "gradient");
                            break;
                        default:
                            document.body.setAttribute("data-sidebar-color", "light");
                            break;
                    }
                }
            },
        },
        width: {
            immediate: true,
            handler(newVal, oldVal) {
                if (newVal !== oldVal) {
                    switch (newVal) {
                        case "boxed":
                            document.body.setAttribute("data-layout-width", "boxed");
                            document.body.setAttribute("data-sidebar-size", "condensed");
                            break;
                        case "fluid":
                            document.body.setAttribute("data-layout-width", "fluid");
                            document.body.removeAttribute("data-sidebar-size");
                            document.body.removeAttribute("data-layout-width");
                            break;
                        default:
                            document.body.setAttribute("data-layout-mode", "fluid");
                            break;
                    }
                }
            },
        },
        size: {
            immediate: true,
            handler(newVal, oldVal) {
                if (newVal !== oldVal) {
                    switch (newVal) {
                        case "default":
                            document.body.setAttribute("data-sidebar-size", "default");
                            break;
                        case "condensed":
                            document.body.setAttribute("data-sidebar-size", "condensed");
                            break;
                        case "compact":
                            document.body.setAttribute("data-sidebar-size", "compact");
                            break;
                        default:
                            document.body.setAttribute("data-sidebar-size", "default");
                            break;
                    }
                }
            },
        },
        menu: {
            immediate: true,
            handler(newVal, oldVal) {
                if (newVal !== oldVal) {
                    switch (newVal) {
                        case "fixed":
                            document.body.setAttribute("data-layout-menu-position", "fixed");
                            break;
                        case "scrollable":
                            document.body.setAttribute(
                                "data-layout-menu-position",
                                "scrollable"
                            );
                            break;
                        default:
                            document.body.setAttribute("data-layout-menu-position", "fixed");
                            break;
                    }
                }
            },
        },
        topbar: {
            immediate: true,
            handler(newVal, oldVal) {
                if (newVal !== oldVal) {
                    switch (newVal) {
                        case "dark":
                            document.body.setAttribute("data-topbar-color", "dark");
                            break;
                        case "light":
                            document.body.setAttribute("data-topbar-color", "light");
                            break;
                        default:
                            document.body.setAttribute("data-topbar-color", "dark");
                            break;
                    }
                }
            },
        },
    },
    mounted: function () {
        this._activateMenuDropdown();
        this.$router.afterEach((routeTo, routeFrom) => {
            this._activateMenuDropdown();
        });
    },
    methods: {
        /**
         * Returns true or false if given menu item has child or not
         * @param item menuItem
         */
        hasItems(item) {
            return item.subItems !== undefined ? item.subItems.length > 0 : false;
        },

        _activateMenuDropdown() {
            const resetParent = (el) => {
                el.classList.remove("active");
                var parent = el.parentElement;
                if (parent) {
                    parent.classList.remove("menuitem-active");
                    const parent2 = parent.parentElement;
                    if (parent2) {
                        const parent3 = parent2.parentElement;
                        if (parent3) {
                            parent3.classList.remove("show");
                            const parent4 = parent3.parentElement;
                            if (parent4) {
                                parent4.classList.remove("menuitem-active");
                            }
                        }
                    }
                }
            };
            var links = document.getElementsByClassName("side-nav-link-ref");
            var matchingMenuItem = null;
            const paths = [];
            for (let i = 0; i < links.length; i++) {
                // reset menu
                resetParent(links[i]);
            }
            for (var i = 0; i < links.length; i++) {
                paths.push(links[i]["pathname"]);
            }
            var itemIndex = paths.indexOf(window.location.pathname);
            if (itemIndex === -1) {
                const strIndex = window.location.pathname.lastIndexOf("/");
                const item = window.location.pathname.substr(0, strIndex).toString();
                matchingMenuItem = links[paths.indexOf(item)];
            } else {
                matchingMenuItem = links[itemIndex];
            }

            if (matchingMenuItem) {
                matchingMenuItem.classList.add("active");
                var parent = matchingMenuItem.parentElement;

                /**
                 * TODO: This is hard coded way of expading/activating parent menu dropdown and working till level 3.
                 * We should come up with non hard coded approach
                 */
                if (parent) {
                    parent.classList.add("menuitem-active");
                    const parent2 = parent.parentElement;
                    if (parent2) {
                        const parent3 = parent2.parentElement;
                        if (parent3) {
                            parent3.classList.add("show");
                            const parent4 = parent3.parentElement;
                            if (parent4) {
                                parent4.classList.add("menuitem-active");
                            }
                        }
                    }
                }
            }
        },
    },
};
</script>

<template>
<!-- ========== Left Sidebar Start ========== -->
<div class="left-side-menu">
    <div class="h-100">
        <div class="sidebar-content">
            <simplebar class="sidebar-icon-menu h-100" data-simplebar>
                <!-- LOGO -->
                <a href="/" class="logo">
                    <span>
                        <img src="@/assets/images/logo-sm.png" alt height="28" />
                    </span>
                </a>
                <nav class="nav flex-column" id="two-col-sidenav-main">
                    <a class="nav-link" href="javascript: void(0);" v-on:click="activetab=1" v-bind:class="[ activetab === 1 ? 'active' : '' ]" data-toggle="tooltip" data-placement="right" title="Dashboard" data-trigger="hover">
                        <i class="ri-dashboard-line"></i>
                    </a>
                    <a class="nav-link" href="javascript: void(0);" v-on:click="activetab=2" v-bind:class="[ activetab === 2 ? 'active' : '' ]" data-toggle="tooltip" data-placement="right" title="Apps" data-trigger="hover">
                        <i class="ri-apps-2-line"></i>
                    </a>
                    <a class="nav-link" v-on:click="activetab=3" v-bind:class="[ activetab === 3 ? 'active' : '' ]" href="javascript: void(0);" data-toggle="tooltip" data-placement="right" title="Pages" data-trigger="hover">
                        <i class="ri-pages-line"></i>
                    </a>
                    <a class="nav-link" v-on:click="activetab=4" v-bind:class="[ activetab === 4 ? 'active' : '' ]" href="javascript: void(0);" data-toggle="tooltip" data-placement="right" title="UI Elements" data-trigger="hover">
                        <i class="ri-pencil-ruler-2-line"></i>
                    </a>
                    <a class="nav-link" v-on:click="activetab=5" v-bind:class="[ activetab === 5 ? 'active' : '' ]" href="javascript: void(0);" data-toggle="tooltip" data-placement="right" title="Components" data-trigger="hover">
                        <i class="ri-stack-line"></i>
                    </a>
                    <router-link class="nav-link" to="/widgets"> <i class="ri-honour-line align-middle"></i></router-link>
                </nav>
            </simplebar>
            <!--- Sidemenu -->
            <div class="sidebar-main-menu">
                <simplebar id="two-col-menu" class="h-100" data-simplebar>
                    <div class="twocolumn-menu-item d-block" id="dashboard" v-if="activetab === 1">
                        <div class="title-box">
                            <h5 class="menu-title">Dashboards</h5>
                            <ul class="nav flex-column">
                                <li class="nav-item">
                                    <router-link class="nav-link side-nav-link-ref" to="/">Sales</router-link>
                                </li>
                                <li class="nav-item">
                                    <router-link class="nav-link side-nav-link-ref" to="/dashboard/crm">CRM</router-link>
                                </li>
                                <li class="nav-item">
                                    <router-link class="nav-link side-nav-link-ref" to="/dashboard/analytics">Analytics</router-link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="twocolumn-menu-item d-block" id="apps" v-if="activetab === 2">
                        <h5 class="menu-title">Apps</h5>
                        <ul class="nav flex-column">
                            <li class="nav-item">
                                <router-link class="nav-link side-nav-link-ref" to="/apps/calendar">Calendar</router-link>
                            </li>
                            <li class="nav-item">
                                <router-link class="nav-link side-nav-link-ref" to="/apps/chat">Chat</router-link>
                            </li>
                            <li class="nav-item">
                                <a href="javascript: void(0);" v-b-toggle.sidebarEcommerce data-toggle="collapse" class="nav-link">
                                    <span>Ecommerce</span>
                                    <span class="menu-arrow"></span>
                                </a>
                                <b-collapse id="sidebarEcommerce">
                                    <ul class="nav-second-level">
                                        <li>
                                            <router-link to="/ecommerce/products" class="side-nav-link-ref">Products List</router-link>
                                        </li>
                                        <li>
                                            <router-link to="/ecommerce/products-grid" class="side-nav-link-ref">Products Grid</router-link>
                                        </li>
                                        <li>
                                            <router-link to="/ecommerce/product-detail/1" class="side-nav-link-ref">Product Detail</router-link>
                                        </li>
                                        <li>
                                            <router-link to="/ecommerce/product-create" class="side-nav-link-ref">Create Product</router-link>
                                        </li>
                                        <li>
                                            <router-link to="/ecommerce/customers" class="side-nav-link-ref">Customers</router-link>
                                        </li>
                                        <li>
                                            <router-link to="/ecommerce/orders" class="side-nav-link-ref">Orders</router-link>
                                        </li>
                                        <li>
                                            <router-link to="/ecommerce/order-detail" class="side-nav-link-ref">Order Detail</router-link>
                                        </li>
                                        <li>
                                            <router-link to="/ecommerce/sellers" class="side-nav-link-ref">Sellers</router-link>
                                        </li>
                                        <li>
                                            <router-link to="/ecommerce/cart" class="side-nav-link-ref">Shopping Cart</router-link>
                                        </li>
                                        <li>
                                            <router-link to="/ecommerce/checkout" class="side-nav-link-ref">Checkout</router-link>
                                        </li>
                                    </ul>
                                </b-collapse>
                            </li>

                            <li class="nav-item">
                                <a href="#sidebarEmail" v-b-toggle.sidebarEmail data-toggle="collapse" class="nav-link">
                                    <span>Email</span>
                                    <span class="menu-arrow"></span>
                                </a>
                                <b-collapse id="sidebarEmail">
                                    <ul class="nav-second-level">
                                        <li>
                                            <router-link to="/email/inbox" class="side-nav-link-ref">Inbox</router-link>
                                        </li>
                                        <li>
                                            <router-link to="/email/reademail/1" class="side-nav-link-ref">Read Email</router-link>
                                        </li>
                                        <li>
                                            <router-link to="/email/templates" class="side-nav-link-ref">Email Templates</router-link>
                                        </li>
                                    </ul>
                                </b-collapse>
                            </li>
                            <li class="nav-item">
                                <router-link class="nav-link side-nav-link-ref" to="/apps/companies">Companies</router-link>
                            </li>
                            <li class="nav-item">
                                <a href="#sidebarTasks" v-b-toggle.sidebarTasks data-toggle="collapse" class="nav-link">
                                    <span>Tasks</span>
                                    <span class="menu-arrow"></span>
                                </a>
                                <b-collapse id="sidebarTasks">
                                    <ul class="nav-second-level">
                                        <li>
                                            <router-link to="/task/list" class="side-nav-link-ref">List</router-link>
                                        </li>
                                        <li>
                                            <router-link to="/task/detail" class="side-nav-link-ref">Details</router-link>
                                        </li>
                                        <li>
                                            <router-link to="/task/kanban" class="side-nav-link-ref">Kanban Board</router-link>
                                        </li>
                                    </ul>
                                </b-collapse>
                            </li>
                            <li class="nav-item">
                                <a href="javascript: void(0);" v-b-toggle.sidebarContacts data-toggle="collapse" class="nav-link">
                                    <span>Contacts</span>
                                    <span class="menu-arrow"></span>
                                </a>
                                <b-collapse id="sidebarContacts">
                                    <ul class="nav-second-level">
                                        <li>
                                            <router-link to="/contacts/list" class="side-nav-link-ref">Members List</router-link>
                                        </li>
                                        <li>
                                            <router-link to="/contacts/profile" class="side-nav-link-ref">Profile</router-link>
                                        </li>
                                    </ul>
                                </b-collapse>
                            </li>

                            <li class="nav-item">
                                <router-link class="nav-link side-nav-link-ref" to="/apps/file-manager">File Manager</router-link>
                            </li>

                            <li class="nav-item">
                                <router-link class="nav-link side-nav-link-ref" to="/apps/tickets">Tickets</router-link>
                            </li>
                        </ul>
                    </div>

                    <div class="twocolumn-menu-item d-block" id="pages" v-if="activetab === 3">
                        <div class="title-box">
                            <h5 class="menu-title">Pages</h5>
                            <ul class="nav flex-column">
                                <li class="nav-item">
                                    <router-link class="nav-link side-nav-link-ref" to="/extras/starter">Starter</router-link>
                                </li>
                                <li class="nav-item">
                                    <router-link class="nav-link side-nav-link-ref" to="/extras/timeline">Timeline</router-link>
                                </li>
                                <li class="nav-item">
                                    <router-link class="nav-link side-nav-link-ref" to="/extras/sitemap">Sitemap</router-link>
                                </li>
                                <li class="nav-item">
                                    <router-link class="nav-link side-nav-link-ref" to="/extras/invoice">Invoice</router-link>
                                </li>
                                <li class="nav-item">
                                    <router-link class="nav-link side-nav-link-ref" to="/extras/faqs">FAQs</router-link>
                                </li>
                                <li class="nav-item">
                                    <router-link class="nav-link side-nav-link-ref" to="/extras/search-results">Search Results</router-link>
                                </li>
                                <li class="nav-item">
                                    <router-link class="nav-link side-nav-link-ref" to="/extras/pricing">Pricing</router-link>
                                </li>
                                <li class="nav-item">
                                    <router-link class="nav-link side-nav-link-ref" to="/extras/maintenance">Maintenance</router-link>
                                </li>
                                <li class="nav-item">
                                    <router-link class="nav-link side-nav-link-ref" to="/extras/coming-soon">Coming Soon</router-link>
                                </li>
                                <li class="nav-item">
                                    <router-link class="nav-link side-nav-link-ref" to="/extras/lightbox">Lightbox</router-link>
                                </li>
                                <li class="nav-item">
                                    <a href="javascript: void(0);" v-b-toggle.sidebarAuth data-toggle="collapse" class="nav-link">
                                        <span>Auth Pages</span>
                                        <span class="menu-arrow"></span>
                                    </a>
                                    <b-collapse class="collapse" id="sidebarAuth">
                                        <ul class="nav-second-level">
                                            <li>
                                                <router-link to="/auth/login-1">Log In</router-link>
                                            </li>
                                            <li>
                                                <router-link to="/auth/login-2">Log In 2</router-link>
                                            </li>
                                            <li>
                                                <router-link to="/auth/register-1">Register</router-link>
                                            </li>
                                            <li>
                                                <router-link to="/auth/register-2">Register 2</router-link>
                                            </li>
                                            <li>
                                                <router-link to="/auth/signin-signup">Signin - Signup</router-link>
                                            </li>
                                            <li>
                                                <router-link to="/auth/signin-signup-2">Signin - Signup 2</router-link>
                                            </li>
                                            <li>
                                                <router-link to="/auth/recoverpwd">Recover Password</router-link>
                                            </li>
                                            <li>
                                                <router-link to="/auth/recoverpwd-2">Recover Password 2</router-link>
                                            </li>
                                            <li>
                                                <router-link to="/auth/lock-screen">Lock Screen</router-link>
                                            </li>
                                            <li>
                                                <router-link to="/auth/lock-screen-2">Lock Screen 2</router-link>
                                            </li>
                                            <li>
                                                <router-link to="/auth/logout-1">Logout</router-link>
                                            </li>
                                            <li>
                                                <router-link to="/auth/logout-2">Logout 2</router-link>
                                            </li>
                                            <li>
                                                <router-link to="/auth/confirm-mail">Confirm Mail</router-link>
                                            </li>
                                            <li>
                                                <router-link to="/auth/confirm-mail-2">Confirm Mail 2</router-link>
                                            </li>
                                        </ul>
                                    </b-collapse>
                                </li>
                                <li class="nav-item">
                                    <a href="javascript: void(0);" v-b-toggle.sidebarErrors data-toggle="collapse" class="nav-link">
                                        Error Pages
                                        <span class="menu-arrow"></span>
                                    </a>
                                    <b-collapse id="sidebarErrors">
                                        <ul class="nav-second-level">
                                            <li>
                                                <router-link to="/error/404">Error 404</router-link>
                                            </li>
                                            <li>
                                                <router-link to="/error/404-alt">Error 404-alt</router-link>
                                            </li>
                                            <li>
                                                <router-link to="/error/500">Error 500</router-link>
                                            </li>
                                        </ul>
                                    </b-collapse>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="twocolumn-menu-item d-block" id="uielements" v-if="activetab === 4">
                        <div class="title-box">
                            <h5 class="menu-title">UI Elements</h5>
                            <ul class="nav flex-column">
                                <li class="nav-item">
                                    <router-link class="nav-link side-nav-link-ref" to="/ui/avatars">Avatars</router-link>
                                </li>
                                <li class="nav-item">
                                    <router-link class="nav-link side-nav-link-ref" to="/ui/buttons">Buttons</router-link>
                                </li>
                                <li class="nav-item">
                                    <router-link class="nav-link side-nav-link-ref" to="/ui/cards">Cards</router-link>
                                </li>
                                <li class="nav-item">
                                    <router-link class="nav-link side-nav-link-ref" to="/ui/carousel">Carousel</router-link>
                                </li>
                                <li class="nav-item">
                                    <router-link class="nav-link side-nav-link-ref" to="/ui/dropdowns">Dropdowns</router-link>
                                </li>
                                <li class="nav-item">
                                    <router-link class="nav-link side-nav-link-ref" to="/ui/video">Embed Video</router-link>
                                </li>
                                <li class="nav-item">
                                    <router-link class="nav-link side-nav-link-ref" to="/ui/general">General UI</router-link>
                                </li>
                                <li class="nav-item">
                                    <router-link class="nav-link side-nav-link-ref" to="/ui/grid">Grid</router-link>
                                </li>
                                <li class="nav-item">
                                    <router-link class="nav-link side-nav-link-ref" to="/ui/images">Images</router-link>
                                </li>
                                <li class="nav-item">
                                    <router-link class="nav-link side-nav-link-ref" to="/ui/list-group">List Group</router-link>
                                </li>
                                <li class="nav-item">
                                    <router-link class="nav-link side-nav-link-ref" to="/ui/modals">Modals</router-link>
                                </li>
                                <li class="nav-item">
                                    <router-link class="nav-link side-nav-link-ref" to="/ui/notifications">Notifications</router-link>
                                </li>
                                <li class="nav-item">
                                    <router-link class="nav-link side-nav-link-ref" to="/ui/portlets">Portlets</router-link>
                                </li>
                                <li class="nav-item">
                                    <router-link class="nav-link side-nav-link-ref" to="/ui/progress">Progress</router-link>
                                </li>
                                <li class="nav-item">
                                    <router-link class="nav-link side-nav-link-ref" to="/ui/ribbons">Ribbons</router-link>
                                </li>
                                <li class="nav-item">
                                    <router-link class="nav-link side-nav-link-ref" to="/ui/spinners">Spinners</router-link>
                                </li>
                                <li class="nav-item">
                                    <router-link class="nav-link side-nav-link-ref" to="/ui/tabs-accordions">Tabs & Accordions</router-link>
                                </li>
                                <li class="nav-item">
                                    <router-link class="nav-link side-nav-link-ref" to="/ui/tooltips-popovers">Tooltips & Popovers</router-link>
                                </li>
                                <li class="nav-item">
                                    <router-link class="nav-link side-nav-link-ref" to="/ui/typography">Typography</router-link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="twocolumn-menu-item d-block" id="components" v-if="activetab === 5">
                        <div class="title-box">
                            <h5 class="menu-title">Components</h5>
                            <ul class="nav flex-column">
                                <li class="nav-item">
                                    <a href="javascript: void(0);" v-b-toggle.sidebarExtendedui data-toggle="collapse" class="nav-link">
                                        <span class="badge badge-info float-right">Hot</span>
                                        <span>Extended UI</span>
                                    </a>
                                    <b-collapse id="sidebarExtendedui">
                                        <ul class="nav-second-level">
                                            <li>
                                                <router-link to="/extended/rangeslider" class="side-nav-link-ref">Range Slider</router-link>
                                            </li>
                                            <li>
                                                <router-link to="/extended/sweet-alert" class="side-nav-link-ref">Sweet Alert</router-link>
                                            </li>
                                            <li>
                                                <router-link to="/extended/tour" class="side-nav-link-ref">Tour Page</router-link>
                                            </li>
                                            <li>
                                                <router-link to="/extended/scrollspy" class="side-nav-link-ref">Scrollspy</router-link>
                                            </li>
                                        </ul>
                                    </b-collapse>
                                </li>
                                <li class="nav-item">
                                    <a href="javascript: void(0);" v-b-toggle.sidebarIcons data-toggle="collapse" class="nav-link">
                                        <span>Icons</span>
                                        <span class="menu-arrow"></span>
                                    </a>
                                    <b-collapse id="sidebarIcons">
                                        <ul class="nav-second-level">
                                            <li>
                                                <router-link to="/icons/feather" class="side-nav-link-ref">Feather</router-link>
                                            </li>
                                            <li>
                                                <router-link to="/icons/remix" class="side-nav-link-ref">Remix</router-link>
                                            </li>
                                            <li>
                                                <router-link to="/icons/boxicons" class="side-nav-link-ref">Boxicons</router-link>
                                            </li>
                                            <li>
                                                <router-link to="/icons/mdi" class="side-nav-link-ref">Material Design</router-link>
                                            </li>
                                            <li>
                                                <router-link to="/icons/font-awesome" class="side-nav-link-ref">Font Awesome 5</router-link>
                                            </li>
                                            <li>
                                                <router-link to="/icons/weather" class="side-nav-link-ref">Weather</router-link>
                                            </li>
                                        </ul>
                                    </b-collapse>
                                </li>
                                <li class="nav-item">
                                    <a href="javascript: void(0);" v-b-toggle.sidebarForms data-toggle="collapse" class="nav-link">
                                        <span>Forms</span>
                                        <span class="menu-arrow"></span>
                                    </a>
                                    <b-collapse id="sidebarForms">
                                        <ul class="nav-second-level">
                                            <li>
                                                <router-link to="/forms/elements" class="side-nav-link-ref">General Elements</router-link>
                                            </li>
                                            <li>
                                                <router-link to="/forms/advanced" class="side-nav-link-ref">Advanced</router-link>
                                            </li>
                                            <li>
                                                <router-link to="/forms/validation" class="side-nav-link-ref">Validation</router-link>
                                            </li>
                                            <li>
                                                <router-link to="/forms/wizard" class="side-nav-link-ref">Wizard</router-link>
                                            </li>
                                            <li>
                                                <router-link to="/forms/mask" class="side-nav-link-ref">Masks</router-link>
                                            </li>
                                            <li>
                                                <router-link to="/forms/quill" class="side-nav-link-ref">Quill Editor</router-link>
                                            </li>
                                            <li>
                                                <router-link to="/forms/file-uploads" class="side-nav-link-ref">File Uploads</router-link>
                                            </li>
                                        </ul>
                                    </b-collapse>
                                </li>
                                <li class="nav-item">
                                    <a href="javascript: void(0);" v-b-toggle.sidebarTables data-toggle="collapse" class="nav-link">
                                        <span>Tables</span>
                                        <span class="menu-arrow"></span>
                                    </a>
                                    <b-collapse id="sidebarTables">
                                        <ul class="nav-second-level">
                                            <li>
                                                <router-link to="/tables/basic" class="side-nav-link-ref">Basic Tables</router-link>
                                            </li>
                                            <li>
                                                <router-link to="/tables/advanced" class="side-nav-link-ref">Advanced Tables</router-link>
                                            </li>
                                        </ul>
                                    </b-collapse>
                                </li>
                                <li class="nav-item">
                                    <a href="javascript: void(0);" v-b-toggle.sidebarCharts data-toggle="collapse" class="nav-link">
                                        <span>Charts</span>
                                        <span class="menu-arrow"></span>
                                    </a>
                                    <b-collapse id="sidebarCharts">
                                        <ul class="nav-second-level">
                                            <li>
                                                <router-link to="/charts/apex" class="side-nav-link-ref">Apex Charts</router-link>
                                            </li>
                                            <li>
                                                <router-link to="/charts/chartjs" class="side-nav-link-ref">Chartjs Charts</router-link>
                                            </li>
                                            <li>
                                                <router-link to="/charts/c3" class="side-nav-link-ref">C3 Charts</router-link>
                                            </li>
                                            <li>
                                                <router-link to="/charts/chartist" class="side-nav-link-ref">Chartist Charts</router-link>
                                            </li>
                                            <li>
                                                <router-link to="/charts/knob" class="side-nav-link-ref">Knob Charts</router-link>
                                            </li>
                                        </ul>
                                    </b-collapse>
                                </li>
                                <li class="nav-item">
                                    <a href="javascript: void(0);" v-b-toggle.sidebarMaps data-toggle="collapse" class="nav-link">
                                        <span>Maps</span>
                                        <span class="menu-arrow"></span>
                                    </a>
                                    <b-collapse id="sidebarMaps">
                                        <ul class="nav-second-level">
                                            <li>
                                                <router-link to="/maps/google" class="side-nav-link-ref">Google Maps</router-link>
                                            </li>
                                        </ul>
                                    </b-collapse>
                                </li>
                                <li class="nav-item">
                                    <a href="javascript: void(0);" v-b-toggle.sidebarMultilevel data-toggle="collapse" class="nav-link">
                                        <span>Multi Level</span>
                                        <span class="menu-arrow"></span>
                                    </a>
                                    <b-collapse class="collapse" id="sidebarMultilevel">
                                        <ul class="nav-second-level">
                                            <li>
                                                <a href="javascript: void(0);" v-b-toggle.sidebarMultilevel2 data-toggle="collapse">
                                                    Second Level
                                                    <span class="menu-arrow"></span>
                                                </a>
                                                <b-collapse id="sidebarMultilevel2">
                                                    <ul class="nav-second-level">
                                                        <li>
                                                            <a href="javascript: void(0);">Item 1</a>
                                                        </li>
                                                        <li>
                                                            <a href="javascript: void(0);">Item 2</a>
                                                        </li>
                                                    </ul>
                                                </b-collapse>
                                            </li>

                                            <li>
                                                <a href="#sidebarMultilevel3" data-toggle="collapse">Second Level 1</a>
                                            </li>
                                        </ul>
                                    </b-collapse>
                                </li>
                            </ul>
                        </div>
                    </div>
                </simplebar>
            </div>
            <div class="clearfix"></div>
        </div>
        <!-- End Sidebar -->
    </div>
    <!-- Sidebar -left -->
</div>
<!-- Left Sidebar End -->
</template>
