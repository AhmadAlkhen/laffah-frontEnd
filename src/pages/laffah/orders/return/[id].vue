<script setup>
import { VNodeRenderer } from "@layouts/components/VNodeRenderer";
import { themeConfig } from "@themeConfig";
import moment from "moment";
import Swal from "sweetalert2";
import { avatarText } from "@core/utils/formatters";
const router = useRouter();

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
const orderDataNew = ref([]);

const orderDetails = ref();
const quantitySent = ref([]);
const quantityReturn = ref([]);
const quantityCount = ref();
const rating = ref([]);
const comment = ref("");
const listComments = ref([]);

const category = ref([]);
const categories = ref([]);

const searchQuery = ref("");
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
    let categoriesSpec = [];
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

// const fetchOrders = () => {
//   orderListStore
//     .fetchOrder(Number(route.params.id))
//     .then((response) => {
//       orderData.value = response.data.data;
//     })
//     .catch((err) => {
//       console.log(err);
//       toast.warning(err.response?.data?.message || err.message, {
//         timeout: 2000,
//       });
//     });
// };
const fetchOrders = () => {
  orderListStore
    .fetchOrder(Number(route.params.id))
    .then((response) => {
      orderData.value = response.data.data;
      orderDataNew.value = response.data.data;
      orderDetails.value = response.data.order[0];
      quantityCount.value = response.data.data.length;
      listComments.value = response.data.comments;
    })
    .catch((err) => {
      console.log(err);
      toast.warning(err.response?.data?.message || err.message, {
        timeout: 2000,
      });
    });
};

// 👉 Print Invoice
const printInvoice = () => {
  window.print();
};

const storeQuantityReturn = (item, quaReturn, index) => {
  const id = item.id;
  const quantity_return = quaReturn;

  axios
    .post("/order/quantity/return", { id, quantity_return })
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
      quantityReturn.value[index] = "";
    })
    .catch((err) => {
      console.log(err);
    });
};
const handleReturnQuantityInput = (event, item, quaReturn, index) => {
  if (event.keyCode === 13) {
    // "Enter" key was pressed
    storeQuantityReturn(item, quaReturn, index);
  }
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

const isAllFilled = () => {
  const allFilled = orderData.value.every(
    (element) => element.quantity_sent !== null
  );
  return allFilled;
};

const returnedOrder = () => {
  Swal.fire({
    title: "Are you sure?",
    text: "Do you really want to return this order?!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, confirm!",
  }).then((res) => {
    if (res.isConfirmed) {
      const status = "returned";
      const orderId = orderDetails.value.id;
      axios
        .post("/order/status/returned", { status, orderId })
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
  if (category.value && category.value.length > 0) {
    orderDataNew.value = orderData.value;
    if (category.value.some((cat) => cat.value == 0)) {
      fetchOrders();
      // orderDataNew.value = orderData.value;
      // category.value = [{ title: "Select All", value: 0 }, ...categories.value];
      orderDataNew.value = orderData.value;
    } else {
      const selectedCategoryValues = category.value.map((cat) => cat.value);
      const newOrderData = orderData.value.filter((item) => {
        return selectedCategoryValues.includes(item.product.category_id);
      });
      orderDataNew.value = newOrderData;
    }
  } else {
    fetchOrders();
    orderDataNew.value = orderData.value;
  }
};
watch(
  () => category.value,
  () => {
    filterProductsByCategory();
  }
);

const filterProductsByProduct = () => {
  if (searchQuery.value) {
    orderDataNew.value = orderData.value;
    const searchWords = searchQuery.value.toLowerCase().split(" ");
    const newOrderData = orderData.value.filter((item) => {
      const productName = item.product.name.toLowerCase();
      return searchWords.every((word) => productName.includes(word));
    });
    orderDataNew.value = newOrderData;
  } else {
    orderDataNew.value = orderData.value;
  }
};
// watch the searchQuery input
watch(
  () => searchQuery.value,
  () => {
    filterProductsByProduct();
  }
);
</script>

<template>
  <section v-if="orderData && orderDetails">
    <VRow class="my-1 mx-1">
      <VCol cols="12" md="6" sm="12" class="d-print-none">
        <VAutocomplete
          v-model="category"
          :items="categories"
          item-title="title"
          item-value="value"
          label="Select category"
          persistent-hint
          return-object
          multiple
          clearable
        />
      </VCol>
      <VCol cols="12" md="6" sm="12" class="d-print-none">
        <VTextField
          v-model="searchQuery"
          prepend-inner-icon="tabler-search"
          label="Search"
          placeholder="Search"
        />
      </VCol>
    </VRow>
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
            </div>
          </VCardText>
          <!-- !SECTION -->

          <VDivider />

          <!-- 👉 Table -->
          <VDivider />
          <VTable>
            <thead>
              <tr>
                <th scope="col">ITEM</th>
                <th scope="col">Product</th>
                <th scope="col">Unit</th>
                <th scope="col">Quantity</th>
                <th scope="col">Confirm</th>
                <th scope="col">return</th>
                <th
                  scope="col"
                  v-if="
                    userRole == 'branch' && orderDetails.status == 'completed'
                  "
                >
                  return Sent
                </th>
                <th
                  scope="col"
                  v-if="
                    userRole == 'branch' && orderDetails.status == 'completed'
                  "
                >
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(item, index) in orderDataNew" :key="item.id">
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
                  {{ item.quantity_confirm }}
                </td>
                <td class="text-no-wrap">
                  {{ item.quantity_return }}
                </td>

                <td
                  class="text-center quantityConfirm"
                  v-if="
                    (userRole == 'branch') &
                    (orderDetails.status == 'completed')
                  "
                >
                  <VTextField
                    v-model="quantityReturn[index]"
                    persistent-placeholder
                    placeholder="Qty Returned"
                    type="number"
                    class="qtyReturn"
                    :min="0"
                    :disabled="
                      orderDetails.status != 'completed' ? true : false
                    "
                    @keyup="
                      handleReturnQuantityInput(
                        $event,
                        item,
                        quantityReturn[index],
                        index
                      )
                    "
                  />
                </td>
                <td
                  class="text-center"
                  v-if="
                    (userRole == 'branch') &
                    (orderDetails.status == 'completed')
                  "
                >
                  <VBtn
                    icon="ic:baseline-send"
                    variant="text"
                    size="24"
                    @click="
                      storeQuantityReturn(item, quantityReturn[index], index)
                    "
                    :disabled="
                      orderDetails.status != 'completed' ? true : false
                    "
                  />
                </td>
              </tr>
            </tbody>
          </VTable>

          <!-- show btn to complete the order  -->
          <VRow class="flex-row-reverse mr-2 my-5" v-if="userRole == 'branch'">
            <VBtn
              prepend-icon="tabler-send"
              class="mr-3"
              @click="returnedOrder()"
              :disabled="orderDetails.status != 'completed' ? true : false"
            >
              Return
            </VBtn>
          </VRow>

          <VDivider class="my-5" />

          <!-- Add Message -->
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
.qtyReturn {
  grid-area: auto;
  width: 130px;
}
</style>
