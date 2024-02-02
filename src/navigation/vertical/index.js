import { useAuthStore } from "@/views/laffah/auth/useAuthStore";
import { computed } from 'vue';
import admin from "./admin";
import branch from "./branch";
import warehouse from "./warehouse";
import manager from "./manager";

const authStore = useAuthStore();

const routesArray = computed(() => {
  const userRole = authStore.userRole;
  const routes = [];

  if (userRole === 'admin') {
    routes.push(...admin);
  }

  if (userRole === 'branch') {
    routes.push(...branch);
  }

  if (userRole === 'warehouse') {
    routes.push(...warehouse);
  }
  if (userRole === 'manager') {
    routes.push(...manager);
  }

  return routes;
});

export default routesArray;