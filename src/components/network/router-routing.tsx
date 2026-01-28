import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, ChevronRight } from "lucide-react"

type RouteRow = {
  id: number
  vrf: string
  prefix: string
  source: "Static" | "BGP"
  nexthop: string
  interface: string
  metric: number
  routeCount: number
}

// Mock route table per VRF (replace later with API)
const routingTableData: RouteRow[] = [
  { id: 1, vrf: "global", prefix: "10.0.0.0/24", source: "Static", nexthop: "10.0.1.5", interface: "GigE 0/0", metric: 10, routeCount: 3 },
  { id: 2, vrf: "global", prefix: "172.16.0.0/16", source: "BGP", nexthop: "10.0.5.1", interface: "GigE 0/2", metric: 50, routeCount: 2 },
  { id: 3, vrf: "ORG-BBL-BACKUP", prefix: "192.168.50.0/24", source: "Static", nexthop: "10.10.10.1", interface: "GigE 0/2", metric: 20, routeCount: 1 },
  { id: 4, vrf: "MGMT", prefix: "10.99.0.0/16", source: "Static", nexthop: "10.45.2.254", interface: "GigE 0/3", metric: 5, routeCount: 1 },
]

interface RouterRoutingProps {
  routerId: string
  vrf: string // <-- comes from org-level selector
}

export function RouterRouting({ routerId, vrf }: RouterRoutingProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const vrfRoutes = useMemo(() => {
    return routingTableData
      .filter((r) => r.vrf === vrf)
      .filter((r) => r.prefix.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [vrf, searchQuery])

  return (
    <div className="space-y-6">
      <Tabs defaultValue="routes" className="w-full">
        {/* Tabs only (no VRF dropdown here anymore) */}
        <div className="flex items-center justify-between gap-3">
          <TabsList>
            <TabsTrigger value="routes">Route Table</TabsTrigger>
            <TabsTrigger value="static">Static Routes</TabsTrigger>
            <TabsTrigger value="dynamic">Dynamic Routes</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="routes" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-semibold">Routing Table</h3>
              <Badge variant="secondary">{vrf}</Badge>
            </div>

            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <Input
                type="text"
                placeholder="Filter by prefix..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            {vrfRoutes.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground">
                No routes found for VRF <b>{vrf}</b>.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Prefix</TableHead>
                    <TableHead>Best Route</TableHead>
                    <TableHead>Next Hop</TableHead>
                    <TableHead>Interface</TableHead>
                    <TableHead>Metric</TableHead>
                    <TableHead>Routes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vrfRoutes.map((route) => (
                    <TableRow key={route.id}>
                      <TableCell>
                        <ChevronRight size={18} className="text-slate-500" />
                      </TableCell>
                      <TableCell className="font-mono text-cyan-600 dark:text-cyan-400">
                        {route.prefix}
                      </TableCell>
                      <TableCell>
                        <Badge variant={route.source === "Static" ? "default" : "secondary"}>
                          {route.source}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono">{route.nexthop}</TableCell>
                      <TableCell>{route.interface}</TableCell>
                      <TableCell>{route.metric}</TableCell>
                      <TableCell className="font-medium">{route.routeCount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>

        <TabsContent value="static" className="space-y-4">
          {/* Here you will render static routes UI filtered by `vrf` */}
          <div className="text-sm text-muted-foreground">
            Static routes for <b>{vrf}</b> (render your static routes UI here).
          </div>
        </TabsContent>

        <TabsContent value="dynamic" className="space-y-4">
          {/* Here you will render BGP/OSPF UI filtered by `vrf` */}
          <div className="text-sm text-muted-foreground">
            Dynamic routing config for <b>{vrf}</b> (render your dynamic config UI here).
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
