import axios from 'axios'
import { defineStore } from 'pinia'

export const useProductListStore = defineStore('ProductListStore', {
  actions: {
    // 👉 Fetch product data
    fetchProducts(params) { return axios.get('/product/index', { params }) },

    // 👉 Add product
    addProduct(productData) {

      return new Promise((resolve, reject) => {
        
        const formData = new FormData();
        formData.append('name',productData.fullName);
        formData.append('sku',productData.sku);
        formData.append('category',productData.category.value);
        formData.append('unit',productData.unit);
        formData.append('status',productData.status);
        if(productData.image && productData.image != undefined && productData.image != null)
        formData.append('image',productData.image);
        axios.post('/product/store', formData).then(response => resolve(response))
          .catch(error => reject(error))
      })
    },

    updateProduct(productData) {

      return new Promise((resolve, reject) => {
        
        const formData = new FormData();
        formData.append('id',productData.id);
        formData.append('name',productData.name);
        formData.append('sku',productData.sku);
        formData.append('category',productData.category);
        formData.append('unit',productData.unit);
        formData.append('status',productData.status);
        if(productData.image && productData.image != undefined && productData.image != null){
          formData.append('image',productData.image);
        }
        axios.post('/product/update', formData).then(response => resolve(response))
          .catch(error => reject(error))
      })
    },

    // 👉 fetch product 
    getProduct(id) {
      return new Promise((resolve, reject) => {
        axios.get(`/product/preview/${id}`).then(response => resolve(response)).catch(error => reject(error))
      })
    },
    
    uploadProducts(fileImport){
      return new Promise((resolve, reject) => {
        
        const formData = new FormData();
        formData.append('file',fileImport);

        axios.post('/product/import', formData).then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    uploadImages(images){
      return new Promise((resolve, reject) => {
        
        // const formData = new FormData();
        // formData.append('images',images);

        axios.post('/product/import/images', images).then(response => resolve(response))
          .catch(error => reject(error))
      })

    },

    // delete Product
    deleteProduct(id) {
      return new Promise((resolve, reject) => {
        axios.delete(`/product/delete/${id}`).then(response => resolve(response)).catch(error => reject(error))
      })
    }

  },
})
