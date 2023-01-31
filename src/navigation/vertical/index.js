import { useUserStore } from "@/views/laffah/auth/useUserStore";
import admin from "./admin";
import branch from "./branch";
import warehouse from "./warehouse";
const userStore = useUserStore();

const routesArray = [];


const userRole =  localStorage.getItem('userRole');
// const userRole =  userStore.userRole;


if(userRole=='admin'){
    routesArray.push(...admin);
}

if(userRole=='branch'){
    routesArray.push(...branch);
}
if(userRole=='warehouse'){
    routesArray.push(...warehouse);
}

export default routesArray
