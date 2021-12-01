<script>
import { layoutComputed } from "@/state/helpers";

import Topbar from "@/components/Topbar";
import HorizontalNavbar from "@/components/Horizontal-navbar";
import Rightbar from "@/components/Rightbar";
import Footer from "@/components/Footer";

/**
 * Horizontal layout
 */
export default {
  data() {
    return {};
  },
  components: {
    Topbar,
    HorizontalNavbar,
    Rightbar,
    Footer,
  },
  computed: {
    ...layoutComputed,
  },
  mounted() {
    document.body.setAttribute("data-layout-mode", "horizontal");
  },
  methods: {
    toggleRightSidebar() {
      document.body.classList.toggle("right-bar-enabled");
    },
    hideRightSidebar() {
      document.body.classList.remove("right-bar-enabled");
    },
  },
};
</script>

<template>
  <!-- Begin page -->
  <div id="wrapper">
    <Topbar />
    <HorizontalNavbar
      :type="topbar"
      :width="layoutWidth"
      :menu="menuPosition"
    />
    <!-- ============================================================== -->
    <!-- Start Page Content here -->
    <!-- ============================================================== -->
    <div class="content-page">
      <div class="content">
        <div class="container-fluid">
          <slot />
        </div>
      </div>
      <!-- content -->
      <Footer />
    </div>
    <!-- ============================================================== -->
    <!-- End Page content -->
    <!-- ============================================================== -->
    <Rightbar />
  </div>
</template>
