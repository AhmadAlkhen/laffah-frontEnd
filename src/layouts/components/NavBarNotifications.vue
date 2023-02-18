<script setup>
import Notifications from "@/views/laffah/components/Notifications.vue";
import { ref, onMounted } from "vue";

import { useNotificationListStore } from "@/views/laffah/notification/useNotificationListStore";
const NotificationStore = useNotificationListStore();
const notifications = ref([]);

// onMounted(() => {
//   NotificationStore.fetchNotifications().then((res) => {
//     console.log(res.data.notification);
//     notifications.value = res.data.notification;
//   });
// });

onMounted(() => {
  NotificationStore.fetchNotifications();
});
// Watch for changes to the notifications in the store
watchEffect(() => {
  notifications.value = NotificationStore.notifications;
});
</script>

<template>
  <Notifications :notifications="notifications" />
</template>
