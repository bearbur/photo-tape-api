const withApiPrefix = (url: string) => `/photo_tape_api/${url}`;
const withUserPrefix = (url: string) => `user/${url}`;
const withArticlePrefix = (url: string) => `articles/${url}`;

/* User endpoints */

export const userRegister = withApiPrefix(withUserPrefix('register'));
export const userProfile = withApiPrefix(withUserPrefix('profile'));
export const userLogin = withApiPrefix(withUserPrefix('login'));
export const userLogout = withApiPrefix(withUserPrefix('logout'));
export const userChangePassword = withApiPrefix(withUserPrefix('change/password'));
export const userReAuth = withApiPrefix(withUserPrefix('reauth'));

/* Articles endpoints */

export const freshArticles = withApiPrefix(withArticlePrefix('fresh'));
export const newArticle = withApiPrefix(withArticlePrefix('new'));
