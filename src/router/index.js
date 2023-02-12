// import { canNavigate } from '@layouts/plugins/casl'
import { setupLayouts } from 'virtual:generated-layouts';
import { createRouter, createWebHistory } from 'vue-router';
import routes from '~pages';
import { isUserLoggedIn } from './utils';
const userRole=localStorage.getItem('userRole')?localStorage.getItem('userRole'):null




const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ℹ️ We are redirecting to different pages based on role.
    // NOTE: Role is just for UI purposes. ACL is based on abilities.
    {
      path: '/',
      redirect: to => {
        // const userData = JSON.parse(localStorage.getItem('userData') || '{}')
        const userRole = localStorage.getItem('userRole') ? localStorage.getItem('userRole') : null
        // if (userRole === 'admin')
        //   return { name: 'dashboards-analytics' }
        // if (userRole === 'branch')
        //   return { name: 'access-control' }
        
        // return { name: 'login' }
        return { name: 'dashboard'}
      },
    },
    {
      path: '//user-profile',
      redirect: () => ({ name: 'pages-user-profile-tab', params: { tab: 'profile' } }),
    },
    {
      path: '/pages/account-settings',
      redirect: () => ({ name: 'pages-account-settings-tab', params: { tab: 'account' } }),
    },
    // my route
    // {
    //   path: '/laffah/branches/list',
    //   name: 'branches-list',
    //   component: () => import('@/pages/laffah/branches/list.vue'),
    //   beforeEnter: (to, from, next) => {
    //     if (userRole =='admin') {
    //      return next()
    //     } else {
    //       return next({ name: 'unauthorized' })
    //     }
    //   }
    // },





    ...setupLayouts(routes),
  ],
})

// const myMiddleware = (to, from, next) => {
//   console.log(`Navigating from ${from.path} to ${to.path}`);
//   next();
// };


// Docs: https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
// router.beforeEach(to => {
//   const isLoggedIn = isUserLoggedIn()

  /*
  
    ℹ️ Commented code is legacy code
  
    if (!canNavigate(to)) {
      // Redirect to login if not logged in
      // ℹ️ Only add `to` query param if `to` route is not index route
      if (!isLoggedIn)
        return next({ name: 'login', query: { to: to.name !== 'index' ? to.fullPath : undefined } })
  
      // If logged in => not authorized
      return next({ name: 'not-authorized' })
    }
  
    // Redirect if logged in
    if (to.meta.redirectIfLoggedIn && isLoggedIn)
      next('/')
  
    return next()
  
    */
//   if (canNavigate(to)) {
//     if (to.meta.redirectIfLoggedIn && isLoggedIn)
//       return '/'
//   }
//   else {
//     if (isLoggedIn)
//       return { name: 'not-authorized' }
//     else
//       return { name: 'login', query: { to: to.name !== 'index' ? to.fullPath : undefined } }
//   }
// })

// router.beforeEach((to, from, next) => {
//   const isLoggedIn = isUserLoggedIn()
  
// if (isLoggedIn) {
//   return next()
// }else{
//   return next({ name: 'login', query: { to: to.name !== 'index' ? to.fullPath : undefined } }) 
// }

// })

router.beforeEach((to, from, next) => {
    // to.name !== 'Login' && 
  const isLoggedIn = isUserLoggedIn()
  const userRole=localStorage.getItem('userRole')?localStorage.getItem('userRole'):null

  // console.log(userRole)
  // console.log(to.name)

  if (to.name !== 'login' && !isLoggedIn){
    return next({ name: 'login', query: { to: to.name !== 'index' ? to.fullPath : undefined } }) 
      //  return next({ name: 'login' }) 
  }
  else{
    switch (to.name) {
      // case 'dashboards-analytics':
      //   if (from.name == 'login') {
      //     console.log('from login')
      //     return  next()
      //     location.reload()
      //   } else {
      //     console.log(' not from login')
      //     return next()
      //   }
      //   break
      case 'laffah-branches-list':
        if (userRole=='admin') {
         return next()
        } else {
          return next({ name: 'not-authorized' })
        }
        break
      case 'laffah-users-list':
        if (userRole === 'admin') {
          return next()
        } else {
          return next({ name: 'not-authorized' })
        }
        break
      case 'laffah-categories-list':
        if (userRole === 'admin' || userRole === 'warehouse' ) {
          return next()
        } else {
          return next({ name: 'not-authorized' })
        }
        break
      case 'laffah-products-list':
        if (userRole === 'admin' || userRole === 'warehouse' ) {
          return next()
        } else {
          return next({ name: 'not-authorized' })
        }
        break
      default:
        return next()
    }
  } 
  // else{
  //   if(to.name==='laffah-users-list'|| to.name==='laffah-branches-list'){
  //     if(userRole !=='admin'){
  //       return next({name:'not-authorized'})
  //     } 
  //   }        
  //   else 
  //   return next()
  // } 
})

export default router
