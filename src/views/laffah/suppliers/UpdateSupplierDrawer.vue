<script setup>
import { PerfectScrollbar } from "vue3-perfect-scrollbar";
import { emailValidator, requiredValidator } from "@validators";

const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },

  supplier: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update:isDrawerOpen", "supplierData"]);

const isFormValid = ref(false);
const refForm = ref();

const password = ref("");

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
      emit("supplierData", {
        // id: 0,
        id: props.supplier.id,
        name: props.supplier.name,
        email: props.supplier.email,
        phone: props.supplier.phone,
        // password: password.value,
        type: props.supplier.type,
        additional_info: props.supplier.additional_info,
        status: props.supplier.status,
      });
      emit("update:isDrawerOpen", false);
      nextTick(() => {
        refForm.value?.reset();
        refForm.value?.resetValidation();
      });
    }
  });
};

const handleDrawerModelValueUpdate = (val) => {
  emit("update:isDrawerOpen", val);
};
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
      <h6 class="text-h6">Edit Supplier</h6>

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
                  v-model="supplier.name"
                  :rules="[requiredValidator]"
                  label="Supplier Name"
                />
              </VCol>
              <!-- 👉 Email -->
              <VCol cols="12">
                <VTextField
                  v-model="supplier.email"
                  :rules="[requiredValidator, emailValidator]"
                  label="Email"
                />
              </VCol>
              <!-- 👉 Password -->
              <!-- <VCol cols="12">
                <VTextField
                  v-model="password"
                  label="Password"
                  type="password"
                />
              </VCol> -->
              <!-- 👉 Phone -->
              <VCol cols="12">
                <VTextField
                  v-model="supplier.phone"
                  :rules="[requiredValidator]"
                  label="Phone"
                />
              </VCol>

              <!-- 👉 type -->
              <VCol cols="12">
                <VTextField
                  v-model="supplier.type"
                  :rules="[requiredValidator]"
                  label="Type"
                />
              </VCol>

              <!-- 👉 Status -->
              <VCol cols="12">
                <VSelect
                  v-model="supplier.status"
                  label="Select Status"
                  :rules="[requiredValidator]"
                  :items="[
                    { title: 'Active', value: 1 },
                    { title: 'Inactive', value: 0 },
                  ]"
                />
              </VCol>

              <!-- 👉 additional_info -->
              <VCol cols="12">
                <VTextarea
                  v-model="supplier.additional_info"
                  label="Additional Info"
                  rows="2"
                />
              </VCol>
              <!-- 👉 Submit and Cancel -->
              <VCol cols="12">
                <VBtn type="submit" class="me-3"> Submit </VBtn>
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
