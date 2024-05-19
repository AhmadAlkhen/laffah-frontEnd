import axios from 'axios';
import { defineStore } from 'pinia';

export const useSupplierListStore = defineStore('SupplierListStore', {
  state: () => {
    return {
      // all these properties will have their type inferred automatically
    branches:[],
    // branchesNew:[],
    }
  },
  getters:{
    getAllBranches(state){
      let allBranches=[];
      this.fetchBranches().then((res)=>{
        // allBranches=res.data.data
        state.branches=res.data.data.data
        // console.log(res.data)
      }).then(()=>{
        state.branches.forEach((branch)=>{
          allBranches.push({
            title:branch.name,
            value:branch.id
          })
        })
        state.branches=allBranches
      })
      return allBranches
    }

  },
  actions: {
    // 👉 Fetch Branch data
    fetchSuppliers(params) { return axios.get('/suppliers/index', { params }) },

    fetchBranches() { return axios.get('/branch/index') },

    // 👉 Add Branch
    addSupplier(supplierData) {

      return new Promise((resolve, reject) => {
        
        const formData = new FormData();
        formData.append('name',supplierData.name);
        formData.append('email',supplierData.email);
        formData.append('phone',supplierData.phone);
        formData.append('type',supplierData.type);
        if(supplierData.additional_info)
        formData.append('additional_info',supplierData.additional_info);
        formData.append('status',supplierData.status);
        axios.post('/suppliers/store', formData).then(response => resolve(response))
          .catch(error =>{
             reject(error)
            // console.log(error.message)
          } )
      })
    },

    // 👉 fetch single supplier
    getSupplier(id) {
      return new Promise((resolve, reject) => {
        axios.get(`/suppliers/preview/${id}`).then(response => resolve(response)).catch(error => reject(error))
      })
    },
    // 👉 fetch single supplier category
    getSupplierCategory(id) {
      return new Promise((resolve, reject) => {
        axios.get(`/suppliers/categories/${id}`).then(response => resolve(response)).catch(error => reject(error))
      })
    },

    // 👉 fetch single supplier products
    getSupplierProduct(id) {
      return new Promise((resolve, reject) => {
        axios.get(`/suppliers/products/${id}`).then(response => resolve(response)).catch(error => reject(error))
      })
    },

    // 👉 Update Supplier 
    updateSupplier(supplierData) {
      return new Promise((resolve, reject) => {
        axios.post('/suppliers/update',supplierData).then(response => resolve(response)).catch(error => reject(error))
      })
    },

    // delete Supplier
    deleteSupplier(id) {
      return new Promise((resolve, reject) => {
        axios.delete(`/suppliers/delete/${id}`).then(response => resolve(response)).catch(error => reject(error))
      })
    }

  },
})
