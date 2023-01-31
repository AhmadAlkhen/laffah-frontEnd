import { reactive } from 'vue';
import admin from "./admin";
import branch from "./branch";
import warehouse from "./warehouse";


const routesArray = [];
const state = reactive({
  userRole: localStorage.getItem('userRole')
});

if (state.userRole === 'admin') {
  routesArray.push(...admin);
}

if (state.userRole === 'branch') {
  routesArray.push(...branch);
}

if (state.userRole === 'warehouse') {
  routesArray.push(...warehouse);
}

export default routesArray;