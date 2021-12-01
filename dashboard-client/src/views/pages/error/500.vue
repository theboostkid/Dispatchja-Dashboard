<script>
import Auth from "../../layouts/auth";
import appConfig from "../../../../app.config";

/**
 * Error-500 component
 */
export default {
  page: {
    title: "Error-500",
    meta: [{ name: "description", content: appConfig.description }],
  },
  data() {
    return {};
  },
  components: {
    Auth,
  },
};
</script>

<template>
  <Auth>
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6 col-xl-5">
        <div class="card">
          <div class="card-body p-4">
            <div class="text-center w-75 m-auto">
              <div class="auth-logo">
                <router-link to="/" class="logo logo-dark text-center">
                  <span class="logo-lg">
                    <img
                      src="@/assets/images/logo-dark.png"
                      alt=""
                      height="22"
                    />
                  </span>
                </router-link>

                <router-link to="/" class="logo logo-light text-center">
                  <span class="logo-lg">
                    <img
                      src="@/assets/images/logo-light.png"
                      alt=""
                      height="22"
                    />
                  </span>
                </router-link>
              </div>
            </div>

            <div class="text-center mt-4">
              <h1 class="text-error">500</h1>
              <h3 class="mt-3 mb-2">Internal Server Error</h3>
              <p class="text-muted mb-3">
                Why not try refreshing your page? or you can contact
                <a href="" class="text-dark"><b>Support</b></a>
              </p>

              <router-link
                to="/"
                class="btn btn-success waves-effect waves-light"
                >Back to Home</router-link
              >
            </div>
          </div>
          <!-- end card-body -->
        </div>
        <!-- end card -->
      </div>
      <!-- end col -->
    </div>
    <!-- end row -->
  </Auth>
</template>
