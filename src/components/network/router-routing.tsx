import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Plus, Trash2, Search, ChevronRight } from "lucide-react"
import { AddStaticRouteDialog } from "./add-static-route-dialog"
import { AddBGPNeighborDialog } from "./add-bgp-neighbor-dialog"
import { AddOSPFAreaDialog } from "./add-ospf-area-dialog"

// Mock data
const routingTableData = [
    { id: 1, prefix: '10.0.0.0/24', source: 'Static', nexthop: '10.0.1.5', interface: 'GigE 0/0', metric: 10, routeCount: 3 },
    { id: 2, prefix: '172.16.0.0/16', source: 'BGP', nexthop: '10.0.5.1', interface: 'GigE 0/2', metric: 50, routeCount: 2 },
    { id: 3, prefix: '192.168.1.0/24', source: 'Static', nexthop: '10.0.1.1', interface: 'GigE 0/1', metric: 5, routeCount: 2 },
    { id: 4, prefix: '0.0.0.0/0', source: 'BGP', nexthop: '10.0.5.1', interface: 'GigE 0/2', metric: 100, routeCount: 1 },
]

const initialStaticRoutes = [
    { id: 1, vrf: 'default', prefix: '10.0.0.0/24', nexthop: '10.0.1.5', interface: 'GigE 0/0', metric: 10 },
    { id: 2, vrf: 'default', prefix: '192.168.1.0/24', nexthop: '10.0.1.1', interface: 'GigE 0/1', metric: 5 },
]

const initialBgpNeighbors = [
    { id: 1, ip: '192.168.1.2', asn: '65002', state: 'Established' },
    { id: 2, ip: '192.168.1.3', asn: '65003', state: 'Established' },
]

const initialOspfAreas = [
    { id: 1, areaId: '0.0.0.0', network: '10.0.0.0/24' },
]

interface RouterRoutingProps {
    routerId: string
}

export function RouterRouting({ routerId }: RouterRoutingProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [staticRoutes, setStaticRoutes] = useState(initialStaticRoutes)
    const [bgpNeighbors, setBgpNeighbors] = useState(initialBgpNeighbors)
    const [ospfAreas, setOspfAreas] = useState(initialOspfAreas)

    const handleAddStaticRoute = (route: any) => {
        setStaticRoutes([...staticRoutes, route])
    }

    const handleDeleteStaticRoute = (id: number) => {
        setStaticRoutes(staticRoutes.filter(r => r.id !== id))
    }

    const handleAddBGPNeighbor = (neighbor: any) => {
        setBgpNeighbors([...bgpNeighbors, neighbor])
    }

    const handleDeleteBGPNeighbor = (id: number) => {
        setBgpNeighbors(bgpNeighbors.filter(n => n.id !== id))
    }

    const handleAddOSPFArea = (area: any) => {
        setOspfAreas([...ospfAreas, area])
    }

    const handleDeleteOSPFArea = (id: number) => {
        setOspfAreas(ospfAreas.filter(a => a.id !== id))
    }

    return (
        <div className="space-y-6">
            <Tabs defaultValue="routes" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="routes">Routes</TabsTrigger>
                    <TabsTrigger value="static">Static</TabsTrigger>
                    <TabsTrigger value="dynamic">Dynamic</TabsTrigger>
                </TabsList>

                {/* Routes Tab - Routing Table View */}
                <TabsContent value="routes" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold">Routing Table</h3>
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={16} />
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
                                {routingTableData
                                    .filter(route => route.prefix.toLowerCase().includes(searchQuery.toLowerCase()))
                                    .map(route => (
                                        <TableRow key={route.id}>
                                            <TableCell>
                                                <ChevronRight size={18} className="text-slate-500" />
                                            </TableCell>
                                            <TableCell className="font-mono text-cyan-600 dark:text-cyan-400">{route.prefix}</TableCell>
                                            <TableCell>
                                                <Badge variant={route.source === 'Static' ? 'default' : 'secondary'}>
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
                    </div>
                </TabsContent>

                {/* Static Routes Tab */}
                <TabsContent value="static" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold">Static Routes</h3>
                        <AddStaticRouteDialog onAdd={handleAddStaticRoute} />
                    </div>

                    <div className="space-y-3">
                        {staticRoutes.map(route => (
                            <Card key={route.id}>
                                <CardContent className="pt-6">
                                    <div className="grid grid-cols-6 gap-4 items-end">
                                        <div>
                                            <Label htmlFor={`vrf-${route.id}`}>VRF</Label>
                                            <Select defaultValue={route.vrf}>
                                                <SelectTrigger id={`vrf-${route.id}`}>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="default">Default</SelectItem>
                                                    <SelectItem value="customer_a">CUSTOMER_A</SelectItem>
                                                    <SelectItem value="customer_b">CUSTOMER_B</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label htmlFor={`prefix-${route.id}`}>Prefix</Label>
                                            <Input
                                                id={`prefix-${route.id}`}
                                                defaultValue={route.prefix}
                                                placeholder="10.0.0.0/24"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor={`nexthop-${route.id}`}>Next Hop</Label>
                                            <Input
                                                id={`nexthop-${route.id}`}
                                                defaultValue={route.nexthop}
                                                placeholder="10.0.1.5"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor={`interface-${route.id}`}>Interface</Label>
                                            <Input
                                                id={`interface-${route.id}`}
                                                defaultValue={route.interface}
                                                placeholder="GigE 0/0"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor={`metric-${route.id}`}>Metric</Label>
                                            <Input
                                                id={`metric-${route.id}`}
                                                type="number"
                                                defaultValue={route.metric}
                                                placeholder="10"
                                            />
                                        </div>
                                        <div>
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                onClick={() => handleDeleteStaticRoute(route.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* Dynamic Routing Tab */}
                <TabsContent value="dynamic" className="space-y-6">
                    {/* BGP Configuration */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                                BGP Configuration
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="bgp-vrf">VRF</Label>
                                    <Select defaultValue="default">
                                        <SelectTrigger id="bgp-vrf">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="default">Default</SelectItem>
                                            <SelectItem value="customer_a">CUSTOMER_A</SelectItem>
                                            <SelectItem value="customer_b">CUSTOMER_B</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="as-number">AS Number</Label>
                                    <Input id="as-number" defaultValue="65001" />
                                </div>
                                <div>
                                    <Label htmlFor="router-id-bgp">Router ID</Label>
                                    <Input id="router-id-bgp" defaultValue="1.1.1.1" />
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4">
                                <h4 className="text-sm font-semibold">BGP Neighbors</h4>
                                <AddBGPNeighborDialog onAdd={handleAddBGPNeighbor} />
                            </div>

                            <div className="space-y-3">
                                {bgpNeighbors.map(neighbor => (
                                    <div key={neighbor.id} className="flex items-center gap-4 p-4 border rounded-lg">
                                        <Input
                                            defaultValue={neighbor.ip}
                                            placeholder="IP Address"
                                            className="flex-1"
                                        />
                                        <Input
                                            defaultValue={neighbor.asn}
                                            placeholder="AS Number"
                                            className="w-32"
                                        />
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                            <span className="text-sm">{neighbor.state}</span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDeleteBGPNeighbor(neighbor.id)}
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* OSPF Configuration */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                                OSPF Configuration
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="ospf-vrf">VRF</Label>
                                    <Select defaultValue="default">
                                        <SelectTrigger id="ospf-vrf">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="default">Default</SelectItem>
                                            <SelectItem value="customer_a">CUSTOMER_A</SelectItem>
                                            <SelectItem value="customer_b">CUSTOMER_B</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="router-id-ospf">Router ID</Label>
                                    <Input id="router-id-ospf" defaultValue="1.1.1.1" />
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4">
                                <h4 className="text-sm font-semibold">OSPF Areas</h4>
                                <AddOSPFAreaDialog onAdd={handleAddOSPFArea} />
                            </div>

                            <div className="space-y-3">
                                {ospfAreas.map(area => (
                                    <div key={area.id} className="flex items-center gap-4 p-4 border rounded-lg">
                                        <Input
                                            defaultValue={area.areaId}
                                            placeholder="Area ID"
                                            className="w-48"
                                        />
                                        <Input
                                            defaultValue={area.network}
                                            placeholder="Network"
                                            className="flex-1"
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDeleteOSPFArea(area.id)}
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
