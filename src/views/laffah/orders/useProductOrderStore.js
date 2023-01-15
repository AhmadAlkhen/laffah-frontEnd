import axios from 'axios';
import { defineStore } from 'pinia';

export const useProductOrderStore = defineStore('ProductOrderStore', {
  actions: {
    // 👉 Fetch users data
    fetchProductsOrder(params) {
      
      // let order=null;
      
      //  axios.get('/order/myOrder').then((response) => {
      //   console.log(response.data);
      //   order=response.data
      // }).catch((err)=>{console.log(err)})
      
    
    return axios.get('/order/products',{ params });
    },



    // 👉 fetch single user
    fetchOrder(id) {
      return new Promise((resolve, reject) => {
        axios.get(`/order/preview/${id}`).then(response => resolve(response)).catch(error => reject(error))
      })
    },
  },
})
