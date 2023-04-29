import axios from 'axios';
import { defineStore } from 'pinia';
export const useTemplateStore = defineStore('TemplateStore', {

  state: () => ({ myItems: []  }),

  getters: {
    getItemLocalStarage(state) {
      const myCart = localStorage.getItem("template")? JSON.parse(localStorage.getItem("template")) :[];

      state.myItems = myCart;
      // console.log(state.myItems);
      return state.myItems
    },
  },
  actions: {

    // 👉 Fetch all Templates
     fetchTemplates(params) {

    return  axios.get('/template/myTemplates',{ params });
    },
    // fetchTemplates(params) {
    //   return new Promise((resolve, reject) => {
    //     axios.get('/template/myTemplates',{params}).then(response => resolve(response)).catch(error => reject(error))
    //   })
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
      localStorage.setItem('template', JSON.stringify(this.myItems));
    },
    
    changeQuantity(item,newQuantity){
   
      const index = this.myItems.findIndex((el) => el.id === item.id);
      if (index >= 0) {
        this.myItems[index].quantity = newQuantity;
        localStorage.setItem('template', JSON.stringify(this.myItems));
      }

    },

    addItems(items){
      this.myItems = items;

      for (let i = 0; i < this.myItems.length; i++) {
        this.myItems[i].quantity = 0;
      }
    
      localStorage.setItem('template',JSON.stringify(this.myItems));
    },



    deleteItem(itemId){
      // console.log(itemId+'AA');

      this.myItems = this.myItems.filter((el) =>{ return el.id != itemId});

      localStorage.setItem('template',JSON.stringify(this.myItems))
    },
    fetchItemCart(){
      return this.myItems;
    },

    resetCart(){
      localStorage.removeItem("template");
      this.myItems=[];
    },

    fetchTemplate(id) {
      return new Promise((resolve, reject) => {
        axios.get(`/template/preview/${id}`).then(response => resolve(response)).catch(error => reject(error))
      })
    },

    updateTemplate(id){
      let products=[];
      let productsCart=[];
      let template={};
      let templateInfo={};
      // this.resetCart();
      axios.get(`/template/preview/${id}`).then((res)=>{
        productsCart=res.data.data;
        template=res.data.template;

        productsCart.forEach(element => {
          element.product.quantity=element.quantity;
          products.push(element.product);
        });
        // console.log(template);

        templateInfo.products=products;
        templateInfo.template=template;
        localStorage.setItem('templateInfo', JSON.stringify(templateInfo));

      }).catch((error)=>{});

    },

    deleteTemplate(id) {
      return new Promise((resolve, reject) => {
        axios.delete(`/template/delete/${id}`).then(response => resolve(response)).catch(error => reject(error))
      })
    },
    
  },
})
