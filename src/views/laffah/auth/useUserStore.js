import { defineStore } from 'pinia';

export const useUserStore = defineStore('userStore', {
  // arrow function recommended for full type inference
  state: () => {
    return {
      // all these properties will have their type inferred automatically
      userData: null,
      accessToken:"",
      authenticated:false,
      userRole:""
    }
  },
  getters:{
    // getUserData(state) {
    //   return state.userData 
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
    },
    getRole(state) {
      return state.userRole 
    },

  },
  actions: {
    // 👉 Fetch Clients
    fetchUserData() {

      const user = JSON.parse(localStorage.getItem("userData"));
      this.userData=user;
      this.userRole=user.role;
      console.log(userRole);
      return user;
    },
  },

})