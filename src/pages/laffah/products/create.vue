<script setup>
import { emailValidator, requiredValidator } from "@validators";
import { ref, onMounted } from "vue";
import axios from "axios";
import { useToast } from "vue-toastification";
const toast = useToast();

const isFormValid = ref(false);
const refForm = ref();
const fullName = ref("");
const sku = ref("");
const category = ref({ title: "", value: "" });
const categoriesAll = ref([]);
const unit = ref("");
const image = ref("");
const status = ref(1);

const onFileChange = (e) => {
  image.value = e.target.files[0];
};

const onSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      const formData = new FormData();
      formData.append("name", fullName.value);
      formData.append("sku", sku.value);
      formData.append("category", category.value);
      formData.append("unit", unit.value);
      formData.append("status", status.value);
      formData.append("image", image.value);
      axios
        .post("/product/store", formData)
        .then((response) => {
          toast.success("product added successfully", {
            timeout: 2000,
          });
          // refForm.value?.reset();
          fullName.value = "";
          sku.value = "";
          category.value = "";
          unit.value = "";
          refForm.value?.resetValidation();
        })
        .catch((err) => {
          toast.warning(err.response.data.message, {
            timeout: 2000,
          });
        });

      // emit("productData", {
      //   // id: 0,
      //   fullName: fullName.value,
      //   sku: sku.value,
      //   category: category.value,
      //   unit: unit.value,
      //   image: image.value,
      //   status: status.value,
      // });
      // nextTick(() => {
      //   refForm.value?.reset();
      //   refForm.value?.resetValidation();
      // });
    }
  });
};

const units = [
  { title: "box", value: "box" },
  { title: "PCS", value: "pcs" },
  { title: "kg", value: "kg" },
  { title: "liter", value: "liter" },
];
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
  <div>
    <div>
      <VCard flat>
        <VCardText>
          <h6 class="text-h6 my-5">Add product</h6>

          <!-- 👉 Form -->
          <VForm ref="refForm" v-model="isFormValid" @submit.prevent="onSubmit">
            <VRow>
              <!-- 👉 Full name -->
              <VCol cols="12">
                <VTextField
                  v-model="fullName"
                  :rules="[requiredValidator]"
                  label="product Name"
                />
              </VCol>
              <!-- 👉 sku -->
              <VCol cols="12">
                <VTextField
                  v-model="sku"
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
                <VAutocomplete
                  v-model="category"
                  :items="categoriesAll"
                  item-title="title"
                  item-value="value"
                  label="Select category"
                  persistent-hint
                  return-object
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- 👉 unit -->
              <VCol cols="12">
                <VSelect
                  v-model="unit"
                  label="Select unit"
                  :rules="[requiredValidator]"
                  :items="units"
                />
              </VCol>

              <!-- 👉 Status -->
              <VCol cols="12">
                <VSelect
                  v-model="status"
                  label="Select Status"
                  :rules="[requiredValidator]"
                  :items="[
                    { title: 'Active', value: 1 },
                    { title: 'Inactive', value: 0 },
                  ]"
                />
              </VCol>

              <!-- 👉 image -->
              <VCol cols="12">
                <VFileInput
                  accept="image/*"
                  label="image"
                  prepend-icon="tabler-camera"
                  v-model="image"
                  @change="onFileChange"
                  density="compact"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- 👉 Submit and Cancel -->
              <VCol cols="12">
                <VBtn type="submit" class="me-3"> Save </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </div>
  </div>
</template>
