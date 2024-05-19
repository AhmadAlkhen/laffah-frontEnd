<script setup>
import { ref, onMounted } from "vue";

import AddNewSupplierDrawer from "@/views/laffah/suppliers/AddNewSupplierDrawer.vue";
import UpdateSupplierDrawer from "@/views/laffah/suppliers/UpdateSupplierDrawer.vue";
import UpdateSupplierProductDrawer from "@/views/laffah/suppliers/UpdateSupplierProductDrawer.vue";
import { useSupplierListStore } from "@/views/laffah/suppliers/useSupplierListStore";
import { avatarText } from "@core/utils/formatters";
import axios from "axios";
import { useToast } from "vue-toastification";
const toast = useToast();
const supplierListStore = useSupplierListStore();
const searchQuery = ref("");
const selectedRole = ref();
const selectedPlan = ref();
const selectedStatus = ref();
const selectedIsCreator = ref();
const rowPerPage = ref(10);
const currentPage = ref(1);
const totalPage = ref(1);
const totalSuppliers = ref(0);
const suppliers = ref([]);
const branchesAll = ref([]);
const managersAll = ref([]);
const categories = ref([]);
const supplierData = ref({});
const supplierCategoryData = ref({});
const supplierProductData = ref({});
const isLoading = ref(false);
const supplier_Id = ref();
const isStore = ref(true);
const isStoreProducts = ref(true);

// 👉 Fetching suppliers
const fetchSuppliers = () => {
  isLoading.value = true;
  supplierListStore
    .fetchSuppliers({
      q: searchQuery.value,
      status: selectedStatus.value,
      perPage: rowPerPage.value,
      currentPage: currentPage.value,
    })
    .then((response) => {
      suppliers.value = response.data.data.data;
      totalPage.value = response.data.data.last_page;
      totalSuppliers.value = response.data.data.total;
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

watchEffect(fetchSuppliers);

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

const resolveSupplierStatusVariant = (stat) => {
  if (stat == 1) return "success";
  if (stat == 0) return "warning";

  return "primary";
};

const convertStatus = (status) => {
  if (status == 1) return "Active";
  if (status == 0) return "Inactive";

  return "Active";
};

const isAddNewSupplierDrawerVisible = ref(false);
const isUpdateSupplierDrawerVisible = ref(false);
const isUpdateSupplierProductDrawerVisible = ref(false);

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = suppliers.value.length
    ? (currentPage.value - 1) * rowPerPage.value + 1
    : 0;
  const lastIndex =
    suppliers.value.length + (currentPage.value - 1) * rowPerPage.value;

  return `Showing ${firstIndex} to ${lastIndex} of ${totalSuppliers.value} entries`;
});

const addNewSupplier = (supplierData) => {
  supplierListStore.addSupplier(supplierData).then(() => {
    toast.success("Supplier added successfully", {
      timeout: 2000,
    });
  });

  // refetch Branchs
  fetchSuppliers();
};

const getSupplier = (supplierId) => {
  supplierListStore.getSupplier(supplierId).then((res) => {
    supplierData.value = res.data.data[0];
    isUpdateSupplierDrawerVisible.value = true;
  });
};

const getSupplierProducts = (supplierId) => {
  let supplierProducts = [];
  let supplierProductsAll = [];
  let supplierProductsObj = {};
  supplierListStore.getSupplierProduct(supplierId).then((res) => {
    supplierProductsAll = res.data.data;

    supplierProductsAll.forEach((el) => {
      supplierProducts.push({ tilte: el.product.name, value: el.product.id });
    });

    supplierProductsObj.data = supplierProducts;
    supplierProductData.value = supplierProductsObj;
    isStoreProducts.value = supplierProductsAll.length > 0 ? false : true;
    supplier_Id.value = supplierId;
    isUpdateSupplierProductDrawerVisible.value = true;
  });
};
const updateSupplier = (supplierData) => {
  supplierListStore
    .updateSupplier(supplierData)
    .then(() => {
      toast.success("Supplier added successfully", {
        timeout: 2000,
      });
      // refetch Branchs
      fetchSuppliers();
    })
    .catch((err) => {
      console.log(err.response.data.message);
      toast.error("check your values and try again!", {
        timeout: 2000,
      });
    });
};

// delete supplier
const deleteSupplier = (id) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this supplier?"
  );
  if (!confirmed) {
    return;
  }
  supplierListStore
    .deleteSupplier(id)
    .then((res) => {
      toast.success(res.data.message, {
        timeout: 2000,
      });
      fetchSuppliers();
    })
    .catch((err) => {
      toast.warning(err.response?.data?.message || err.message, {
        timeout: 2000,
      });
    });
};
</script>

<template>
  <section>
    <VRow>
      <VCol cols="12">
        <VCard title="Search Filter">
          <!-- 👉 Filters -->

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
              <!-- 👉 Add supplier button -->
              <VBtn
                prepend-icon="tabler-plus"
                @click="isAddNewSupplierDrawerVisible = true"
              >
                Add New Supplier
              </VBtn>
            </VCol>
          </VRow>
          <VDivider />

          <VTable class="text-no-wrap">
            <!-- 👉 table head -->
            <thead>
              <tr>
                <th scope="col">Supplier</th>
                <th scope="col">Phone</th>
                <th scope="col">Type</th>
                <th scope="col">STATUS</th>
                <th scope="col">ACTIONS</th>
              </tr>
            </thead>
            <!-- 👉 table body -->
            <tbody>
              <tr
                v-for="supplier in suppliers"
                :key="supplier.id"
                style="height: 3.75rem"
              >
                <!-- 👉 Supplier -->
                <td>
                  <div class="d-flex align-center">
                    <VAvatar
                      variant="tonal"
                      color="info"
                      class="me-3"
                      size="38"
                    >
                      <VImg v-if="supplier.avatar" :src="supplier.avatar" />
                      <span v-else>{{ avatarText(supplier.name) }}</span>
                    </VAvatar>

                    <div class="d-flex flex-column">
                      <h6 class="text-base">
                        <h3 class="font-weight-medium supplier-list-name">
                          {{ supplier.name }}
                        </h3>
                      </h6>
                      <span class="text-sm text-disabled">{{
                        supplier.email
                      }}</span>
                    </div>
                  </div>
                </td>

                <!-- 👉 phone -->
                <td>
                  <span
                    class="text-capitalize text-base font-weight-semibold"
                    >{{ supplier.phone }}</span
                  >
                </td>

                <!-- 👉 type -->
                <td>
                  <span
                    class="text-capitalize text-base font-weight-semibold"
                    >{{ supplier.type }}</span
                  >
                </td>

                <!-- 👉 Status -->
                <td>
                  <VChip
                    label
                    :color="resolveSupplierStatusVariant(supplier.status)"
                    size="small"
                    class="text-capitalize"
                  >
                    {{ convertStatus(supplier.status) }}
                  </VChip>
                </td>

                <!-- 👉 Actions -->
                <td class="text-center" style="width: 5rem">
                  <VBtn
                    icon
                    size="x-small"
                    color="default"
                    variant="text"
                    @click="getSupplier(supplier.id)"
                  >
                    <VIcon size="22" icon="tabler-edit" />
                  </VBtn>
                  <VBtn
                    icon
                    size="x-small"
                    color="error"
                    variant="text"
                    @click="deleteSupplier(supplier.id)"
                  >
                    <VIcon size="22" icon="tabler-trash" />
                  </VBtn>

                  <VBtn
                    icon
                    size="x-small"
                    color="success"
                    variant="text"
                    @click="getSupplierProducts(supplier.id)"
                  >
                    <VIcon size="22" icon="tabler-topology-star-ring-3" />
                  </VBtn>
                </td>
              </tr>
            </tbody>

            <!-- 👉 table footer  -->
            <tfoot v-show="isLoading || suppliers.length === 0">
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

    <!-- 👉 Add New supplier -->
    <AddNewSupplierDrawer
      v-model:isDrawerOpen="isAddNewSupplierDrawerVisible"
      @supplier-data="addNewSupplier"
    />
    <!-- 👉 update supplier -->
    <UpdateSupplierDrawer
      v-model:isDrawerOpen="isUpdateSupplierDrawerVisible"
      :supplier="supplierData"
      @supplier-data="updateSupplier"
    />

    <!-- 👉 Update Supplier Product Drawer -->
    <UpdateSupplierProductDrawer
      v-if="isUpdateSupplierProductDrawerVisible"
      v-model:isDrawerOpen="isUpdateSupplierProductDrawerVisible"
      :supplierProduct="supplierProductData"
      :supplier="supplierData"
      :supplier_Id="supplier_Id"
      :isStore="isStoreProducts"
    />
  </section>
</template>

<style lang="scss">
.app-supplier-search-filter {
  inline-size: 31.6rem;
}

.text-capitalize {
  text-transform: capitalize;
}

.supplier-list-name:not(:hover) {
  color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));
}
</style>
<style scoped>
.justify-content-end {
  justify-content: flex-end;
}
</style>
