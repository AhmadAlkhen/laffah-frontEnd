<script setup>
import { ref, onMounted } from "vue";

import AddNewUserDrawer from "@/views/laffah/users/AddNewUserDrawer.vue";
import UpdateUserDrawer from "@/views/laffah/users/UpdateUserDrawer.vue";
import UpdateUserCategoryDrawer from "@/views/laffah/users/UpdateUserCategoryDrawer.vue";
import UpdateUserProductDrawer from "@/views/laffah/users/UpdateUserProductDrawer.vue";
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
const selectedIsCreator = ref();
const rowPerPage = ref(10);
const currentPage = ref(1);
const totalPage = ref(1);
const totalUsers = ref(0);
const users = ref([]);
const branchesAll = ref([]);
const managersAll = ref([]);
const categories = ref([]);
const userData = ref({});
const userCategoryData = ref({});
const userProductData = ref({});
const isLoading = ref(false);
const user_Id = ref();
const isStore = ref(true);
const isStoreProducts = ref(true);

// 👉 Fetching users
const fetchUsers = () => {
  isLoading.value = true;
  userListStore
    .fetchUsers({
      q: searchQuery.value,
      status: selectedStatus.value,
      role: selectedRole.value,
      perPage: rowPerPage.value,
      currentPage: currentPage.value,
      isCreator: selectedIsCreator.value,
    })
    .then((response) => {
      users.value = response.data.data.data;
      totalPage.value = response.data.data.last_page;
      totalUsers.value = response.data.data.total;
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

const selectedCountry = ref("");
const isDialogVisible = ref(false);

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
    title: "Admin",
    value: "admin",
  },
  {
    title: "Branch",
    value: "branch",
  },
  {
    title: "Warehouse",
    value: "warehouse",
  },
  {
    title: "Assistant",
    value: "assistant",
  },
  {
    title: "Helper",
    value: "helper",
  },
  {
    title: "Carrier",
    value: "carrier",
  },
  {
    title: "Manager",
    value: "manager",
  },
];

const isCreatorItems = [
  {
    title: "True",
    value: 1,
  },
  {
    title: "False",
    value: 0,
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
const isUpdateUserCategoryDrawerVisible = ref(false);
const isUpdateUserProductDrawerVisible = ref(false);

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
const getUserCategory = (userId) => {
  let userCategories = [];
  let userCategoriesAll = [];
  let userCategoriesObj = {};
  userListStore.getUserCategory(userId).then((res) => {
    userCategoriesAll = res.data.data;

    userCategoriesAll.forEach((el) => {
      userCategories.push({ tilte: el.category.name, value: el.category.id });
    });

    userCategoriesObj.data = userCategories;
    userCategoryData.value = userCategoriesObj;
    isStore.value = userCategoriesAll.length > 0 ? false : true;
    user_Id.value = userId;
    isUpdateUserCategoryDrawerVisible.value = true;
  });
};
const getUserProducts = (userId) => {
  let userProducts = [];
  let userProductsAll = [];
  let userProductsObj = {};
  userListStore.getUserProduct(userId).then((res) => {
    userProductsAll = res.data.data;

    userProductsAll.forEach((el) => {
      userProducts.push({ tilte: el.product.name, value: el.product.id });
    });

    userProductsObj.data = userProducts;
    userProductData.value = userProductsObj;
    isStoreProducts.value = userProductsAll.length > 0 ? false : true;
    user_Id.value = userId;
    isUpdateUserProductDrawerVisible.value = true;
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

const changeIsCreator = (userId, creator) => {
  const id = userId;
  const isCreator = creator;

  axios
    .post("/users/isCreator", { id, isCreator })
    .then(() => {
      toast.success("Changed successfully", {
        timeout: 1000,
      });
      // alert("added successfuly");
      // fetchOrders();
      // quantityConfirm.value[index] = "";
    })
    .catch((err) => {
      console.log(err);
    });
};

// delete user
const deleteUser = (id) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this user?"
  );
  if (!confirmed) {
    return;
  }
  userListStore
    .deleteUser(id)
    .then((res) => {
      toast.success(res.data.message, {
        timeout: 2000,
      });
      fetchUsers();
    })
    .catch((err) => {
      toast.warning(err.response?.data?.message || err.message, {
        timeout: 2000,
      });
    });
};

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

// get all users managers
onMounted(() => {
  axios
    .get("/users/managers")
    .then((res) => {
      managersAll.value = res.data.data;
      // console.log(managersAll.value);
    })
    .catch((err) => {
      console.log(err);
    });
});

onMounted(() => {
  let allCategories = [];
  let categoriesItem = [];
  axios
    .get("/category/index")
    .then((res) => {
      allCategories = res.data.data.data;
      allCategories.forEach((category) => {
        categoriesItem.push({
          text: category.name,
          value: category.id,
        });
      });
      // console.log(categoriesItem);

      categories.value = categoriesItem;
      return categoriesItem;
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
          <!-- 
          <VCardText class="d-flex flex-wrap py-4 gap-4">
            <div class="me-3" style="width: 80px">
              <VSelect
                v-model="rowPerPage"
                density="compact"
                variant="outlined"
                :items="[10, 20, 30, 50]"
              />
            </div>

            <VSelect
              v-model="selectedStatus"
              label="Select Status"
              :items="status"
              clearable
              clear-icon="tabler-x"
            />

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
              <div style="width: 16rem">
                <VTextField
                  v-model="searchQuery"
                  placeholder="Search"
                  density="compact"
                />
              </div>

              <VBtn
                prepend-icon="tabler-plus"
                @click="isAddNewUserDrawerVisible = true"
              >
                Add New User
              </VBtn>
            </div>
          </VCardText> -->

          <VRow class="py-4 mx-1" cols="12">
            <VCol class="" cols="12" md="2">
              <VSelect
                v-model="rowPerPage"
                density="compact"
                variant="outlined"
                :items="[10, 20, 30, 50]"
              />
            </VCol>
            <VCol class="" cols="12" md="2">
              <!-- 👉 Select Status -->
              <VSelect
                v-model="selectedStatus"
                label="Select Status"
                :items="status"
                clearable
                clear-icon="tabler-x"
              />
            </VCol>
            <VCol class="" cols="12" md="2">
              <!-- 👉 Select Role -->
              <VSelect
                v-model="selectedRole"
                label="Select Role"
                :items="roles"
                clearable
                clear-icon="tabler-x"
              />
            </VCol>
            <!-- 👉 Select isCreator -->
            <VCol class="" cols="12" md="2">
              <VSelect
                v-model="selectedIsCreator"
                label="Select isCreator"
                :items="isCreatorItems"
                clearable
                clear-icon="tabler-x"
              />
            </VCol>
            <VCol class="" cols="12" md="3">
              <!-- 👉 Search  -->
              <div>
                <VTextField
                  v-model="searchQuery"
                  placeholder="Search"
                  density="compact"
                />
              </div>
            </VCol>
            <VCol class="" cols="12" md="3">
              <!-- 👉 Add user button -->
              <VBtn
                prepend-icon="tabler-plus"
                @click="isAddNewUserDrawerVisible = true"
              >
                Add New User
              </VBtn>
            </VCol>
          </VRow>
          <VDivider />

          <VTable class="text-no-wrap">
            <!-- 👉 table head -->
            <thead>
              <tr>
                <th scope="col">User</th>
                <th scope="col">Phone</th>
                <th scope="col">Branch</th>
                <th scope="col">Role</th>
                <th scope="col">Is Creator</th>
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

                <!-- 👉 phone -->
                <td>
                  <span
                    class="text-capitalize text-base font-weight-semibold"
                    >{{ user.phone }}</span
                  >
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

                <!-- 👉 is Craetor -->
                <td>
                  <VSwitch
                    v-model="user.isCreator"
                    :true-value="1"
                    :false-value="0"
                    color="success"
                    @change="changeIsCreator(user.id, user.isCreator)"
                  />
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
                  <VBtn
                    icon
                    size="x-small"
                    color="default"
                    variant="text"
                    @click="deleteUser(user.id)"
                  >
                    <VIcon size="22" icon="tabler-trash" />
                  </VBtn>
                  <VBtn
                    v-if="user.role == 'branch' || user.role == 'assistant'"
                    icon
                    size="x-small"
                    color="default"
                    variant="text"
                    @click="getUserCategory(user.id)"
                  >
                    <VIcon size="22" icon="tabler-api-app" />
                  </VBtn>
                  <VBtn
                    v-if="user.role == 'helper'"
                    icon
                    size="x-small"
                    color="success"
                    variant="text"
                    @click="getUserProducts(user.id)"
                  >
                    <VIcon size="22" icon="tabler-topology-star-ring-3" />
                  </VBtn>

                  <!-- <VBtn icon size="x-small" color="default" variant="text">
                    <VIcon size="22" icon="tabler-dots-vertical" />
                  </VBtn> -->
                </td>
              </tr>
            </tbody>

            <!-- 👉 table footer  -->
            <tfoot v-show="isLoading || users.length === 0">
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

    <!-- 👉 Add New user -->
    <AddNewUserDrawer
      v-model:isDrawerOpen="isAddNewUserDrawerVisible"
      :branches="branchesAll"
      :managers="managersAll"
      @user-data="addNewUser"
    />
    <!-- 👉 update user -->
    <UpdateUserDrawer
      v-model:isDrawerOpen="isUpdateUserDrawerVisible"
      :branches="branchesAll"
      :managers="managersAll"
      :user="userData"
      @user-data="updateUser"
    />

    <!-- 👉 Update UserCategory Drawer -->
    <UpdateUserCategoryDrawer
      v-model:isDrawerOpen="isUpdateUserCategoryDrawerVisible"
      :userCategory="userCategoryData"
      :user="userData"
      :user_Id="user_Id"
      :isStore="isStore"
    />

    <!-- 👉 Update User Product Drawer -->
    <UpdateUserProductDrawer
      v-if="isUpdateUserProductDrawerVisible"
      v-model:isDrawerOpen="isUpdateUserProductDrawerVisible"
      :userProduct="userProductData"
      :user="userData"
      :user_Id="user_Id"
      :isStore="isStoreProducts"
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
