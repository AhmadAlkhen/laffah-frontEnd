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
        formData.append('image',productData.image);
        axios.post('/product/store', formData).then(response => resolve(response))
          .catch(error => reject(error))
      })
    },

    uploadProducts(fileImport){
      return new Promise((resolve, reject) => {
        
        const formData = new FormData();
        formData.append('file',fileImport);

        axios.post('/product/import', formData).then(response => resolve(response))
          .catch(error => reject(error))
      })

    }

    // 👉 fetch single user
    // fetchUser(id) {
    //   return new Promise((resolve, reject) => {
    //     axios.get(`/apps/users/${id}`).then(response => resolve(response)).catch(error => reject(error))
    //   })
    // },
  },
})
