
export default  {
    namespaced: true,
    state: {
        userData: null,
        accessToken:"",
        authenticated:false,
        userRole:"adminnn"
      },
      mutations: {
        SET_USER_DATA(state, data) {
            state.userData = data;
        },
        SET_USER_ROLE(state, data) {
            state.userRole = data;
        },
     },

     actions: {
        getUserData({commit }){
            const user = JSON.parse(localStorage.getItem("userData"));
            const token =  localStorage.getItem('accessToken');
      
            commit('SET_USER_DATA',user );
            commit('SET_USER_ROLE',user.userRole );

          },
    },


}