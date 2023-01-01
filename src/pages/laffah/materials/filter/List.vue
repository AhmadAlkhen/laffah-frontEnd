<template>
  <VContainer>
    <VRow>
      <VCol v-for="product in productsData" :key="product.id" md="4">
        <FilterCard :product="product" />
      </VCol>
    </VRow>

    <v-row justify="center">
      <v-col cols="8">
        <v-container class="max-width">
          <v-pagination
            v-model="currentPage"
            class="my-4"
            :length="length"
          ></v-pagination>
        </v-container>
      </v-col>
    </v-row>
  </VContainer>
</template>

<script setup>
import axios from "@axios";
import FilterCard from "@/views/laffah/components/products/filterCard.vue";
import { useProductStore } from "@/views/apps/products/useProductStore";
const productsData = ref("");
const productsCount = ref("");
const currentPage = ref(1);
const perPage = ref(10);
const length = ref(1);

const fetchProductData = () => {
  const formData = new FormData();
  formData.append("page", currentPage.value);
  formData.append("perPage", perPage.value);
  // formData.append("q", "");

  axios
    .post("products/search", formData)
    .then((response) => {
      productsData.value = response.data.data;
      productsCount.value = response.data.meta.total;
      length.value = Math.round(productsCount.value / perPage.value);
    })
    .catch((err) => {
      console.log(err);
    });
};
watch(fetchProductData, currentPage, { immediate: true });
</script>
