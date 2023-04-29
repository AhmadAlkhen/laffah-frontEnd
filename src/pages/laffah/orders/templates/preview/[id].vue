<script setup>
import { useTemplateStore } from "@/views/laffah/products/useTemplateStore";
import axios from "axios";
import { useToast } from "vue-toastification";
import Swal from "sweetalert2";
const route = useRoute();
const router = useRouter();
import moment from "moment";

const toast = useToast();
const TemplateStore = useTemplateStore();
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
const templateName = ref("");
const description = ref("");

onMounted(() => {
  TemplateStore.fetchTemplate(route.params.id)
    .then((response) => {
      itemsCart.value = response.data.data;
      quantityCount.value = response.data.template.productsCount;
      templateName.value = response.data.template.name;
      itemsCartSearch.value = response.data.data;
    })
    .catch((error) => {
      console.log(error);
    });
  //   quantityCount.value = TemplateStore.fetchItemCart().length;
  //   itemsCart.value = TemplateStore.fetchItemCart();
  //   itemsCartSearch.value = TemplateStore.fetchItemCart();
});

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
    }).then((result) => {
      if (result.isConfirmed) {
        overlay.value = true;
        let newArraydata = [];
        const myCart = itemsCart.value;
        myCart.forEach((element, index) => {
          newArraydata.push({
            product_id: element.product_id,
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

              //   ProductStore.resetCart();
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
      }
    });
  } else {
    toast.warning("Please fill in all fields", {
      timeout: 2000,
    });
  }
};

const isDisabled = () => {
  for (let i = 0; i < itemsCart.value.length; i++) {
    if (
      itemsCart.value[i].quantity === undefined ||
      itemsCart.value[i].quantity <= 0
    ) {
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
        item.product.name
          .toLowerCase()
          .indexOf(searchQuery.value.toLowerCase()) !== -1 ||
        item.product.sku
          .toLowerCase()
          .indexOf(searchQuery.value.toLowerCase()) !== -1
    );
    itemsCartSearch.value = searchResult;
  } else {
    itemsCartSearch.value = itemsCart.value;
  }
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
    <div v-if="itemsCart.length">
      <VCard class="my-4 py-5 px-2">
        <VRow class="pt-2">
          <VCol class="" md="12">
            <VAlert variant="outlined" color="success">
              {{ templateName }}
            </VAlert>
          </VCol>
        </VRow>
      </VCard>
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
            <th scope="col">Unit</th>
            <th scope="col">Quantity</th>
            <!-- <th scope="col">ACTIONS</th> -->
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
              <!-- <img
                height="90"
                width="90"
                :src="cart.image"
                class="ml-2 rounded mt-2"
              /> -->
              <div class="d-flex align-center">
                <VAvatar
                  variant="tonal"
                  color="primary"
                  class="me-3"
                  size="38"
                  v-viewer
                >
                  <VImg v-if="cart.product.image" :src="cart.product.image" />
                  <span v-else>{{ avatarText(cart.product.name) }}</span>
                </VAvatar>

                <div class="d-flex flex-column">
                  <h6 class="text-base">
                    <h3 class="font-weight-medium user-list-name">
                      {{ cart.product.name }}
                    </h3>
                  </h6>
                  <span class="text-sm text-disabled">{{
                    cart.product.sku
                  }}</span>
                </div>
              </div>
            </td>

            <!-- 👉  -->
            <td>
              <span class="text-capitalize text-base">{{
                cart.product.unit
              }}</span>
            </td>

            <!-- 👉  -->
            <td>
              <VTextField
                v-model="cart.quantity"
                label="Quantity"
                type="number"
                :min="1"
              />
            </td>

            <!-- 👉  -->
            <!-- <td>
              <VBtn
                @click="Delete(cart.id)"
                icon
                size="x-small"
                color="default"
                variant="text"
              >
                <VIcon size="22" icon="tabler-trash" />
              </VBtn>
            </td> -->
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
            <VBtn color="primary" @click="saveOrderCart()"> Save Order</VBtn>
            <!-- <VBtn color="error" @click="resetCart()" class="mx-2"> Reset </VBtn> -->
          </div>
        </VRow>
      </VContainer>
    </div>

    <!-- <div>
      <VAlert border="start" border-color="error">
        there are no products in the template.
      </VAlert>
    </div> -->
  </VCard>
</template>

<style scoped>
.cart {
  padding: 1rem;
  align-items: center;
}
</style>
