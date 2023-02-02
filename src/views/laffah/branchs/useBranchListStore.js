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
    updateBranch(branchData) {

      return new Promise((resolve, reject) => {
        
        const formData = new FormData();
        formData.append('id',branchData.id);
        formData.append('name',branchData.fullName);
        formData.append('status',branchData.status);
        axios.post('/branch/update', formData).then(response => resolve(response))
          .catch(error => reject(error))
      })
    },

    // 👉 fetch branch user
    fetchBranch(id) {
      return new Promise((resolve, reject) => {
        axios.get(`/branch/preview/${id}`).then(response => resolve(response)).catch(error => reject(error))
      })
    },
  },
})
