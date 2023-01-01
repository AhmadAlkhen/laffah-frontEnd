<template>
  <VCard>
    <div class="d-flex cart">
      <v-container fluid>
        <v-row v-for="(cart, index) in cartDataComputed" :key="cart.id">
          <!-- <v-col cols="12" sm="1" md="1">
            <span>{{ index }}</span>
          </v-col> -->
          <v-col cols="12" sm="6" md="2">
            <img
              height="75"
              width="75"
              src="https://cdn.vuetifyjs.com/images/cards/cooking.png"
              class="ml-2"
            />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <b-card-text class="mx-1"> {{ cart.name }} </b-card-text>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-text-field
              v-model="quantity[index]"
              :counter="max"
              type="number"
              :rules="rules"
              label="Quantity"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <VBtn @click="Delete(cart.id)" color="error"> Delete </VBtn>
          </v-col>
        </v-row>
        <v-row class="d-flex flex-row-reverse">
          <div>
            <VBtn color="primary" @click="saveOrderCart()"> Save </VBtn>
          </div>
        </v-row>
      </v-container>
    </div>
  </VCard>
</template>

<script setup>
const quantity = ref([]);
import { useProductStore } from "@/views/apps/products/useProductStore";
import axios from "@axios";

const ProductStore = useProductStore();

const cartDataComputed = computed(() => {
  //   const cartData = ref([]);
  //   cartData.value = JSON.parse(localStorage.getItem("cart"));
  //   return cartData.value;
  ProductStore.getItemLocalStarage;
  return ProductStore.fetchItemCart();
});

const Delete = (cardId) => {
  if (confirm("Do you really want to remove this item?")) {
    ProductStore.deleteItem(cardId);
  }
};

const saveOrderCart = () => {
  if (confirm("Do you really want to save the order?")) {
    let newArraydata = [];
    const myCart = JSON.parse(localStorage.getItem("cart"));
    //   newArraydata = myCart;
    myCart.forEach((element, index) => {
      // console.log(quantity.value[index]);

      // element.product_id = myCart.id;
      // element.quantity = quantity.value[index];

      newArraydata.push({
        product_id: element.id,
        quantity: quantity.value[index],
      });
    });
    console.log(newArraydata);

    const formData = new FormData();
    formData.append("user_id", "123");
    formData.append("status", "pending");
    formData.append("products", JSON.stringify(newArraydata));

    axios
      .post("/order/store", formData)
      .then((response) => {
        console.log(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
};
</script>

<style scoped>
.cart {
  padding: 1rem;
  align-items: center;
}
</style>
