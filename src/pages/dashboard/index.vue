<script setup>
import { useToast } from "vue-toastification";
const toast = useToast();

import EcommerceCongratulationsJohn from "@/views/laffah/dashboards/EcommerceCongratulationsJohn.vue";
import Statistics from "@/views/laffah/dashboards/Statistics.vue";
import StatisticsProducts from "@/views/laffah/dashboards/StatisticsProducts.vue";
import StatisticsCategories from "@/views/laffah/dashboards/StatisticsCategories.vue";
import { useDashboardStore } from "@/views/laffah/dashboards/useDashboardStore";
const dashboardStore = useDashboardStore();

const orderStatus = ref();
const products = ref();
const categories = ref();
const overlay = ref(false);

onMounted(() => {
  overlay.value = true;

  dashboardStore.fetchStatistics().then((res) => {
    console.log(res.data.orderStatus);
    orderStatus.value = res.data.orderStatus;
    products.value = res.data.products;
    categories.value = res.data.categories;
    overlay.value = false;
  });
});
</script>

<template>
  <section>
    <VOverlay v-model="overlay" class="align-center justify-center" persistent>
      <VProgressCircular
        color="primary"
        indeterminate
        size="64"
      ></VProgressCircular>
    </VOverlay>
    <VRow>
      <VCol cols="12" md="3" lg="3">
        <EcommerceCongratulationsJohn />
      </VCol>
      <VCol cols="12" md="7" lg="8" v-if="orderStatus">
        <Statistics class="h-100" :orderStatus="orderStatus" />
      </VCol>
      <VCol cols="12" md="3" lg="3" v-if="categories">
        <StatisticsCategories :categories="categories" />
      </VCol>
      <VCol cols="12" md="7" lg="8" v-if="products">
        <StatisticsProducts :products="products" />
      </VCol>
    </VRow>
  </section>
</template>

<style lang="scss"></style>
