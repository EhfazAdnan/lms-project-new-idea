export const apiUrl = import.meta.env.VITE_API_URL;

const userInfoLms = localStorage.getItem("userInfoLms");
export const token = userInfoLms ? JSON.parse(userInfoLms).token : null;