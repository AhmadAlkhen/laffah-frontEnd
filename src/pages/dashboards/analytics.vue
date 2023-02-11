<script setup>
import EcommerceCongratulationsJohn from "@/views/laffah/dashboards/EcommerceCongratulationsJohn.vue";
import Statistics from "@/views/laffah/dashboards/Statistics.vue";
import StatisticsProducts from "@/views/laffah/dashboards/StatisticsProducts.vue";
import StatisticsCategories from "@/views/laffah/dashboards/StatisticsCategories.vue";
import { useDashboardStore } from "@/views/laffah/dashboards/useDashboardStore";
const dashboardStore = useDashboardStore();
import axios from "axios";

const orderStatus = ref();
const products = ref();
const categories = ref();
onMounted(() => {
  dashboardStore.fetchStatistics().then((res) => {
    console.log(res.data.orderStatus);
    orderStatus.value = res.data.orderStatus;
    products.value = res.data.products;
    categories.value = res.data.categories;
  });
});
</script>

<template>
  <VRow>
    <!-- 👉 Congratulation John -->
    <VCol cols="12" md="3" lg="3">
      <EcommerceCongratulationsJohn />
    </VCol>

    <!-- 👉 Ecommerce Transition -->
    <VCol cols="12" md="7" lg="8" v-if="orderStatus">
      <Statistics class="h-100" :orderStatus="orderStatus" />
    </VCol>

    <!-- 👉 Ecommerce Transition -->
    <VCol cols="12" md="3" lg="3" v-if="categories">
      <StatisticsCategories :categories="categories" />
    </VCol>
    <!-- 👉 Ecommerce Transition -->
    <VCol cols="12" md="7" lg="8" v-if="products">
      <StatisticsProducts :products="products" />
    </VCol>

    <!-- 👉 Revenue Report -->
    <!-- <VCol cols="12" lg="8">
      <EcommerceRevenueReport />
    </VCol> -->

    <!-- 👉 Earning Reports -->
    <!-- <VCol cols="12" sm="6" lg="4">
      <EcommerceEarningReports />
    </VCol> -->
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart.scss";
</style>
