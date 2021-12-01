<script>
import { layoutComputed } from "@/state/helpers";

import TwoColumnSidebar from "@/components/Two-column-sidebar";
import Topbar from "@/components/Topbar";
import Rightbar from "@/components/Rightbar";
import Footer from "@/components/Footer";

/**
 * Two-column layout
 */
export default {
  components: {
    TwoColumnSidebar,
    Topbar,
    Rightbar,
    Footer,
  },
  data() {
    return {
      isMenuCondensed: false,
    };
  },
  computed: {
      ...layoutComputed
  },
  methods: {
    toggleRightSidebar() {
      document.body.classList.toggle("right-bar-enabled");
    },
    hideRightSidebar() {
      document.body.classList.remove("right-bar-enabled");
    },
    toggleMenu() {
      this.isMenuCondensed = !this.isMenuCondensed;
      if (this.isMenuCondensed)
        document.body.setAttribute("data-sidebar-size", "condensed");
      else document.body.removeAttribute("data-sidebar-size", "condensed");

      if (window.screen.width >= 992) {
        this.$router.afterEach((routeTo, routeFrom) => {
          document.body.classList.remove("sidebar-enable");
        });
      } else {
        document.body.setAttribute("data-sidebar-size", "default");
        document.body.classList.toggle("sidebar-enable");
        this.$router.afterEach((routeTo, routeFrom) => {
          document.body.classList.remove("sidebar-enable");
        });
      }
    },
  },
  mounted() {
    document.body.setAttribute("data-layout-mode", "two-column");
    document.body.setAttribute("data-topbar-color", "light");
    document.body.removeAttribute("data-sidebar-showuser");
  },
};
</script>

<template>
  <!-- Begin page -->
  <div id="wrapper">
    <Topbar />
    <TwoColumnSidebar
      :type="leftSidebarType"
      :width="layoutWidth"
      :size="leftSidebarSize"
      :menu="menuPosition"
      :topbar="topbar"
    />
    <!-- ============================================================== -->
    <!-- Start Page Content here -->
    <!-- ============================================================== -->

    <div class="content-page">
      <div class="content">
        <!-- Start Content-->
        <div class="container-fluid">
          <slot />
        </div>
      </div>
      <Footer />
    </div>
    <Rightbar />
  </div>
</template>
