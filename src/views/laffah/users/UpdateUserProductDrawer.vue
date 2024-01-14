<script setup>
import { PerfectScrollbar } from "vue3-perfect-scrollbar";
import { emailValidator, requiredValidator } from "@validators";
import axios from "axios";
import { useToast } from "vue-toastification";
import { useUserListStore } from "@/views/laffah/users/useUserListStore";
import { computed } from "vue";
const userListStore = useUserListStore();

const toast = useToast();
const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },

  userProduct: {
    type: Object,
    required: true,
  },
  user: {
    type: Object,
    required: true,
  },
  isStore: {
    type: Boolean,
    required: true,
  },
  user_Id: {
    required: true,
  },
});

const emit = defineEmits(["update:isDrawerOpen"]);

const isFormValid = ref(false);
const refForm = ref();
const password = ref("");
const categoriesSelected = ref();
const productsAll = ref([]);
const userCategoriesAll = ref([]);
const searchQuery = ref("");
const loading = ref(false);

const oldProducts = ref();

// 👉 drawer close
const closeNavigationDrawer = () => {
  emit("update:isDrawerOpen", false);
  nextTick(() => {
    refForm.value?.reset();
    refForm.value?.resetValidation();
  });
};

const onSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      if (props.isStore) {
        let productsVar = [];
        props.userProduct.data.forEach((el) => {
          productsVar.push(el.value ? el.value : el);
        });

        let product_ids = productsVar;
        // let user_id = props.user.id;
        let user_id = props.user_Id;
        axios
          .post("/users/products/store", { product_ids, user_id })
          .then((res) => {
            if (res.status != 200) {
              toast.warning(res.data.message, {
                timeout: 2000,
              });
            } else {
              closeNavigationDrawer();
              toast.success(res.data.message, {
                timeout: 2000,
              });
              // fetchOrders();
            }
          })
          .catch((err) => {
            console.log(err);
            toast.warning(err.response?.data?.message || err.message, {
              timeout: 2000,
            });
          });
      } else {
        let productsVar = [];
        props.userProduct.data.forEach((el) => {
          productsVar.push(el.value ? el.value : el);
        });

        let product_ids = productsVar;
        // let user_id = props.user.id;
        let user_id = props.user_Id;
        axios
          .post("/users/products/update", { product_ids, user_id })
          .then((res) => {
            if (res.status != 200) {
              toast.warning(res.data.message, {
                timeout: 2000,
              });
            } else {
              closeNavigationDrawer();
              toast.success(res.data.message, {
                timeout: 2000,
              });
              // fetchOrders();
            }
          })
          .catch((err) => {
            console.log(err);
            toast.warning(err.response?.data?.message || err.message, {
              timeout: 2000,
            });
          });
      }

      // emit("userData", {
      //   // id: 0,
      //   id: props.user.id,
      // });
      // emit("update:isDrawerOpen", false);
      // nextTick(() => {
      //   refForm.value?.reset();
      //   refForm.value?.resetValidation();
      // });
    }
  });
};

const handleDrawerModelValueUpdate = (val) => {
  emit("update:isDrawerOpen", val);
};

const loadProducts = async (page, perPage, q) => {
  loading.value = true;

  let productItem = {};
  let params = {
    page: page,
    perPage: perPage,
    q: q,
  };

  return axios
    .get("/products", { params: params })
    .then((res) => {
      const products = res.data.data.data;
      productsAll.value = [];
      products.forEach((product) => {
        productItem = {
          title: product.name,
          value: product.id,
        };
        productsAll.value.push(productItem);
      });
      loading.value = false;
    })
    .catch((err) => {
      console.log(err);
      loading.value = false;
    });
};

onMounted(() => {
  oldProducts.value = props.userProduct?.data || [];
});

onMounted(() => {
  loadProducts(1, 25, "");
});

watch(searchQuery, (newVal, oldVal) => {
  if (newVal && newVal.length && newVal.length >= 3) {
    // productsAll.value = [];
    loadProducts(1, 25, newVal);
  }
});
// fetch all category
// onMounted(() => {
//   let allProducts = [];
//   let productItem = [];
//   // categoriesSelected.value = props.userProduct.data;
//   // console.log(props.userProduct.data);
//   let params = {
//     perPage: 2000,
//   };
//   axios
//     .get("/products", { params: params })
//     .then((res) => {
//       allProducts = res.data.data.data;
//       allProducts.forEach((product) => {
//         productItem.push({
//           title: product.name,
//           value: product.id,
//         });
//       });
//       productsAll.value = productItem;
//       console.log(productsAll.value);
//       return productItem;
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });
</script>

<template>
  <VNavigationDrawer
    temporary
    :width="550"
    location="end"
    class="scrollable-content"
    :model-value="props.isDrawerOpen"
    @update:model-value="handleDrawerModelValueUpdate"
  >
    <!-- 👉 Title -->
    <div class="d-flex align-center pa-6 pb-1">
      <h6 class="text-h6">Assign Products</h6>

      <VSpacer />
      <!-- 👉 Close btn -->
      <VBtn
        variant="tonal"
        color="default"
        icon
        size="32"
        class="rounded"
        @click="closeNavigationDrawer"
      >
        <VIcon size="18" icon="tabler-x" />
      </VBtn>
    </div>

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <VCardText>
          <!-- 👉 Form -->
          <VForm ref="refForm" v-model="isFormValid" @submit.prevent="onSubmit">
            <VRow>
              <!-- 👉  VAutocomplete-->
              <VCol cols="10">
                <VTextField
                  v-model="searchQuery"
                  placeholder="Search for products (at least 3 characters)"
                  class="my-4"
                />
                <VAutocomplete
                  v-model="userProduct.data"
                  :items="productsAll"
                  placeholder="Select Product"
                  label="Select Product"
                  clearable
                  item-value="value"
                  item-text="text"
                  multiple
                ></VAutocomplete>
              </VCol>
              <VDivider />
              <div v-if="oldProducts">
                <p class="mx-1 my-2" v-if="oldProducts.length > 0">
                  Old assigned products:
                </p>
                <VChip
                  v-for="product in oldProducts"
                  :key="product.id"
                  label
                  color="primary"
                  size="small"
                  class="mx-2 my-1"
                >
                  {{ product.tilte }}
                </VChip>
              </div>
              <!-- item-value="value" item-text="text" return-object -->

              <!-- 👉 Submit and Cancel -->
              <VCol cols="12">
                <VBtn type="submit" class="me-3" v-if="isStore"> Save </VBtn>
                <VBtn type="submit" class="me-3" v-if="!isStore"> Update </VBtn>
                <VBtn
                  type="reset"
                  variant="tonal"
                  color="secondary"
                  @click="closeNavigationDrawer"
                >
                  Cancel
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
