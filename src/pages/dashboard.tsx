import p1 from "@/assets/p1.png"
import p2 from "@/assets/p2.png"
import p3 from "@/assets/p3.png"
import sham from "@/assets/shamp.png"

import { ChartLineDotsColors } from "@/components/lineChart"
import { useUserGetQuery } from "@/rtk/adminSl"
import { Link } from "react-router-dom"

const prod = [
  { img: p1, name: "Sales", color: "#FEF3F2", price: 152 },
  { img: p2, name: "Cost", color: "#FEF3F2", price: 99.7 },
  { img: p3, name: "Profit", color: "#FEF3F2", price: 32.1 },
]

const selProd = Array(5).fill({
  img: sham,
  t1: "Healthcare Erbology",
  t2: "in Accessories",
  price: "13,153",
  t3: "in sales",
})

const Dashboard = () => {
  const { data: dataUs, isLoading } = useUserGetQuery({})

  console.log("Data:", dataUs?.data);

  const SkeletonRow = () => (
    <tr>
      <td className="px-4 py-2">
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
      </td>
      <td className="px-4 py-2">
        <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
      </td>
      <td className="px-4 py-2">
        <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
      </td>
    </tr>
  )

  return (
    <div>
      <h1 className="font-bold text-2xl md:text-3xl">Dashboard</h1>

      <div className="mt-4 flex flex-col xl:flex-row gap-6">

        <div className="w-full xl:w-[60%]">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {prod.map((e, i) => (
              <div
                key={i}
                className={`border flex items-center justify-center gap-3 rounded-md p-4 bg-[${e.color}]
            text-slate-900 dark:bg-slate-900 dark:text-white transition-colors duration-300`}
              >
                <img src={e.img} alt={e.name} className="w-10 h-10" />
                <div className="flex flex-col">
                  <span className="font-medium">{e.name}</span>
                  <span className="font-bold">{e.price}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <ChartLineDotsColors />
          </div>
        </div>


        <div className="w-full xl:w-[35%] border rounded-md p-5 py-6">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Top selling products</span>
            <Link to={"/products"} >
              <span className="text-blue-500 cursor-pointer text-sm">See All</span>
            </Link>
          </div>
          <div>
            {selProd.map((e, i) => (
              <div
                key={i}
                className="flex items-center mt-3 mb-1 justify-between"
              >
                <img src={e.img} alt="" className="w-[60px] dark:invert" />
                <div className="flex-1 ml-2">
                  <h1 className="text-sm font-medium">{e.t1}</h1>
                  <h1 className="text-gray-500 text-xs">{e.t2}</h1>
                </div>
                <div className="text-right">
                  <h1 className="text-green-400 font-semibold text-sm">{e.price}</h1>
                  <h1 className="text-gray-400 text-xs">{e.t3}</h1>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col xl:flex-row gap-6">
        {["Recent Transactions", "Top Users by Units Sold"].map((title, idx) => (
          <div
            key={idx}
            className="
        flex-1 p-4 rounded-xl border border-gray-200
        bg-gradient-to-b from-white/80 to-blue-50/30
        dark:from-[#0A0A0AFF] dark:to-[#171227FF]/30
        shadow-sm hover:shadow-md
        transition-all duration-300
      "
          >
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
              {title}
            </h2>

            <div className="max-h-[340px] overflow-y-auto rounded-xl" style={{ scrollbarColor:"transparent transparent"}} >

              <table className="hidden sm:table w-full border-separate border-spacing-0 rounded-2xl overflow-hidden shadow-sm">
                <thead className="bg-gray-100 dark:bg-[#171227]">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Phone</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {isLoading
                    ? Array(5).fill(null).map((_, i) => <SkeletonRow key={i} />)
                    : dataUs?.data?.slice(0, 10).map((user: any, i: number) => (
                      <tr
                        key={i}
                        className="
            hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100
            dark:hover:from-cyan-700/20 dark:hover:to-cyan-600/10
            transition-all duration-300 cursor-pointer
          "
                      >
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                          {user?.userName}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                          {user?.dob}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                          {user?.phoneNumber}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>



              <div className="sm:hidden space-y-3">
                {isLoading
                  ? Array(5).fill(null).map((_, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 animate-pulse"
                    ></div>
                  ))
                  : dataUs?.data?.slice(0, 10).map((user: any, i: number) => (
                    <div
                      key={i}
                      className="
                  p-3 rounded-lg border border-gray-200 dark:border-gray-700
                  bg-gradient-to-r from-blue-50/30 to-blue-100/20
                  dark:from-cyan-700/20 dark:to-cyan-600/10
                  hover:from-blue-100/40 hover:to-blue-200/30
                  dark:hover:from-cyan-600/30 dark:hover:to-cyan-500/20
                  shadow-sm hover:shadow-md
                  transition-all duration-300
                "
                    >
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{user?.userName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user?.dob}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user?.phoneNumber}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ))}
      </div>



    </div>

  )
}

export default Dashboard
