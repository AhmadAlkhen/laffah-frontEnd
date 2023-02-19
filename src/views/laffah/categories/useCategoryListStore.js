import axios from 'axios'
import { defineStore } from 'pinia'

export const useCategoryListStore = defineStore('CategoryListStore', {
  actions: {
    // 👉 Fetch category data
    fetchCategories(params) { return axios.get('/category/index', { params }) },

    // 👉 Add category
    addCategory(categoryData) {

      return new Promise((resolve, reject) => {
        
        const formData = new FormData();
        formData.append('name',categoryData.fullName);
        formData.append('status',categoryData.status);
        axios.post('/category/store', formData).then(response => resolve(response))
          .catch(error => reject(error))
      })
    },

    
    // 👉 Update category
    updateCategory(categoryData) {

      return new Promise((resolve, reject) => {
        
        const formData = new FormData();
        formData.append('id',categoryData.id);
        formData.append('name',categoryData.fullName);
        formData.append('status',categoryData.status);
        axios.post('/category/update', formData).then(response => resolve(response))
          .catch(error => reject(error))
      })
    },

    // 👉 fetch category
    fetchCategory(id) {
      return new Promise((resolve, reject) => {
        axios.get(`/category/preview/${id}`).then(response => resolve(response)).catch(error => reject(error))
      })
    },

  // 👉 fetch category
    uploadCategoies(fileImport){
      return new Promise((resolve, reject) => {
        
        const formData = new FormData();
        formData.append('file',fileImport);

        axios.post('/category/import', formData).then(response => resolve(response))
          .catch(error => reject(error))
      })
    },

    // delete category
    deleteCategory(id) {
      return new Promise((resolve, reject) => {
        axios.delete(`/category/delete/${id}`).then(response => resolve(response)).catch(error => reject(error))
      })
    },

  },
})
