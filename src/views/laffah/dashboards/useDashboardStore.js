import axios from 'axios'
import { defineStore } from 'pinia'

export const useDashboardStore = defineStore('DashboardStore', {
  actions: {
    // 👉 Fetch Branch data
    fetchStatistics(params) { return axios.get('/dashboard', { params }) },


    // 👉 fetch branch user
    // fetchBranch(id) {
    //   return new Promise((resolve, reject) => {
    //     axios.get(`/branch/preview/${id}`).then(response => resolve(response)).catch(error => reject(error))
    //   })
    // },
  },
})
