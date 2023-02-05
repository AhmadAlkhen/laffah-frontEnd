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
const selectedStatus = ref();
const selectedBranch = ref();
const rowPerPage = ref(10);
const currentPage = ref(1);
const totalPage = ref(1);
const totalOrders = ref(0);
const orders = ref([]);
const branches = ref([]);

// 👉 Fetching orders
const fetchOrders = () => {
  orderListStore
    .fetchOrders({
      q: searchQuery.value,
      status: selectedStatus.value,
      branchId: selectedBranch.value,
      perPage: rowPerPage.value,
      page: currentPage.value,
    })
    .then((response) => {
      orders.value = response.data.data.data;
      totalPage.value = response.data.data.last_page;
      totalOrders.value = response.data.data.total;
      // totalPage.value = Math.round(totalOrders.value / rowPerPage.value);
    })
    .catch((error) => {
      console.error(error);
    });
};
const convertCreated = (value) => {
  return moment(value).format("YYYY-MM-DD");
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
  if (stat === "completed") return "info";
  if (stat === "canceled") return "secondary";
  if (stat === "closed") return "secondary";

  return "primary";
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
          // router.push({ name: "laffah-orders-MyOrders" });
        })
        .catch((err) => {
          console.log(err);
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
      console.log(branchesAll);
      branches.value = branchesAll;
    })
    .catch((error) => {
      console.error(error);
    });
});
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
              <VSelect
                v-if="userRole == 'admin' || userRole == 'warehouse'"
                v-model="selectedBranch"
                label="Select branch"
                :items="branches"
                clearable
                clear-icon="tabler-x"
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

            <!-- <VCol md="3"> </VCol> -->
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
                <th scope="col">Products Count</th>
                <th scope="col">Carrier</th>
                <th scope="col">STATUS</th>
                <th scope="col">Created at</th>
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
                    convertCreated(order.created_at)
                  }}</span>
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
            <tfoot v-show="!orders.length">
              <tr>
                <td colspan="7" class="text-center">No data available</td>
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
