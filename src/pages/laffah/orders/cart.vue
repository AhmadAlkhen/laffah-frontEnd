<script setup>
import { useProductStore } from "@/views/laffah/products/useProductStore";
import { useProductOrderStore } from "@/views/laffah/orders/useProductOrderStore";

import axios from "axios";
import { useToast } from "vue-toastification";
import Swal from "sweetalert2";
const router = useRouter();
import moment from "moment";

const toast = useToast();
const ProductStore = useProductStore();
const productOrderStore = useProductOrderStore();

const quantity = ref([]);
const quantityCount = ref();
const itemsCart = ref([]);
const itemsCartSearch = ref([]);

const btnDis = ref(false);
const overlay = ref(false);
const btnSaveComplete = ref(false);
const orderDate = ref();
const isInputEnabled = ref(false);
const searchQuery = ref("");
const isCreator = ref(false);
const userIsCreator = ref(false);

const branches = ref([]);
const branchesOptions = {};

onMounted(() => {
  ProductStore.getItemLocalStarage;
  quantityCount.value = ProductStore.fetchItemCart().length;
  itemsCart.value = ProductStore.fetchItemCart();
  itemsCartSearch.value = ProductStore.fetchItemCart();
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

const storeQuantity = (item, quantity) => {
  // console.log(quantity.value[index]);
  ProductStore.changeQuantity(item, quantity);
};

// const userIsCreator = computed(() => {
//   let data = localStorage.getItem("userData");
//   let userData = JSON.parse(data);
//   console.log(userData.isCreator);
//   return false;
//   // return userData.isCreator;
// });
onMounted(() => {
  axios
    .get("/users/isCreator")
    .then((response) => {
      console.log(response.data.data.isCreator);
      isCreator.value = response.data.data.isCreator;
    })
    .catch((err) => {
      console.log(err);
      toast.warning(err.response?.data?.message || err.message, {
        timeout: 2000,
      });
    });
});
const checkIsCreator = () => {
  axios
    .get("/users/isCreator")
    .then((response) => {
      console.log(response.data.data.isCreator);
      isCreator.value = response.data.data.isCreator;
    })
    .catch((err) => {
      console.log(err);
      toast.warning(err.response?.data?.message || err.message, {
        timeout: 2000,
      });
    });
};

const saveOrderCart = () => {
  if (isDisabled()) {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to save the order?!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, confirm!",
      showDenyButton: isCreator.value,
      denyButtonColor: "#3a9853",
      denyButtonText: "Assign to branch",
    }).then((result) => {
      if (result.isConfirmed) {
        overlay.value = true;
        let newArraydata = [];
        const myCart = JSON.parse(localStorage.getItem("cart"));
        myCart.forEach((element, index) => {
          newArraydata.push({
            product_id: element.id,
            quantity: element.quantity,
          });
        });

        const formData = new FormData();
        // formData.append("user_id", "1");
        formData.append("status", "pending");
        formData.append("productsCount", newArraydata.length);
        formData.append("products", JSON.stringify(newArraydata));

        if (isInputEnabled) {
          if (orderDate && orderDate.value !== undefined) {
            const orderDateFormatted = moment(orderDate.value).format(
              "YYYY-MM-DD HH:mm:ss"
            );
            formData.append("order_date", orderDateFormatted);
          } else {
            const currentDateFormatted = moment(new Date()).format(
              "YYYY-MM-DD HH:mm:ss"
            );
            formData.append("order_date", currentDateFormatted);
          }
        } else {
          const currentDateFormatted = moment(new Date()).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          formData.append("order_date", currentDateFormatted);
        }
        axios
          .post("/order/store", formData)
          .then((response) => {
            // console.log(response.status);
            if (response.status == 200 || response.status == true) {
              overlay.value = false;

              ProductStore.resetCart();
              Swal.fire(
                "Added!",
                "Your order has been added successfully.",
                "success"
              );
            }
          })
          .then(() => {
            router.replace({ name: "laffah-orders-MyOrders" });
          })
          .catch((err) => {
            console.log(err);
            toast.warning(err.response?.data?.message || err.message, {
              timeout: 2000,
            });
            overlay.value = false;
          });
        // ------------------------------ Choose another Branch   --------------------------------------
      } else if (result.isDenied) {
        Swal.fire({
          title: "Select a branch",
          input: "select",
          inputOptions: {
            ...branchesOptions,
          },
          inputPlaceholder: "Select a branch",
          showCancelButton: true,
        }).then((result) => {
          if (result.value) {
            overlay.value = true;
            let newArraydata = [];
            const myCart = JSON.parse(localStorage.getItem("cart"));
            myCart.forEach((element, index) => {
              newArraydata.push({
                product_id: element.id,
                quantity: element.quantity,
              });
            });

            const formData = new FormData();
            // formData.append("user_id", "1");
            formData.append("assign_branch_id", result.value);
            formData.append("status", "pending");
            formData.append("productsCount", newArraydata.length);
            formData.append("products", JSON.stringify(newArraydata));

            if (isInputEnabled) {
              if (orderDate && orderDate.value !== undefined) {
                const orderDateFormatted = moment(orderDate.value).format(
                  "YYYY-MM-DD HH:mm:ss"
                );
                formData.append("order_date", orderDateFormatted);
              } else {
                const currentDateFormatted = moment(new Date()).format(
                  "YYYY-MM-DD HH:mm:ss"
                );
                formData.append("order_date", currentDateFormatted);
              }
            } else {
              const currentDateFormatted = moment(new Date()).format(
                "YYYY-MM-DD HH:mm:ss"
              );
              formData.append("order_date", currentDateFormatted);
            }
            axios
              .post("/order/store", formData)
              .then((response) => {
                // console.log(response.status);
                if (response.status == 200 || response.status == true) {
                  overlay.value = false;

                  ProductStore.resetCart();
                  Swal.fire(
                    "Added!",
                    "Your order has been added successfully.",
                    "success"
                  );
                }
              })
              .then(() => {
                router.replace({ name: "laffah-orders-MyOrders" });
              })
              .catch((err) => {
                console.log(err);
                toast.warning(err.response?.data?.message || err.message, {
                  timeout: 2000,
                });
                overlay.value = false;
              });
            // ------------------------------ Choose another Branch   --------------------------------------

            // Swal.fire(`You selected: ${result.value}`);
          }
        });
      }
    });
  } else {
    toast.warning("Please fill in all fields", {
      timeout: 2000,
    });
  }
};

const resetCart = () => {
  if (confirm("Do you really want to reset the cart?")) {
    ProductStore.resetCart();
    quantityCount.value = ProductStore.fetchItemCart().length;
    itemsCart.value = ProductStore.fetchItemCart();
    toast.success("Products deleted successfully", {
      timeout: 2000,
    });
  }
};

// const isDisabled = () => {
//   const myCart = JSON.parse(localStorage.getItem("cart"));

//   for (let index = 0; index < quantityCount.value; index++) {
//     if (quantity.value[index] === undefined || quantity.value[index] <= 0) {
//       btnSaveComplete.value = false;
//       break;
//     } else {
//       btnSaveComplete.value = true;
//     }
//   }
//   return btnSaveComplete.value;
// };

const isDisabled = () => {
  const myCart = JSON.parse(localStorage.getItem("cart"));

  for (let i = 0; i < myCart.length; i++) {
    if (myCart[i] === undefined || myCart[i] <= 0 || myCart[i].quantity <= 0) {
      btnSaveComplete.value = false;
      break;
    } else {
      btnSaveComplete.value = true;
    }
  }
  return btnSaveComplete.value;
};

// watch the Search
watchEffect(() => {
  if (searchQuery.value) {
    const searchResult = itemsCart.value.filter(
      (item) =>
        item.name.toLowerCase().indexOf(searchQuery.value.toLowerCase()) !== -1
    );
    itemsCartSearch.value = searchResult;
  } else {
    itemsCartSearch.value = itemsCart.value;
  }
});

onMounted(() => {
  productOrderStore
    .fetchBranches({
      perPage: 50,
      page: 1,
    })
    .then((response) => {
      const branchesData = response.data.data.data;

      branchesData.forEach((branch) => {
        branchesOptions[branch.id] = branch.name;
      });
    });
});
</script>

<template>
  <VCard>
    <VOverlay v-model="overlay" class="align-center justify-center" persistent>
      <VProgressCircular
        color="primary"
        indeterminate
        size="64"
      ></VProgressCircular>
    </VOverlay>
    <div v-if="itemsCart.length > 0">
      <VCard class="my-4 py-5 px-2">
        <VRow class="pt-2">
          <VCol class="" md="6">
            <VTextField
              v-model="searchQuery"
              prepend-inner-icon="tabler-search"
              label="Search"
              placeholder="Search"
            />
          </VCol>
        </VRow>
      </VCard>
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
            v-for="cart in itemsCartSearch"
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
                v-model="cart.quantity"
                label="Quantity"
                type="number"
                :min="1"
                @input="storeQuantity(cart, cart.quantity)"
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
        <VRow class="d-flex my-3">
          <VCol cols="12" sm="2">
            <VCheckbox v-model="isInputEnabled" label="Add date to order" />
          </VCol>
          <VCol cols="12" sm="6" v-if="isInputEnabled">
            <AppDateTimePicker
              v-model="orderDate"
              label="Add date to order"
              :config="{ enableTime: true, dateFormat: 'Y-m-d H:i' }"
            />
          </VCol>
        </VRow>
        <VRow class="d-flex flex-row-reverse my-3">
          <div>
            <VBtn color="primary" @click="saveOrderCart()"> Save </VBtn>
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
