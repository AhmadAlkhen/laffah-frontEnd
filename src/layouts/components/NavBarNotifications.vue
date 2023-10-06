<script setup>
import Notifications from "@/views/laffah/components/Notifications.vue";
import { ref, onMounted } from "vue";
import { useToast } from "vue-toastification";
const toast = useToast();
import { pusher_key } from "@/main";
import { pusher_authEndpoint } from "@/main";

import soundurl from "@/assets/notification-sound.mp3";

import Echo from "laravel-echo";
import Pusher from "pusher-js";

import { useNotificationListStore } from "@/views/laffah/notification/useNotificationListStore";
const NotificationStore = useNotificationListStore();
const notifications = ref([]);

onMounted(() => {
  NotificationStore.fetchNotifications();
});
// Watch for changes to the notifications in the store
watchEffect(() => {
  notifications.value = NotificationStore.notifications;
});

const initAudio = () => {
  // const soundurl =
  //   "http://soundbible.com/mp3/analog-watch-alarm_daniel-simion.mp3";
  // const soundurl = "../../../public/notification-sound.mp3";

  try {
    const audio = new Audio(soundurl);
    return audio;
  } catch (error) {
    console.error("Error initializing audio:", error);
    return null;
  }
};

onMounted(() => {
  try {
    const user = localStorage.getItem("userData")
      ? JSON.parse(localStorage.getItem("userData"))
      : null;
    const userId = user.id;

    if (!window.Echo) {
      const token = localStorage.getItem("accessToken");
      window.Pusher = Pusher;
      window.Echo = new Echo({
        broadcaster: "pusher",
        key: pusher_key,
        cluster: "ap2",
        forceTLS: true,
        authEndpoint: pusher_authEndpoint,
        auth: {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            // 'X-CSRF-TOKEN': this.getCsrfToken(),
          },
        },
      });
    }
    window.Echo.private(`App.Models.User.${userId}`).notification(
      (notification) => {
        // console.log(notification);
        let audioPlayer = null;
        if (!audioPlayer) {
          audioPlayer = initAudio();
        }

        // Play the audio
        audioPlayer.play();

        toast.info(
          notification.message ? notification.message : "New notification",
          {
            timeout: 3000,
          }
        );

        NotificationStore.fetchNotifications();
      }
    );

    // Pusher.log = function (message) {
    //   window.console.log(message);
    // };
  } catch (error) {
    console.error("Error setting up notifications:", error);
  }
});
</script>

<template>
  <button id="playAudioButton" style="display: none"></button>

  <Notifications :notifications="notifications" />
</template>
