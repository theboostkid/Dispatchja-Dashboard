<template>
  <div class="card">
    <div class="card-body">
      <h5 class="card-title"> {{ title }} </h5>
      <p class="font-weight-light text-muted mb-4">{{ subtitle }}</p>
      
      <slot name="header"/>
      
      <div class="row">
        <div class="col-12">
          <b-table
            :items="items"
            :fields="headers"
            >
          </b-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      title: String,
      subtitle: String,
      items: Array,
      headers: Array
    }
  }
</script>

<style scoped>

</style>