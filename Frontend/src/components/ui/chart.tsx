
import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/lib/utils"

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
}

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig
    children: React.ComponentProps<
      typeof RechartsPrimitive.ResponsiveContainer
    >["children"]
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
})
ChartContainer.displayName = "Chart"

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([_, config]) => config.theme || config.color
  )

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color
    return color ? `  --color-${key}: ${color};` : null
  })
  .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  )
}

const ChartTooltip = RechartsPrimitive.Tooltip

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
    React.ComponentProps<"div"> & {
      hideLabel?: boolean
      hideIndicator?: boolean
      indicator?: "line" | "dot" | "dashed"
      nameKey?: string
      labelKey?: string
    }
>(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
    },
    ref
  ) => {
    const { config } = useChart()

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) {
        return null
      }

      const [item] = payload
      const key = `${labelKey || item.dataKey || item.name || "value"}`
      const itemConfig = getPayloadConfigFromPayload(config, item, key)
      const value =
        !labelKey && typeof label === "string"
          ? config[label as keyof typeof config]?.label || label
          : itemConfig?.label

      if (labelFormatter) {
        return (
          <div className={cn("font-medium", labelClassName)}>
            {labelFormatter(value, payload)}
          </div>
        )
      }

      if (!value) {
        return null
      }

      return <div className={cn("font-medium", labelClassName)}>{value}</div>
    }, [
      label,
      labelFormatter,
      payload,
      hideLabel,
      labelClassName,
      config,
      labelKey,
    ])

    if (!active || !payload?.length) {
      return null
    }

    const nestLabel = payload.length === 1 && indicator !== "dot"

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className
        )}
      >
        {!nestLabel ? tooltipLabel : null}
        <div className="grid gap-1.5">
          {payload.map((item, index) => {
            const key = `${nameKey || item.name || item.dataKey || "value"}`
            const itemConfig = getPayloadConfigFromPayload(config, item, key)
            const indicatorColor = color || item.payload.fill || item.color

            return (
              <div
                key={item.dataKey}
                className={cn(
                  "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                  indicator === "dot" && "items-center"
                )}
              >
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          className={cn(
                            "shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]",
                            {
                              "h-2.5 w-2.5": indicator === "dot",
                              "w-1": indicator === "line",
                              "w-0 border-[1.5px] border-dashed bg-transparent":
                                indicator === "dashed",
                              "my-0.5": nestLabel && indicator === "dashed",
                            }
                          )}
                          style={
                            {
                              "--color-bg": indicatorColor,
                              "--color-border": indicatorColor,
                            } as React.CSSProperties
                          }
                        />
                      )
                    )}
                    <div
                      className={cn(
                        "flex flex-1 justify-between leading-none",
                        nestLabel ? "items-end" : "items-center"
                      )}
                    >
                      <div className="grid gap-1.5">
                        {nestLabel ? tooltipLabel : null}
                        <span className="text-muted-foreground">
                          {itemConfig?.label || item.name}
                        </span>
                      </div>
                      {item.value && (
                        <span className="font-mono font-medium tabular-nums text-foreground">
                          {item.value.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltip"

const ChartLegend = RechartsPrimitive.Legend

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> &
    Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> & {
      hideIcon?: boolean
      nameKey?: string
    }
>(
  (
    { className, hideIcon = false, payload, verticalAlign = "bottom", nameKey },
    ref
  ) => {
    const { config } = useChart()

    if (!payload?.length) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center gap-4",
          verticalAlign === "top" ? "pb-3" : "pt-3",
          className
        )}
      >
        {payload.map((item) => {
          const key = `${nameKey || item.dataKey || "value"}`
          const itemConfig = getPayloadConfigFromPayload(config, item, key)

          return (
            <div
              key={item.value}
              className={cn(
                "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"
              )}
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="h-2 w-2 shrink-0 rounded-[2px]"
                  style={{
                    backgroundColor: item.color,
                  }}
                />
              )}
              {itemConfig?.label}
            </div>
          )
        })}
      </div>
    )
  }
)
ChartLegendContent.displayName = "ChartLegend"

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string
) {
  if (typeof payload !== "object" || payload === null) {
    return undefined
  }

  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined

  let configLabelKey: string = key

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === "string"
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string
  }

  return configLabelKey in config
    ? config[configLabelKey]
    : config[key as keyof typeof config]
}

// Create wrapper components for Recharts chart types
const AreaChart = React.forwardRef<
  HTMLDivElement,
  Omit<
    React.ComponentProps<typeof ChartContainer>,
    "children" | "config"
  > & {
    data: Array<Record<string, any>>
    categories: string[]
    index: string
    colors?: string[]
    valueFormatter?: (value: number) => string | number
  }
>(({ data, categories, index, colors, valueFormatter, className, ...props }, ref) => {
  const categoriesWithColors = React.useMemo(() => {
    return categories.map((category, i) => ({
      category,
      color: colors?.[i] || `hsl(${(i * 360) / categories.length}, 65%, 60%)`,
    }))
  }, [categories, colors])

  const config = React.useMemo<ChartConfig>(
    () =>
      Object.fromEntries(
        categoriesWithColors.map(({ category, color }) => [
          category,
          { color },
        ])
      ),
    [categoriesWithColors]
  )

  return (
    <ChartContainer ref={ref} className={className} config={config} {...props}>
      <RechartsPrimitive.AreaChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
        <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" />
        <RechartsPrimitive.XAxis
          dataKey={index}
          axisLine={false}
          tickLine={false}
        />
        <RechartsPrimitive.YAxis
          axisLine={false}
          tickLine={false}
          tickFormatter={(value) => valueFormatter ? valueFormatter(value) : value}
        />
        <ChartTooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null
            
            return (
              <div className="rounded-lg border bg-background p-2 shadow-sm">
                <div className="grid grid-cols-1 gap-2">
                  {payload.map((entry, i) => (
                    <div key={`tooltip-${i}`} className="flex items-center gap-2">
                      <div 
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      />
                       <p className="text-sm font-medium">
                         {entry.name}: {valueFormatter ? valueFormatter(Number(entry.value)) : entry.value}
                       </p>
                    </div>
                  ))}
                </div>
              </div>
            )
          }}
        />
        {categoriesWithColors.map(({ category, color }, i) => (
          <RechartsPrimitive.Area
            key={category}
            type="monotone"
            dataKey={category}
            fill={color}
            stroke={color}
            fillOpacity={0.2}
            activeDot={{ r: 4 }}
          />
        ))}
      </RechartsPrimitive.AreaChart>
    </ChartContainer>
  )
})
AreaChart.displayName = "AreaChart"

const BarChart = React.forwardRef<
  HTMLDivElement,
  Omit<
    React.ComponentProps<typeof ChartContainer>,
    "children" | "config"
  > & {
    data: Array<Record<string, any>>
    categories: string[]
    index: string
    colors?: string[]
    valueFormatter?: (value: number) => string | number
    layout?: "vertical" | "horizontal"
    stack?: boolean
  }
>(({ data, categories, index, colors, valueFormatter, layout = "horizontal", stack = false, className, ...props }, ref) => {
  const categoriesWithColors = React.useMemo(() => {
    return categories.map((category, i) => ({
      category,
      color: colors?.[i] || `hsl(${(i * 360) / categories.length}, 65%, 60%)`,
    }))
  }, [categories, colors])

  const config = React.useMemo<ChartConfig>(
    () =>
      Object.fromEntries(
        categoriesWithColors.map(({ category, color }) => [
          category,
          { color },
        ])
      ),
    [categoriesWithColors]
  )

  return (
    <ChartContainer ref={ref} className={className} config={config} {...props}>
      <RechartsPrimitive.BarChart data={data} layout={layout} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
        <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" />
        <RechartsPrimitive.XAxis
          dataKey={layout === "horizontal" ? index : undefined}
          type={layout === "horizontal" ? "category" : "number"}
          axisLine={false}
          tickLine={false}
          tickFormatter={(value) => (layout === "vertical" && valueFormatter) ? valueFormatter(value) : value}
        />
        <RechartsPrimitive.YAxis
          dataKey={layout === "vertical" ? index : undefined}
          type={layout === "vertical" ? "category" : "number"}
          axisLine={false}
          tickLine={false}
          tickFormatter={(value) => (layout === "horizontal" && valueFormatter) ? valueFormatter(value) : value}
        />
        <ChartTooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null
            
            return (
              <div className="rounded-lg border bg-background p-2 shadow-sm">
                <div className="grid grid-cols-1 gap-2">
                  {payload.map((entry, i) => (
                    <div key={`tooltip-${i}`} className="flex items-center gap-2">
                      <div 
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      />
                       <p className="text-sm font-medium">
                         {entry.name}: {valueFormatter ? valueFormatter(Number(entry.value)) : entry.value}
                       </p>
                    </div>
                  ))}
                </div>
              </div>
            )
          }}
        />
        {categoriesWithColors.map(({ category, color }) => (
          <RechartsPrimitive.Bar
            key={category}
            dataKey={category}
            fill={color}
            stackId={stack ? "stack" : undefined}
          />
        ))}
      </RechartsPrimitive.BarChart>
    </ChartContainer>
  )
})
BarChart.displayName = "BarChart"

const PieChart = React.forwardRef<
  HTMLDivElement,
  Omit<
    React.ComponentProps<typeof ChartContainer>,
    "children" | "config"
  > & {
    data: Array<Record<string, any>>
    category: string
    index: string
    colors?: string[]
    valueFormatter?: (value: number) => string | number
    startAngle?: number
    endAngle?: number
    innerRadius?: number
    outerRadius?: number
  }
>(({ data, category, index, colors, valueFormatter, startAngle = 0, endAngle = 360, className, innerRadius = 0, outerRadius, ...props }, ref) => {
  const categoriesWithColors = React.useMemo(() => {
    return data.map((item, i) => ({
      category: item[index],
      color: colors?.[i] || `hsl(${(i * 360) / data.length}, 65%, 60%)`,
    }))
  }, [data, index, colors])

  const config = React.useMemo<ChartConfig>(
    () =>
      Object.fromEntries(
        categoriesWithColors.map(({ category, color }) => [
          category,
          { color },
        ])
      ),
    [categoriesWithColors]
  )

  return (
    <ChartContainer ref={ref} className={className} config={config} {...props}>
      <RechartsPrimitive.PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
        <RechartsPrimitive.Pie
          data={data}
          dataKey={category}
          nameKey={index}
          cx="50%"
          cy="50%"
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={2}
          minAngle={4}
          label={({ name, value, percent }) => `${name}: ${valueFormatter ? valueFormatter(value) : value} (${(percent * 100).toFixed(0)}%)`}
          labelLine={true}
        >
          {data.map((entry, i) => (
            <RechartsPrimitive.Cell
              key={`cell-${i}`}
              fill={colors?.[i % (colors.length || 1)] || `hsl(${(i * 360) / data.length}, 65%, 60%)`}
            />
          ))}
        </RechartsPrimitive.Pie>
        <ChartTooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null
            
            return (
              <div className="rounded-lg border bg-background p-2 shadow-sm">
                <div className="grid grid-cols-1 gap-2">
                  {payload.map((entry, i) => (
                    <div key={`tooltip-${i}`} className="flex items-center gap-2">
                      <div 
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      />
                       <p className="text-sm font-medium">
                         {entry.name}: {valueFormatter ? valueFormatter(Number(entry.value)) : entry.value}
                       </p>
                    </div>
                  ))}
                </div>
              </div>
            )
          }}
        />
      </RechartsPrimitive.PieChart>
    </ChartContainer>
  )
})
PieChart.displayName = "PieChart"

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  AreaChart,
  BarChart,
  PieChart
}
