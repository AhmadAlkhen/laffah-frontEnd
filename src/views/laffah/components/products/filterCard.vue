<template>
  <VCard :loading="loading" class="px-0" max-width="374" min-height="300">
    <template #progress>
      <VProgressLinear color="deep-purple" height="10" indeterminate />
    </template>
    <VImg
      v-if="product.image"
      class="p-0 mb-2"
      :src="product.image"
      height="183"
    />
    <VImg
      v-else
      class="p-0 mb-2"
      src="https://cdn.vuetifyjs.com/images/cards/cooking.png"
      height="183"
    />
    <!-- :src="https://cdn.vuetifyjs.com/images/cards/cooking.png" `http://127.0.0.1:8000/${product.image}` -->

    <VCardTitle class="text-base">{{ product.name }}</VCardTitle>
    <VDivider class="mx-4" />
    <!-- <VCardText>
      {{ product.name }}
    </VCardText> -->
    <VCardActions class="justify-space-between mt-2">
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
