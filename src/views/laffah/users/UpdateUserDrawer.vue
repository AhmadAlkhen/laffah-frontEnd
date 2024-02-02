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
  managers: {
    type: Array,
    required: true,
  },
  user: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update:isDrawerOpen", "userData"]);

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
      emit("userData", {
        // id: 0,
        id: props.user.id,
        name: props.user.name,
        email: props.user.email,
        phone: props.user.phone,
        password: password.value,
        role: props.user.role,
        branch_id: props.user.branch_id,
        inform_user_id: props.user.inform_user_id,
        status: props.user.status,
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
      <h6 class="text-h6">Edit User</h6>

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
                  v-model="user.name"
                  :rules="[requiredValidator]"
                  label="User Name"
                />
              </VCol>
              <!-- 👉 Email -->
              <VCol cols="12">
                <VTextField
                  v-model="user.email"
                  :rules="[requiredValidator, emailValidator]"
                  label="Email"
                />
              </VCol>
              <!-- 👉 Password -->
              <VCol cols="12">
                <VTextField
                  v-model="password"
                  label="Password"
                  type="password"
                />
              </VCol>
              <!-- 👉 Phone -->
              <VCol cols="12">
                <VTextField
                  v-model="user.phone"
                  :rules="[requiredValidator]"
                  label="Phone"
                />
              </VCol>
              <!-- 👉 Role -->
              <VCol cols="12">
                <VSelect
                  v-model="user.role"
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
                  v-model="user.branch_id"
                  label="Select Branch"
                  :rules="[requiredValidator]"
                  :items="branches"
                />
              </VCol>

              <!-- 👉 Inform manage -->
              <VCol cols="12" v-if="user.role == 'branch'">
                <VSelect
                  v-model="user.inform_user_id"
                  label="Inform Manager"
                  :items="managers"
                  clearable
                />
              </VCol>

              <!-- 👉 Status -->
              <VCol cols="12">
                <VSelect
                  v-model="user.status"
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
