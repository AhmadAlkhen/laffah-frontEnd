<script setup>
import { ref, onMounted } from "vue";
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
// const categoriesAll = ["category 1", "category 2", "category 3"];
const categoriesAll = ref([]);
// const categories = ref(["category1", "category2"]);

const fetchProductData = () => {
  const formData = new FormData();
  formData.append("currentPage", currentPage.value);
  formData.append("perPage", perPage.value);
  if (searchQuery.value) {
    formData.append("q", searchQuery.value);
  }
  if (categorySelected.value) {
    formData.append("category", categorySelected.value.value);
  }

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

onMounted(() => {
  let allCategories = [];
  let categoryItem = [];
  axios
    .get("/category/index")
    .then((res) => {
      allCategories = res.data.data.data;
      allCategories.forEach((category) => {
        categoryItem.push({
          title: category.name,
          value: category.id,
        });
      });
      categoriesAll.value = categoryItem;
      return categoryItem;
    })
    .catch((err) => {
      console.log(err);
    });
});

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = productsData.value.length
    ? (currentPage.value - 1) * perPage.value + 1
    : 0;
  const lastIndex =
    productsData.value.length + (currentPage.value - 1) * perPage.value;

  return `Showing ${firstIndex} to ${lastIndex} of ${productsCount.value} entries`;
});
</script>

<template>
  <VContainer>
    <VCard class="my-4 py-5 px-2">
      <VRow class="pt-1">
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
            v-model="categorySelected"
            :items="categoriesAll"
            item-value="value"
            item-text="text"
            return-object
            clearable
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
      <VCol v-for="product in productsData" :key="product.id" md="3">
        <FilterCard :product="product" />
      </VCol>
    </VRow>

    <v-row justify="center">
      <v-col cols="12">
        <VCardText
          class="d-flex align-center flex-wrap justify-space-between gap-4 py-3 px-5"
        >
          <span class="text-sm text-disabled">
            {{ paginationData }}
          </span>

          <VPagination
            v-model="currentPage"
            size="small"
            :total-visible="5"
            :length="length"
          />
        </VCardText>
        <!-- <v-container class="max-width">
          <v-pagination
            v-model="currentPage"
            class="my-4"
            :length="length"
          ></v-pagination>
        </v-container> -->
      </v-col>
    </v-row>
  </VContainer>
</template>
