<script setup>
import { useProductStore } from "@/views/laffah/products/useProductStore";
import axios from "axios";
import { useToast } from "vue-toastification";
import Swal from "sweetalert2";

const toast = useToast();
const ProductStore = useProductStore();
const quantity = ref([]);
const quantityCount = ref();

const btnDis = ref(false);

const cartDataComputed = computed(() => {
  //   const cartData = ref([]);
  //   cartData.value = JSON.parse(localStorage.getItem("cart"));
  //   return cartData.value;
  ProductStore.getItemLocalStarage;
  quantityCount.value = ProductStore.fetchItemCart().length;
  return ProductStore.fetchItemCart();
});

const Delete = (cardId) => {
  if (confirm("Do you really want to remove this item?")) {
    ProductStore.deleteItem(cardId);
    toast.success("Product deleted successfully", {
      timeout: 2000,
    });
  }
};

const saveOrderCart = () => {
  Swal.fire({
    title: "Are you sure?",
    text: "Do you really want to save the order?!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, confirm!",
  }).then((result) => {
    if (result.isConfirmed) {
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
      // console.log(newArraydata);

      const formData = new FormData();
      // formData.append("user_id", "1");
      formData.append("status", "pending");
      formData.append("productsCount", newArraydata.length);
      formData.append("products", JSON.stringify(newArraydata));

      axios
        .post("/order/store", formData)
        .then((response) => {
          // console.log(response.status);
          if (response.status == 200 || response.status == true) {
            ProductStore.resetCart();
            Swal.fire(
              "Added!",
              "Your order has been added successfully.",
              "success"
            );
          }
        })
        .catch((err) => {
          console.log(err);
        });
      // Swal.fire("Deleted!", "Your file has been deleted.", "success");
    }
  });
  // if (confirm("Do you really want to save the order?")) {
  // }
};
const isDisabled = () => {
  // console.log(quantity.value.length);
  // const len = quantity.value.length;
  // let result = false;
  for (let index = 0; index < quantityCount.value; index++) {
    if (quantity.value[index] === undefined || quantity.value[index] <= 0) {
      // console.log(quantity.value[index]);
      // console.log("hhhhh");
      btnDis.value = true;
    } else {
      btnDis.value = false;
    }
  }
  return btnDis.value;
};
</script>

<template>
  <VCard>
    <!-- <div class="d-flex cart" v-if="cartDataComputed.length > 0">
      <v-container fluid>
        <v-row v-for="(cart, index) in cartDataComputed" :key="cart.id">
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
          <v-col cols="12" sm="6" md="2">
            <b-card-text class="mx-1"> {{ cart.unit }} </b-card-text>
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
          <v-col cols="12" sm="6" md="2">
            <VBtn
              @click="Delete(cart.id)"
              icon
              size="x-small"
              color="default"
              variant="text"
            >
              <VIcon size="22" icon="tabler-trash" />
            </VBtn>
          </v-col>
          <VDivider class="mx-4 my-4" />
        </v-row>
        <v-row class="d-flex flex-row-reverse">
          <div>
            <VBtn
              color="primary"
              @click="saveOrderCart()"
              :disabled="isDisabled()"
            >
              Save
            </VBtn>
          </div>
        </v-row>
      </v-container>
    </div> -->

    <div class="" v-if="cartDataComputed.length > 0">
      <VTable class="text-no-wrap">
        <!-- 👉 table head -->
        <thead>
          <tr>
            <th scope="col">Product</th>
            <th scope="col">Name</th>
            <th scope="col">Unit</th>
            <th scope="col">Quantity</th>
            <th scope="col">ACTIONS</th>
          </tr>
        </thead>
        <!-- 👉 table body -->
        <tbody>
          <tr
            v-for="(cart, index) in cartDataComputed"
            :key="cart.id"
            style="height: 3.75rem"
          >
            <!-- 👉  -->
            <td>
              <img
                height="75"
                width="75"
                src="https://cdn.vuetifyjs.com/images/cards/cooking.png"
                class="ml-2"
              />
            </td>

            <!-- 👉 -->
            <td>
              <span class="text-capitalize text-base">{{ cart.name }}</span>
            </td>
            <!-- 👉  -->
            <td>
              <span class="text-capitalize text-base">{{ cart.unit }}</span>
            </td>

            <!-- 👉  -->
            <td>
              <v-text-field
                v-model="quantity[index]"
                :counter="max"
                type="number"
                :rules="rules"
                label="Quantity"
              ></v-text-field>
            </td>

            <!-- 👉  -->
            <td>
              <VBtn
                @click="Delete(cart.id)"
                icon
                size="x-small"
                color="default"
                variant="text"
              >
                <VIcon size="22" icon="tabler-trash" />
              </VBtn>
            </td>
          </tr>
        </tbody>

        <!-- 👉 table footer  -->
        <tfoot v-show="!cartDataComputed.length">
          <tr>
            <td colspan="7" class="text-center">No data available</td>
          </tr>
        </tfoot>
      </VTable>
      <VContainer class="">
        <VRow class="d-flex flex-row-reverse my-3">
          <div>
            <VBtn
              color="primary"
              @click="saveOrderCart()"
              :disabled="isDisabled()"
            >
              Save
            </VBtn>
          </div>
        </VRow>
      </VContainer>
    </div>

    <div v-else>
      <v-alert border="right" colored-border type="error" elevation="2">
        there are no products in the cart.
      </v-alert>
    </div>
  </VCard>
</template>

<style scoped>
.cart {
  padding: 1rem;
  align-items: center;
}
</style>
