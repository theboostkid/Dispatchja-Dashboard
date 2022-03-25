<script>
import Layout from "../../layouts/horizontal.vue";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import DataTable from "@/components/tables/data-table";

/**
 * Starter component
 */
export default {
  page: {
    title: "Starter Page",
    meta: [{ name: "description", content: appConfig.description }]
  },
  components: { Layout, PageHeader, DataTable},
  data() {
    return {
      title: "Statment Frequency",
      items: [
        {
          text: "Settings"
        },
        {
          text: "Statement Frequency",
          active: true
        }
      ],
      headers:[
        {
          label: "Merchant Name",
          key: "restaurantName"
        },
        {
          label: "Statment Frequency",
          key: "statmentFrequency"
        }
      ],

      tableItems: []
    };
  }
};
</script>
<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <DataTable
    title="Statment Frequency"
    subtitle="This table shows the time span for each statement and when a statment should be genereated by the system"
    :headers="headers"
    :items="tableItems"
    />
  </Layout>
</template>