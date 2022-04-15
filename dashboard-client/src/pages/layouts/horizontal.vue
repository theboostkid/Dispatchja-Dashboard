<script>
import HorizontalTopbar from "@/components/horizontal-topbar";
import HorizontalNav from "@/components/horizontal-nav";
import RightBar from "@/components/right-bar";
import Footer from "@/components/footer";

import { layoutComputed } from "@/state/helpers";
import Toast from '../../components/widgets/toast.vue';

/**
 * Horizontal-layout
 */
export default {
  props: {},
  components: {
    HorizontalTopbar,
    HorizontalNav,
    Footer,
    RightBar,
    Toast,
  },
  data() {
    return {};
  },
  computed: {
    ...layoutComputed,

  },
  created: () => {
    document.body.setAttribute("data-layout", "horizontal");
    document.body.setAttribute("data-topbar", "dark");
    document.body.removeAttribute("data-sidebar");
    document.body.removeAttribute("data-layout-size");
    document.body.classList.remove("auth-body-bg");
  },
  methods: {
    toggleRightSidebar() {
      document.body.classList.toggle("right-bar-enabled");
    },
    hideRightSidebar() {
      document.body.classList.remove("right-bar-enabled");
    },
  },
  mounted() {
    if (this.loader === true) {
      document.getElementById("preloader").style.display = "block";
      document.getElementById("status").style.display = "block";

      setTimeout(function() {
        document.getElementById("preloader").style.display = "none";
        document.getElementById("status").style.display = "none";
      }, 2500);
    } else {
      document.getElementById("preloader").style.display = "none";
      document.getElementById("status").style.display = "none";
    }
  },
};
</script>

<template>
  <div class="min-vh-100" :class="{ 'bg-dark': leftSidebarType == 'dark', 'bg-light': leftSidebarType == 'light' }">
    
    <div id="preloader">
      <div id="status">
        <div class="spinner-chase">
          <div class="chase-dot"></div>
          <div class="chase-dot"></div>
          <div class="chase-dot"></div>
          <div class="chase-dot"></div>
          <div class="chase-dot"></div>
          <div class="chase-dot"></div>
        </div>
      </div>
    </div>
    <!-- Begin page -->
    <div id="layout-wrapper">
      <Toast/>
      <HorizontalTopbar :type="topbar" :width="layoutWidth" />
      <HorizontalNav />
      <!-- ============================================================== -->
      <!-- Start right Content here -->
      <!-- ============================================================== -->
      <div class="clearfix" :class="{ 'bg-dark': leftSidebarType == 'dark', 'bg-light': leftSidebarType == 'light' }">
        <div class="page-content">
          <div class="container-fluid" >
            <slot />
          </div>
          <!-- container-fluid -->
        </div>
        <!-- End Page-content -->

        <div>
          <Footer />
        </div>
      </div>
      <!-- end main content-->
    </div>
    <!-- END layout-wrapper -->
    <RightBar />
  </div>
</template>

<style scoped>
  .clearfix:before,
  .clearfix:after {
      content: ".";    
      display: block;    
      height: 0;    
      overflow: hidden; 
  }
  .clearfix:after { clear: both; }
  .clearfix { zoom: 1; height: auto;}
</style>
