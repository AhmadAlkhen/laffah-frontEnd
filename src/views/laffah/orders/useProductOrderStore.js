import axios from 'axios';
import { defineStore } from 'pinia';

export const useProductOrderStore = defineStore('ProductOrderStore', {
  actions: {
    // 👉 Fetch users data
    fetchProductsOrder(params) {
      
    return axios.get('/order/products',{ params });
    },

    fetchBranches(params) {
      
    return axios.get('branch/index',{ params });
    },



    // 👉 fetch single user
    fetchOrder(id) {
      return new Promise((resolve, reject) => {
        axios.get(`/order/preview/${id}`).then(response => resolve(response)).catch(error => reject(error))
      })
    },
  },
})
