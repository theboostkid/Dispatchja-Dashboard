<script>
import Auth from "../../layouts/auth-2";
import appConfig from "../../../../app.config";

/**
 * Recoverpwd-2 component
 */
export default {
  page: {
    title: "Recoverpwd-2",
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
    <!-- Logo -->
    <div class="auth-brand text-center text-lg-left">
      <div class="auth-logo">
        <router-link to="/" class="logo logo-dark text-center">
          <span class="logo-lg">
            <img src="@/assets/images/logo-dark.png" alt height="22" />
          </span>
        </router-link>

        <router-link to="/" class="logo logo-light text-center">
          <span class="logo-lg">
            <img src="@/assets/images/logo-light.png" alt height="22" />
          </span>
        </router-link>
      </div>
    </div>

    <!-- title-->
    <h4 class="mt-0">Recover Password</h4>
    <p class="text-muted mb-4">
      Enter your email address and we'll send you an email with instructions to
      reset your password.
    </p>

    <!-- form -->
    <form action="#">
      <div class="form-group mb-3">
        <label for="emailaddress">Email address</label>
        <input
          class="form-control"
          type="email"
          id="emailaddress"
          required
          placeholder="Enter your email"
        />
      </div>

      <div class="form-group mb-0 text-center">
        <button
          class="btn btn-primary waves-effect waves-light btn-block"
          type="submit"
        >
          Reset Password
        </button>
      </div>
    </form>
    <!-- end form-->

    <!-- Footer-->
    <footer class="footer footer-alt">
      <p class="text-muted">
        Back to
        <router-link to="/auth/login-2" class="text-primary ml-1">
          <b>Log in</b>
        </router-link>
      </p>
    </footer>
  </Auth>
</template>
