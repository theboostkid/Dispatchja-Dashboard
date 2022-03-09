<template>
  <div class="card mini-stats-wid">
    <div class="card-body">
      <div class="d-flex flex-wrap">
        <div class="me-3">
          <p class="text-muted mb-2">{{ title }}</p>
          <h5 class="mb-0">{{ data }}</h5>
        </div>

        <div class="avatar-sm ms-auto">
          <div
            class="avatar-title bg-light rounded-circle text-primary font-size-20"
          >
            <i :class="icon"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      icon: String,
      data: String,
      title: String
    }
  }
</script>

<style scoped>

</style>