export default defineNuxtRouteMiddleware((to) => {
  const user = useState("user");
  if (!user.value && to.path !== "/login") {
    return navigateTo("/login");
  }
});
