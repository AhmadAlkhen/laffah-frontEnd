<script setup>
const props = defineProps({
  categories: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <VCard title="Statistics categories">
    <template #append>
      <span class="text-body-2"></span>
    </template>
    <VCardText class="pt-6">
      <VRow>
        <VCol cols="12" md="12">
          <div class="d-flex">
            <VAvatar color="primary" variant="tonal" size="42" class="me-3">
              <VIcon size="24" icon="tabler-app-window" />
            </VAvatar>

            <div class="d-flex flex-column">
              <span class="text-h6 font-weight-medium">{{
                categories.categoriesTotal
              }}</span>
              <span class="text-caption">categories Total </span>
            </div>
          </div>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>
