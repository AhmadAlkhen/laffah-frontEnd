<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import FilterCard from "@/views/laffah/components/products/filterCard.vue";
import { useProductStore } from "@/views/laffah/products/useProductStore";
const productsData = ref("");
const productsCount = ref("");
const searchQuery = ref("");
const currentPage = ref(1);
const perPage = ref(12);
const length = ref(1);
const categorySelected = ref("");
const totalPage = ref(1);
const totalProducts = ref(0);
const categoriesAll = ref([]);
const loading = ref(false);
const overlay = ref(false);
const templateSwitch = ref(false);

const fetchProductData = () => {
  overlay.value = true;
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
      // productsData.value = response.data.data.data;
      // productsCount.value = response.data.meta.total;
      // length.value = Math.round(productsCount.value / perPage.value);
      productsData.value = response.data.data.data;
      totalPage.value = response.data.data.last_page;
      totalProducts.value = response.data.data.total;
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      overlay.value = false;
    });
};
watch(fetchProductData, currentPage, { immediate: true });

const changeCategorySelected = (ee) => {
  console.log("sdf");
};

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

  return `Showing ${firstIndex} to ${lastIndex} of ${totalProducts.value} entries`;
});
</script>

<template>
  <VContainer>
    <VCard class="my-4 py-5 px-2">
      <VRow class="pt-1">
        <VCol class="" md="6">
          <VTextField
            v-model="searchQuery"
            prepend-inner-icon="tabler-search"
            label="Search"
            placeholder="Search"
          />
        </VCol>
        <VCol md="6">
          <v-autocomplete
            v-model="categorySelected"
            :items="categoriesAll"
            placeholder="Select Category"
            label="Select Category"
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
    <VOverlay v-model="overlay" class="align-center justify-center" persistent>
      <VProgressCircular
        color="primary"
        indeterminate
        size="64"
      ></VProgressCircular>
    </VOverlay>
    <VRow>
      <VCol v-for="product in productsData" :key="product.id" md="3" sm="12">
        <FilterCard :product="productsData" :templateSwitch="templateSwitch" />
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
            :length="totalPage"
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
    <div class="demo-space-x">
      <VSwitch v-model="templateSwitch" label="Template mode" />
    </div>
  </VContainer>
</template>
