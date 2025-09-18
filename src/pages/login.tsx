import { Input } from "@/components/ui/input"
import { Request } from "@/utils/config"
import { useNavigate } from "react-router-dom"

import logo from '@/assets/logo.svg'
import { useEffect } from "react"


import { jwtDecode } from "jwt-decode";
interface JwtPayload {
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
  [key: string]: any;
}


const Login = () => {


  let navigate = useNavigate()

  async function login(userName: string, password: string) {
    const res = await Request.post(`Account/login`, { userName, password });
    if (res.data.data) {
      const token = res.data.data;
      try {
        const decodedToken = jwtDecode<JwtPayload>(token);
        const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        if (role.includes("Admin") || role.includes("SuperAdmin")) {
          localStorage.setItem("accessToken", token);
          navigate("/");
        } else {
          alert("No Admin");
          return;
        }
      } catch (err) {
        console.error("Invalid token", err);
        return;
      }
    }
    return res.data;
  }

  const hadnleSubmit = (e: any) => {
    e.preventDefault()
    let userName = e.target["userName"].value
    let password = e.target["password"].value
    login(userName, password)
  }

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decodedToken = jwtDecode<JwtPayload>(token);
      const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      if (role.includes("Admin") || role.includes("SuperAdmin")) {
        navigate("/");
      } else {
        navigate("/login");
      }

    } catch {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap " >
        <div className="xl:w-[50%] sm:w-[100%] xl:block sm:hidden    xl:min-h-screen sm:h-[50vh]  flex items-center  bg-gradient-to-r from-[#4c6085] to-[#1C2536]  via-[#1C2536] " >
          <div className="ml-[7%] mt-[260px] " >
            <p className="text-white text-[26px] font-medium" >Welcome to admin panel</p>
            <img src={logo} alt="" className="w-[400px]" />
          </div>
        </div>
        <div className="xl:w-[50%]  flex items-center justify-center sm:w-[90%] m-auto  mt-[160px] ">
          <form onSubmit={hadnleSubmit} className="xl:w-[60%] bg-white p-8 rounded-xl shadow-lg sm:w-[100%] ">
            <p className="text-4xl font-semibold mb-6 text-gray-800">Log in</p>
            <Input
              type="text"
              name="userName"
              className={`w-full p-3 mb-4 border border-gray-300 text-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400  `}
              placeholder="Username"
            />
            <Input
              type="password"
              name="password"
              className={`w-full p-3 mb-4 border border-gray-300 text-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400  `}
              placeholder="Password"
            />
            <button
              type="button"
              className="w-full text-blue-600 bg-white py-3 rounded mb-4 hover:bg-blue-50 transition-colors"
            >
              Forgot password?
            </button>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition-colors"
            >
              Submit
            </button>
          </form>
        </div>

      </div>
    </div >
  )
}

export default Login
