<script setup>
import { requiredValidator } from "@validators";
import axios from "axios";
const templateName = ref("");
const products = ref([]);
const product = ref("");
const quantity = ref("");
const refForm = ref();

onMounted(() => {
  let allProducts = [];
  let productItem = [];
  axios
    .post("products/search")
    .then((res) => {
      allProducts = response.data.data.data;
      allProducts.forEach((product) => {
        productItem.push({
          title: product.name,
          value: product.id,
        });
      });
      products.value = productItem;
      return productItem;
    })
    .catch((err) => {
      console.log(err);
    });
});
</script>

<template>
  <VForm ref="refForm" @submit.prevent="() => {}">
    <VRow>
      <VCol cols="12" md="12">
        <VTextField
          v-model="templateName"
          label="First Name"
          :rules="[requiredValidator]"
        />
      </VCol>

      <VCol cols="12" md="6">
        <VAutocomplete
          v-model="product"
          :items="products"
          placeholder="Select Product"
          label="Select Product"
          item-value="value"
          item-text="text"
          return-object
          clearable
        ></VAutocomplete>
      </VCol>
      <VCol cols="12" md="6">
        <VTextField
          v-model="quantity"
          label="quantity"
          :rules="[requiredValidator]"
        />
      </VCol>

      <VCol cols="12">
        <VBtn type="submit" @click="refForm?.validate()"> Submit </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>
