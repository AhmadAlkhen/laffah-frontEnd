<script setup>
import { useProductStore } from "@/views/laffah/products/useProductStore";
import axios from "axios";
import { useToast } from "vue-toastification";
import Swal from "sweetalert2";
const router = useRouter();

const toast = useToast();
const ProductStore = useProductStore();
const quantity = ref([]);
const quantityCount = ref();
const itemsCart = ref([]);
const btnDis = ref(false);

// const cartDataComputed = computed(() => {
//   ProductStore.getItemLocalStarage;
//   quantityCount.value = ProductStore.fetchItemCart().length;
//   return ProductStore.fetchItemCart();
// });

onMounted(() => {
  ProductStore.getItemLocalStarage;
  quantityCount.value = ProductStore.fetchItemCart().length;
  itemsCart.value = ProductStore.fetchItemCart();
});

const Delete = (cardId) => {
  if (confirm("Do you really want to remove this item?")) {
    ProductStore.deleteItem(cardId);
    quantityCount.value = ProductStore.fetchItemCart().length;
    itemsCart.value = ProductStore.fetchItemCart();
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
      myCart.forEach((element, index) => {
        newArraydata.push({
          product_id: element.id,
          quantity: quantity.value[index],
        });
      });

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
          router.replace({ name: "laffah-orders-MyOrders" });
        })
        .catch((err) => {
          console.log(err);
          toast.warning(err.response?.data?.message || err.message, {
            timeout: 2000,
          });
        });
    }
  });
};

const resetCart = () => {
  if (confirm("Do you really want to reset the cart?")) {
    ProductStore.resetCart();
    toast.success("Products deleted successfully", {
      timeout: 2000,
    });
  }
};
// const isDisabled = () => {
//   for (let index = 0; index < quantityCount.value; index++) {
//     if (quantity.value[index] === undefined || quantity.value[index] <= 0) {
//       btnDis.value = true;
//     } else {
//       btnDis.value = false;
//     }
//   }
//   return btnDis.value;
// };
const isDisabled = () => {
  for (let index = 0; index < quantityCount.value; index++) {
    if (isNaN(quantity.value[index]) || quantity.value[index] <= 0) {
      quantity.value[index] = 0;
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
    <div v-if="itemsCart.length > 0">
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
            v-for="(cart, index) in itemsCart"
            :key="cart.id"
            style="height: 3.75rem"
          >
            <!-- 👉  -->
            <td v-viewer>
              <img
                height="90"
                width="90"
                :src="cart.image"
                class="ml-2 rounded mt-2"
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
              <VTextField
                v-model="quantity[index]"
                label="Quantity"
                type="number"
              />
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
        <tfoot v-show="!itemsCart.length">
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
            <VBtn color="error" @click="resetCart()" class="mx-2"> Reset </VBtn>
          </div>
        </VRow>
      </VContainer>
    </div>

    <div v-else>
      <!-- <v-alert border="right" colored-border type="error" elevation="2">
        there are no products in the cart.
      </v-alert> -->
      <VAlert border="start" border-color="error">
        there are no products in the cart.
      </VAlert>
    </div>
  </VCard>
</template>

<style scoped>
.cart {
  padding: 1rem;
  align-items: center;
}
</style>
