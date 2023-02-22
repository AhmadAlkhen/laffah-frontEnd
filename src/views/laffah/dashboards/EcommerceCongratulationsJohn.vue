<script setup>
import congoImg from "@images/illustrations/congo-illustration.png";
</script>

<template>
  <VCard>
    <VRow no-gutters>
      <VCol cols="8" class="h-100">
        <VCardText>
          <h6 class="text-lg text-no-wrap font-weight-semibold mb-7">
            Welcome ! 🎉
          </h6>
          <p class="text-sm">Order Management System</p>
          <h5 class="text-h5 font-weight-semibold text-primary mb-2"></h5>
          <VBtn class="mt-5" :to="{ name: 'laffah-orders-MyOrders' }"
            >View Orders</VBtn
          >
        </VCardText>
      </VCol>

      <VCol cols="4">
        <VCardText class="pb-0 px-0 position-relative h-100">
          <VImg
            :src="congoImg"
            height="140"
            class="w-100 position-absolute"
            style="bottom: 0"
          />
        </VCardText>
      </VCol>
    </VRow>
  </VCard>
</template>
