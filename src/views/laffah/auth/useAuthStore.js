import { defineStore } from 'pinia';

export const useAuthStore = defineStore('authStore', {
  state: () => {
    return {
      accessToken:"",
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