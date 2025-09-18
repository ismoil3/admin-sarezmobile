
import { TrendingUp } from "lucide-react"
import { CartesianGrid, Dot, Line, LineChart, Tooltip, XAxis, YAxis, ResponsiveContainer } from "recharts"

// --- Card Components ---
export const Card = ({ children, className }: any) => (
  <div className={`rounded-lg shadow-md bg-white dark:bg-[#0A0A0AFF] border  ${className}`}>{children}</div>
)
export const CardHeader = ({ children, className }: any) => (
  <div className={`p-4 border-b border-gray-200 dark:border-gray-700 ${className}`}>{children}</div>
)
export const CardContent = ({ children, className }: any) => (
  <div className={`p-4 ${className}`}>{children}</div>
)
export const CardFooter = ({ children, className }: any) => (
  <div className={`p-4 border-t border-gray-200 dark:border-gray-700 ${className}`}>{children}</div>
)
export const CardTitle = ({ children, className }: any) => (
  <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>
)
export const CardDescription = ({ children, className }: any) => (
  <p className={`text-sm text-gray-500 dark:text-gray-400 ${className}`}>{children}</p>
)

// --- Chart Tooltip Components ---
export const ChartContainer = ({ children }: any) => <div className="w-full h-72">{children}</div>
export const ChartTooltipContent = ({ payload, nameKey, hideLabel }: any) => (
  <div className="bg-white dark:bg-gray-800 p-2 rounded shadow text-sm">
    {!hideLabel && <div>{nameKey}</div>}
    <div className="font-bold">{payload?.value}</div>
  </div>
)
export const ChartTooltip = (props: any) => <Tooltip {...props} content={props.content} />

// --- Chart Config Type ---
export type ChartConfig = Record<string, { label: string; color: string }>

// --- Chart Data ---
const chartData = [
  { browser: "chrome", visitors: 275, fill: "#4285F4" },
  { browser: "safari", visitors: 400, fill: "#00A1F1" },
  { browser: "firefox", visitors: 1210, fill: "#FF7139" },
  { browser: "edge", visitors: 173, fill: "#0078D4" },
  { browser: "other", visitors: 3000, fill: "#A0A0A0" },
]

const ChartConfig = {
  visitors: { label: "Visitors", color: "#4F46E5" },
  chrome: { label: "Chrome", color: "#4285F4" },
  safari: { label: "Safari", color: "#00A1F1" },
  firefox: { label: "Firefox", color: "#FF7139" },
  edge: { label: "Edge", color: "#0078D4" },
  other: { label: "Other", color: "#A0A0A0" },
}

export function ChartLineDotsColors() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Line Chart - Dots Colors</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 24, left: 24, right: 24, bottom: 24 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="browser" />
              <YAxis />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" nameKey="visitors" hideLabel={false} />}
              />
              <Line
                dataKey="visitors"
                type="natural"
                stroke="#4F46E5"
                strokeWidth={2}
                dot={({ payload, ...props }) => (
                  <Dot key={payload.browser} r={5} cx={props.cx} cy={props.cy} fill={payload.fill} stroke={payload.fill} />
                )}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium mb-2">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-gray-500 dark:text-gray-400 leading-none">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}


