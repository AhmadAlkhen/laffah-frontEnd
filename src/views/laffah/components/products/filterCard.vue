<script setup>
import { useProductStore } from "@/views/laffah/products/useProductStore";
import { useToast } from "vue-toastification";
const toast = useToast();

const ProductStore = useProductStore();
const props = defineProps({
  product: {
    type: String,
    required: true,
  },
});

const quantity = ref([]);

const reserve = (product) => {
  let qty = quantity.value[product.id] ? quantity.value[product.id] : 0;
  ProductStore.addItem(product, qty);
  toast.success("Product added successfully", {
    timeout: 1000,
  });
};
</script>

<template>
  <VCard :loading="loading" class="px-0" max-width="374" min-height="300">
    <template #progress>
      <VProgressLinear color="deep-purple" height="10" indeterminate />
    </template>
    <VImg
      v-viewer
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
      <VTextField
        v-model="quantity[product.id]"
        persistent-placeholder
        placeholder="Qtu"
        type="number"
        class=""
        :min="0"
      />
    </VCardActions>
  </VCard>
</template>
<style scoped>
.v-card-title {
  min-height: 95px;
  display: block;
  flex: none;
  font-size: 1.2rem;
  font-weight: 500;
  hyphens: auto;
  letter-spacing: 0.0125em;
  min-width: 0;
  overflow-wrap: normal;
  overflow: hidden;
  padding: 0.5rem 1rem;
  text-transform: none;
  white-space: normal;
  word-break: normal;
  word-wrap: break-word;
}
</style>
