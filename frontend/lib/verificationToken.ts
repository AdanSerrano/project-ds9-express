export const isLoggedIn = () => {
    const token = sessionStorage.getItem('token');
    return !!token;
};


export const LogoutClick = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('User');
}