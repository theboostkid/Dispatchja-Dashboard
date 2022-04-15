<script>
import { layoutComputed } from '../state/helpers'
export default {
  components: {},

  computed: {
    ...layoutComputed
  },

  props: {
    title: {
      type: String,
      default: '',
    },
    items: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
}
</script>

<template>
  <!-- start page title -->
  <div class="row">
    <div class="col-12">
      <div class="page-title-box d-flex align-items-center justify-content-between">
        <h4 class="mb-0 font-size-18" :class="{'text-white': leftSidebarType == 'dark', 'text-dark': leftSidebarType == 'light' }">{{ title }}</h4>

        <div class="page-title-right">
          <b-breadcrumb :items="items" class="m-0 text-white"></b-breadcrumb>
        </div>
      </div>
    </div>
  </div>
  <!-- end page title -->
</template>
