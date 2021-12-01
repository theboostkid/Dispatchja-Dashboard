<script>
import Auth from "../../layouts/auth";
import appConfig from "../../../../app.config";

/**
 * Error-404 component
 */
export default {
  page: {
    title: "Error-404",
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
            <div class="error-ghost text-center">
              <img
                src="@/assets/images/error.svg"
                width="200"
                alt="error-image"
              />
            </div>

            <div class="text-center">
              <h3 class="mt-4 text-uppercase font-weight-bold">
                Page not found
              </h3>
              <p class="text-muted mb-0 mt-3" style="line-height: 20px">
                It's looking like you may have taken a wrong turn. Don't
                worry... it happens to the best of us. You might want to check
                your internet connection. Here's a little tip that might help
                you get back on track.
              </p>

              <router-link to="/" class="btn btn-primary mt-3"
                ><i class="mdi mdi-reply mr-1"></i> Return Home</router-link
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
