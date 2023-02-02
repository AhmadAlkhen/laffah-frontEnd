import { defineStore } from 'pinia';

export const useAuthStore = defineStore('authStore', {
  state: () => {
    return {
      accessToken:localStorage.getItem('accessToken')?localStorage.getItem('accessToken'):"",
      userRole:localStorage.getItem('userRole')?localStorage.getItem('userRole'):"",
    }
  },
  
  mutations: {
    setUserRole(state, role) {
      state.userRole = role;
    },
  },
  getters:{
    getRole(state) {
    //   state.userRole= localStorage.getItem('userRole') ? localStorage.getItem('userRole'):''
      return state.userRole 
    },
    getAccessToken(state) {
      return state.accessToken 
    },
  },
  actions: {
    async login({ state }, { accessToken, role }) {
    state.accessToken = accessToken;
    state.userRole = role;
    localStorage.setItem('userRole', role);
    },

    updateData(Token, role){
        state.accessToken = Token;
        state.userRole = role;
    }


    },
})