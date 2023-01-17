<template>
  <VCard :loading="loading" class="px-0" max-width="374">
    <template #progress>
      <VProgressLinear color="deep-purple" height="10" indeterminate />
    </template>
    <VImg
      height="250"
      class="p-0 mb-2"
      src="https://cdn.vuetifyjs.com/images/cards/cooking.png"
    />
    <VCardTitle>{{ product.name }}</VCardTitle>
    <VDivider class="mx-4" />
    <!-- <VCardText>
      {{ product.name }}
    </VCardText> -->
    <VCardActions class="justify-space-between">
      <VBtn @click="reserve(product)">
        <VIcon icon="tabler-shopping-cart-plus" />
        <span class="ms-2">Add to cart</span>
      </VBtn>
    </VCardActions>
  </VCard>
</template>
<script setup>
import { useProductStore } from "@/views/apps/products/useProductStore";
import { useToast } from "vue-toastification";
const toast = useToast();

const ProductStore = useProductStore();

const props = defineProps({
  product: {
    type: String,
    required: true,
  },
});

const reserve = (product) => {
  ProductStore.addItem(product);
  toast.success("Product added successfully", {
    timeout: 2000,
  });
};
</script>
