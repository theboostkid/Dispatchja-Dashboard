<template>
  <Layout>
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6 col-xl-5">
        <div class="card overflow-hidden">
          <div class="bg-soft bg-primary">
            <div class="row">
              <div class="col-7">
                <div class="text-primary p-4">
                  <h5 class="text-primary">Welcome Back !</h5>
                  <p>Sign in to continue to Dispatch Dashboard.</p>
                </div>
              </div>
            </div>
          </div>
          <div class="card-body pt-0">
            <div>
              <router-link to="/">
                <div class="avatar-md profile-user-wid mb-4">
                  <span class="avatar-title rounded-circle bg-dark bg-soft">
                    
                    <span class="logo-sm">
                      <img
                        src="@/assets/images/logo-light.png"
                        alt
                        height="60"
                      />
                    </span>
                  </span>
                </div>
              </router-link>
            </div>
            <b-alert
              v-model="isAuthError"
              :variant="notification.type"
              class="mt-3"
              dismissible
              >{{ authError }}</b-alert
            >
            <div
              v-if="notification.message"
              :class="'alert ' + notification.type"
            >
              {{ notification.message }}
            </div>

            <b-form class="p-2" @submit.prevent="tryToLogIn">
              <b-form-group
                class="mb-3"
                id="input-group-1"
                label="Email"
                label-for="input-1"
              >
                <b-form-input
                  id="input-1"
                  v-model="email"
                  type="text"
                  placeholder="Enter email"
                  :class="{ 'is-invalid': submitted && $v.email.$error }"
                ></b-form-input>
                <div
                  v-if="submitted && $v.email.$error"
                  class="invalid-feedback"
                >
                  <span v-if="!$v.email.required">Email is required.</span>
                  <span v-if="!$v.email.email">Please enter valid email.</span>
                </div>
              </b-form-group>

              <b-form-group
                class="mb-3"
                id="input-group-2"
                label="Password"
                label-for="input-2"
              >
                <b-form-input
                  id="input-2"
                  v-model="password"
                  type="password"
                  placeholder="Enter password"
                  :class="{ 'is-invalid': submitted && $v.password.$error }"
                ></b-form-input>
                <div
                  v-if="submitted && !$v.password.required"
                  class="invalid-feedback"
                >
                  Password is required.
                </div>
              </b-form-group>
              <b-form-checkbox
                  class="form-check"
                  id="customControlInline"
                  name="checkbox-1"
                  value="accepted"
                  unchecked-value="not_accepted"
                >
                  Remember me
                </b-form-checkbox>
              <div class="mt-3 d-grid">
                <b-button type="submit" variant="primary" class="btn-block"
                  >Log In</b-button
                >
              </div>
              <div class="mt-4 text-center">
                <router-link to="/forgot-password" class="text-muted">
                  <i class="mdi mdi-lock me-1"></i> Forgot your password?
                </router-link>
              </div>
            </b-form>
          </div>
          <!-- end card-body -->
        </div>
        <!-- end card -->

        <div class="mt-5 text-center">
          <p>
            © {{ new Date().getFullYear() }} Created by Black Sigma Technologies
          </p>
        </div>
        <!-- end row -->
      </div>
      <!-- end col -->
    </div>
    <!-- end row -->
  </Layout>
</template>

<script>
import Layout from "../../layouts/auth";
import {
  authMethods,
  notificationMethods,
} from "@/state/helpers";

import appConfig from "@/app.config";
import { required, email } from "vuelidate/lib/validators";

/**
 * Login component
 */
export default {
  page: {
    title: "Login",
    meta: [
      {
        name: "description",
        content: appConfig.description,
      },
    ],
  },
  components: {
    Layout,
  },
  data() {
    return {
      email: "",
      password: "",
      submitted: false,
      authError: null,
      tryingToLogIn: false,
      isAuthError: false,
      notification: {
        message: "",
        type: ""
      }
    };
  },
  validations: {
    email: {
      required,
      email,
    },
    password: {
      required,
    },
  },
  methods: {
    ...authMethods,
    ...notificationMethods,
    // Try to log the user in with the username
    // and password they provided.
    async tryToLogIn() {
      this.submitted = true;

      this.$v.$touch();

      if(this.$v.$invalid) return; 
      const { email, password } = this;
      const { status, message} = await this.logIn({email, password});

      this.authError = message
      this.notification.type = status != 200 ? "danger" : "success"
      this.isAuthError = true

      if (status == 200) {
        this.$router.push({ name: 'Dashboard'})
      }
    },
  },
};
</script>

