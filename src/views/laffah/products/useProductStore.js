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

    // addItem(item){
    //   item.quantity=0;
    //   this.myItems.push(item);
    //   localStorage.setItem('cart',JSON.stringify(this.myItems));
    // },
    addItem(item ,qty) {
      // Check if the item already exists in myItems array
      const index = this.myItems.findIndex((el) => el.sku === item.sku);
    
      if (index >= 0) {
        // If the item exists, increase its quantity by 1
        alert("The item is already in the cart");
        return;
      } else {
        // If the item does not exist, add it to the array
        item.quantity = qty;
        this.myItems.push(item);
      }
    
      // Store the updated myItems array in local storage
      localStorage.setItem('cart', JSON.stringify(this.myItems));
    },
    
    changeQuantity(item,newQuantity){
   
      const index = this.myItems.findIndex((el) => el.id === item.id);
      if (index >= 0) {
        this.myItems[index].quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(this.myItems));
      }

    },

    addItems(items){
      this.myItems = items;

      for (let i = 0; i < this.myItems.length; i++) {
        this.myItems[i].quantity = 0;
      }
    
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
