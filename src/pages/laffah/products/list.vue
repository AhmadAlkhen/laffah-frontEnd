<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import AddNewProductDrawer from "@/views/laffah/products/AddNewProductDrawer.vue";
import { useProductListStore } from "@/views/laffah/products/useProductListStore";
import { avatarText } from "@core/utils/formatters";
import { useToast } from "vue-toastification";
const toast = useToast();
const productListStore = useProductListStore();
const searchQuery = ref("");
const selectedStatus = ref();
const selectedCategory = ref();
const rowPerPage = ref(10);
const currentPage = ref(1);
const totalPage = ref(1);
const totalProducts = ref(0);
const products = ref([]);
const categoriesAll = ref([]);

const toggleSwitch = ref(1);

// 👉 Fetching products
const fetchProducts = () => {
  productListStore
    .fetchProducts({
      q: searchQuery.value,
      status: selectedStatus.value,
      perPage: rowPerPage.value,
      currentPage: currentPage.value,
      category: selectedCategory.value,
    })
    .then((response) => {
      products.value = response.data.data.data;
      totalPage.value = response.data.data.last_page;
      totalProducts.value = response.data.data.total;
    })
    .catch((error) => {
      console.error(error);
    });
};

watchEffect(fetchProducts);

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
const convertStatusBoolean = (status) => {
  if (status == 1) return true;
  if (status == 0) return false;

  return "Active";
};

const isAddNewProductDrawerVisible = ref(false);

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = products.value.length
    ? (currentPage.value - 1) * rowPerPage.value + 1
    : 0;
  const lastIndex =
    products.value.length + (currentPage.value - 1) * rowPerPage.value;

  return `Showing ${firstIndex} to ${lastIndex} of ${totalProducts.value} entries`;
});

const addNewProduct = (productData) => {
  productListStore
    .addProduct(productData)
    .then(() => {
      toast.success("product added successfully", {
        timeout: 2000,
      });
    })
    .catch((err) => {
      toast.warning(err.response.data.message, {
        timeout: 2000,
      });
    });

  // refetch products
  fetchProducts();
};

const changeStatus = (productId, statu) => {
  const id = productId;
  const status = statu;

  axios
    .post("/product/status", { id, status })
    .then(() => {
      // alert("added successfuly");
      // fetchOrders();
      // quantityConfirm.value[index] = "";
    })
    .catch((err) => {
      console.log(err);
    });
};

onMounted(() => {
  let allCategories = [];
  let categoryItem = [];
  axios
    .get("/category/index")
    .then((res) => {
      allCategories = res.data.data.data;
      allCategories.forEach((category) => {
        categoryItem.push({
          title: category.name,
          value: category.id,
        });
      });
      categoriesAll.value = categoryItem;
      return categoryItem;
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

          <VRow class="mx-1 my-1">
            <VCol cols="12" class="" md="2">
              <div class="" style="width: 80px">
                <VSelect
                  v-model="rowPerPage"
                  density="compact"
                  variant="outlined"
                  :items="[10, 20, 30, 50]"
                /></div
            ></VCol>
            <VCol cols="12" class="" md="2"></VCol>

            <VCol cols="12" class="" md="4">
              <div>
                <VTextField
                  v-model="searchQuery"
                  placeholder="Search"
                  density="compact"
                /></div
            ></VCol>
            <VCol cols="12" class="" md="4">
              <VBtn
                prepend-icon="tabler-plus"
                @click="isAddNewProductDrawerVisible = true"
              >
                Add New product
              </VBtn></VCol
            >
          </VRow>
          <VRow class="mx-1 my-1">
            <VCol cols="12" class="" md="4"> </VCol>
            <VCol cols="12" class="" md="4">
              <VSelect
                v-model="selectedStatus"
                label="Select Status"
                :items="status"
                clearable
                clear-icon="tabler-x"
              />
            </VCol>

            <VCol cols="12" class="" md="4">
              <VSelect
                v-model="selectedCategory"
                label="Select Category"
                :items="categoriesAll"
                clearable
                clear-icon="tabler-x"
              />
            </VCol>
          </VRow>
          <VDivider />

          <VTable class="text-no-wrap">
            <!-- 👉 table head -->
            <thead>
              <tr>
                <th scope="col">Product</th>
                <th scope="col">Unit</th>
                <th scope="col">Category</th>
                <th scope="col">STATUS</th>
                <th scope="col">ACTIONS</th>
              </tr>
            </thead>
            <!-- 👉 table body -->
            <tbody>
              <tr
                v-for="product in products"
                :key="product.id"
                style="height: 3.75rem"
              >
                <!-- 👉 Name && Sku -->
                <!-- <td>
                  <span
                    class="text-capitalize text-base font-weight-semibold"
                    >{{ product.id }}</span
                  >
                </td> -->

                <td>
                  <div class="d-flex align-center">
                    <VAvatar
                      variant="tonal"
                      color="primary"
                      class="me-3"
                      size="38"
                    >
                      <VImg v-if="product.avatar" :src="product.avatar" />
                      <span v-else>{{ avatarText(product.name) }}</span>
                    </VAvatar>

                    <div class="d-flex flex-column">
                      <h6 class="text-base">
                        <h3 class="font-weight-medium user-list-name">
                          {{ product.name }}
                        </h3>
                      </h6>
                      <span class="text-sm text-disabled">{{
                        product.sku
                      }}</span>
                    </div>
                  </div>
                </td>

                <!-- 👉 Unit -->
                <td>
                  <span class="text-capitalize text-base">{{
                    product.unit
                  }}</span>
                </td>
                <!-- 👉 Category -->
                <td>
                  <span class="text-capitalize text-base">{{
                    product.category.name
                  }}</span>
                </td>

                <!-- 👉 Status -->
                <td>
                  <!-- <VChip
                    label
                    :color="resolveUserStatusVariant(product.status)"
                    size="small"
                    class="text-capitalize"
                  >
                    {{ convertStatus(product.status) }}
                  </VChip> -->
                  <VSwitch
                    v-model="product.status"
                    :true-value="1"
                    :false-value="0"
                    color="success"
                    @change="changeStatus(product.id, product.status)"
                  />
                </td>

                <!-- 👉 Actions -->
                <td class="text-center" style="width: 5rem">
                  <VBtn icon size="x-small" color="default" variant="text">
                    <VIcon size="22" icon="tabler-edit" />
                  </VBtn>

                  <VBtn icon size="x-small" color="default" variant="text">
                    <VIcon size="22" icon="tabler-trash" />
                  </VBtn>

                  <VBtn icon size="x-small" color="default" variant="text">
                    <VIcon size="22" icon="tabler-dots-vertical" />

                    <!-- <VMenu activator="parent">
                      <VList>
                        <VListItem
                          title="View"
                          :to="{
                            name: 'apps-user-view-id',
                            params: { id: user.id },
                          }"
                        />
                        <VListItem title="Suspend" href="javascript:void(0)" />
                      </VList>
                    </VMenu> -->
                  </VBtn>
                </td>
              </tr>
            </tbody>

            <!-- 👉 table footer  -->
            <tfoot v-show="!products.length">
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

    <!-- 👉 Add New product -->
    <AddNewProductDrawer
      v-model:isDrawerOpen="isAddNewProductDrawerVisible"
      @product-data="addNewProduct"
      :categories="categoriesAll"
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