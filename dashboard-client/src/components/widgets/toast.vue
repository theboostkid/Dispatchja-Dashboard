<template>
  <div 
      ref="el" 
      class="toast"
      role="alert" 
      aria-live="assertive" 
      aria-atomic="true" 
      style="position: fixed; top: 10px; right: 0; z-index: 999999;"
    >
        <div class="toast-header">
          <strong class="me-auto">{{ notification.title }}</strong>
          <small class="text-muted">just now</small>
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body fw-lighter text-white">
          {{ notification.message }}
        </div>
    </div>
</template>

<script>
  import { Toast } from 'bootstrap'

  export default {
    data(){
      return {
        toast: null
      }
    },


    computed:{
      notification() {
        return this.$store ? this.$store.state.notification : null;
      },
    },

    watch: {
      'notification.isActive'(newVal){
        if (newVal) {
          var toast = new Toast(this.$refs.el);
          var val = toast.show();
          console.log(val);
        }
      }
    }
  }
</script>

<style scoped>

</style>