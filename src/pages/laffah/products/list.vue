<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import AddNewProductDrawer from "@/views/laffah/products/AddNewProductDrawer.vue";
import UpdateProductDrawer from "@/views/laffah/products/UpdateProductDrawer.vue";
import { useProductListStore } from "@/views/laffah/products/useProductListStore";
import { avatarText } from "@core/utils/formatters";
import { useToast } from "vue-toastification";
const route = useRoute();
const router = useRouter();
const toast = useToast();

const productListStore = useProductListStore();
const searchQuery = ref("");
const selectedStatus = ref(route.query.status || null);
const selectedCategory = ref();
const rowPerPage = ref(10);
const currentPage = ref(1);
const totalPage = ref(1);
const totalProducts = ref(0);
const products = ref([]);
const categoriesAll = ref([]);
const isDialogVisible = ref(false);
const isImagesDialogVisible = ref(false);
const fileImport = ref();
const fileName = ref({ name: "" });
const images = ref([]);
const toggleSwitch = ref(1);
const product = ref({});
const isLoading = ref(false);
const overlay = ref(false);

// 👉 Fetching products
const fetchProducts = () => {
  isLoading.value = true;
  productListStore
    .fetchProducts({
      q: searchQuery.value,
      status: selectedStatus.value,
      perPage: rowPerPage.value,
      currentPage: currentPage.value,
      category: selectedCategory.value?.value,
    })
    .then((response) => {
      products.value = response.data.data.data;
      totalPage.value = response.data.data.last_page;
      totalProducts.value = response.data.data.total;
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

watchEffect(fetchProducts);

// 👉 watching current page
watchEffect(() => {
  if (currentPage.value > totalPage.value) currentPage.value = totalPage.value;
});
watch(
  [searchQuery, selectedCategory, selectedStatus],
  () => {
    currentPage.value = 1;
    fetchProducts();
  },
  { immediate: false }
);
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
const isUpdateProductDrawerVisible = ref(false);

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
  overlay.value = true;
  productListStore
    .addProduct(productData)
    .then(() => {
      toast.success("product added successfully", {
        timeout: 2000,
      });
    })
    .catch((err) => {
      toast.warning(err.response?.data?.message || err.message, {
        timeout: 2000,
      });
    })
    .finally(() => {
      overlay.value = false;
    });

  // refetch products
  fetchProducts();
};

const getProduct = (id) => {
  productListStore.getProduct(id).then((res) => {
    product.value = res.data.data;
    isUpdateProductDrawerVisible.value = true;
  });
};
const updateProduct = (productData) => {
  overlay.value = true;

  productListStore
    .updateProduct(productData)
    .then(() => {
      toast.success("Product updated successfully", {
        timeout: 2000,
      });
    })
    .catch((err) => {
      toast.warning(err.response?.data?.message || err.message, {
        timeout: 2000,
      });
    })
    .finally(() => {
      overlay.value = false;
      fetchProducts();
    });
};

// upload excel file
const uploading = () => {
  overlay.value = true;
  productListStore
    .uploadProducts(fileImport.value)
    .then(() => {
      toast.success("products added successfully", {
        timeout: 2000,
      });
      fileImport.value = null;
      fileName.value = { name: "" };
      isDialogVisible.value = false;
    })
    .catch((err) => {
      toast.warning(err.response?.data?.message || err.message, {
        timeout: 2000,
      });
    })
    .finally(() => {
      overlay.value = false;
      fetchProducts();
    });
};

const exportProducts = () => {
  overlay.value = true;

  const params = {};
  if (searchQuery.value && searchQuery.value !== "")
    params.q = searchQuery.value;

  if (selectedStatus.value && selectedStatus.value !== "")
    params.status = selectedStatus.value;

  if (selectedCategory.value && selectedCategory.value !== "")
    params.category = selectedCategory.value?.value;

  axios
    .get("/product/export", {
      params: params,
      responseType: "blob",
    })
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      const fileName = `Products.xlsx`;
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

const uploadingImages = () => {
  productListStore
    .uploadImages(formData.value)
    .then(() => {
      toast.success("images added successfully", {
        timeout: 2000,
      });
      this.$refs.images = null;
      // fileName.value = { name: "" };
      isImagesDialogVisible.value = false;
    })
    .catch((err) => {
      toast.warning(err.response?.data?.message || err.message, {
        timeout: 2000,
      });
    });

  // refetch products
  // fetchProducts();
};

const onFileChange = (e) => {
  if (e.target.files.length > 0) {
    fileImport.value = e.target.files[0];
    fileName.value.name = e.target.files[0].name;
  } else {
    fileImport.value = null;
    fileName.value.name = null;
  }
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

// delete product
const deleteProduct = (id) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this product?"
  );
  if (!confirmed) {
    return;
  }
  productListStore
    .deleteProduct(id)
    .then((res) => {
      toast.success(res.data.message, {
        timeout: 2000,
      });
      fetchProducts();
    })
    .catch((err) => {
      toast.warning(err.response?.data?.message || err.message, {
        timeout: 2000,
      });
    });
};

onMounted(() => {
  let allCategories = [];
  let categoryItem = [];
  axios
    .get("/category/index", { perPage: 20 })
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

// get userRole
const userRole = computed(() => {
  let data = localStorage.getItem("userRole");
  return data;
});
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
            <VCol cols="12" class="" md="2">
              <VSelect
                v-model="selectedStatus"
                label="Select Status"
                :items="status"
                clearable
                clear-icon="tabler-x"
              />
            </VCol>

            <VCol cols="12" class="" md="4">
              <div>
                <VTextField
                  v-model="searchQuery"
                  placeholder="Search"
                  density="compact"
                /></div
            ></VCol>
            <VCol cols="12" class="" md="4">
              <VAutocomplete
                v-model="selectedCategory"
                :items="categoriesAll"
                item-title="title"
                item-value="value"
                label="Select category"
                persistent-hint
                return-object
                clear-icon="tabler-x"
              />
            </VCol>
          </VRow>
          <VRow class="mx-1 my-1">
            <!-- import excel file -->
            <VCol cols="12" class="" md="2" v-if="userRole == 'admin'">
              <VDialog v-model="isDialogVisible" max-width="600">
                <!-- Dialog Activator -->
                <template #activator="{ props }">
                  <VBtn
                    v-bind="props"
                    prepend-icon="tabler-arrow-big-down-lines"
                    class="mr-3"
                  >
                    <!-- !isAllFilled() -->
                    import
                  </VBtn>
                </template>

                <!-- Dialog close btn -->
                <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />

                <!-- Dialog Content -->
                <VCard title="Upload a file">
                  <VCardText>
                    <VRow>
                      <VCol cols="12" sm="12">
                        <VFileInput
                          accept=".xlsx, .xls, .csv"
                          label="file"
                          v-model="fileName"
                          density="compact"
                          @change="onFileChange"
                        />
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
                    <VBtn @click="uploading()" :disabled="!fileImport">
                      Upload
                    </VBtn>
                  </VCardText>
                </VCard>
              </VDialog>
            </VCol>
            <!-- end import excel file -->

            <VCol cols="12" class="" md="2" v-if="userRole == 'admin'">
              <VBtn @click="exportProducts()"> Export </VBtn>
            </VCol>

            <VCol cols="12" class="" md="4" v-if="userRole == 'admin'">
              <VBtn
                prepend-icon="tabler-plus"
                @click="isAddNewProductDrawerVisible = true"
              >
                Add New product
              </VBtn></VCol
            >
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
                <th scope="col" v-if="userRole == 'admin'">ACTIONS</th>
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
                      v-viewer
                    >
                      <VImg v-if="product.image" :src="product.image" />
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
                    :disabled="userRole == 'admin' ? false : true"
                  />
                </td>

                <!-- 👉 Actions -->
                <td
                  class="text-center"
                  style="width: 5rem"
                  v-if="userRole == 'admin'"
                >
                  <VBtn
                    icon
                    size="x-small"
                    color="default"
                    variant="text"
                    @click="getProduct(product.id)"
                  >
                    <VIcon size="22" icon="tabler-edit" />
                  </VBtn>

                  <VBtn
                    icon
                    size="x-small"
                    color="default"
                    variant="text"
                    @click="deleteProduct(product.id)"
                  >
                    <VIcon size="22" icon="tabler-trash" />
                  </VBtn>

                  <!-- <VBtn icon size="x-small" color="default" variant="text">
                    <VIcon size="22" icon="tabler-dots-vertical" />
                  </VBtn> -->
                </td>
              </tr>
            </tbody>

            <!-- 👉 table footer  -->
            <tfoot v-show="isLoading || products.length === 0">
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

    <!-- 👉 Add New product -->
    <AddNewProductDrawer
      v-model:isDrawerOpen="isAddNewProductDrawerVisible"
      @product-data="addNewProduct"
      :categories="categoriesAll"
    />

    <!-- 👉 edit product -->
    <UpdateProductDrawer
      v-model:isDrawerOpen="isUpdateProductDrawerVisible"
      @product-data="updateProduct"
      :categories="categoriesAll"
      :product="product"
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
