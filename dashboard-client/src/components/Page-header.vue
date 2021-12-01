<script>
import { layoutComputed } from "@/state/helpers";

/**
 * Page-header component
 */
export default {
  components: {},
  props: {
    title: {
      type: String,
      default: "",
    },
    items: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  computed: {
    ...layoutComputed,
  },
};
</script>

<template>
  <!-- start page title -->
  <div class="row">
    <div class="col-12">
      <div
        class="page-title-box"
        :class="{
          'page-title-box-alt':
            layoutType !== 'vertical' && layoutType !== 'two-column',
        }"
      >
        <h4 class="page-title">{{ title }}</h4>
        <div class="page-title-right">
          <b-breadcrumb :items="items" class="m-0"></b-breadcrumb>
        </div>
      </div>
    </div>
  </div>
  <!-- end page title -->
</template>
