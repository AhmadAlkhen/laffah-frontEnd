<script setup>
import { ref, onMounted } from "vue";

import AddNewUserDrawer from "@/views/laffah/users/AddNewUserDrawer.vue";
import UpdateUserDrawer from "@/views/laffah/users/UpdateUserDrawer.vue";
import { useUserListStore } from "@/views/laffah/users/useUserListStore";
import { avatarText } from "@core/utils/formatters";
import axios from "axios";
import { useToast } from "vue-toastification";
const toast = useToast();
const userListStore = useUserListStore();
const searchQuery = ref("");
const selectedRole = ref();
const selectedPlan = ref();
const selectedStatus = ref();
const rowPerPage = ref(10);
const currentPage = ref(1);
const totalPage = ref(1);
const totalUsers = ref(0);
const users = ref([]);
const branchesAll = ref([]);
const userData = ref({});
// 👉 Fetching users
const fetchUsers = () => {
  userListStore
    .fetchUsers({
      q: searchQuery.value,
      status: selectedStatus.value,
      role: selectedRole.value,
      perPage: rowPerPage.value,
      currentPage: currentPage.value,
    })
    .then((response) => {
      users.value = response.data.data.data;
      totalPage.value = response.data.data.last_page;
      totalUsers.value = response.data.data.total;
    })
    .catch((error) => {
      console.error(error);
    });
};

watchEffect(fetchUsers);

// 👉 watching current page
watchEffect(() => {
  if (currentPage.value > totalPage.value) currentPage.value = totalPage.value;
});

// 👉 search filters

const status = [
  {
    title: "Active",
    value: 1,
  },
  {
    title: "Inactive",
    value: 0,
  },
];
const roles = [
  {
    title: "Branch",
    value: "branch",
  },
  {
    title: "Warehouse",
    value: "warehouse",
  },
  {
    title: "Carrier",
    value: "carrier",
  },
];

const resolveUserRoleVariant = (role) => {
  if (role === "branch")
    return {
      color: "success",
      icon: "tabler-user",
    };
  if (role === "warehouse")
    return {
      color: "success",
      icon: "tabler-device-laptop",
    };

  return {
    color: "primary",
    icon: "tabler-user",
  };
};

const resolveUserStatusVariant = (stat) => {
  if (stat == 1) return "success";
  if (stat == 0) return "warning";

  return "primary";
};

const convertStatus = (status) => {
  if (status == 1) return "Active";
  if (status == 0) return "Inactive";

  return "Active";
};

const isAddNewUserDrawerVisible = ref(false);
const isUpdateUserDrawerVisible = ref(false);

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = users.value.length
    ? (currentPage.value - 1) * rowPerPage.value + 1
    : 0;
  const lastIndex =
    users.value.length + (currentPage.value - 1) * rowPerPage.value;

  return `Showing ${firstIndex} to ${lastIndex} of ${totalUsers.value} entries`;
});

const addNewUser = (userData) => {
  userListStore.addUser(userData).then(() => {
    toast.success("User added successfully", {
      timeout: 2000,
    });
  });

  // refetch Branchs
  fetchUsers();
};

const getUser = (userId) => {
  userListStore.getUser(userId).then((res) => {
    userData.value = res.data.data[0];
    isUpdateUserDrawerVisible.value = true;
  });
};
const updateUser = (userData) => {
  userListStore
    .updateUser(userData)
    .then(() => {
      toast.success("User added successfully", {
        timeout: 2000,
      });
      // refetch Branchs
      fetchUsers();
    })
    .catch((err) => {
      console.log(err.response.data.message);
      toast.error("check your values and try again!", {
        timeout: 2000,
      });
    });
};

// const branches = computed(() => {
//   let allBranches = [];
//   let branchesItem = [];
//   axios
//     .get("/branch/index")
//     .then((res) => {
//       allBranches = res.data.data.data;
//       allBranches.forEach((branch) => {
//         branchesItem.push({
//           title: branch.name,
//           value: branch.id,
//         });
//       });
//       branchesAll.value = branchesItem;
//       return branchesItem;
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

onMounted(() => {
  let allBranches = [];
  let branchesItem = [];
  axios
    .get("/branch/index")
    .then((res) => {
      allBranches = res.data.data.data;
      allBranches.forEach((branch) => {
        branchesItem.push({
          title: branch.name,
          value: branch.id,
        });
      });
      branchesAll.value = branchesItem;
      return branchesItem;
    })
    .catch((err) => {
      console.log(err);
    });
});
</script>

<template>
  <section>
    <VRow>
      <VCol cols="12">
        <VCard title="Search Filter">
          <!-- 👉 Filters -->
          <!-- <VCardText>
            <VRow>
               //👉 Select Status 
              <VCol cols="12" sm="4">
                <VSelect
                  v-model="selectedStatus"
                  label="Select Status"
                  :items="status"
                  clearable
                  clear-icon="tabler-x"
                />
              </VCol>
            </VRow>
          </VCardText> -->

          <!-- <VDivider /> -->
          <VCardText class="d-flex flex-wrap py-4 gap-4">
            <div class="me-3" style="width: 80px">
              <VSelect
                v-model="rowPerPage"
                density="compact"
                variant="outlined"
                :items="[10, 20, 30, 50]"
              />
            </div>

            <!-- 👉 Select Status -->
            <VSelect
              v-model="selectedStatus"
              label="Select Status"
              :items="status"
              clearable
              clear-icon="tabler-x"
            />

            <!-- 👉 Select Role -->
            <VSelect
              v-model="selectedRole"
              label="Select Role"
              :items="roles"
              clearable
              clear-icon="tabler-x"
            />

            <VSpacer />

            <div
              class="app-user-search-filter d-flex justify-content-end flex-wrap gap-4"
            >
              <!-- 👉 Search  -->
              <div style="width: 16rem">
                <VTextField
                  v-model="searchQuery"
                  placeholder="Search"
                  density="compact"
                />
              </div>

              <!-- 👉 Export button -->
              <!-- <VBtn
                variant="tonal"
                color="secondary"
                prepend-icon="tabler-screen-share"
              >
                Export
              </VBtn> -->

              <!-- 👉 Add user button -->
              <VBtn
                prepend-icon="tabler-plus"
                @click="isAddNewUserDrawerVisible = true"
              >
                Add New User
              </VBtn>
            </div>
          </VCardText>

          <VDivider />

          <VTable class="text-no-wrap">
            <!-- 👉 table head -->
            <thead>
              <tr>
                <th scope="col">User</th>
                <th scope="col">Branch</th>
                <th scope="col">Role</th>
                <th scope="col">STATUS</th>
                <th scope="col">ACTIONS</th>
              </tr>
            </thead>
            <!-- 👉 table body -->
            <tbody>
              <tr v-for="user in users" :key="user.id" style="height: 3.75rem">
                <!-- 👉 User -->
                <td>
                  <div class="d-flex align-center">
                    <VAvatar
                      variant="tonal"
                      :color="resolveUserRoleVariant(user.role).color"
                      class="me-3"
                      size="38"
                    >
                      <VImg v-if="user.avatar" :src="user.avatar" />
                      <span v-else>{{ avatarText(user.name) }}</span>
                    </VAvatar>

                    <div class="d-flex flex-column">
                      <h6 class="text-base">
                        <h3 class="font-weight-medium user-list-name">
                          {{ user.name }}
                        </h3>
                      </h6>
                      <span class="text-sm text-disabled">{{
                        user.email
                      }}</span>
                    </div>
                  </div>
                </td>

                <!-- 👉 branch -->
                <td>
                  <span
                    class="text-capitalize text-base font-weight-semibold"
                    >{{ user.branch.name }}</span
                  >
                </td>
                <!-- 👉 role -->
                <td>
                  <span
                    class="text-capitalize text-base font-weight-semibold"
                    >{{ user.role }}</span
                  >
                </td>

                <!-- 👉 Status -->
                <td>
                  <VChip
                    label
                    :color="resolveUserStatusVariant(user.status)"
                    size="small"
                    class="text-capitalize"
                  >
                    {{ convertStatus(user.status) }}
                  </VChip>
                </td>

                <!-- 👉 Actions -->
                <td class="text-center" style="width: 5rem">
                  <VBtn
                    icon
                    size="x-small"
                    color="default"
                    variant="text"
                    @click="getUser(user.id)"
                  >
                    <VIcon size="22" icon="tabler-edit" />
                  </VBtn>
                  <!-- 
                  <VBtn icon size="x-small" color="default" variant="text">
                    <VIcon size="22" icon="tabler-trash" />
                  </VBtn> -->

                  <!-- <VBtn icon size="x-small" color="default" variant="text">
                    <VIcon size="22" icon="tabler-dots-vertical" />
                  </VBtn> -->
                </td>
              </tr>
            </tbody>

            <!-- 👉 table footer  -->
            <tfoot v-show="!users.length">
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

    <!-- 👉 Add New user -->
    <AddNewUserDrawer
      v-model:isDrawerOpen="isAddNewUserDrawerVisible"
      :branches="branchesAll"
      @user-data="addNewUser"
    />
    <!-- 👉 update user -->
    <UpdateUserDrawer
      v-model:isDrawerOpen="isUpdateUserDrawerVisible"
      :branches="branchesAll"
      :user="userData"
      @user-data="updateUser"
    />
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
<style scoped>
.justify-content-end {
  justify-content: flex-end;
}
</style>
