<script setup>
import { avatarText } from "@core/utils/formatters";

const props = defineProps({
  notifications: {
    type: Array,
    required: true,
  },
  badgeProps: {
    type: null,
    required: false,
    default: undefined,
  },
  location: {
    type: null,
    required: false,
    default: "bottom end",
  },
});

// const emit = defineEmits(["click:readAllNotifications"]);
</script>

<template>
  <VBadge :model-value="!!props.badgeProps" v-bind="props.badgeProps">
    <VBtn icon variant="text" color="default" size="small">
      <VBadge
        :model-value="!!props.notifications.length"
        color="error"
        :content="props.notifications.length"
      >
        <VIcon icon="tabler-shopping-cart" size="24" />
      </VBadge>

      <VMenu
        activator="parent"
        width="380px"
        :location="props.location"
        offset="14px"
      >
        <VList class="py-0">
          <!-- 👉 Header -->
          <VListItem title="Cart" class="notification-section" height="48px">
            <template #append>
              <VChip
                v-if="props.notifications.length"
                color="primary"
                size="small"
              >
                {{ props.notifications.length }} New
              </VChip>
            </template>
          </VListItem>

          <VDivider />

          <!-- 👉 Notifications list -->
          <template
            v-for="notification in props.notifications"
            :key="notification.title"
          >
            <VListItem
              :title="notification.name"
              :subtitle="notification.unit"
              link
              lines="one"
              min-height="66px"
            >
              <!-- Slot: Prepend -->
              <!-- Handles Avatar: Image, Icon, Text -->
              <template #prepend>
                <VListItemAction start>
                  <VAvatar
                    :color="notification.color || 'primary'"
                    :image="notification.image || undefined"
                    :icon="notification.icon || undefined"
                    size="40"
                    variant="tonal"
                  >
                    <span v-if="notification.name">{{
                      avatarText(notification.name)
                    }}</span>
                  </VAvatar>
                </VListItemAction>
              </template>
              <!-- Slot: Append -->
              <!-- <template #append>
                <small class="whitespace-no-wrap text-medium-emphasis">{{
                  notification.time
                }}</small>
              </template> -->
            </VListItem>
            <VDivider />
          </template>

          <!-- 👉 Footer -->
          <VListItem class="notification-section">
            <VBtn block @click="$router.push({ name: 'laffah-orders-cart' })">
              ALL products cart
            </VBtn>
          </VListItem>
        </VList>
      </VMenu>
    </VBtn>
  </VBadge>
</template>

<style lang="scss">
.notification-section {
  padding: 14px !important;
}
</style>
