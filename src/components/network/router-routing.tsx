import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, ChevronRight, Trash2 } from "lucide-react"

import { AddStaticRouteDialog } from "@/components/network/add-static-route-dialog"
import { AddOSPFAreaDialog } from "@/components/network/add-ospf-area-dialog"

// IMPORTANT: your file add-bgp-neighbor-dialog.tsx exports BgpConfigPanel (not AddBGPNeighborDialog)
import { BgpConfigPanel } from "@/components/network/add-bgp-neighbor-dialog"
import { Network } from "lucide-react"
type Vrf = { name: string }

type RouteRow = {
  id: number
  vrf: string
  prefix: string
  source: "Static" | "BGP"
  nexthop: string
  iface: string
  metric: number
  routeCount: number
}

type StaticRoute = {
  id: number
  vrf: string
  prefix: string
  nexthop: string
  iface: string
  metric: number
}

type OspfArea = {
  id: number
  vrf: string
  areaId: string
  network: string
}

interface RouterRoutingProps {
  routerId: string
  vrfs: Vrf[]
}

const initialRouteTable: RouteRow[] = [
  { id: 1, vrf: "global", prefix: "10.0.0.0/24", source: "Static", nexthop: "10.0.1.5", iface: "GigE 0/0", metric: 10, routeCount: 3 },
  { id: 2, vrf: "global", prefix: "172.16.0.0/16", source: "BGP", nexthop: "10.0.5.1", iface: "GigE 0/2", metric: 50, routeCount: 2 },
  { id: 3, vrf: "ORG-BBL-BACKUP", prefix: "192.168.50.0/24", source: "Static", nexthop: "10.10.10.1", iface: "GigE 0/2", metric: 20, routeCount: 1 },
  { id: 4, vrf: "MGMT", prefix: "10.99.0.0/16", source: "Static", nexthop: "10.45.2.254", iface: "GigE 0/3", metric: 5, routeCount: 1 },
]

const initialStaticRoutes: StaticRoute[] = [
  { id: 101, vrf: "global", prefix: "10.0.0.0/24", nexthop: "10.0.1.5", iface: "GigE 0/0", metric: 10 },
  { id: 102, vrf: "global", prefix: "192.168.1.0/24", nexthop: "10.0.1.1", iface: "GigE 0/1", metric: 5 },
  { id: 103, vrf: "ORG-BBL-BACKUP", prefix: "172.16.0.0/16", nexthop: "10.10.10.1", iface: "GigE 0/2", metric: 20 },
  { id: 104, vrf: "MGMT", prefix: "10.99.0.0/16", nexthop: "10.45.2.254", iface: "GigE 0/3", metric: 5 },
]

const initialOspfAreas: OspfArea[] = [
  { id: 201, vrf: "global", areaId: "0.0.0.0", network: "10.1.0.0/16" },
  { id: 202, vrf: "ORG-BBL-BACKUP", areaId: "0.0.0.1", network: "172.16.0.0/16" },
]

export function RouterRouting({ routerId, vrfs }: RouterRoutingProps) {
  const safeVrfs = vrfs?.length ? vrfs : [{ name: "global" }]
  const [selectedVrf, setSelectedVrf] = React.useState<string>(safeVrfs[0].name)
  const [searchQuery, setSearchQuery] = React.useState("")

  const [routeTable] = React.useState<RouteRow[]>(initialRouteTable)
  const [staticRoutes, setStaticRoutes] = React.useState<StaticRoute[]>(initialStaticRoutes)
  const [ospfAreas, setOspfAreas] = React.useState<OspfArea[]>(initialOspfAreas)

  const vrfRoutes = React.useMemo(() => {
    return routeTable
      .filter((r) => r.vrf === selectedVrf)
      .filter((r) => r.prefix.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [routeTable, selectedVrf, searchQuery])

  const vrfStaticRoutes = React.useMemo(
    () => staticRoutes.filter((r) => r.vrf === selectedVrf),
    [staticRoutes, selectedVrf]
  )

  const vrfOspf = React.useMemo(
    () => ospfAreas.filter((a) => a.vrf === selectedVrf),
    [ospfAreas, selectedVrf]
  )

  const onAddStaticRoute = (route: any) => {
    // your dialog sends FormData values; normalize + force current VRF
    const newRoute: StaticRoute = {
      id: Number(route.id ?? Date.now()),
      vrf: selectedVrf,
      prefix: String(route.prefix ?? ""),
      nexthop: String(route.nexthop ?? ""),
      iface: String(route.interface ?? route.iface ?? ""),
      metric: Number(route.metric ?? 0),
    }
    setStaticRoutes((prev) => [newRoute, ...prev])
  }

  const deleteStaticRoute = (id: number) => {
    setStaticRoutes((prev) => prev.filter((r) => r.id !== id))
  }

  const onAddOspf = (area: any) => {
    const a: OspfArea = {
      id: Number(area.id ?? Date.now()),
      vrf: selectedVrf,
      areaId: String(area.areaId ?? ""),
      network: String(area.network ?? ""),
    }
    setOspfAreas((prev) => [a, ...prev])
  }

  return (
    <div className="space-y-6" data-router-id={routerId}>
      <Tabs defaultValue="routes" className="w-full">
        {/* Tabs left, VRF dropdown right */}
        <div className="flex items-center justify-between gap-3">
          <TabsList>
            <TabsTrigger value="routes">Route Table</TabsTrigger>
            <TabsTrigger value="static">Static Routes</TabsTrigger>
            <TabsTrigger value="dynamic">Dynamic Routes</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
		  <span className="text-sm text-muted-foreground">VRF</span>

		  <Select value={selectedVrf} onValueChange={setSelectedVrf}>
			<SelectTrigger className="w-[260px] border-2 ...">
			  <div className="flex items-center gap-2">
				<Network className="h-4 w-4 text-muted-foreground" />
				<SelectValue placeholder="Select VRF..." />
			  </div>
			</SelectTrigger>

			<SelectContent>
			  {safeVrfs.map((v) => (
				<SelectItem key={v.name} value={v.name}>
				  {v.name}
				</SelectItem>
			  ))}
			</SelectContent>
		  </Select>
		</div>

        </div>

        {/* Route Table */}
        <TabsContent value="routes" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-semibold">Routing Table</h3>
              <Badge variant="outline">{selectedVrf}</Badge>
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
                No routes found for <b>{selectedVrf}</b>.
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
                  {vrfRoutes.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>
                        <ChevronRight size={18} className="text-slate-500" />
                      </TableCell>
                      <TableCell className="font-mono text-cyan-600 dark:text-cyan-400">
                        {r.prefix}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{r.source}</Badge>
                      </TableCell>
                      <TableCell className="font-mono">{r.nexthop}</TableCell>
                      <TableCell>{r.iface}</TableCell>
                      <TableCell>{r.metric}</TableCell>
                      <TableCell className="font-medium">{r.routeCount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>

        {/* Static Routes (no VRF column inside rows) */}
        <TabsContent value="static" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Static Routes</h3>
            <AddStaticRouteDialog onAdd={onAddStaticRoute} />
          </div>

          {vrfStaticRoutes.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No static routes configured for <b>{selectedVrf}</b>.
            </div>
          ) : (
            <div className="space-y-4">
              {vrfStaticRoutes.map((r) => (
                <div key={r.id} className="rounded-lg border p-4">
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-5 md:items-end">
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Prefix</div>
                      <Input value={r.prefix} readOnly />
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Next Hop</div>
                      <Input value={r.nexthop} readOnly />
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Interface</div>
                      <Input value={r.iface} readOnly />
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Metric</div>
                      <Input value={String(r.metric)} readOnly />
                    </div>
                    <div className="flex justify-end">
                      <Button variant="destructive" size="icon" onClick={() => deleteStaticRoute(r.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Dynamic Routes */}
        <TabsContent value="dynamic" className="space-y-6">
          {/* Your existing BGP panel (VRF-specific) */}
          <div className="rounded-lg border p-4">
            <BgpConfigPanel routerId={routerId} vrf={selectedVrf} />
          </div>

          {/* Optional OSPF section */}
          <div className="rounded-lg border p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">OSPF Areas</h3>
              <AddOSPFAreaDialog onAdd={onAddOspf} />
            </div>

            {vrfOspf.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                No OSPF areas in <b>{selectedVrf}</b>.
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Area</TableHead>
                      <TableHead>Network</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vrfOspf.map((a) => (
                      <TableRow key={a.id}>
                        <TableCell className="font-mono">{a.areaId}</TableCell>
                        <TableCell className="font-mono">{a.network}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
