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
const quantityOrder = ref([]);
const quantitySent = ref([]);
const quantityConfirm = ref([]);
const quantityCount = ref();
const rating = ref([]);
const comment = ref("");
const listComments = ref([]);
const selectedCarrier = ref({ name: "", id: "" });
const carriers = ref([]);
const categories = ref([]);
const category = ref([]);
const searchQuery = ref("");
const isCarrierSelected = ref(false);
const isDialogVisible = ref(false);
const isAllQtySentFilled = ref(false);
const statusSelected = ref("");

const isEdit = ref(false);
const status = [
  {
    title: "Pending",
    value: "pending",
  },
  {
    title: "inProcess",
    value: "inProcess",
  },
  {
    title: "Processing",
    value: "processing",
  },
  {
    title: "Completed",
    value: "completed",
  },
  {
    title: "Returned",
    value: "returned",
  },
  {
    title: "Canceled",
    value: "Canceled",
  },
];
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
    // let categoriesSpec = [{ title: "All", value: "0" }];
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
  .catch((err) => {
    console.log(err);
    toast.warning(err.response?.data?.message || err.message, {
      timeout: 2000,
    });
  });

orderListStore.fetchCarriers().then((res) => {
  carriers.value = res.data.data;
});

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

// Store the Quantity(quantity) that order from the branch / admin
const storeQuantityOrder = (item, qtyOrder, index) => {
  const id = item.id;
  const quantity = qtyOrder;

  axios
    .post("/order/quantity/order", { id, quantity })
    .then((res) => {
      if (res.status != 200) {
        toast.warning(res.data.message, {
          timeout: 2000,
        });
      } else {
        // if (category.value === undefined || category.value.value == 0) {
        if (category.value.length <= 0) {
          fetchOrders();
        }
        toast.success(res.data.message, {
          timeout: 2000,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      toast.warning(err.response?.data?.message || err.message, {
        timeout: 2000,
      });
    });
};
const handleOrderQuantityInput = (event, item, quaOrder, index) => {
  if (event.keyCode === 13) {
    storeQuantityOrder(item, quaOrder, index);
  }
};

// Store the Quantity(quantity_send) that send by the warehouse / admin
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
        if (category.value.length <= 0) {
          fetchOrders();
        }
        toast.success(res.data.message, {
          timeout: 2000,
        });
      }

      // fetchOrders();
      quantitySent.value[index] = "";
    })
    .catch((err) => {
      console.log(err);
      toast.warning(err.response?.data?.message || err.message, {
        timeout: 2000,
      });
    });
};
const handleSentQuantityInput = (event, item, quaSent, index) => {
  if (event.keyCode === 13) {
    storeQuantitySent(item, quaSent, index);
  }
};

// Store the Quantity(quantity_confirm) that confirm by the branch / admin
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
        if (category.value.length <= 0) {
          fetchOrders();
        }
        toast.success(res.data.message, {
          timeout: 2000,
        });
      }
      quantityConfirm.value[index] = "";
    })
    .catch((err) => {
      console.log(err);
      toast.warning(err.response?.data?.message || err.message, {
        timeout: 2000,
      });
    });
};
const handleConfirmQuantityInput = (event, item, quaConfirm, index) => {
  if (event.keyCode === 13) {
    storeQuantityConfirm(item, quaConfirm, index);
  }
};

// Store the Quantity(quantity_Return) that reurn from the branch by admin
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
        if (category.value.length <= 0) {
          fetchOrders();
        }
        toast.success(res.data.message, {
          timeout: 2000,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      toast.warning(err.response?.data?.message || err.message, {
        timeout: 2000,
      });
    });
};
const handleReturnQuantityInput = (event, item, quaReturn, index) => {
  if (event.keyCode === 13) {
    storeQuantityReturn(item, quaReturn, index);
  }
};

// changeRate by branch / admin
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
          timeout: 1000,
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

// delete product from the order by admin only
const deleteProduct = (id) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this product from the order?"
  );
  if (!confirmed) {
    return;
  }
  axios
    .delete(`/order/product/delete/${id}`)
    .then((res) => {
      if (res.status != 200) {
        toast.warning(res.data.message, {
          timeout: 2000,
        });
      } else {
        toast.success(res.data.message, {
          timeout: 2000,
        });
        fetchOrders();
      }
    })
    .catch((err) => {
      toast.warning(err.response?.data?.message || err.message, {
        timeout: 2000,
      });
    });
};

// update Order Date by admin
const updateOrderDate = (orderId, orderDate) => {
  // console.log(orderId);
  const order_date = orderDate;
  const order_id = orderId;
  axios
    .post("/order/date/update", { order_id, order_date })
    .then((res) => {
      if (res.status != 200) {
        toast.warning(res.data.message, {
          timeout: 2000,
        });
      } else {
        toast.success(res.data.message, {
          timeout: 1000,
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

// update order status by admin
const updtateOrderStatus = (orderId, orderStatus) => {
  const status = orderStatus;
  const order_id = orderId;
  axios
    .post("/order/status/update", { order_id, status })
    .then((res) => {
      if (res.status != 200) {
        toast.warning(res.data.message, {
          timeout: 2000,
        });
      } else {
        toast.success(res.data.message, {
          timeout: 1000,
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
// update carrier  by admin
const updtateOrderCarrier = (orderId, carrierId) => {
  console.log(orderId);
  console.log(carrierId);
  const carrier_id = carrierId.id;
  const order_id = orderId;
  axios
    .post("/order/carrier/update", { order_id, carrier_id })
    .then((res) => {
      if (res.status != 200) {
        toast.warning(res.data.message, {
          timeout: 2000,
        });
      } else {
        toast.success(res.data.message, {
          timeout: 1000,
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
    const processing_date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    axios
      .post("/order/status/processing", {
        status,
        orderId,
        carrier_id,
        processing_date,
      })
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
const inProcess = () => {
  const status = "inProcess";
  const orderId = orderDetails.value.id;
  axios
    .post("/order/status/inProcess", { status, orderId })
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
      fetchOrders();
      // router.replace({ name: "laffah-orders-MyOrders" });
    })
    .catch((err) => {
      console.log(err);
      toast.warning(err.response?.data?.message || err.message, {
        timeout: 2000,
      });
    });
};

const isAllFilled = () => {
  const allFilled = orderData.value.every(
    (element) => element.quantity_sent !== null
  );
  return allFilled;
};
const isAllFilledQuantConfirm = () => {
  const allFilled = orderData.value.every(
    (element) => element.quantity_confirm !== null
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
      const completed_date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

      axios
        .post("/order/status/completed", { status, orderId, completed_date })
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
    <VCard class="my-2 order-preview">
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
            color="success"
            class="mb-2"
            @click="printInvoice"
          >
            Print
          </VBtn>
        </VCol>
        <VCol cols="12" md="2" class="d-print-none" v-if="userRole == 'admin'">
          <VBtn
            block
            prepend-icon="tabler-screen-share"
            variant="tonal"
            color="info"
            class="mb-2"
            @click="exportOrder"
          >
            Export
          </VBtn>
        </VCol>
        <VCol cols="12" md="2" class="d-print-none" v-if="userRole == 'admin'">
          <!-- <VBtn
            block
            prepend-icon="tabler-edit"
            variant="tonal"
            color="danger"
            class="mb-2"
            @click="isEdit = !isEdit"
          >
            {{ !isEdit ? "Update" : "Done" }}
          </VBtn> -->
        </VCol>
        <VCol
          cols="12"
          md="2"
          class="d-print-none"
          v-if="userRole == 'warehouse' && orderDetails.status == 'pending'"
        >
          <VBtn
            block
            prepend-icon="tabler-analyze"
            variant="tonal"
            color="secondary"
            class="mb-2"
            @click="inProcess()"
          >
            In Process
          </VBtn>
        </VCol>
      </VRow>
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
              <p class="mb-0" v-if="orderDetails.branch != null">
                Assign to: # {{ orderDetails.branch.name }}
              </p>
              <p class="mb-0" v-if="orderDetails.carrier != null && !isEdit">
                Carrier: # {{ orderDetails.carrier.name }}
              </p>
              <div v-if="isEdit">
                <VAutocomplete
                  v-model="orderDetails.carrier"
                  :items="carriers"
                  item-title="name"
                  item-value="id"
                  label="Select Carrier"
                  persistent-hint
                  return-object
                  class="my-3"
                  :onUpdate:modelValue="
                    (newValue) => updtateOrderCarrier(orderDetails.id, newValue)
                  "
                />
              </div>
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
              <p class="mb-2" v-if="!isEdit">
                <span>Order date : </span>
                <span class="font-weight-semibold">{{
                  convertCreated(orderDetails.order_date)
                }}</span>
              </p>
              <div class="w-200 mb-1 d-flex align-items-center" v-else>
                <AppDateTimePicker
                  v-model="orderDetails.order_date"
                  label="Date Issued"
                  :config="{ enableTime: true, dateFormat: 'Y-m-d H:i' }"
                />
                <VIcon
                  size="22"
                  class="ml-1"
                  icon="tabler-refresh"
                  @click="
                    updateOrderDate(orderDetails.id, orderDetails.order_date)
                  "
                />
              </div>
              <!-- 👉 end Issue Date -->

              <!-- 👉 Processing Date -->
              <p class="mb-2 v" v-if="orderDetails.processing_date">
                <span>Processing date : </span>
                <span class="font-weight-semibold">{{
                  convertCreated(orderDetails.processing_date)
                }}</span>
              </p>

              <!-- 👉 Completed Date -->
              <p class="mb-2 v" v-if="orderDetails.processing_date">
                <span>Completed date : </span>
                <span class="font-weight-semibold">{{
                  convertCreated(orderDetails.completed_date)
                }}</span>
              </p>

              <!-- 👉 order status -->
              <p class="mb-2" v-if="!isEdit">
                <span>status: </span>
                <span class="font-weight-semibold">{{
                  orderDetails.status
                }}</span>
              </p>
              <div v-else class="my-3">
                <VSelect
                  v-model="orderDetails.status"
                  label="Select Status"
                  :items="status"
                  :onUpdate:modelValue="
                    (newValue) => updtateOrderStatus(orderDetails.id, newValue)
                  "
                />
              </div>
              <!-- 👉 end order status -->
            </div>
          </VCardText>
          <!-- !SECTION -->

          <!-- <VDivider /> -->

          <!-- 👉 Table -->
          <VDivider />
          <VTable fixed-header v-if="userRole == 'admin'">
            <thead>
              <tr>
                <th scope="col" class="d-print-none">ITEM</th>
                <th scope="col">Product</th>
                <th scope="col">Unit</th>
                <th scope="col">Quantity</th>
                <th scope="col">Sent</th>
                <th scope="col">Confirm</th>
                <th scope="col">Return</th>
                <th scope="col">Total</th>
                <th class="d-print-none" scope="col">Rate</th>
                <th class="d-print-none" scope="col" v-if="isEdit">Action</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(item, index) in orderDataNew" :key="item.id">
                <td class="text-no-wrap d-print-none" v-viewer>
                  <VImg
                    :src="item.product.image"
                    class="mt-1 rounded my-2"
                    width="80px"
                    height="80px"
                  />
                </td>
                <td class="text-no-wrap">
                  {{ item.product.name }}
                </td>
                <td class="text-no-wrap">
                  {{ item.product.unit }}
                </td>
                <td class="text-no-wrap" v-if="!isEdit">
                  {{ item.quantity }}
                </td>
                <td class="text-no-wrap" v-else>
                  <VTextField
                    v-model="item.quantity"
                    persistent-placeholder
                    placeholder="Qty Order"
                    type="number"
                    class="qtySent"
                    :min="0"
                    @keyup="
                      handleOrderQuantityInput(
                        $event,
                        item,
                        item.quantity,
                        index
                      )
                    "
                  />
                </td>
                <td class="text-no-wrap" v-if="!isEdit">
                  {{ item.quantity_sent }}
                </td>
                <td class="text-no-wrap" v-else>
                  <VTextField
                    v-model="item.quantity_sent"
                    persistent-placeholder
                    placeholder="Qty Sent"
                    type="number"
                    class="qtySent"
                    :min="0"
                    @keyup="
                      handleSentQuantityInput(
                        $event,
                        item,
                        item.quantity_sent,
                        index
                      )
                    "
                  />
                </td>
                <td class="text-no-wrap" v-if="!isEdit">
                  {{ item.quantity_confirm }}
                </td>
                <td class="text-no-wrap" v-else>
                  <VTextField
                    v-model="item.quantity_confirm"
                    persistent-placeholder
                    placeholder="Qty Confirm"
                    type="number"
                    class="qtySent"
                    :min="0"
                    @keyup="
                      handleConfirmQuantityInput(
                        $event,
                        item,
                        item.quantity_confirm,
                        index
                      )
                    "
                  />
                </td>
                <td class="text-no-wrap" v-if="!isEdit">
                  {{ item.quantity_return }}
                </td>
                <td class="text-no-wrap" v-else>
                  <VTextField
                    v-model="item.quantity_return"
                    persistent-placeholder
                    placeholder="Qty Return"
                    type="number"
                    class="qtySent"
                    :min="0"
                    @keyup="
                      handleReturnQuantityInput(
                        $event,
                        item,
                        item.quantity_return,
                        index
                      )
                    "
                  />
                </td>
                <td class="text-no-wrap">
                  {{
                    item.quantity_confirm - item.quantity_return == 0
                      ? ""
                      : item.quantity_confirm - item.quantity_return
                  }}
                </td>
                <td class="d-print-none">
                  <VRating
                    hover
                    v-model="item.rate"
                    color="warning"
                    @change="changeRate(item, item.rate)"
                    :readonly="!isEdit"
                  />
                </td>
                <td>
                  <VBtn
                    v-if="isEdit"
                    icon
                    size="x-small"
                    color="default"
                    variant="text"
                    @click="deleteProduct(item.id)"
                  >
                    <VIcon size="22" icon="tabler-trash" />
                  </VBtn>
                </td>
              </tr>
            </tbody>
          </VTable>
          <VTable fixed-header v-else>
            <thead>
              <tr>
                <th scope="col" class="d-print-none">ITEM</th>
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
                    userRole == 'warehouse' &&
                    (orderDetails.status == 'pending' ||
                      orderDetails.status == 'inProcess')
                  "
                >
                  Quantity Sent
                </th>
                <th
                  class="d-print-none"
                  scope="col"
                  v-if="
                    userRole == 'warehouse' &&
                    (orderDetails.status == 'pending' ||
                      orderDetails.status == 'inProcess')
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
                <td class="text-no-wrap d-print-none" v-viewer>
                  <VImg
                    :src="item.product.image"
                    class="mt-1 rounded my-2"
                    width="80px"
                    height="80px"
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
                    userRole == 'warehouse' &&
                    (orderDetails.status == 'pending' ||
                      orderDetails.status == 'inProcess')
                  "
                >
                  <VTextField
                    v-model="quantitySent[index]"
                    persistent-placeholder
                    placeholder="Qty Sent"
                    type="number"
                    class="qtySent"
                    :min="0"
                    :disabled="
                      orderDetails.status != 'pending' &&
                      orderDetails.status != 'inProcess'
                        ? true
                        : false
                    "
                    @keyup="
                      handleSentQuantityInput(
                        $event,
                        item,
                        quantitySent[index],
                        index
                      )
                    "
                  />
                </td>
                <td
                  class="text-center d-print-none"
                  v-if="
                    userRole == 'warehouse' &&
                    (orderDetails.status == 'pending' ||
                      orderDetails.status == 'inProcess')
                  "
                >
                  <VBtn
                    icon="ic:baseline-send"
                    variant="text"
                    size="24"
                    @click="storeQuantitySent(item, quantitySent[index], index)"
                    :disabled="
                      orderDetails.status != 'pending' &&
                      orderDetails.status != 'inProcess'
                        ? true
                        : false
                    "
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
                    class="qtyConfirm"
                    :min="0"
                    :disabled="
                      orderDetails.status != 'processing' ? true : false
                    "
                    @keyup="
                      handleConfirmQuantityInput(
                        $event,
                        item,
                        quantityConfirm[index],
                        index
                      )
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
            v-if="
              userRole == 'warehouse' &&
              (orderDetails.status == 'pending' ||
                orderDetails.status == 'inProcess')
            "
          >
            <VDialog v-model="isDialogVisible" max-width="600">
              <!-- Dialog Activator -->
              <template #activator="{ props }">
                <VBtn
                  v-bind="props"
                  prepend-icon="tabler-send"
                  class="mr-3"
                  :disabled="
                    (orderDetails.status == 'pending' ||
                      orderDetails.status == 'inProcess') &&
                    isAllFilled()
                      ? false
                      : true
                  "
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
              :disabled="
                orderDetails.status == 'processing' && isAllFilledQuantConfirm()
                  ? false
                  : true
              "
            >
              Complete
            </VBtn>
          </VRow>
          <VRow
            class="flex-row-reverse mr-2 my-5 d-print-none"
            v-if="userRole == 'branch' && orderDetails.status == 'completed'"
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

          <VCardText class="d-print-none">
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
.qtySent,
.qtyConfirm {
  grid-area: auto;
  width: 130px;
}
.w-200 {
  width: 200px;
  display: flex;
  align-items: center;
}
</style>
