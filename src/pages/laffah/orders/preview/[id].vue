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

// Store
import { useOrderListStore } from "@/views/laffah/orders/useOrderListStore";
import axios from "axios";

const orderListStore = useOrderListStore();
const route = useRoute();
const orderData = ref([]);
const orderDetails = ref();
const quantitySent = ref([]);
const quantityConfirm = ref([]);
const quantityCount = ref();
const rating = ref([]);
const comment = ref("");
const listComments = ref([]);
const selectedCarrier = ref({ name: "", id: "" });
const carriers = ref([]);
const isCarrierSelected = ref(false);
const isDialogVisible = ref(false);

const isAllQtySentFilled = ref(false);

// 👉 fetchInvoice
orderListStore
  .fetchOrder(Number(route.params.id))
  .then((response) => {
    orderData.value = response.data.data;
    orderDetails.value = response.data.order[0];
    quantityCount.value = response.data.data.length;
    listComments.value = response.data.comments;
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

// 👉 Print Invoice
const printInvoice = () => {
  window.print();
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
      .then(() => {
        isDialogVisible.value = false;
        toast.success("Done successfully", {
          timeout: 2000,
        });
        // router.push({ name: "laffah-orders-MyOrders" });
      })
      .catch((err) => {
        console.log(err);
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
        .post("/order/status", { status, orderId })
        .then((res) => {
          // if (res.data.OrderStatus > 0) {
          //   Swal.fire(
          //     "Done successfully!",
          //     "Your order has been completed.",
          //     "success"
          //   );
          // }

          toast.success(res.data.message, {
            timeout: 2000,
          });
          // router.push({ name: "laffah-orders-MyOrders" });
        })
        .catch((err) => {
          console.log(err);
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
      }
      fetchOrders();
      quantityConfirm.value[index] = "";
    })
    .catch((err) => {
      console.log(err);
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
</script>

<template>
  <section v-if="orderData && orderDetails">
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
                <h6 class="font-weight-bold text-xl">
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
                Order #{{ orderDetails.id }}
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

          <!-- 👉 Payment Details -->
          <!-- <VCardText class="d-flex justify-space-between flex-wrap flex-column flex-sm-row print-row">
            <div class="ma-sm-4">
              <h6 class="text-sm font-weight-semibold mb-3">
                Invoice To:
              </h6>
              <p class="mb-1">
                {{ invoiceData.client.name }}
              </p>
              <p class="mb-1">
                {{ invoiceData.client.company }}
              </p>
              <p class="mb-1">
                {{ invoiceData.client.address }}, {{ invoiceData.client.country }}
              </p>
              <p class="mb-1">
                {{ invoiceData.client.contact }}
              </p>
              <p class="mb-0">
                {{ invoiceData.client.companyEmail }}
              </p>
            </div>

            <div class="mt-4 ma-sm-4">
              <h6 class="text-sm font-weight-semibold mb-3">
                Bill To:
              </h6>
              <table>
                <tr>
                  <td class="pe-6">
                    Total Due:
                  </td>
                  <td>
                    {{ paymentDetails.totalDue }}
                  </td>
                </tr>
                <tr>
                  <td class="pe-6">
                    Bank Name:
                  </td>
                  <td>
                    {{ paymentDetails.bankName }}
                  </td>
                </tr>
                <tr>
                  <td class="pe-6">
                    Country:
                  </td>
                  <td>
                    {{ paymentDetails.country }}
                  </td>
                </tr>
                <tr>
                  <td class="pe-6">
                    IBAN:
                  </td>
                  <td>
                    {{ paymentDetails.iban }}
                  </td>
                </tr>
                <tr>
                  <td class="pe-6">
                    SWIFT Code:
                  </td>
                  <td>
                    {{ paymentDetails.swiftCode }}
                  </td>
                </tr>
              </table>
            </div>
          </VCardText> -->

          <!-- 👉 Table -->
          <VDivider />
          <VTable>
            <thead>
              <tr>
                <th scope="col">ITEM</th>
                <th scope="col">Product</th>
                <th scope="col">Unit</th>
                <th scope="col">Quantity</th>
                <th scope="col">Sent</th>
                <th scope="col">confirm</th>
                <th scope="col">return</th>
                <th
                  scope="col"
                  v-if="userRole == 'admin' || userRole == 'warehouse'"
                >
                  Quantity Sent
                </th>
                <th scope="col" v-if="userRole == 'branch'">Confirm Sent</th>
                <th scope="col">Action</th>
                <th scope="col">Rate</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(item, index) in orderData" :key="item.id">
                <td class="text-no-wrap">
                  <!-- <VAvatar
                    variant="tonal"
                    color="success"
                    class="me-3"
                    size="80"
                  > -->
                  <!-- <VImg v-if="user.avatar" :src="user.avatar" /> -->
                  <!-- <span v-else>{{ avatarText(user.name) }}</span> -->

                  <VImg
                    src="https://cdn.vuetifyjs.com/images/cards/cooking.png"
                    class="mt-1"
                    width="80px"
                  />
                  <!-- </VAvatar> -->
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
                <td
                  class="text-center quantitySent"
                  v-if="userRole == 'admin' || userRole == 'warehouse'"
                >
                  <VTextField
                    v-model="quantitySent[index]"
                    persistent-placeholder
                    placeholder="Qty Sent"
                    type="number"
                    class=""
                    :disabled="
                      orderDetails.status == 'completed' ? true : false
                    "
                  />
                </td>
                <td
                  class="text-center quantityConfirm"
                  v-if="userRole == 'branch'"
                >
                  <VTextField
                    v-model="quantityConfirm[index]"
                    persistent-placeholder
                    placeholder="Qty confirm"
                    type="number"
                    class=""
                    :disabled="item.quantity_sent ? false : true"
                  />
                </td>
                <td
                  class="text-center"
                  v-if="userRole == 'admin' || userRole == 'warehouse'"
                >
                  <VBtn
                    icon="ic:baseline-send"
                    variant="text"
                    size="24"
                    @click="storeQuantitySent(item, quantitySent[index], index)"
                    :disabled="orderDetails.status != 'pending' ? true : false"
                  />
                </td>
                <td class="text-center" v-if="userRole == 'branch'">
                  <VBtn
                    icon="ic:baseline-send"
                    variant="text"
                    size="24"
                    @click="
                      storeQuantityConfirm(item, quantityConfirm[index], index)
                    "
                    :disabled="
                      item.quantity_sent && orderDetails.status == 'processing'
                        ? false
                        : true
                    "
                  />
                </td>
                <td>
                  <VRating
                    hover
                    v-model="item.rate"
                    color="warning"
                    @change="changeRate(item, item.rate)"
                    :readonly="userRole == 'branch' ? false : true"
                  />
                </td>

                <!--
                    :rules="[requiredValidator]"
                   <td class="text-center">${{ item.price }}</td> -->
              </tr>
            </tbody>
          </VTable>

          <!-- show btn to proccess the order in warehouse  -->
          <VRow
            class="flex-row-reverse mr-2 my-5"
            v-if="userRole == 'admin' || userRole == 'warehouse'"
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
          <VRow class="flex-row-reverse mr-2 my-5" v-if="userRole == 'branch'">
            <VBtn
              prepend-icon="tabler-send"
              class="mr-3"
              @click="completedOrder()"
              :disabled="
                orderDetails.status == 'completed' ||
                orderDetails.status == 'returned' ||
                orderDetails.status == 'canceled'
              "
            >
              Complete
            </VBtn>
          </VRow>
          <VRow class="flex-row-reverse mr-2 my-5" v-if="userRole == 'branch'">
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

          <VRow class="my-7">
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
              class="d-flex align-center mb-1 pb-1 border-bottom"
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
                <span class="text-sm text-disabled">{{ comment.message }}</span>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <!-- <VCol cols="12" md="3" class="d-print-none">
        <VCard>
          <VCardText>
            👉 Send Invoice Trigger button
            <VBtn
              block
              prepend-icon="tabler-send"
              class="mb-2"
              @click="isSendPaymentSidebarVisible = true"
            >
              Send Invoice
            </VBtn>

            <VBtn
              block
              variant="tonal"
              color="secondary"
              class="mb-2"
              @click="printInvoice"
            >
              Print
            </VBtn>
          </VCardText>
        </VCard>
      </VCol> -->
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
    size: auto;
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
</style>
