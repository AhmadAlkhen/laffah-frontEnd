<script setup>
import { useUserStore } from "@/views/laffah/auth/useUserStore";
import { useOrderListStore } from "@/views/laffah/orders/useOrderListStore";
import { useProductOrderStore } from "@/views/laffah/orders/useProductOrderStore";

import { avatarText } from "@core/utils/formatters";
import { computed } from "@vue/runtime-core";
import moment from "moment";
import Swal from "sweetalert2";
import axios from "axios";
import { useToast } from "vue-toastification";
const toast = useToast();

const route = useRoute();
const router = useRouter();

// import { auth } from "@/store/auth/index";
import { ref, onMounted } from "vue";

const userStore = useUserStore();
const orderListStore = useOrderListStore();
const productOrderStore = useProductOrderStore();
// const authStore = auth();

let cart = computed(function () {
  console.log(authStore.state.userData);
});

const searchQuery = ref("");
const selectedRole = ref();
const selectedPlan = ref();
const selectedStatus = ref(route.query.status || null);
const selectedBranch = ref();
const selectedIsApproved = ref();
const ordersDate = ref();
const rowPerPage = ref(10);
const currentPage = ref(1);
const totalPage = ref(1);
const totalOrders = ref(0);
const orders = ref([]);
const branches = ref([]);
const isLoading = ref(false);
const assignedTo = ref();
const overlay = ref(false);

const ordersDateFrom = ref();
const ordersDateTo = ref();

// 👉 Fetching orders
const fetchOrders = () => {
  isLoading.value = true;

  const params = {
    perPage: rowPerPage.value,
    page: currentPage.value,
  };
  if (selectedStatus.value) {
    params.status = selectedStatus.value;
  }
  if (selectedBranch.value) {
    params.branchId = selectedBranch.value;
  }
  if (selectedIsApproved.value) {
    params.isApproved = selectedIsApproved.value;
  }
  if (ordersDate.value) {
    params.ordersDate = ordersDate.value;
  }
  if (searchQuery.value) {
    params.q = searchQuery.value;
  }
  if (assignedTo.value || assignedTo.value == 0) {
    params.assignedTo = assignedTo.value;
  }
  if (ordersDateFrom.value) {
    params.ordersDateFrom = ordersDateFrom.value;
  }
  if (ordersDateTo.value) {
    params.ordersDateTo = ordersDateTo.value;
  }

  orderListStore
    .fetchOrders(params)
    .then((response) => {
      orders.value = response.data.data.data;
      totalPage.value = response.data.data.last_page;
      totalOrders.value = response.data.data.total;
      // totalPage.value = Math.round(totalOrders.value / rowPerPage.value);
    })
    .catch((err) => {
      console.log(err);
      toast.warning(err.response?.data?.message || err.message, {
        timeout: 2000,
      });
    })
    .finally(() => {
      isLoading.value = false;
    });
};
const convertCreated = (value) => {
  if (value) {
    return moment(value).format("YYYY-MM-DD");
  } else return null;
  // return moment(value).format("YYYY-MM-DD hh:mm");
};

const getUserRole = computed(() => {
  return userStore;
});

// onMounted(() => {
//   useUserStore();
// });

watchEffect(fetchOrders);

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

const AssignedToItems = [
  {
    value: 1,
    title: "Assigned",
  },
  {
    value: 0,
    title: "Not assigned",
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

const showManagerName = (name) => {
  Swal.fire({
    title: "Manager Name",
    text: name,
  });
};

const resolveUserStatusVariant = (stat) => {
  if (stat === "pending") return "warning";
  if (stat === "processing") return "success";
  if (stat === "completed") return "info";
  if (stat === "canceled") return "secondary";
  if (stat === "closed") return "secondary";

  return "primary";
};
const resolveIsApprovedVariant = (stat) => {
  if (stat === "suspended") return "secondary";
  if (stat === "yes") return "success";
  if (stat === "no") return "error";

  return "secondary";
};

// 👉 watching current page
watchEffect(() => {
  if (currentPage.value > totalPage.value) currentPage.value = totalPage.value;
});

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = orders.value.length
    ? (currentPage.value - 1) * rowPerPage.value + 1
    : 0;
  const lastIndex =
    orders.value.length + (currentPage.value - 1) * rowPerPage.value;

  return `Showing ${firstIndex} to ${lastIndex} of ${totalOrders.value} entries`;
});

const userRole = computed(() => {
  let data = localStorage.getItem("userRole");

  // console.log(localStorage.getItem("userRole"));
  return data;
});

const canceledOrder = (order_id) => {
  Swal.fire({
    title: "Are you sure?",
    text: "Do you really want to cancel this order?!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, confirm!",
  }).then((res) => {
    if (res.isConfirmed) {
      const status = "canceled";
      const orderId = order_id;
      axios
        .post("/order/status/canceled", { status, orderId })
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
          fetchOrders();
          // router.push({ name: "laffah-orders-MyOrders" });
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

const saveFiltersToLocalStorage = () => {
  localStorage.setItem(
    "filters",
    JSON.stringify({
      selectedStatus: selectedStatus.value,
      selectedBranch: selectedBranch.value,
      ordersDate: ordersDate.value,
      searchQuery: searchQuery.value,
      assignedTo: assignedTo.value,
      ordersDateFrom: ordersDateFrom.value,
      ordersDateTo: ordersDateTo.value,
    })
  );
};

const exportOrders = () => {
  overlay.value = true;

  const params = {};
  if (ordersDate.value && ordersDate.value !== "")
    params.orders_date = ordersDate.value;
  if (searchQuery.value && searchQuery.value !== "")
    params.q = searchQuery.value;
  if (selectedStatus.value && selectedStatus.value !== "")
    params.status = selectedStatus.value;
  if (selectedBranch.value && selectedBranch.value !== "")
    params.branchId = selectedBranch.value;
  if (selectedIsApproved.value && selectedIsApproved.value !== "")
    params.isApproved = selectedIsApproved.value;
  if (assignedTo.value || assignedTo.value === 0)
    params.assigned_to = assignedTo.value;

  if (ordersDateFrom.value || ordersDateFrom.value !== "")
    params.ordersDateFrom = ordersDateFrom.value;

  if (ordersDateTo.value || ordersDateTo.value !== "")
    params.ordersDateTo = ordersDateTo.value;

  axios
    .get("/order/my-orders/export", {
      params: params,
      responseType: "blob",
    })
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      const fileName = `Orders.xlsx`;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
    })
    .catch((err) => {
      console.log(err);
      toast.warning(err.response?.data?.message || err.message, {
        timeout: 2000,
      });
    })
    .finally(() => {
      overlay.value = false;
    });
};

onMounted(() => {
  const savedFilters = JSON.parse(localStorage.getItem("filters"));
  if (savedFilters) {
    selectedStatus.value = savedFilters.selectedStatus;
    selectedBranch.value = savedFilters.selectedBranch;
    ordersDate.value = savedFilters.ordersDate;
    searchQuery.value = savedFilters.searchQuery;
    assignedTo.value = savedFilters.assignedTo;
    ordersDateFrom.value = savedFilters.ordersDateFrom;
    ordersDateTo.value = savedFilters.ordersDateTo;
  }
});
watch(
  [selectedStatus, selectedBranch, ordersDate, searchQuery, assignedTo],
  () => {
    saveFiltersToLocalStorage();
  }
);
const resetFilters = () => {
  selectedStatus.value = null;
  selectedBranch.value = null;
  ordersDate.value = null;
  searchQuery.value = "";
  assignedTo.value = null;
  ordersDateFrom.value = null;
  ordersDateTo.value = null;
  localStorage.removeItem("filters");
};
</script>

<template>
  <section>
    <VOverlay v-model="overlay" class="align-center justify-center" persistent>
      <VProgressCircular
        color="primary"
        indeterminate
        size="64"
      ></VProgressCircular>
    </VOverlay>
    <VRow>
      <VCol cols="12">
        <VCard title="Search Filter">
          <!-- 👉 Filters -->

          <!-- <VDivider /> -->
          <!-- <VCardText class="d-flex flex-wrap py-4 gap-4"> -->
          <VSpacer />
          <VRow class="py-2 px-2" cols="12">
            <VCol lg="2" sm="6" cols="12">
              <!-- <div class="me-3" style="width: 80px"> -->
              <VSelect
                v-model="rowPerPage"
                density="compact"
                variant="outlined"
                :items="[10, 20, 30, 50]"
              />
              <!-- </div> -->
            </VCol>
            <VCol lg="2" sm="6" cols="12">
              <VSelect
                v-model="assignedTo"
                label="Select if assigned"
                :items="AssignedToItems"
                clearable
                clear-icon="tabler-x"
              />
            </VCol>
            <VCol lg="2" sm="6" cols="12">
              <VSelect
                v-model="selectedStatus"
                label="Select Status"
                :items="status"
                clearable
                clear-icon="tabler-x"
              />
            </VCol>
            <VCol lg="3" sm="6" cols="12">
              <AppDateTimePicker
                v-model="ordersDate"
                label="Order date"
                clearable
              />
            </VCol>

            <VCol
              lg="3"
              sm="6"
              cols="12"
              v-if="userRole == 'admin' || userRole == 'warehouse'"
            >
              <VSelect
                v-model="selectedBranch"
                label="Select branch"
                :items="branches"
                clearable
                clear-icon="tabler-x"
              />
            </VCol>
            <VCol
              lg="3"
              sm="6"
              cols="12"
              v-if="userRole == 'admin' || userRole == 'warehouse'"
            >
              <VSelect
                v-model="selectedIsApproved"
                label="is Approved"
                :items="[
                  { title: 'Suspended', value: 'suspended' },
                  { title: 'Yes', value: 'yes' },
                  { title: 'No', value: 'no' },
                ]"
                clearable
                clear-icon="tabler-x"
              />
            </VCol>
            <VCol class="" cols="12" md="3">
              <!-- 👉 Search  -->
              <div>
                <VTextField
                  v-model="searchQuery"
                  placeholder="Search by order ID"
                  density="compact"
                />
              </div>
            </VCol>

            <!-- <VCol md="3"> </VCol> -->
            <VCol class="" cols="12" md="3">
              <VBtn prepend-icon="tabler-filter-off" @click="resetFilters()">
                Reset
              </VBtn>
            </VCol>
          </VRow>
          <VRow class="py-2 px-2">
            <VCol
              cols="12"
              md="3"
              v-if="userRole == 'admin' || userRole == 'warehouse'"
            >
              <AppDateTimePicker
                v-model="ordersDateFrom"
                label="Orders date From"
                clearable
              />
            </VCol>
            <VCol
              cols="12"
              md="3"
              v-if="userRole == 'admin' || userRole == 'warehouse'"
            >
              <AppDateTimePicker
                v-model="ordersDateTo"
                label="Orders date To"
                clearable
              />
            </VCol>
            <VCol cols="12" md="3" v-if="userRole == 'admin'">
              <VBtn
                block
                prepend-icon="tabler-transfer-out"
                variant="tonal"
                color="info"
                class="mb-2"
                @click="exportOrders()"
              >
                Export
              </VBtn>
            </VCol>
          </VRow>
          <VDivider />

          <VTable class="text-no-wrap">
            <!-- 👉 table head -->
            <thead>
              <tr>
                <th scope="col">#ID</th>
                <th
                  scope="col"
                  v-if="userRole == 'admin' || userRole == 'warehouse'"
                >
                  User
                </th>
                <th
                  scope="col"
                  v-if="userRole == 'admin' || userRole == 'warehouse'"
                >
                  Branch
                </th>
                <th scope="col">Assign To</th>
                <th scope="col">Products Count</th>
                <th scope="col">Carrier</th>
                <th scope="col">STATUS</th>
                <th scope="col">Order Date</th>
                <th scope="col">Processing Date</th>
                <th scope="col">Completed Date</th>
                <th
                  scope="col"
                  v-if="userRole == 'admin' || userRole == 'manager'"
                >
                  Is Approved
                </th>
                <th scope="col">ACTIONS</th>
              </tr>
            </thead>
            <!-- 👉 table body -->
            <tbody>
              <tr
                v-for="order in orders"
                :key="order.id"
                style="height: 3.75rem"
              >
                <!-- 👉 Order ID -->
                <td>#{{ order.id }}</td>

                <!-- 👉 User name  if admin -->
                <td v-if="userRole == 'admin' || userRole == 'warehouse'">
                  <span class="text-capitalize text-base">{{
                    order.user.name
                  }}</span>
                </td>
                <!-- 👉 Branch name  if admin -->
                <td v-if="userRole == 'admin' || userRole == 'warehouse'">
                  <span class="text-capitalize text-base">{{
                    order.user.branch.name
                  }}</span>
                </td>

                <!-- 👉 Assign to branch name  -->
                <td>
                  <span class="text-capitalize text-base">{{
                    order.branch ? order.branch.name : "--"
                  }}</span>
                </td>

                <!-- 👉 Products Count -->
                <td>
                  <span class="text-capitalize text-base">{{
                    order.productsCount
                  }}</span>
                </td>

                <!-- 👉 Plan -->
                <!-- <td>
                  <span
                    class="text-capitalize text-base font-weight-semibold"
                    >{{ user.currentPlan }}</span
                  >
                </td> -->

                <!-- 👉 carrierId -->
                <td>
                  <span class="text-base" v-if="order.carrier">{{
                    order.carrier.name
                  }}</span>
                  <VChip
                    v-else
                    label
                    color="warning"
                    size="small"
                    class="text-capitalize"
                  >
                    Not assigned Yet
                  </VChip>
                </td>

                <!-- 👉 Status -->
                <td>
                  <VChip
                    label
                    :color="resolveUserStatusVariant(order.status)"
                    size="small"
                    class="text-capitalize"
                  >
                    {{ order.status }}
                  </VChip>
                </td>

                <!-- 👉 Created at -->
                <td>
                  <span class="text-base">{{
                    convertCreated(order.order_date)
                  }}</span>
                </td>

                <!-- 👉 Processing Date -->
                <td>
                  <span class="text-base">{{
                    convertCreated(order.processing_date)
                  }}</span>
                </td>

                <!-- 👉 Completed Date -->
                <td>
                  <span class="text-base">{{
                    convertCreated(order.completed_date)
                  }}</span>
                </td>

                <!-- 👉 is Approved -->
                <td v-if="userRole == 'admin' || userRole == 'manager'">
                  <VChip
                    v-if="order.isApproved"
                    label
                    :color="resolveIsApprovedVariant(order.isApproved)"
                    size="small"
                    @click="showManagerName(order.manager?.name)"
                  >
                    {{ order.isApproved }}
                  </VChip>
                </td>

                <!-- 👉 Actions -->
                <td class="text-center" style="width: 5rem">
                  <VBtn
                    v-if="userRole == 'branch'"
                    icon
                    size="x-small"
                    color="default"
                    variant="text"
                    @click="canceledOrder(order.id)"
                    :disabled="order.status != 'pending' ? true : false"
                  >
                    <VIcon size="22" icon="tabler-trash" />
                  </VBtn>
                  <VBtn
                    icon
                    variant="text"
                    color="default"
                    size="x-small"
                    :to="{
                      name: 'laffah-orders-preview-id',
                      params: { id: order.id },
                    }"
                  >
                    <VIcon :size="22" icon="tabler-eye" />
                  </VBtn>
                </td>
              </tr>
            </tbody>

            <!-- 👉 table footer  -->
            <tfoot v-show="isLoading || orders.length === 0">
              <tr>
                <td colspan="7" class="text-center">
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
