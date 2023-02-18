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
     axios.get('/notification/index').then((res)=>{
      this.notifications = res.data.notification;
    })
    },

    // 👉 fetch Notifications
    changeIsRead(id) {
     axios.post("/notification/isRead", { id: id });
     this.fetchNotifications();  
    },
    readAllNotifications() {
     axios.post("/readAllNotifications" );
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
