<template>
  <div class="card mini-stats-wid" :class="themeClass">
    <div class="card-body">
      <div class="d-flex flex-wrap">
        <div class="me-3">
          <p class="mb-2" :class="themeClass">{{ title }}</p>
          <h5 class="mb-0" :class="themeClass">{{ data }}</h5>
        </div>

        <div class="avatar-sm ms-auto">
          <div
            class="avatar-title rounded-circle font-size-20" :class="{ 'bg-gray text-secondary' : leftSidebarType == 'dark',  'bg-dark text-primary': leftSidebarType == 'light' }"
          >
            <i :class="icon"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { layoutComputed } from "@/state/helpers";

  export default {
    props: {
      icon: String,
      data: [String, Number],
      title: String
    },

    computed: {
      ...layoutComputed
    },
  }
</script>

<style scoped>

</style>