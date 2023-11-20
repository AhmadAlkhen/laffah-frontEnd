span
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

import { useProductOrderStore } from "@/views/laffah/orders/useProductOrderStore";
const productOrderStore = useProductOrderStore();

// Store
import { useOrderListStore } from "@/views/laffah/orders/useOrderListStore";
import axios from "axios";
import { name } from "vue-prism-component";
import { watch } from "@vue/runtime-core";
import Vue3Html2pdf from "vue3-html2pdf";

const orderListStore = useOrderListStore();
const route = useRoute();
const router = useRouter();

const orderData = ref();
const html2Pdf = ref(null);
const isDownloading = ref(false);
const isDownloadingOrder = ref(false);
const ordersData = ref([]);
const currentOrder = ref(null);
const ordersDate = ref();
const selectedBranch = ref();
const branches = ref([]);
const message = ref(null);
const messageOrder = ref(null);
const searchQuery = ref(null);

// const printOrder = () => {
//   isDownloading.value = true;

//   const order_id = searchQuery.value;
//   orderListStore
//     .fetchOrderToPrint(order_id)
//     .then((response) => {
//       ordersData.value = response.data.data;

//       if (ordersData.value.length < 1) {
//         toast.success("There are no orders to download it", {
//           timeout: 2000,
//         });
//         return Promise.resolve();
//       }
//     })
//     .then(() => {
//       html2Pdf.value.generatePdf();
//     })
//     .catch((err) => {
//       console.log(err);
//       toast.warning(err.response?.data?.message || err.message, {
//         timeout: 2000,
//       });
//     })
//     .finally(() => {
//       isDownloading.value = false;
//     });
// };
const printOrder = async () => {
  isDownloadingOrder.value = true;

  const order_id = searchQuery.value;
  try {
    const response = await orderListStore.fetchOrderToPrint(order_id);
    ordersData.value = response.data.data;
    if (ordersData.value.length < 1) {
      toast.success("There are no order to download it", {
        timeout: 2000,
      });
    } else {
      messageOrder.value =
        "There are " +
        ordersData.value.length +
        " order that will be downloaded";

      for (const order of ordersData.value) {
        orderData.value = order;
        await new Promise((resolve) => {
          setTimeout(() => {
            html2Pdf.value.generatePdf();
            resolve();
          }, 2000); // Delay of 1 second
        });
      }
    }
  } catch (err) {
    console.log(err);
    toast.warning(err.response?.data?.message || err.message, {
      timeout: 2000,
    });
  } finally {
    isDownloadingOrder.value = false;
    messageOrder.value = null;
  }
};

const printOrders = async () => {
  isDownloading.value = true;
  const orders_date = ordersDate.value;
  const branch_id = selectedBranch.value;
  const params = {
    orders_date: orders_date,
    branch_id: branch_id,
  };
  try {
    const response = await orderListStore.fetchOrdersToPrint(params);
    ordersData.value = response.data.data;
    if (ordersData.value.length < 1) {
      toast.success("There are no orders to download it", {
        timeout: 2000,
      });
    } else {
      message.value =
        "There are " +
        ordersData.value.length +
        " orders that will be downloaded";

      for (const order of ordersData.value) {
        orderData.value = order;
        await new Promise((resolve) => {
          setTimeout(() => {
            html2Pdf.value.generatePdf();
            resolve();
          }, 2000); // Delay of 1 second
        });
      }
    }
  } catch (err) {
    console.log(err);
    toast.warning(err.response?.data?.message || err.message, {
      timeout: 2000,
    });
  } finally {
    isDownloading.value = false;
    message.value = null;
  }
};

const convertCreated = (value) => {
  return moment(value).format("YYYY-MM-DD hh:mm");
};
const convertCreatedWithoutHour = (value) => {
  return moment(value).format("YYYY-MM-DD");
};

const userRole = computed(() => {
  let data = localStorage.getItem("userRole");
  return data;
});
const userName = computed(() => {
  let data = JSON.parse(localStorage.getItem("userData"));
  return data.name;
});

onMounted(() => {
  productOrderStore
    .fetchBranches({
      perPage: 50,
      page: 1,
    })
    .then((response) => {
      branches.value = response.data.data.data;
      let branchesAll = [];
      branches.value.forEach((element) => {
        branchesAll.push({ title: element.name, value: element.id });
      });
      // console.log(branchesAll);
      branches.value = branchesAll;
    })
    .catch((error) => {
      console.error(error);
    });
});
</script>

<template>
  <section>
    <VCard class="my-2 order-preview">
      <VRow class="my-1 ml-1">
        <VCol lg="3" sm="6" cols="12" class="d-print-none">
          <AppDateTimePicker v-model="ordersDate" label="Select Orders Date" />
        </VCol>
        <VCol lg="3" sm="6" cols="12">
          <VSelect
            v-if="userRole == 'admin'"
            v-model="selectedBranch"
            label="Select branch"
            :items="branches"
            clearable
            clear-icon="tabler-x"
          />
        </VCol>
        <VCol cols="12" md="2" class="d-print-none">
          <VBtn
            block
            prepend-icon="tabler-file-download"
            variant="tonal"
            color="primary"
            class="mb-2"
            @click="printOrders"
            :disabled="!ordersDate"
          >
            {{ isDownloading ? "PLease Wait..." : "Download PDF" }}
          </VBtn>
        </VCol>
        <VCol cols="12" md="3" class="d-print-none" v-if="message">
          <p class="message mt-1">{{ message }}</p>
        </VCol>
      </VRow>
      <VRow class="my-1 ml-1">
        <VCol lg="3" sm="6" cols="12">
          <VTextField
            v-model="searchQuery"
            placeholder="Print by order ID"
            density="compact"
          />
        </VCol>
        <VCol cols="12" md="2" class="d-print-none">
          <VBtn
            block
            prepend-icon="tabler-file-download"
            variant="tonal"
            color="primary"
            class="mb-2"
            @click="printOrder"
            :disabled="!searchQuery"
          >
            {{ isDownloadingOrder ? "PLease Wait..." : "Download PDF" }}
          </VBtn>
        </VCol>
        <VCol cols="12" md="3" class="d-print-none" v-if="messageOrder">
          <p class="message mt-1">{{ messageOrder }}</p>
        </VCol>
      </VRow>
    </VCard>
    <Vue3Html2pdf
      v-if="orderData"
      ref="html2Pdf"
      :enable-download="true"
      :manual-pagination="true"
      :preview-modal="false"
      :pdf-quality="2"
      pdf-format="a4"
      pdf-orientation="portrait"
      pdf-content-width="2480"
      :html-to-pdf-options="{
        filename:
          'Order#' +
          orderData.id +
          '__' +
          orderData.user.branch.name +
          '__' +
          convertCreatedWithoutHour(ordersDate),
        margin: [5, 1],
      }"
    >
      <!-- :filename="'Order#' + orderData.id + '__' + convertCreated(ordersDate)"  image: { type: 'jpeg', quality: 0.99 }, -->

      <template v-slot:pdf-content>
        <!-- <VRow> -->
        <!-- <VCol cols="12" md="12"> -->
        <VCard id="pdf-content">
          <!-- SECTION Header            v-for="orderData in ordersData"
          :key="orderData.id" -->
          <VCardText
            class="d-flex flex-wrap justify-space-between flex-column flex-sm-row print-row"
          >
            <!-- 👉 Left Content -->
            <div class="">
              <div class="d-flex align-center mb-6">
                <!-- 👉 Logo -->
                <VNodeRenderer :nodes="themeConfig.app.logo" class="me-3" />

                <!-- 👉 Title -->
                <h6 class="font-weight-bold text-xl color-red">
                  {{ themeConfig.app.title }}
                </h6>
              </div>
              <!-- 👉 Address -->
              <p class="mb-0">
                User: {{ orderData.user.name }}
                <span v-if="orderData.user.phone"
                  >, {{ orderData.user.phone }}</span
                >
              </p>
              <p class="mb-0">Branch: # {{ orderData.user.branch.name }}</p>
              <p class="mb-0" v-if="orderData.branch != null">
                Assign to: # {{ orderData.branch.name }}
              </p>
              <p class="mb-0" v-if="orderData.carrier != null">
                Carrier: # {{ orderData.carrier.name }}
                <span v-if="orderData.carrier.phone"
                  >, {{ orderData.carrier.phone }}</span
                >
              </p>
            </div>

            <!-- 👉 Right Content -->
            <div class="mt-4">
              <!-- 👉 Invoice ID -->
              <h6 class="font-weight-medium text-xl mb-6">
                Order #
                <span class="color-blue" color="primary"
                  >{{ orderData.id }}
                </span>
              </h6>

              <!-- 👉 Order Date -->
              <p class="mb-2">
                <span>Order date : </span>
                <span class="font-weight-semibold">{{
                  convertCreated(orderData.order_date)
                }}</span>
              </p>

              <!-- 👉 end Issue Date -->

              <!-- 👉 Processing Date -->
              <div>
                <p class="mb-2 v" v-if="orderData.processing_date">
                  <span>Processing date : </span>
                  <span class="font-weight-semibold">{{
                    convertCreated(orderData.processing_date)
                  }}</span>
                </p>
              </div>

              <!-- 👉 End Processing Date -->

              <!-- 👉 Completed Date -->
              <div>
                <p class="mb-2 v" v-if="orderData.completed_date">
                  <span>Completed date : </span>
                  <span class="font-weight-semibold">{{
                    convertCreated(orderData.completed_date)
                  }}</span>
                </p>
              </div>

              <!-- 👉End  Completed Date -->

              <!-- 👉 order status -->
              <p class="mb-2">
                <span>status: </span>
                <span class="font-weight-semibold">{{ orderData.status }}</span>
              </p>
            </div>
            <!-- 👉 end order status -->
          </VCardText>
          <!-- !SECTION -->

          <!-- <VDivider /> -->

          <!-- 👉 Table -->
          <VDivider />

          <VTable fixed-header class="VTableClass">
            <thead>
              <tr>
                <!-- <th scope="col" class="d-print-none">ITEM</th> -->
                <th scope="col">Product</th>
                <th scope="col">Unit</th>
                <th scope="col">Quantity</th>
                <th scope="col">Sent</th>
                <th scope="col">Confirm</th>
                <th scope="col">Return</th>
                <th scope="col">Total</th>
                <!-- <th class="d-print-none" scope="col">Rate</th> -->
              </tr>
            </thead>

            <tbody>
              <tr v-for="item in orderData.order_products" :key="item.id">
                <!-- <td class="text-no-wrap d-print-none" v-viewer>
                      <VImg
                        :src="item.product.image"
                        class="mt-1 rounded my-2"
                        width="80px"
                        height="80px"
                      />
                    </td> -->
                <td class="text-sm text-no-normal">
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

                <!-- <td class="d-print-none">
                      <VRating hover v-model="item.rate" color="warning" />
                    </td> -->
              </tr>
            </tbody>
          </VTable>

          <VDivider class="my-5" />

          <VCardText class="d-print-none">
            <div
              class="d-flex align-center mb-1 pb-2 border-bottom"
              v-for="comment in orderData.comment"
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
        <!-- </VCol> -->
        <!-- </VRow> -->
      </template>
    </Vue3Html2pdf>
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
<style scoped>
#pdf-content {
  margin: 0;
  padding: 0;
}

.text-no-normal {
  width: 200px;
  white-space: normal;
}

.message {
  color: #d24552;
}
</style>
