import axios from 'axios';
import { defineStore } from 'pinia';

export const useOrderListStore = defineStore('OrderListStore', {
  actions: {
    // 👉 Fetch users data
    fetchOrders(params) {
    
    return axios.get('/order/myOrder',{ params });
    },




    fetchCarriers(){
      return axios.get('/users/carriers');
    },
    fetchAssistants(){
      return axios.get('/users/assistants');
    },
    fetchHelpers(){
      return axios.get('/users/helpers');
    },

    fetchAssistantCategories(id){
      return axios.get(`/users/assistant/categories/${id}`);
    },

    fetchHelperProducts(id){
      return axios.get(`/users/helper/products/${id}`);
    },

    // 👉 fetch single user
    fetchOrder(id) {
      return new Promise((resolve, reject) => {
        axios.get(`/order/preview/${id}`).then(response => resolve(response)).catch(error => reject(error))
      })
    },


    fetchOrdersToPrint(params) {
      return new Promise((resolve, reject) => {
        axios.get('/order/print',{params}).then(response => resolve(response)).catch(error => reject(error))
      })
    },
    fetchOrderToPrint(id) {
      return new Promise((resolve, reject) => {
        axios.get(`/order/print/${id}`,).then(response => resolve(response)).catch(error => reject(error))
      })
    },
  },
})
