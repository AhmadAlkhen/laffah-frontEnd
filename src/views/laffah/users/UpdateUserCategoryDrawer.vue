<script setup>
import { PerfectScrollbar } from "vue3-perfect-scrollbar";
import { emailValidator, requiredValidator } from "@validators";
import axios from "axios";
import { useToast } from "vue-toastification";
import { useUserListStore } from "@/views/laffah/users/useUserListStore";
const userListStore = useUserListStore();

const toast = useToast();
const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },

  userCategory: {
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
  categories: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["update:isDrawerOpen"]);

const isFormValid = ref(false);
const refForm = ref();
const password = ref("");
const categoriesSelected = ref();
const categoriesAll = ref([]);
const userCategoriesAll = ref([]);
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
        let categoriesVar = [];
        props.userCategory.data.forEach((el) => {
          categoriesVar.push(el.value ? el.value : el);
        });

        let category_ids = categoriesVar;
        // let user_id = props.user.id;
        let user_id = props.user_Id;
        axios
          .post("/users/categories/store", { category_ids, user_id })
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
        let categoriesVar = [];
        props.userCategory.data.forEach((el) => {
          categoriesVar.push(el.value ? el.value : el);
        });

        let category_ids = categoriesVar;
        // let user_id = props.user.id;
        let user_id = props.user_Id;
        axios
          .post("/users/categories/update", { category_ids, user_id })
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

// fetch all category
onMounted(() => {
  let allCategories = [];
  let categoryItem = [];
  // categoriesSelected.value = props.userCategory.data;
  // console.log(props.userCategory.data);
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
      <h6 class="text-h6">Define Categories</h6>

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
              <!-- 👉 Categories   VAutocomplete-->
              <VCol cols="10">
                <VAutocomplete
                  v-model="userCategory.data"
                  :items="categoriesAll"
                  placeholder="Select Category"
                  label="Select Category"
                  clearable
                  item-value="value"
                  item-text="text"
                  multiple
                ></VAutocomplete>
              </VCol>

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
