<script setup>
import { PerfectScrollbar } from "vue3-perfect-scrollbar";
import { emailValidator, requiredValidator } from "@validators";
import { ref } from "@vue/reactivity";

const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
  categories: {
    type: Array,
    required: true,
  },
  product: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update:isDrawerOpen", "productData"]);

const isFormValid = ref(false);
const refForm = ref();
const fullName = ref("");
const sku = ref("");
const category = ref({ title: "", value: "" });
const unit = ref("");
const image = ref("");
const imageName = ref({ name: "" });
const status = ref();

// 👉 drawer close
const closeNavigationDrawer = () => {
  emit("update:isDrawerOpen", false);
  nextTick(() => {
    // refForm.value?.reset();
    fullName.value = null;
    sku.value = null;
    category.value = null;
    unit.value = null;
    barcode.value = null;
    image.value = null;
    imageName.value = { name: "" };
    // image.value = null;

    // refForm.value?.resetValidation();
  });
};
const onFileChange = (e) => {
  if (e.target.files.length > 0) {
    image.value = e.target.files[0];
    imageName.value.name = e.target.files[0].name;
  } else {
    image.value = null;
  }
};

const onSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      emit("productData", {
        // id: 0,
        id: props.product.id,
        name: props.product.name,
        sku: props.product.sku,
        category: props.product.category_id,
        unit: props.product.unit,
        status: props.product.status,
        barcode: props.product.barcode,
        image: image.value,
      });
      emit("update:isDrawerOpen", false);
      nextTick(() => {
        fullName.value = null;
        sku.value = null;
        category.value = null;
        unit.value = null;
        barcode.value = null;
        image.value = null;
        imageName.value = { name: "" };
        // refForm.value?.reset();
        // refForm.value?.resetValidation();
      });
    }
  });
};

const handleDrawerModelValueUpdate = (val) => {
  emit("update:isDrawerOpen", val);
};

const units = [
  { title: "box", value: "box" },
  { title: "PCS", value: "pcs" },
  { title: "kg", value: "kg" },
  { title: "liter", value: "liter" },
];
</script>

<template>
  <VNavigationDrawer
    temporary
    :width="400"
    location="end"
    class="scrollable-content"
    :model-value="props.isDrawerOpen"
    @update:model-value="handleDrawerModelValueUpdate"
  >
    <!-- 👉 Title -->
    <div class="d-flex align-center pa-6 pb-1">
      <h6 class="text-h6">Update product</h6>

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
              <!-- 👉 Full name -->
              <VCol cols="12">
                <VTextField
                  v-model="product.name"
                  :rules="[requiredValidator]"
                  label="product Name"
                />
              </VCol>
              <!-- 👉 sku -->
              <VCol cols="12">
                <VTextField
                  v-model="product.sku"
                  :rules="[requiredValidator]"
                  label="product Sku"
                />
              </VCol>
              <!-- 👉 category -->
              <VCol cols="12">
                <!-- <VSelect
                  v-model="category"
                  label="Select category"
                  :rules="[requiredValidator]"
                  :items="categories"
                /> -->
                <VSelect
                  v-model="product.category_id"
                  :items="categories"
                  label="Select category"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- 👉 unit -->
              <VCol cols="12">
                <VSelect
                  v-model="product.unit"
                  label="Select unit"
                  :rules="[requiredValidator]"
                  :items="units"
                />
              </VCol>
              <!-- 👉 Status -->
              <VCol cols="12">
                <VSelect
                  v-model="product.status"
                  label="Select Status"
                  :rules="[requiredValidator]"
                  :items="[
                    { title: 'Active', value: 1 },
                    { title: 'Inactive', value: 0 },
                  ]"
                />
              </VCol>
              <!-- 👉 barcode -->
              <VCol cols="12">
                <VTextField v-model="product.barcode" label="Barcode" />
              </VCol>

              <!-- 👉 image -->
              <VCol cols="12">
                <VFileInput
                  accept="image/*"
                  label="image"
                  prepend-icon="tabler-camera"
                  v-model="imageName"
                  @change="onFileChange"
                  density="compact"
                />
                <!-- <v-file-input
                  accept="image/*"
                  label="File input"
                ></v-file-input> -->
              </VCol>

              <!-- 👉 Submit and Cancel -->
              <VCol cols="12">
                <VBtn type="submit" class="me-3"> Submit </VBtn>
                <VBtn
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
