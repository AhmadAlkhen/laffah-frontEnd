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

    // 👉 fetch single user
    // fetchUser(id) {
    //   return new Promise((resolve, reject) => {
    //     axios.get(`/apps/users/${id}`).then(response => resolve(response)).catch(error => reject(error))
    //   })
    // },
  },
})
