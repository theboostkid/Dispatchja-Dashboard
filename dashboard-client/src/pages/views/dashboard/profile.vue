<template>
  <b-modal
  title="User Profile"
  title-class="text-black font-18"
  ok-title="Save"
  v-model="isModalOpen"
  @ok.prevent="saveUser"
  @cancel="closeDialog"
  >
    <b-form>
      <b-form-group
      label="Name"
      id="input-group-1"
      class="mb-3"
      label-for="input-1"
      >
        <b-form-input
        id="input-1"
        v-model="user.name"
        type="text"
        />
      </b-form-group>

      <b-form-group
      label="Email"
      id="input-group-2"
      class="mb-3"
      label-for="input-2"
      >
        <b-form-input
        id="input-2"
        v-model="user.email"
        type="email"
        />
      </b-form-group>

      <b-form-group
      label="Role"
      id="input-group-4"
      class="mb-3 form-label"
      label-for="input-4"
      >
        <b-form-input
        id="input-4"
        v-model="user.role"
        type="text"
        disabled
        />
      </b-form-group>

      <b-form-group
      label="Merchant Name"
      id="input-group-5"
      class="mb-3 form-label"
      label-for="input-5"
      >
        <b-form-input
        id="input-5"
        v-model="user.merchantName"
        type="text"
        disabled
        />
      </b-form-group>

      <template v-if="allowPasswordChange">
        <b-form-group
          label="New Password"
          id="input-group-6"
          class="mb-3 form-label"
        >
          <b-form-input
          id="input-6"
          aria-describedby="password-help-block"
          v-model="password"
          type="password"
          autocomplete="off"
          />
        </b-form-group>
        <b-form-group
          label="Confirm Password"
          aria-describedby="password-help-block"
          id="input-group-7"
          class="mb-3 form-label"
          label-for="input-7"
        >
          <b-form-input
          v-model="confirmPassword"
          type="password"
          autocomplete="off"
          />
        </b-form-group>
      </template>
      
      <template v-else>
        <b-form-group
          label="Password"
        >
          <b-button variant="outline-primary" @click="allowPasswordChange = true">Change Password</b-button>
        </b-form-group>
      </template>
    </b-form>
  </b-modal>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import { authComputed } from '../../../state/helpers';

  export default {
    data(){
      return {
        user: {

        },
        password: '',
        confirmPassword: '',
        isModalOpen: false,
        allowPasswordChange: false
      }
    },

    computed: {
      ...authComputed,
      ...mapGetters('merchantModule', ['findMerchantById'])
    },

    methods: {
      ...mapActions('userModule', ['updateUser', 'changePassword']),

      openModal(){
        const merchant = this.findMerchantById(this.currentUser.merchantName);
        this.user = { ...this.currentUser };
        this.user.merchantName = merchant?.name || this.currentUser.merchantName;
        this.isModalOpen = true;
      },

      async saveUser(){
        let success = false;
        const result = await this.updateUser(this.user);
        if (result.status == 204) success = true;
        if(this.password && this.confirmPassword) {
          const result = await this.changePassword({ userId: this.currentUser.id, newPassword: this.password });
          if (result.status == 204) success = true;
        }

        if(success){
          this.closeDialog();
        }
      },

      closeDialog(){
        this.isModalOpen = false;
        this.confirmPassword = '';
        this.password = '';
        this.user = {}
        this.allowPasswordChange = false;
      }
    }
  }
</script>

<style scoped>

</style>