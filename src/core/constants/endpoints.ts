const withApiPrefix = (url : string) => `/api/${url}`
const withUserPrefix = (url: string) => `user/${url}`

/* User routes */

export const userRegister = withApiPrefix(withUserPrefix('register'));
export const userProfile = withApiPrefix(withUserPrefix('profile'));
export const userLogin  = withApiPrefix(withUserPrefix('login'));
export const userLogout  = withApiPrefix(withUserPrefix('logout'));
