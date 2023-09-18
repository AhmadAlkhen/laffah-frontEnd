import axios from 'axios';
import { defineStore } from 'pinia';

export const useNotificationListStore = defineStore('NotificationListStore', {

  state: () => ({ notifications: []  }),

  getters: {
    getNotifications(state) {
      return state.notifications
    },
  },


  actions: {
    // 👉 fetch Notifications
    fetchNotifications() {
      axios.get('/notifications/unread').then((res)=>{
        this.notifications = res.data.unreadNotifications;
      })
    },

    // 👉 markAsRead 
    markAsRead(id) {
     axios.post(`/notifications/${id}/read`);
     this.fetchNotifications();  
    },
    readAllNotifications() {
     axios.post("/notifications/read" );
     this.fetchNotifications();  
    },

    // 👉 fetch Notifications
    // fetchNotifications() {
    //   return new Promise((resolve, reject) => {
    //     axios.get('/notification/index').then(response => resolve(response)).catch(error => reject(error))
    //   })
    // },
  },
})
