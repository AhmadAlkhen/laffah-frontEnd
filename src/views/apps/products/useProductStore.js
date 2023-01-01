import axios from '@axios';
import { defineStore } from 'pinia';

export const useProductStore = defineStore('ProductStore', {

  state: () => ({ myItems: []  }),

  getters: {
    getItemLocalStarage(state) {
      const myCart = JSON.parse(localStorage.getItem("cart"));

      state.myItems = myCart;
      console.log(state.myItems);
      return state.myItems
    },
  },
  actions: {
    // 👉 Fetch all Invoices
    fetchProducts(data) {
      return axios.get('http://localhost:8000/api/products/search')
    },

    addItem(item){
      this.myItems.push(item);

      localStorage.removeItem("cart");

      localStorage.setItem('cart',JSON.stringify(this.myItems));
    },

    deleteItem(itemId){
      // console.log(itemId+'AA');

      this.myItems = this.myItems.filter((el) =>{ return el.id != itemId});
    
    // console.log(this.myItems)
      localStorage.removeItem("cart");

      localStorage.setItem('cart',JSON.stringify(this.myItems))
    },
    fetchItemCart(){
      return this.myItems;
    },


  },
})
