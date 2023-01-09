import { defineStore } from 'pinia';

export const useUserStore = defineStore('userStore', {
  // arrow function recommended for full type inference
  state: () => {
    return {
      // all these properties will have their type inferred automatically
      userData: {},
      accessToken:"",
      authenticated:false,
      userRole:""
    }
  },
  getters:{
    // getUserData(state) {
    //   return state.userData 
    // },
    // getRole(state) {
    //   return state.userRole 
    // },
    // getAccessToken(state) {
    //   return state.accessToken 
    // },
    
    // getAuthenticated(state) {
    //   return state.authenticated 
    // },

    getUserData(state){
      const user = JSON.parse(localStorage.getItem("userData"));
      const token =  localStorage.getItem('accessToken');

      state.userData = user;
      state.userRole = user.role;
      state.accessToken = token;
  
      return state.userData
    }

  },
  // actions: {
  //   // 👉 Fetch Clients
  //   fetchUserData() {

  //     const data =localStorage.getItem('userData')
  //     console.log('fetchUserData')
  //     this.user=data
  //     this.userRole=data.role
  //     return data
  //   },
  // },

})