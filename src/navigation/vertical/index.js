import { useAuthStore } from "@/views/laffah/auth/useAuthStore";
import { computed } from 'vue';
import admin from "./admin";
import branch from "./branch";
import warehouse from "./warehouse";

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

  return routes;
});

export default routesArray;