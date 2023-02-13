<script setup>
import AddNewCategoryDrawer from "@/views/laffah/categories/AddNewCategoryDrawer.vue";
import UpdateCategoryDrawer from "@/views/laffah/categories/UpdateCategoryDrawer.vue";
import { useCategoryListStore } from "@/views/laffah/categories/useCategoryListStore";
import { avatarText } from "@core/utils/formatters";
import { useToast } from "vue-toastification";
const toast = useToast();
const categoryListStore = useCategoryListStore();
const searchQuery = ref("");
const selectedStatus = ref();
const rowPerPage = ref(10);
const currentPage = ref(1);
const totalPage = ref(1);
const totalCategories = ref(0);
const categories = ref([]);
const category = ref({});
const isLoading = ref(false);
// 👉 Fetching categories
const fetchCategories = () => {
  isLoading.value = true;
  categoryListStore
    .fetchCategories({
      q: searchQuery.value,
      status: selectedStatus.value,
      perPage: rowPerPage.value,
      currentPage: currentPage.value,
    })
    .then((response) => {
      categories.value = response.data.data.data;
      totalPage.value = response.data.data.last_page;
      totalCategories.value = response.data.data.total;
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      isLoading.value = false;
    });
};

watchEffect(fetchCategories);

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

const isAddNewCategoryDrawerVisible = ref(false);
const isUpdateCategoryDrawerVisible = ref(false);

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = categories.value.length
    ? (currentPage.value - 1) * rowPerPage.value + 1
    : 0;
  const lastIndex =
    categories.value.length + (currentPage.value - 1) * rowPerPage.value;

  return `Showing ${firstIndex} to ${lastIndex} of ${totalCategories.value} entries`;
});

const addNewCategory = (categoryData) => {
  categoryListStore.addCategory(categoryData).then(() => {
    toast.success("Category added successfully", {
      timeout: 2000,
    });
  });

  // refetch categories
  fetchCategories();
};

const getCategory = (id) => {
  categoryListStore.fetchCategory(id).then((res) => {
    category.value = res.data.data[0];
    console.log(category.value);
    isUpdateCategoryDrawerVisible.value = true;
  });
};
const updateCategory = (categoryData) => {
  categoryListStore.updateCategory(categoryData).then(() => {
    toast.success("Category updated successfully", {
      timeout: 2000,
    });
  });
  // refetch Categories
  fetchCategories();
};
</script>

<template>
  <section>
    <VRow>
      <VCol cols="12">
        <VCard title="Search Filter">
          <!-- 👉 Filters -->

          <!-- <VCardText class="d-flex flex-wrap py-4 gap-4">
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
                @click="isAddNewCategoryDrawerVisible = true"
              >
                Add New category
              </VBtn>
            </div>
          </VCardText> -->
          <VRow class="mx-1 my-1">
            <VCol cols="12" class="" md="3">
              <div class="" style="width: 80px">
                <VSelect
                  v-model="rowPerPage"
                  density="compact"
                  variant="outlined"
                  :items="[10, 20, 30, 50]"
                /></div
            ></VCol>
            <VCol cols="12" class="" md="3">
              <VSelect
                v-model="selectedStatus"
                label="Select Status"
                :items="status"
                clearable
                clear-icon="tabler-x"
              />
            </VCol>
            <VCol cols="12" class="" md="3">
              <div>
                <VTextField
                  v-model="searchQuery"
                  placeholder="Search"
                  density="compact"
                /></div
            ></VCol>
            <VCol cols="12" class="" md="3">
              <VBtn
                prepend-icon="tabler-plus"
                @click="isAddNewCategoryDrawerVisible = true"
              >
                Add New category
              </VBtn></VCol
            >
          </VRow>
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
                v-for="category in categories"
                :key="category.id"
                style="height: 3.75rem"
              >
                <!-- 👉 ID -->
                <td>
                  <span
                    class="text-capitalize text-base font-weight-semibold"
                    >{{ category.id }}</span
                  >
                </td>

                <!-- 👉 NAME -->
                <td>
                  <span
                    class="text-capitalize text-base font-weight-semibold"
                    >{{ category.name }}</span
                  >
                </td>

                <!-- 👉 Status -->
                <td>
                  <VChip
                    label
                    :color="resolveUserStatusVariant(category.status)"
                    size="small"
                    class="text-capitalize"
                  >
                    {{ convertStatus(category.status) }}
                  </VChip>
                </td>

                <!-- 👉 Actions -->
                <td class="text-center" style="width: 5rem">
                  <VBtn
                    icon
                    size="x-small"
                    color="default"
                    variant="text"
                    @click="getCategory(category.id)"
                  >
                    <VIcon size="22" icon="tabler-edit" />
                  </VBtn>

                  <!-- <VBtn icon size="x-small" color="default" variant="text">
                    <VIcon size="22" icon="tabler-trash" />
                  </VBtn>

                  <VBtn icon size="x-small" color="default" variant="text">
                    <VIcon size="22" icon="tabler-dots-vertical" />
                  </VBtn> -->
                </td>
              </tr>
            </tbody>

            <!-- 👉 table footer  -->
            <tfoot v-show="isLoading || categories.length === 0">
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

    <!-- 👉 Add New category -->
    <AddNewCategoryDrawer
      v-model:isDrawerOpen="isAddNewCategoryDrawerVisible"
      @category-data="addNewCategory"
    />

    <!-- 👉 update category -->
    <UpdateCategoryDrawer
      v-model:isDrawerOpen="isUpdateCategoryDrawerVisible"
      @category-data="updateCategory"
      :category="category"
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
