<script setup>
import { VNodeRenderer } from "@layouts/components/VNodeRenderer";
import { themeConfig } from "@themeConfig";
import moment from "moment";
import Swal from "sweetalert2";
import { avatarText } from "@core/utils/formatters";

import { requiredValidator } from "@validators";
import { useToast } from "vue-toastification";
const toast = useToast();
// Components

import { useProductStore } from "@/views/laffah/products/useProductStore";
const ProductStore = useProductStore();

// Store
import { useOrderListStore } from "@/views/laffah/orders/useOrderListStore";
import axios from "axios";
import { name } from "vue-prism-component";
import { watch } from "@vue/runtime-core";

const orderListStore = useOrderListStore();
const route = useRoute();
const router = useRouter();

const orderData = ref([]);
const orderDataNew = ref([]);
const orderDetails = ref();
const quantitySent = ref([]);
const quantityConfirm = ref([]);
const quantityCount = ref();
const rating = ref([]);
const comment = ref("");
const listComments = ref([]);
const selectedCarrier = ref({ name: "", id: "" });
const carriers = ref([]);
const categories = ref([]);
const category = ref();

const isCarrierSelected = ref(false);
const isDialogVisible = ref(false);

const isAllQtySentFilled = ref(false);

// 👉 fetchInvoice
orderListStore
  .fetchOrder(Number(route.params.id))
  .then((response) => {
    orderData.value = response.data.data;
    orderDataNew.value = response.data.data;
    orderDetails.value = response.data.order[0];
    quantityCount.value = response.data.data.length;
    listComments.value = response.data.comments;
  })
  .then(() => {
    let categoriesSpec = [{ title: "All", value: "0" }];
    orderData.value.forEach((item) => {
      const category = {
        title: item.product.category.name,
        value: item.product.category.id,
      };

      // check if category already exists in categoriesSpec array
      if (!categoriesSpec.some((c) => c.value === category.value)) {
        categoriesSpec.push(category);
      }
    });
    categories.value = categoriesSpec;
  })
  .catch((error) => {
    console.log(error);
  });

orderListStore.fetchCarriers().then((res) => {
  carriers.value = res.data.data;
});

const fetchOrders = () => {
  orderListStore
    .fetchOrder(Number(route.params.id))
    .then((response) => {
      orderData.value = response.data.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

// 👉 Print Order
const printInvoice = () => {
  window.print();
};

// duplicate Order
const duplicateOrder = () => {
  let myProducts = [];
  orderData.value.forEach((element) => {
    myProducts.push(element.product);
  });
  ProductStore.addItems(myProducts);
  // localStorage.setItem("cart", JSON.stringify(myProducts));
  router.replace({ name: "laffah-orders-cart" });
};

// export Order
const exportOrder = () => {
  const orderId = orderDetails.value.id;
  axios
    .get("/order/export", { params: { orderId }, responseType: "blob" })
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Order.xlsx");
      document.body.appendChild(link);
      link.click();
    })
    .catch((err) => {
      console.log(err);
      toast.warning(err.response?.data?.message || err.message, {
        timeout: 2000,
      });
    });
};

const storeQuantitySent = (item, quaSent, index) => {
  const id = item.id;
  const quantity_sent = quaSent;

  axios
    .post("/order/quantity/sent", { id, quantity_sent })
    .then((res) => {
      if (res.status != 200) {
        toast.warning(res.data.message, {
          timeout: 2000,
        });
      } else {
        toast.success(res.data.message, {
          timeout: 2000,
        });
      }

      fetchOrders();
      quantitySent.value[index] = "";
    })
    .catch((err) => {
      console.log(err);
    });
};
const storeQuantityConfirm = (item, quaConfirm, index) => {
  const id = item.id;
  const quantity_confirm = quaConfirm;

  axios
    .post("/order/quantity/confirm", { id, quantity_confirm })
    .then((res) => {
      if (res.status != 200) {
        toast.warning(res.data.message, {
          timeout: 2000,
        });
      } else {
        toast.success(res.data.message, {
          timeout: 2000,
        });
      }
      fetchOrders();
      quantityConfirm.value[index] = "";
    })
    .catch((err) => {
      console.log(err);
    });
};
const isDisabled = () => {
  let result = false;
  for (let index = 0; index < quantityCount.value; index++) {
    if (quantitySent.value[index] === undefined) {
      result = true;
    }
  }
  return result;
};
const convertCreated = (value) => {
  return moment(value).format("YYYY-MM-DD hh:mm");
};

const isProcessing = () => {
  const carrierId = selectedCarrier.value.id;
  if (carrierId == "") {
    isCarrierSelected.value = true;
    // isDialogVisible.value = false;
  } else {
    isCarrierSelected.value = false;

    const status = "processing";
    const orderId = orderDetails.value.id;
    const carrier_id = carrierId;
    axios
      .post("/order/status/processing", { status, orderId, carrier_id })
      .then((res) => {
        isDialogVisible.value = false;
        if (res.status != 200) {
          toast.warning(res.data.message, {
            timeout: 2000,
          });
        } else {
          toast.success(res.data.message, {
            timeout: 2000,
          });
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
};

const isAllFilled = () => {
  const allFilled = orderData.value.every(
    (element) => element.quantity_sent !== null
  );
  return allFilled;
};

const completedOrder = () => {
  Swal.fire({
    title: "Are you sure?",
    text: "Do you really want to complete this order?!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, confirm!",
  }).then((res) => {
    if (res.isConfirmed) {
      const status = "completed";
      const orderId = orderDetails.value.id;
      axios
        .post("/order/status/completed", { status, orderId })
        .then((res) => {
          if (res.status != 200) {
            toast.warning(res.data.message, {
              timeout: 2000,
            });
          } else {
            toast.success(res.data.message, {
              timeout: 2000,
            });
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

const changeRate = (item, rated) => {
  const id = item.id;
  const rate = rated;

  axios
    .post("/order/quantity/rate", { id, rate })
    .then((res) => {
      if (res.status != 200) {
        toast.warning(res.data.message, {
          timeout: 2000,
        });
      } else {
        toast.success(res.data.message, {
          timeout: 2000,
        });
        // fetchOrders();
      }
    })
    .catch((err) => {
      console.log(err);
      toast.warning(err.response?.data?.message || err.message, {
        timeout: 2000,
      });
    });
};
const addMessage = () => {
  const orderId = orderDetails.value.id;

  const formData = new FormData();
  formData.append("order_id", orderId);
  formData.append("message", comment.value);

  axios
    .post("/order/message/store", formData)
    .then((res) => {
      toast.success("comment added successfully", {
        timeout: 2000,
      });
      // fetchOrders();
      comment.value = "";
      listComments.value.push({
        id: res.data.order_message.id,
        message: res.data.order_message.message,
        user: { name: userName },
        created_at: res.data.order_message.created_at,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
// const listMessages = computed(() => {
//   const orderId = Number(route.params.id);

//   axios
//     .get("/order/message/list", { orderId })
//     .then((res) => {
//       listComments.value = res.data.comments;
//       // fetchOrders();
//       comment.value = "";
//     })
//     .catch((err) => {
//       console.log(err);
//     });
//   return listComments.value;
// });

const userRole = computed(() => {
  let data = localStorage.getItem("userRole");
  return data;
});
const userName = computed(() => {
  let data = JSON.parse(localStorage.getItem("userData"));
  return data.name;
});

const filterProductsByCategory = () => {
  if (category.value) {
    orderDataNew.value = orderData.value;
    if (category.value.value == "0") {
      console.log(category.value);
      orderDataNew.value = orderData.value;
    } else {
      const newOrderData = orderData.value.filter(
        (item) => item.product.category_id === category.value.value
      );
      orderDataNew.value = newOrderData;
    }
  }
};
watch(
  () => category.value,
  () => {
    filterProductsByCategory();
  }
);

// onMounted(() => {
//   let allCategories = [];
//   let categoryItem = [];
//   axios
//     .get("/category/index")
//     .then((res) => {
//       allCategories = res.data.data.data;
//       allCategories.forEach((category) => {
//         categoryItem.push({
//           title: category.name,
//           value: category.id,
//         });
//       });
//       categories.value = categoryItem;
//       return categoryItem;
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });
</script>

<template>
  <section v-if="orderData && orderDetails">
    <VCard class="my-2">
      <VRow class="my-1 ml-1">
        <VCol cols="12" md="2" class="d-print-none">
          <VBtn
            block
            prepend-icon="tabler-copy"
            class="mb-2"
            @click="duplicateOrder"
          >
            duplicate
          </VBtn>
        </VCol>
        <VCol cols="12" md="2" class="d-print-none">
          <VBtn
            block
            prepend-icon="tabler-scan"
            variant="tonal"
            color="info"
            class="mb-2"
            @click="printInvoice"
          >
            Print
          </VBtn>
        </VCol>
        <VCol cols="3" class="d-print-none">
          <VAutocomplete
            v-model="category"
            :items="categories"
            item-title="title"
            item-value="value"
            label="Select category"
            persistent-hint
            return-object
          />
        </VCol>
        <VCol cols="12" md="2" class="d-print-none">
          <VBtn
            block
            prepend-icon="tabler-icon"
            variant="tonal"
            color="info"
            class="mb-2"
            @click="exportOrder"
          >
            Export
          </VBtn>
        </VCol>
      </VRow>
    </VCard>
    <VRow>
      <VCol cols="12" md="12">
        <VCard>
          <!-- SECTION Header -->
          <VCardText
            class="d-flex flex-wrap justify-space-between flex-column flex-sm-row print-row"
          >
            <!-- 👉 Left Content -->
            <div class="ma-sm-4">
              <div class="d-flex align-center mb-6">
                <!-- 👉 Logo -->
                <VNodeRenderer :nodes="themeConfig.app.logo" class="me-3" />

                <!-- 👉 Title -->
                <h6 class="font-weight-bold text-xl color-red">
                  {{ themeConfig.app.title }}
                </h6>
              </div>
              <!-- 👉 Address -->
              <p class="mb-0">User: {{ orderDetails.user.name }}</p>
              <p class="mb-0">Branch: # {{ orderDetails.user.branch.name }}</p>
              <p class="mb-0" v-if="orderDetails.carrier != null">
                Carrier: # {{ orderDetails.carrier.name }}
              </p>
            </div>

            <!-- 👉 Right Content -->
            <div class="mt-4 ma-sm-4">
              <!-- 👉 Invoice ID -->
              <h6 class="font-weight-medium text-xl mb-6">
                Order #
                <span class="color-blue" color="primary"
                  >{{ orderDetails.id }}
                </span>
              </h6>

              <!-- 👉 Issue Date -->
              <p class="mb-2">
                <span>Date Issued: </span>
                <span class="font-weight-semibold">{{
                  convertCreated(orderDetails.created_at)
                }}</span>
              </p>

              <!-- 👉 Due Date -->
              <p class="mb-2">
                <span>status: </span>
                <span class="font-weight-semibold">{{
                  orderDetails.status
                }}</span>
              </p>
              <!-- 👉 Due Date -->
            </div>
          </VCardText>
          <!-- !SECTION -->

          <VDivider />

          <!-- 👉 Table -->
          <VDivider />
          <VTable fixed-header>
            <thead>
              <tr>
                <th scope="col">ITEM</th>
                <th scope="col">Product</th>
                <th scope="col">Unit</th>
                <th scope="col">Quantity</th>
                <th scope="col">Sent</th>
                <th scope="col">Confirm</th>
                <th scope="col">Return</th>
                <th scope="col">Total</th>
                <!-- for Admin & warehouse -->
                <th
                  class="d-print-none"
                  scope="col"
                  v-if="
                    userRole == 'warehouse' && orderDetails.status == 'pending'
                  "
                >
                  Quantity Sent
                </th>
                <th
                  class="d-print-none"
                  scope="col"
                  v-if="
                    userRole == 'warehouse' && orderDetails.status == 'pending'
                  "
                >
                  Action
                </th>
                <!-- end Admin & warehouse -->
                <!-- for Branch -->
                <th
                  class="d-print-none"
                  scope="col"
                  v-if="
                    userRole == 'branch' && orderDetails.status == 'processing'
                  "
                >
                  Confirm Sent
                </th>
                <th
                  class="d-print-none"
                  scope="col"
                  v-if="
                    userRole == 'branch' && orderDetails.status == 'processing'
                  "
                >
                  Action
                </th>
                <!-- end for Branch -->
                <th class="d-print-none" scope="col">Rate</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(item, index) in orderDataNew" :key="item.id">
                <td class="text-no-wrap" v-viewer>
                  <VImg
                    :src="item.product.image"
                    class="mt-1 rounded my-2"
                    width="80px"
                  />
                </td>
                <td class="text-no-wrap">
                  {{ item.product.name }}
                </td>
                <td class="text-no-wrap">
                  {{ item.product.unit }}
                </td>
                <td class="text-no-wrap">
                  {{ item.quantity }}
                </td>
                <td class="text-no-wrap">
                  {{ item.quantity_sent }}
                </td>
                <td class="text-no-wrap">
                  {{ item.quantity_confirm }}
                </td>
                <td class="text-no-wrap">
                  {{ item.quantity_return }}
                </td>
                <td class="text-no-wrap">
                  {{
                    item.quantity_confirm - item.quantity_return == 0
                      ? ""
                      : item.quantity_confirm - item.quantity_return
                  }}
                </td>
                <!-- for Admin & warehouse -->
                <td
                  class="text-center quantitySent d-print-none"
                  v-if="
                    userRole == 'warehouse' && orderDetails.status == 'pending'
                  "
                >
                  <VTextField
                    v-model="quantitySent[index]"
                    persistent-placeholder
                    placeholder="Qty Sent"
                    type="number"
                    class=""
                    :disabled="orderDetails.status != 'pending' ? true : false"
                  />
                </td>
                <td
                  class="text-center d-print-none"
                  v-if="
                    userRole == 'warehouse' && orderDetails.status == 'pending'
                  "
                >
                  <VBtn
                    icon="ic:baseline-send"
                    variant="text"
                    size="24"
                    @click="storeQuantitySent(item, quantitySent[index], index)"
                    :disabled="orderDetails.status != 'pending' ? true : false"
                  />
                </td>
                <!-- end for Admin & warehouse -->

                <!-- for branch -->
                <td
                  class="text-center quantityConfirm d-print-none"
                  v-if="
                    userRole == 'branch' && orderDetails.status == 'processing'
                  "
                >
                  <VTextField
                    v-model="quantityConfirm[index]"
                    persistent-placeholder
                    placeholder="Qty confirm"
                    type="number"
                    class=""
                    :disabled="
                      orderDetails.status != 'processing' ? true : false
                    "
                  />
                </td>
                <td
                  class="text-center d-print-none"
                  v-if="
                    userRole == 'branch' && orderDetails.status == 'processing'
                  "
                >
                  <VBtn
                    icon="ic:baseline-send"
                    variant="text"
                    size="24"
                    @click="
                      storeQuantityConfirm(item, quantityConfirm[index], index)
                    "
                    :disabled="
                      orderDetails.status != 'processing' ? true : false
                    "
                  />
                </td>
                <!-- end for branch -->

                <td class="d-print-none">
                  <VRating
                    hover
                    v-model="item.rate"
                    color="warning"
                    @change="changeRate(item, item.rate)"
                    :readonly="
                      userRole == 'branch' &&
                      orderDetails.status == 'processing'
                        ? false
                        : true
                    "
                  />
                </td>
              </tr>
            </tbody>
          </VTable>

          <!-- show btn to proccess the order in warehouse  -->
          <VRow
            class="flex-row-reverse mr-2 my-5 d-print-none"
            v-if="userRole == 'warehouse' && orderDetails.status == 'pending'"
          >
            <VDialog v-model="isDialogVisible" max-width="600">
              <!-- Dialog Activator -->
              <template #activator="{ props }">
                <VBtn
                  v-bind="props"
                  prepend-icon="tabler-send"
                  class="mr-3"
                  :disabled="orderDetails.status != 'pending' ? true : false"
                >
                  <!-- !isAllFilled() -->
                  Proccess
                </VBtn>
              </template>

              <!-- Dialog close btn -->
              <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />

              <!-- Dialog Content -->
              <VCard title="Select Carrier">
                <VCardText>
                  <VRow>
                    <VCol cols="12" sm="6">
                      <VAutocomplete
                        v-model="selectedCarrier"
                        :items="carriers"
                        item-title="name"
                        item-value="id"
                        label="Select"
                        persistent-hint
                        return-object
                        single-line
                        rounded
                        filled
                        solo-inverted
                        class="ml-2"
                        :rules="[requiredValidator]"
                      />
                      <span
                        v-if="isCarrierSelected"
                        class="text-danger ml-2"
                        type="error"
                      >
                        Please choose a carrier</span
                      >
                    </VCol>
                  </VRow>
                </VCardText>

                <VCardText class="d-flex justify-end flex-wrap gap-3">
                  <VBtn
                    variant="tonal"
                    color="secondary"
                    @click="isDialogVisible = false"
                  >
                    Close
                  </VBtn>
                  <VBtn @click="isProcessing()"> Save </VBtn>
                </VCardText>
              </VCard>
            </VDialog>
          </VRow>

          <!-- show btn to complete the order in branch  -->
          <VRow
            class="flex-row-reverse mr-2 my-5 d-print-none"
            v-if="userRole == 'branch' && orderDetails.status == 'processing'"
          >
            <VBtn
              prepend-icon="tabler-send"
              class="mr-3"
              @click="completedOrder()"
              :disabled="orderDetails.status != 'processing' ? true : false"
            >
              Complete
            </VBtn>
          </VRow>
          <VRow
            class="flex-row-reverse mr-2 my-5 d-print-none"
            v-if="userRole == 'branch'"
          >
            <p class="mb-2">
              <span></span>
              <VBtn
                color="info"
                prepend-icon="tabler-arrow-back-up"
                class="mr-3"
                :to="{
                  name: 'laffah-orders-return-id',
                  params: { id: orderDetails.id },
                }"
              >
              </VBtn>
            </p>
          </VRow>
          <VDivider class="my-5" />

          <VRow class="my-7 d-print-none">
            <VCol cols="12" md="7" class="ml-2">
              <VTextarea label="Comment" v-model="comment" rows="2" />
            </VCol>
            <VCol cols="12" md="3" class="">
              <VBtn
                block
                prepend-icon="tabler-send"
                class="mb-2"
                :disabled="!comment"
                @click="addMessage()"
              >
                Send
              </VBtn>
            </VCol>
          </VRow>

          <VCardText>
            <div
              class="d-flex align-center mb-1 pb-2 border-bottom"
              v-for="comment in listComments"
              :key="comment.id"
            >
              <VAvatar variant="tonal" color="success" class="me-3" size="38">
                <span>{{ avatarText(comment.user.name) }}</span>
              </VAvatar>

              <div class="d-flex flex-column">
                <h6 class="text-base">
                  <h4 class="font-weight-medium user-list-name">
                    <span>{{ comment.user.name }}</span>
                    <span class="ml-1 text-sm text-disabled">
                      {{ convertCreated(comment.created_at) }}</span
                    >
                  </h4>
                </h6>
                <span class="text-md">{{ comment.message }}</span>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </section>
</template>

<style lang="scss">
@media print {
  .v-application {
    background: none !important;
  }

  @page {
    margin: 0;
    size: landscape;
  }
  table {
    width: 100%;
    overflow-x: visible !important;
  }

  .layout-page-content,
  .v-row,
  .v-col-md-9 {
    padding: 0;
    margin: 0;
  }

  .product-buy-now {
    display: none;
  }

  .v-navigation-drawer,
  .layout-vertical-nav,
  .app-customizer-toggler,
  .layout-footer,
  .layout-navbar,
  .layout-navbar-and-nav-container {
    display: none;
  }

  .v-card {
    box-shadow: none !important;

    .print-row {
      flex-direction: row !important;
    }
  }

  .layout-content-wrapper {
    padding-inline-start: 0 !important;
  }
}
</style>
<style>
/* .v-text-field {
  width: 175px;
} */

/* .v-rating__item .v-btn {
  width: 2rem;
} */
.v-rating__item .v-btn--icon.v-btn--density-default {
  width: calc(var(--v-btn-height) + 0px);
}
</style>
<style scoped>
.text-danger {
  color: red;
}
.quantitySent,
.quantityConfirm {
  width: 11rem;
}
.border-bottom {
  border-bottom: solid 1px #e9e9eb;
}
.color-red {
  color: #d24552;
}
.color-blue {
  color: #698ed5;
}
</style>
