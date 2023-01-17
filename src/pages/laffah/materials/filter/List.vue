<template>
  <VContainer>
    <VCard class="my-4 py-4 px-2">
      <VRow class="">
        <VCol class="" md="6">
          <VCard>
            <VTextField
              v-model="searchQuery"
              prepend-inner-icon="tabler-search"
              label="Search"
              placeholder="Search"
            />
          </VCard>
        </VCol>
        <VCol md="6">
          <v-autocomplete
            v-ref="categorySelected"
            v-model="categorySelected"
            :items="categories"
            item-value="value"
            item-text="text"
            return-object
          ></v-autocomplete>
          <!-- <v-select
            v-model="categorySelected"
            :items="categories"
            filled
            label="Category"
            return-object
          ></v-select> -->
        </VCol>
      </VRow>
    </VCard>

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
import axios from "axios";
import FilterCard from "@/views/laffah/components/products/filterCard.vue";
import { useProductStore } from "@/views/apps/products/useProductStore";
const productsData = ref("");
const productsCount = ref("");
const searchQuery = ref("");
const currentPage = ref(1);
const perPage = ref(12);
const length = ref(1);
const categorySelected = ref("");
const categories = ["category 1", "category 2", "category 3"];
// const categories = ref(["category1", "category2"]);

const fetchProductData = () => {
  const formData = new FormData();
  formData.append("page", currentPage.value);
  formData.append("perPage", perPage.value);
  formData.append("q", searchQuery.value);

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
