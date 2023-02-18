<script setup>
import { useUserStore } from "@/views/laffah/auth/useUserStore";
import { useProductOrderStore } from "@/views/laffah/orders/useProductOrderStore";
import { avatarText } from "@core/utils/formatters";
import { computed } from "@vue/runtime-core";
import moment from "moment";
import axios from "axios";
import { useToast } from "vue-toastification";
const toast = useToast();
// import { auth } from "@/store/auth/index";
import { ref, onMounted } from "vue";

const userStore = useUserStore();
const productOrderStore = useProductOrderStore();
// const authStore = auth();

let cart = computed(function () {
  console.log(authStore.state.userData);
});

const searchQuery = ref();
const startFrom = ref();
const startTo = ref();

const selectedRole = ref();
const selectedPlan = ref();
const selectedStatus = ref();
const selectedBranch = ref();
const rowPerPage = ref(10);
const currentPage = ref(1);
const totalPage = ref(1);
const totalOrderProducts = ref(0);
const orderProducts = ref([]);
const branches = ref([]);
const isLoading = ref(false);

// 👉 Fetching orders
const fetchProductsOrder = () => {
  isLoading.value = true;
  productOrderStore
    .fetchProductsOrder({
      q: searchQuery.value,
      status: selectedStatus.value,
      perPage: rowPerPage.value,
      page: currentPage.value,
      branchId: selectedBranch.value,
      startFrom: startFrom.value,
      startTo: startTo.value,
    })
    .then((response) => {
      orderProducts.value = response.data.data.data;
      totalPage.value = response.data.data.last_page;
      totalOrderProducts.value = response.data.data.total;
      // totalPage.value = Math.round(totalOrders.value / rowPerPage.value);
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      isLoading.value = false;
    });
};
// const fetchBranches = () => {
//   productOrderStore
//     .fetchBranches({
//       perPage: 50,
//       page: 1,
//     })
//     .then((response) => {
//       branches.value = response.data.data.data;
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// };
const convertCreated = (value) => {
  return moment(value).format("YYYY-MM-DD");
};

const getUserRole = computed(() => {
  return userStore;
});

// export Products
const exportProducts = () => {
  const from = startFrom.value ? startFrom.value : "";
  const to = startTo.value ? startTo.value : "";

  axios
    .get("/order/products/export", {
      params: { from, to },
      responseType: "blob",
    })
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      const fileName = `Products-${from}_${to}.xlsx`;
      link.setAttribute("download", fileName);
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
      console.log(branchesAll);
      branches.value = branchesAll;
    })
    .catch((error) => {
      console.error(error);
    });
});

watchEffect(fetchProductsOrder);

// 👉 watching current page
watchEffect(() => {
  if (currentPage.value > totalPage.value) currentPage.value = totalPage.value;
});

// 👉 search filters
const roles = [
  {
    title: "Admin",
    value: "admin",
  },
  {
    title: "Author",
    value: "author",
  },
  {
    title: "Editor",
    value: "editor",
  },
  {
    title: "Maintainer",
    value: "maintainer",
  },
  {
    title: "Subscriber",
    value: "subscriber",
  },
];

const plans = [
  {
    title: "Basic",
    value: "basic",
  },
  {
    title: "Company",
    value: "company",
  },
  {
    title: "Enterprise",
    value: "enterprise",
  },
  {
    title: "Team",
    value: "team",
  },
];

const status = [
  {
    title: "Pending",
    value: "pending",
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
    title: "Closed",
    value: "closed",
  },
];

const resolveUserRoleVariant = (role) => {
  if (role === "subscriber")
    return {
      color: "warning",
      icon: "tabler-user",
    };
  if (role === "author")
    return {
      color: "success",
      icon: "tabler-circle-check",
    };
  if (role === "maintainer")
    return {
      color: "primary",
      icon: "tabler-chart-pie-2",
    };
  if (role === "editor")
    return {
      color: "info",
      icon: "tabler-pencil",
    };
  if (role === "admin")
    return {
      color: "secondary",
      icon: "tabler-device-laptop",
    };

  return {
    color: "primary",
    icon: "tabler-user",
  };
};

const resolveUserStatusVariant = (stat) => {
  if (stat === "pending") return "warning";
  if (stat === "processing") return "success";
  if (stat === "closed") return "secondary";

  return "primary";
};

// 👉 watching current page
watchEffect(() => {
  if (currentPage.value > totalPage.value) currentPage.value = totalPage.value;
});

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = orderProducts.value.length
    ? (currentPage.value - 1) * rowPerPage.value + 1
    : 0;
  const lastIndex =
    orderProducts.value.length + (currentPage.value - 1) * rowPerPage.value;

  return `Showing ${firstIndex} to ${lastIndex} of ${totalOrderProducts.value} entries`;
});

const userRole = computed(() => {
  let data = localStorage.getItem("userRole");

  // console.log(localStorage.getItem("userRole"));
  return data;
});

const subQty = (q1, q2) => {
  if (q2) {
    return q1 - q2;
  } else return "n/a";
};
</script>

<template>
  <section>
    <VRow>
      <VCol cols="12">
        <VCard title="Search Filter">
          <!-- 👉 Filters -->

          <!-- <VDivider /> -->
          <!-- <VCardText class="d-flex flex-wrap py-4 gap-4"> -->
          <VSpacer />
          <VRow class="py-2 px-2">
            <VCol md="3">
              <div class="me-3" style="width: 80px">
                <VSelect
                  v-model="rowPerPage"
                  density="compact"
                  variant="outlined"
                  :items="[10, 20, 30, 50]"
                />
              </div>
            </VCol>
            <VCol md="3"> </VCol>
            <VCol md="3">
              <VTextField
                v-model="searchQuery"
                placeholder="Search by product name"
                density="compact"
              />
            </VCol>
            <VCol md="3">
              <VSelect
                v-model="selectedStatus"
                label="Select Status"
                :items="status"
                clearable
                clear-icon="tabler-x"
              />
            </VCol>
          </VRow>
          <VRow class="py-2 px-2">
            <!-- <VCol md="3"> </VCol> -->
            <VCol md="3">
              <AppDateTimePicker v-model="startFrom" label="Start From" />
            </VCol>
            <VCol md="3">
              <AppDateTimePicker v-model="startTo" label="Start to" />
            </VCol>
            <VCol md="3" v-if="userRole == 'admin' || userRole == 'warehouse'">
              <VSelect
                v-model="selectedBranch"
                label="Select branch"
                :items="branches"
                clearable
                clear-icon="tabler-x"
              />
            </VCol>
            <VCol md="3" v-if="userRole == 'admin' || userRole == 'warehouse'">
              <VBtn
                block
                prepend-icon="tabler-icon"
                variant="tonal"
                color="info"
                class="mb-2"
                @click="exportProducts"
              >
                Export
              </VBtn>
            </VCol>
          </VRow>

          <!-- <div class="me-3" style="width: 250px"></div>
            <div
              class="app-user-search-filter d-flex align-center flex-wrap gap-4"
            >
               👉 Search  
              <div style="width: 10rem">
                <VTextField
                  v-model="searchQuery"
                  placeholder="Search"
                  density="compact"
                />
              </div>

               👉 Export button 
              <VBtn
                variant="tonal"
                color="secondary"
                prepend-icon="tabler-screen-share"
              >
                Export
              </VBtn>
            </div> -->
          <!-- </VCardText> -->

          <VDivider />
          <VTable class="text-no-wrap">
            <!-- 👉 table head -->
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Product</th>
                <th scope="col">Quantity</th>
                <th scope="col">Sent</th>
                <th scope="col">Confirm</th>
                <th scope="col">Return</th>
                <th scope="col">Total</th>
                <th scope="col">order Id</th>
                <th scope="col">Order Status</th>
                <th
                  scope="col"
                  v-if="userRole == 'admin' || userRole == 'warehouse'"
                >
                  Branch
                </th>
                <th scope="col">Created at</th>
                <!-- <th scope="col">ACTIONS</th> -->
              </tr>
            </thead>
            <!-- 👉 table body -->
            <tbody>
              <tr
                v-for="ordProduct in orderProducts"
                :key="ordProduct.id"
                style="height: 3.75rem"
              >
                <!-- 👉  ID -->
                <td>#{{ ordProduct.id }}</td>

                <!-- 👉 Products name -->
                <td>
                  <span class="text-capitalize text-base">{{
                    ordProduct.product.name
                  }}</span>
                </td>

                <!-- 👉 Quantity order -->
                <td>
                  <span class="text-capitalize text-base">{{
                    ordProduct.quantity
                  }}</span>
                </td>

                <!-- 👉 Quantity sent -->
                <td>
                  <span class="text-capitalize text-base">{{
                    ordProduct.quantity_sent
                  }}</span>
                </td>

                <!-- 👉 confirm sent -->
                <td>
                  <span class="text-capitalize text-base">{{
                    ordProduct.quantity_confirm
                  }}</span>
                </td>

                <!-- 👉 return sent -->
                <td>
                  <span class="text-capitalize text-base">{{
                    ordProduct.quantity_return
                  }}</span>
                </td>
                <!-- 👉 Total  -->
                <td>
                  <span class="text-capitalize text-base">{{
                    ordProduct.quantity_confirm - ordProduct.quantity_return ==
                    0
                      ? ""
                      : ordProduct.quantity_confirm - ordProduct.quantity_return
                  }}</span>
                </td>

                <!-- 👉 order ID -->
                <td>
                  <RouterLink
                    :to="{
                      name: 'laffah-orders-preview-id',
                      params: { id: ordProduct.order_id },
                    }"
                  >
                    <span class="text-capitalize text-base">{{
                      ordProduct.order_id
                    }}</span>
                  </RouterLink>
                </td>
                <!-- 👉 order Status -->
                <td>
                  <span class="text-capitalize text-base">{{
                    ordProduct.order.status
                  }}</span>
                </td>

                <!-- 👉 Branch -->
                <td v-if="userRole == 'admin' || userRole == 'warehouse'">
                  <span
                    class="text-capitalize text-base"
                    v-if="ordProduct.order.user.branch.name != undefined"
                    >{{ ordProduct.order.user.branch.name }}</span
                  >
                </td>

                <!-- 👉 Created at -->
                <td>
                  <span class="text-base">{{
                    convertCreated(ordProduct.created_at)
                  }}</span>
                </td>

                <!-- 👉 Actions -->
                <!-- <td class="text-center" style="width: 5rem">
                  <VBtn icon size="x-small" color="default" variant="text">
                    <VIcon size="22" icon="tabler-edit" />
                  </VBtn>

                  <VBtn icon size="x-small" color="default" variant="text">
                    <VIcon size="22" icon="tabler-trash" />
                  </VBtn>
                </td> -->
              </tr>
            </tbody>

            <!-- 👉 table footer  -->
            <tfoot v-show="isLoading || orderProducts.length === 0">
              <tr>
                <td colspan="8" class="text-center">
                  {{ isLoading ? "Loading..." : "No data available" }}
                </td>
              </tr>
            </tfoot>
          </VTable>

          <VDivider />

          <VCardText
            class="d-flex align-center flex-wrap justify-space-between gap-4 py-3 px-5"
          >
            <span class="text-sm text-disabled">
              {{ paginationData }}
            </span>

            <VPagination
              v-model="currentPage"
              size="small"
              :total-visible="5"
              :length="totalPage"
            />
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </section>
</template>

<style lang="scss">
.app-user-search-filter {
  inline-size: 31.6rem;
}

.text-capitalize {
  text-transform: capitalize;
}

.user-list-name:not(:hover) {
  color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));
}
</style>
