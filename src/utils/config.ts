import axios from "axios"

export const Request = axios.create({
  baseURL: "http://37.27.29.18:8007/"
});

Request.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

Request.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      window.location.href = "/login"
    }
    return Promise.reject(err)
  }
)
