<script>
import { mapActions } from 'vuex';
  export default {
    data() {
      return {
        isVerified: false,
        loading: false
      }
    },

    mounted() {
      this.verifyToken();
    },

    methods: {
      ...mapActions('auth', ['verifyPasswordChange']),

      async verifyToken() {
        this.loading = true;

        try {
          const { token } = this.$route.query;
          const { status } = await this.verifyPasswordChange({ token });
          if (status == 204) {
            this.$bvModal.msgBoxOk(
              'Your account password was changed. Check your email for your new password', {
              title: 'Success',
              size: 'md',
              buttonSize: 'sm',
              okVariant: 'success',
              headerClass: 'p-2 border-bottom-0',
              footerClass: 'p-2 border-top-0',
              centered: true
            }).then(() => {
              this.$router.replace({ name: 'login'})
            })
          } else {
            this.$bvModal.msgBoxOk(
              'Your request for a password reset was unsuccessfull', {
              title: 'Password Reset',
              size: 'md',
              buttonSize: 'sm',
              okVariant: 'danger',
              headerClass: 'p-2 border-bottom-0',
              footerClass: 'p-2 border-top-0',
              centered: true
            }).then(() => {
              this.$router.replace({ name: 'login'})
            })
          }
          this.loading = false
        } catch (error) {
          this.loading = false
        }
      }
    }
  }
</script>

<style scoped>

</style>