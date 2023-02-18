import axios from '@axios';
import { defineStore } from 'pinia';

export const useProductStore = defineStore('ProductStore', {

  state: () => ({ myItems: []  }),

  getters: {
    getItemLocalStarage(state) {
      const myCart = localStorage.getItem("cart")? JSON.parse(localStorage.getItem("cart")) :[];

      state.myItems = myCart;
      // console.log(state.myItems);
      return state.myItems
    },
  },
  actions: {
    // 👉 Fetch all Invoices
    fetchProducts(data) {
      return axios.get('/products/search')
    },

    addItem(item){
      this.myItems.push(item);

      // console.log(this.myItems);
      // localStorage.removeItem("cart");

      localStorage.setItem('cart',JSON.stringify(this.myItems));
    },

    addItems(items){
      this.myItems = items;

      localStorage.setItem('cart',JSON.stringify(this.myItems));
    },





    deleteItem(itemId){
      // console.log(itemId+'AA');

      this.myItems = this.myItems.filter((el) =>{ return el.id != itemId});
    
    // console.log(this.myItems)
      // localStorage.removeItem("cart");

      localStorage.setItem('cart',JSON.stringify(this.myItems))
    },
    fetchItemCart(){
      return this.myItems;
    },

    resetCart(){
      localStorage.removeItem("cart");
      this.myItems=[];
    }



  },
})
