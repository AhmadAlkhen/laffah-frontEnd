<script setup>
const props = defineProps({
  orderStatus: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <VCard title="Statistics orders">
    <template #append>
      <span class="text-body-2"></span>
    </template>
    <VCardText class="pt-6">
      <VRow>
        <VCol cols="6" md="3">
          <div class="d-flex">
            <VAvatar color="warning" variant="tonal" size="42" class="me-3">
              <VIcon size="24" icon="tabler-chart-pie-2" />
            </VAvatar>

            <div class="d-flex flex-column">
              <RouterLink
                :to="{
                  name: 'laffah-orders-MyOrders',
                  query: { status: 'pending' },
                }"
              >
                <span class="text-h6 font-weight-medium">{{
                  orderStatus.pendingTotal
                }}</span>
              </RouterLink>

              <span class="text-caption">Pending </span>
            </div>
          </div>
        </VCol>
        <VCol cols="6" md="3">
          <div class="d-flex">
            <VAvatar color="success" variant="tonal" size="42" class="me-3">
              <VIcon size="24" icon="tabler-shopping-cart" />
            </VAvatar>

            <div class="d-flex flex-column">
              <RouterLink
                :to="{
                  name: 'laffah-orders-MyOrders',
                  query: { status: 'processing' },
                }"
              >
                <span class="text-h6 font-weight-medium">{{
                  orderStatus.processingTotal
                }}</span>
              </RouterLink>

              <span class="text-caption">Processing </span>
            </div>
          </div>
        </VCol>
        <VCol cols="6" md="3">
          <div class="d-flex">
            <VAvatar color="info" variant="tonal" size="42" class="me-3">
              <VIcon size="24" icon="tabler-check" />
            </VAvatar>

            <div class="d-flex flex-column">
              <RouterLink
                :to="{
                  name: 'laffah-orders-MyOrders',
                  query: { status: 'completed' },
                }"
              >
                <span class="text-h6 font-weight-medium">{{
                  orderStatus.completedTotal
                }}</span>
              </RouterLink>

              <span class="text-caption">Completed </span>
            </div>
          </div>
        </VCol>
        <VCol cols="6" md="3">
          <div class="d-flex">
            <VAvatar color="secondary" variant="tonal" size="42" class="me-3">
              <VIcon size="24" icon="tabler-arrow-back" />
            </VAvatar>

            <div class="d-flex flex-column">
              <RouterLink
                :to="{
                  name: 'laffah-orders-MyOrders',
                  query: { status: 'returned' },
                }"
              >
                <span class="text-h6 font-weight-medium">{{
                  orderStatus.returnedTotal
                }}</span>
              </RouterLink>

              <span class="text-caption">Returned </span>
            </div>
          </div>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>
