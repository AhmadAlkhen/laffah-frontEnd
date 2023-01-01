<template>
  <VCard :loading="loading" class="mx-auto" max-width="374">
    <template #progress>
      <VProgressLinear color="deep-purple" height="10" indeterminate />
    </template>
    <VImg
      height="250"
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

const ProductStore = useProductStore();

const props = defineProps({
  product: {
    type: String,
    required: true,
  },
});

const reserve = (product) => {
  ProductStore.addItem(product);
};
</script>
