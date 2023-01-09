import axios from 'axios'
import { defineStore } from 'pinia'

export const useBranchListStore = defineStore('BranchListStore', {
  actions: {
    // 👉 Fetch Branch data
    fetchBranchs(params) { return axios.get('/branch/index', { params }) },

    // 👉 Add Branch
    addBranch(branchData) {

      console.log(branchData.fullName)
      return new Promise((resolve, reject) => {
        
        const formData = new FormData();
        formData.append('name',branchData.fullName);
        formData.append('status',branchData.status);
        axios.post('/branch/store', formData).then(response => resolve(response))
          .catch(error => reject(error))
      })
    },

    // 👉 fetch single user
    fetchUser(id) {
      return new Promise((resolve, reject) => {
        axios.get(`/apps/users/${id}`).then(response => resolve(response)).catch(error => reject(error))
      })
    },
  },
})
