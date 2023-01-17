<script setup>
import { VNodeRenderer } from "@layouts/components/VNodeRenderer";
import { themeConfig } from "@themeConfig";
import moment from "moment";

import {
  alphaDashValidator,
  alphaValidator,
  betweenValidator,
  confirmedValidator,
  emailValidator,
  integerValidator,
  lengthValidator,
  passwordValidator,
  regexValidator,
  requiredValidator,
  urlValidator,
} from "@validators";
// Components

// Store
import { useOrderListStore } from "@/views/laffah/orders/useOrderListStore";
import axios from "axios";

const orderListStore = useOrderListStore();
const route = useRoute();
const orderData = ref([]);
const orderDetails = ref();
const quantitySent = ref([]);
const quantityCount = ref();
const comment = ref("");

// 👉 fetchInvoice
orderListStore
  .fetchOrder(Number(route.params.id))
  .then((response) => {
    orderData.value = response.data.data;
    orderDetails.value = response.data.order[0];
    quantityCount.value = response.data.data.length;
  })
  .catch((error) => {
    console.log(error);
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
    .then(() => {
      alert("added successfuly");
      fetchOrders();
      quantitySent.value[index] = "";
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
  return moment(value).format("YYYY-MM-DD");
};

const isProcessing = () => {
  const status = "processing";
  const orderId = orderDetails.value.id;
  axios
    .post("/order/status/processing", { status, orderId })
    .then(() => {
      alert("Done successfuly");
    })
    .catch((err) => {
      console.log(err);
    });
};
const userRole = computed(() => {
  let data = localStorage.getItem("userRole");
  return data;
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
                <th
                  scope="col"
                  v-if="userRole == 'admin' || userRole == 'warehouse'"
                >
                  Quantity Sent
                </th>
                <th
                  scope="col"
                  v-if="userRole == 'admin' || userRole == 'warehouse'"
                >
                  Action
                </th>
                <!-- <th scope="col" class="text-center">HOURS</th>
                <th scope="col" class="text-center">QTY</th>
                <th scope="col" class="text-center">TOTAL</th> -->
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
                <td
                  class="text-center"
                  v-if="userRole == 'admin' || userRole == 'warehouse'"
                >
                  <VTextField
                    v-model="quantitySent[index]"
                    persistent-placeholder
                    placeholder="Quantity Sent"
                    type="number"
                    class=""
                  />
                </td>
                <td
                  class="text-center"
                  v-if="userRole == 'admin' || userRole == 'warehouse'"
                >
                  <VIcon
                    size="24"
                    class="me-3"
                    icon="ic:baseline-send"
                    @click="storeQuantitySent(item, quantitySent[index], index)"
                  />
                </td>

                <!--
                    :rules="[requiredValidator]"
                   <td class="text-center">${{ item.price }}</td> -->
              </tr>
            </tbody>
          </VTable>

          <VDivider class="my-5" />
          <VRow v-if="userRole == 'admin' || userRole == 'warehouse'">
            <VCol cols="12" md="9" class="d-print-none"> </VCol>
            <VCol cols="12" md="2" class="d-print-none">
              <VBtn
                block
                prepend-icon="tabler-send"
                class="mb-2"
                @click="isProcessing()"
              >
                Proccess
              </VBtn>
            </VCol>
            <VDivider class="my-5" />
          </VRow>

          <!-- Total -->
          <!-- <VCardText
            class="d-flex justify-space-between flex-column flex-sm-row print-row"
          >
            <div class="my-2 mx-sm-4">
              <div class="d-flex align-center mb-1">
                <h6 class="text-sm font-weight-semibold me-1">Salesperson:</h6>
                <span>Jenny Parker</span>
              </div>
              <p>Thanks for your business</p>
            </div>

            <div class="my-2 mx-sm-4">
              <table>
                <tr>
                  <td class="text-end">
                    <div class="me-5">
                      <p class="mb-2">Subtotal:</p>
                      <p class="mb-2">Discount:</p>
                      <p class="mb-2">Tax:</p>
                      <p class="mb-2">Total:</p>
                    </div>
                  </td>

                  <td class="font-weight-semibold">
                    <p class="mb-2">$154.25</p>
                    <p class="mb-2">$00.00</p>
                    <p class="mb-2">$50.00</p>
                    <p class="mb-2">$204.25</p>
                  </td>
                </tr>
              </table>
            </div>
          </VCardText> -->

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
              >
                Send
              </VBtn>
            </VCol>
          </VRow>

          <VCardText>
            <div class="d-flex mx-sm-4">
              <h6 class="text-sm font-weight-semibold me-1">Note:</h6>
              <span
                >It was a pleasure working with you and your team. We hope you
                will keep us in mind for future freelance projects. Thank
                You!</span
              >
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
<style scoped>
/* .v-text-field {
  width: 175px;
} */
</style>
