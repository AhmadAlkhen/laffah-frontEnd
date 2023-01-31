// import { router } from '@/router';
import axios from 'axios';
import { defineStore } from 'pinia';

// const router = router();
export const useUserStore = defineStore('userStore', {
  // arrow function recommended for full type inference
  state: () => {
    return {
      // all these properties will have their type inferred automatically
      userData: localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')):null,
      accessToken:"",
      authenticated:false,
      userRole:localStorage.getItem('userRole') ? localStorage.getItem('userRole'):null,
      userAbilities:[{
        action: "manage",
        subject: "all",
      }]
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
    async login(formData) {
      try {
          const user = await axios.post("auth/login", formData);
      
          // this.userData = user.data.userData;
          // // store user details and jwt in local storage to keep user logged in between page refreshes
          // localStorage.setItem('userData', JSON.stringify(user.data.userData));
          // var userRole = user.data.userData.role.split('"').join('');
          // localStorage.setItem('userRole', userRole);

          // localStorage.setItem(
          //   "userAbilities",
          //   JSON.stringify(this.userAbilities)
          // );
          // // ability.update(userAbilities);
          // localStorage.setItem("accessToken", user.data.accessToken);
          // redirect to previous url or default to home page
          // return user
         
      } catch (error) {
        console.log(error);
        return error
        
      }
  },
  setUserRole(state, userRole) {
    console.log(userRole)
    state.userRole = userRole
  },
  },

})