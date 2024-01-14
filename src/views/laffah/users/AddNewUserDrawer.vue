<script setup>
import { PerfectScrollbar } from "vue3-perfect-scrollbar";
import { emailValidator, requiredValidator } from "@validators";

const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
  branches: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["update:isDrawerOpen", "userData"]);

const isFormValid = ref(false);
const refForm = ref();
const name = ref("");
const email = ref("");
const phone = ref("");
const password = ref("");
const role = ref();
const branch = ref("");
const status = ref(1);

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
      emit("userData", {
        // id: 0,
        name: name.value,
        email: email.value,
        phone: phone.value,
        password: password.value,
        role: role.value,
        branch: branch.value,
        status: status.value,
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
      <h6 class="text-h6">Add User</h6>

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
                  v-model="name"
                  :rules="[requiredValidator]"
                  label="User Name"
                />
              </VCol>
              <!-- 👉 Email -->
              <VCol cols="12">
                <VTextField
                  v-model="email"
                  :rules="[requiredValidator, emailValidator]"
                  label="Email"
                />
              </VCol>
              <!-- 👉 Password -->
              <VCol cols="12">
                <VTextField
                  v-model="password"
                  :rules="[requiredValidator]"
                  label="Password"
                  type="password"
                />
              </VCol>

              <!-- 👉 Phone -->
              <VCol cols="12">
                <VTextField
                  v-model="phone"
                  :rules="[requiredValidator]"
                  label="Phone"
                />
              </VCol>

              <!-- 👉 Role -->
              <VCol cols="12">
                <VSelect
                  v-model="role"
                  label="Select Role"
                  :rules="[requiredValidator]"
                  :items="[
                    { title: 'Admin', value: 'admin' },
                    { title: 'Branch', value: 'branch' },
                    { title: 'Warehouse', value: 'warehouse' },
                    { title: 'Assistant', value: 'assistant' },
                    { title: 'Helper', value: 'helper' },
                    { title: 'Carrier', value: 'carrier' },
                  ]"
                />
              </VCol>
              <!-- 👉 Branch -->
              <VCol cols="12">
                <VSelect
                  v-model="branch"
                  label="Select Branch"
                  :rules="[requiredValidator]"
                  :items="branches"
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
