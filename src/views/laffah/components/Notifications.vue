<script setup>
import { avatarText } from "@core/utils/formatters";
import moment from "moment";
import axios from "axios";
import { useNotificationListStore } from "@/views/laffah/notification/useNotificationListStore";
const NotificationStore = useNotificationListStore();

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

const markAsRead = (id) => {
  NotificationStore.markAsRead(id);
  // axios.post("/notification/isRead", { id: id });
};
const readAllNotifications = () => {
  NotificationStore.readAllNotifications();
};
</script>

<template>
  <VBadge :model-value="!!props.badgeProps" v-bind="props.badgeProps">
    <VBtn icon variant="text" color="default" size="small">
      <VBadge
        :model-value="!!props.notifications.length"
        color="error"
        :content="notifications.length"
      >
        <VIcon icon="tabler-bell" size="24" />
      </VBadge>

      <VMenu
        activator="parent"
        width="390px"
        :location="props.location"
        offset="14px"
        min-height="70px"
        max-height="450px"
      >
        <VList class="py-0">
          <!-- 👉 Header -->
          <VListItem
            title="Notifications"
            class="notification-section"
            height="48px"
          >
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
            :key="notification.id"
          >
            <RouterLink
              v-if="notification.data.order_id != 0"
              :to="{
                name: 'laffah-orders-preview-id',
                params: { id: notification.data.order_id },
              }"
            >
              <VListItem
                :title="notification.data.branch"
                :subtitle="notification.data.message"
                link
                lines="one"
                min-height="66px"
                @click="markAsRead(notification.id)"
              >
                <!-- Slot: Prepend -->
                <!-- Handles Avatar: Image, Icon, Text -->
                <template #prepend>
                  <VListItemAction start>
                    <VAvatar
                      :color="notification.color || 'primary'"
                      :image="notification.img || undefined"
                      :icon="notification.icon || undefined"
                      size="40"
                      variant="tonal"
                    >
                      <span v-if="notification.data.user">{{
                        avatarText(notification.data.user)
                      }}</span>
                    </VAvatar>
                  </VListItemAction>
                </template>
                <!-- Slot: Append -->
                <template #append>
                  <small class="whitespace-no-wrap text-medium-emphasis">{{
                    moment(notification.created_at).fromNow()
                  }}</small>
                </template>
              </VListItem>
            </RouterLink>

            <a v-else :href="notification.data.full_url" target="_blank">
              <VListItem
                :title="notification.data.branch"
                :subtitle="notification.data.message"
                link
                lines="one"
                min-height="66px"
                @click="markAsRead(notification.id)"
              >
                <!-- Slot: Prepend -->
                <!-- Handles Avatar: Image, Icon, Text -->
                <template #prepend>
                  <VListItemAction start>
                    <VAvatar
                      :color="notification.color || 'primary'"
                      :image="notification.img || undefined"
                      :icon="notification.icon || undefined"
                      size="40"
                      variant="tonal"
                    >
                      <span v-if="notification.data.user">{{
                        avatarText(notification.data.user)
                      }}</span>
                    </VAvatar>
                  </VListItemAction>
                </template>
                <!-- Slot: Append -->
                <template #append>
                  <small class="whitespace-no-wrap text-medium-emphasis">{{
                    moment(notification.created_at).fromNow()
                  }}</small>
                </template>
              </VListItem>
            </a>

            <VDivider />
          </template>

          <!-- 👉 Footer -->
          <VListItem
            v-if="props.notifications.length > 0"
            class="notification-section"
          >
            <VBtn block @click="readAllNotifications()">
              READ ALL NOTIFICATIONS
            </VBtn>
          </VListItem>
          <VListItem class="notification-section" v-else>
            <span>There are no notifications</span>
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
.v-list-item--one-line .v-list-item-subtitle {
  -webkit-line-clamp: 2;
}
.v-list-item-subtitle {
  margin-right: 2px;
  font-size: 0.86rem;
}
</style>
<style scoped>
.v-list-item--density-default:not(.v-list-item--nav).v-list-item--one-line {
  padding-inline-start: 4px;
  padding-inline-end: 4px;
}
</style>
