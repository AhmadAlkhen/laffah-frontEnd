import axios from 'axios';
import { defineStore } from 'pinia';

export const useOrderListStore = defineStore('OrderListStore', {
  actions: {
    // 👉 Fetch users data
    fetchOrders(params) {
      
      // let order=null;
      
      //  axios.get('/order/myOrder').then((response) => {
      //   console.log(response.data);
      //   order=response.data
      // }).catch((err)=>{console.log(err)})
      
    
    return axios.get('/order/myOrder',{ params });
    },


    fetchCarriers(){
      return axios.get('/users/carriers');
    },

    // 👉 fetch single user
    fetchOrder(id) {
      return new Promise((resolve, reject) => {
        axios.get(`/order/preview/${id}`).then(response => resolve(response)).catch(error => reject(error))
      })
    },
  },
})
