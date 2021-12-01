<script>
import { layoutComputed } from "@/state/helpers";

import Vertical from "./vertical";
import Horizontal from "./horizontal";
import Detached from "./detached";
import TwoColumn from "./two-column";

/**
 * Main layout
 */
export default {
  components: {
    Vertical,
    Horizontal,
    Detached,
    TwoColumn,
  },
  data() {
    return {};
  },
  computed: {
    ...layoutComputed,
  },
};
</script>

<template>
  <div>
    <!-- Begin page -->
    <Vertical v-if="layoutType === 'vertical'" :layout="layoutType">
      <slot />
    </Vertical>
    <!-- END layout-wrapper -->

    <Horizontal v-if="layoutType === 'horizontal'" :layout="layoutType">
      <slot />
    </Horizontal>

    <Detached v-if="layoutType === 'detached'" :layout="layoutType">
      <slot />
    </Detached>

    <TwoColumn v-if="layoutType === 'two-column'" :layout="layoutType">
      <slot />
    </TwoColumn>
  </div>
</template>
