/**
 * Return if user is logged in
 * This is completely up to you and how you want to store the token in your frontend application
 * e.g. If you are using cookies to store the application please update this function
 */
export const isUserLoggedIn2 = () => !!(localStorage.getItem('userData') && localStorage.getItem('accessToken'))
// export const userRole = () => localStorage.getItem('userRole')?localStorage.getItem('userRole'):""

export const isUserLoggedIn = () => {
    return (localStorage.getItem("userData") && localStorage.getItem("accessToken") ? true : false)
}
