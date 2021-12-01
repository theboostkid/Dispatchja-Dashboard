<script>
import Auth from "../../layouts/auth-2";
import appConfig from "../../../../app.config";

/**
 * Lock-screen-2 component
 */
export default {
  page: {
    title: "Lock-screen-2",
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

    <div class="text-center w-75 m-auto">
      <img
        src="@/assets/images/users/avatar-1.jpg"
        alt="user-image"
        class="rounded-circle avatar-lg img-thumbnail"
      />
      <h4 class="text-dark-50 text-center mt-3">Hi ! Nik Patel</h4>
      <p class="text-muted mb-4">Enter your password to access the admin.</p>
    </div>

    <form action="#">
      <div class="form-group mb-3">
        <label for="password">Password</label>
        <input
          class="form-control"
          type="password"
          required
          id="password"
          placeholder="Enter your password"
        />
      </div>

      <div class="form-group mb-0 text-center">
        <button class="btn btn-primary btn-block" type="submit">Log In</button>
      </div>
    </form>

    <!-- Footer-->
    <footer class="footer footer-alt">
      <p class="text-muted">
        Not you? return
        <router-link to="/auth/login-2" class="text-primary ml-1">
          <b>Sign In</b>
        </router-link>
      </p>
    </footer>
  </Auth>
</template>
