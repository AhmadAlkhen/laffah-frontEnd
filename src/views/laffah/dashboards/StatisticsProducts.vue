<script setup>
const statistics = [
  {
    title: "Pending",
    stats: "230k",
    icon: "tabler-chart-pie-2",
    color: "primary",
  },
  {
    title: "Processing",
    stats: "8.549k",
    icon: "tabler-users",
    color: "info",
  },
  {
    title: "Completed",
    stats: "1.423k",
    icon: "tabler-shopping-cart",
    color: "error",
  },
  {
    title: "Returned",
    stats: "$9745",
    icon: "tabler-currency-dollar",
    color: "success",
  },
];
const props = defineProps({
  products: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <VCard title="Statistics products">
    <template #append>
      <span class="text-body-2"></span>
    </template>
    <VCardText class="pt-6">
      <VRow>
        <VCol cols="6" md="3">
          <div class="d-flex">
            <VAvatar color="warning" variant="tonal" size="42" class="me-3">
              <VIcon size="24" icon="tabler-shopping-cart" />
            </VAvatar>

            <div class="d-flex flex-column">
              <RouterLink
                :to="{
                  name: 'laffah-products-list',
                }"
              >
                <span class="text-h6 font-weight-medium">{{
                  products.productsTotal
                }}</span>
              </RouterLink>

              <span class="text-caption">Products Total </span>
            </div>
          </div>
        </VCol>
        <VCol cols="6" md="3">
          <div class="d-flex">
            <VAvatar color="success" variant="tonal" size="42" class="me-3">
              <VIcon size="24" icon="tabler-archive" />
            </VAvatar>

            <div class="d-flex flex-column">
              <RouterLink
                :to="{
                  name: 'laffah-products-list',
                  query: { status: 1 },
                }"
              >
                <span class="text-h6 font-weight-medium">{{
                  products.productsActiveTotal
                }}</span>
              </RouterLink>

              <span class="text-caption">Products Active</span>
            </div>
          </div>
        </VCol>
        <VCol cols="6" md="3">
          <div class="d-flex">
            <VAvatar color="success" variant="tonal" size="42" class="me-3">
              <VIcon size="24" icon="tabler-archive-off" />
            </VAvatar>

            <div class="d-flex flex-column">
              <RouterLink
                :to="{
                  name: 'laffah-products-list',
                  query: { status: 0 },
                }"
              >
                <span class="text-h6 font-weight-medium">{{
                  products.productsInactiveTotal
                }}</span>
              </RouterLink>

              <span class="text-caption">Products Inactive</span>
            </div>
          </div>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>
