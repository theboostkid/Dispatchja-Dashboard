<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/Page-header";
import Portlet from "@/components/widgets/Portlet";
import appConfig from "../../../../app.config";

/**
 * Portlets component
 */
export default {
  page: {
    title: "Portlets",
    meta: [{ name: "description", content: appConfig.description }],
  },
  components: {
    Layout,
    PageHeader,
    Portlet,
  },
  data() {
    return {
      title: "Portlets",
      items: [
        {
          text: "Minton",
          href: "/",
        },
        {
          text: "UI",
          href: "/",
        },
        {
          text: "Portlets",
          active: true,
        },
      ],
      headerTitle: "Card title",
      portletclass: "text-white",
      cardColor: [
        {
          color: "primary",
        },
        {
          color: "success",
        },
        {
          color: "danger",
        },
        {
          color: "purple",
        },
        {
          color: "warning",
        },
        {
          color: "info",
        },
        {
          color: "dark",
        },
        {
          color: "pink",
        },
      ],
    };
  },
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="row">
      <div v-for="color in cardColor" :key="color.color" class="col-lg-4">
        <Portlet
          :headertitle="headerTitle"
          :portletclass="portletclass"
          :class="`bg-${color.color} text-white`"
        >
          <div class="card-body pt-0">
            Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus
            terry richardson ad squid. 3 wolf moon officia aute, non cupidatat
            skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod.
            Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid
            single-origin coffee nulla assumenda shoreditch et.
          </div>
        </Portlet>
      </div>
      <!-- end col -->
    </div>
    <!--end row-->
  </Layout>
</template>
