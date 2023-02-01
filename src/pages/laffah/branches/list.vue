<script setup>
import AddNewBranchDrawer from "@/views/laffah/branchs/AddNewBranchDrawer.vue";
import UpdateBranchDrawer from "@/views/laffah/branchs/UpdateBranchDrawer.vue";
import { useBranchListStore } from "@/views/laffah/branchs/useBranchListStore";
import { avatarText } from "@core/utils/formatters";
import { useToast } from "vue-toastification";
const toast = useToast();
const branchListStore = useBranchListStore();
const searchQuery = ref("");
const selectedStatus = ref();
const rowPerPage = ref(10);
const currentPage = ref(1);
const totalPage = ref(1);
const totalBranchs = ref(0);
const branchs = ref([]);
const branchData = ref({});

// 👉 Fetching branchs
const fetchBranchs = () => {
  branchListStore
    .fetchBranchs({
      q: searchQuery.value,
      status: selectedStatus.value,
      perPage: rowPerPage.value,
      currentPage: currentPage.value,
    })
    .then((response) => {
      branchs.value = response.data.data.data;
      totalPage.value = response.data.data.last_page;
      totalBranchs.value = response.data.data.total;
    })
    .catch((error) => {
      console.error(error);
    });
};

watchEffect(fetchBranchs);

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

const isAddNewBranchDrawerVisible = ref(false);

const isUpdateBranchDrawerVisible = ref(false);

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = branchs.value.length
    ? (currentPage.value - 1) * rowPerPage.value + 1
    : 0;
  const lastIndex =
    branchs.value.length + (currentPage.value - 1) * rowPerPage.value;

  return `Showing ${firstIndex} to ${lastIndex} of ${totalBranchs.value} entries`;
});

const addNewBranch = (branchData) => {
  branchListStore.addBranch(branchData).then(() => {
    toast.success("Branch added successfully", {
      timeout: 2000,
    });
  });

  // refetch Branchs
  fetchBranchs();
};

const getBranch = (id) => {
  branchListStore.fetchBranch(id).then((res) => {
    branchData.value = res.data.data[0];
    console.log(branchData.value);
    isUpdateBranchDrawerVisible.value = true;
  });
};
const updateBranch = (branchData) => {
  branchListStore.updateBranch(branchData).then(() => {
    toast.success("Branch updated successfully", {
      timeout: 2000,
    });
  });
  // refetch Branchs
  fetchBranchs();
};
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
            <!-- <div class="me-3" style="width: 80px">
              <VSelect
                v-model="rowPerPage"
                density="compact"
                variant="outlined"
                :items="[10, 20, 30, 50]"
              />
            </div> -->

            <!-- 👉 Select Status -->
            <VSelect
              v-model="selectedStatus"
              label="Select Status"
              :items="status"
              clearable
              clear-icon="tabler-x"
            />

            <VSpacer />

            <div
              class="app-user-search-filter d-flex flex-wrap justify-content-end gap-4"
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
                @click="isAddNewBranchDrawerVisible = true"
              >
                Add New Branch
              </VBtn>
            </div>
          </VCardText>

          <VDivider />

          <VTable class="text-no-wrap">
            <!-- 👉 table head -->
            <thead>
              <tr>
                <th scope="col">#ID</th>
                <th scope="col">NAME</th>
                <th scope="col">STATUS</th>
                <th scope="col">ACTIONS</th>
              </tr>
            </thead>
            <!-- 👉 table body -->
            <tbody>
              <tr
                v-for="branch in branchs"
                :key="branch.id"
                style="height: 3.75rem"
              >
                <!-- 👉 ID -->
                <td>
                  <span
                    class="text-capitalize text-base font-weight-semibold"
                    >{{ branch.id }}</span
                  >
                </td>

                <!-- 👉 NAME -->
                <td>
                  <span
                    class="text-capitalize text-base font-weight-semibold"
                    >{{ branch.name }}</span
                  >
                </td>

                <!-- 👉 Status -->
                <td>
                  <VChip
                    label
                    :color="resolveUserStatusVariant(branch.status)"
                    size="small"
                    class="text-capitalize"
                  >
                    {{ convertStatus(branch.status) }}
                  </VChip>
                </td>

                <!-- 👉 Actions -->
                <td class="text-center" style="width: 5rem">
                  <VBtn
                    icon
                    size="x-small"
                    color="default"
                    variant="text"
                    @click="getBranch(branch.id)"
                  >
                    <VIcon size="22" icon="tabler-edit" />
                  </VBtn>

                  <!-- <VBtn icon size="x-small" color="default" variant="text">
                    <VIcon size="22" icon="tabler-trash" />
                  </VBtn> -->
                </td>
              </tr>
            </tbody>

            <!-- 👉 table footer  -->
            <tfoot v-show="!branchs.length">
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

    <!-- 👉 Add New Branch -->
    <AddNewBranchDrawer
      v-model:isDrawerOpen="isAddNewBranchDrawerVisible"
      @branch-data="addNewBranch"
    />

    <!-- 👉 Update Branch -->
    <UpdateBranchDrawer
      v-model:isDrawerOpen="isUpdateBranchDrawerVisible"
      @branch-data2="updateBranch"
      :branchData="branchData"
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
