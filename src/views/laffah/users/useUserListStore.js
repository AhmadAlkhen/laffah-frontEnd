import axios from 'axios';
import { defineStore } from 'pinia';

export const useUserListStore = defineStore('UserListStore', {
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
    fetchUsers(params) { return axios.get('/users/index', { params }) },

    fetchBranches() { return axios.get('/branch/index') },

    // 👉 Add Branch
    addUser(userData) {

      return new Promise((resolve, reject) => {
        
        const formData = new FormData();
        formData.append('name',userData.name);
        formData.append('email',userData.email);
        formData.append('password',userData.password);
        formData.append('role',userData.role);
        formData.append('branch_id',userData.branch);
        formData.append('status',userData.status);
        console.log(userData.status)
        axios.post('/users/store', formData).then(response => resolve(response))
          .catch(error =>{
            // reject(error)
            console.log(error.message)
          } )
      })
    },

    // 👉 fetch single user
    getUser(id) {
      return new Promise((resolve, reject) => {
        axios.get(`/users/preview/${id}`).then(response => resolve(response)).catch(error => reject(error))
      })
    },
    // 👉 fetch single user category
    getUserCategory(id) {
      return new Promise((resolve, reject) => {
        axios.get(`/users/categories/${id}`).then(response => resolve(response)).catch(error => reject(error))
      })
    },

    // 👉 Update User 
    updateUser(userData) {
      return new Promise((resolve, reject) => {
        axios.post('/users/update',userData).then(response => resolve(response)).catch(error => reject(error))
      })
    },

    // delete User
    deleteUser(id) {
      return new Promise((resolve, reject) => {
        axios.delete(`/users/delete/${id}`).then(response => resolve(response)).catch(error => reject(error))
      })
    }

  },
})
