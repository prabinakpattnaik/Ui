import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Network, Activity, Zap, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InteractiveTopology } from "@/components/topology/interactive-topology"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

// Mock data - in real app, fetch based on pathId
const mockPathData = {
    1: { id: 1, name: 'NYC-LON-Primary', type: 'Point-to-Point', routers: ['RTR-NYC-01', 'RTR-LON-03'], source: 'RTR-NYC-01', destination: 'RTR-LON-03', protocol: 'IPSec', latency: 45, bandwidth: '1 Gbps', status: 'active' },
    2: { id: 2, name: 'NYC-TKY-Primary', type: 'Hub-Spoke', routers: ['RTR-NYC-01', 'RTR-TKY-02', 'RTR-LON-03'], source: 'RTR-NYC-01', destination: 'RTR-TKY-02', protocol: 'WireGuard', latency: 120, bandwidth: '500 Mbps', status: 'down' },
    3: { id: 3, name: 'LON-TKY-Primary', type: 'Full Mesh', routers: ['RTR-LON-03', 'RTR-TKY-02', 'RTR-NYC-01'], source: 'RTR-LON-03', destination: 'RTR-TKY-02', protocol: 'IPSec', latency: 180, bandwidth: '500 Mbps', status: 'degraded' },
    4: { id: 4, name: 'SFO-NYC-Primary', type: 'Point-to-Point', routers: ['RTR-SFO-01', 'RTR-NYC-01'], source: 'RTR-SFO-01', destination: 'RTR-NYC-01', protocol: 'WireGuard', latency: 35, bandwidth: '10 Gbps', status: 'active' },
    5: { id: 5, name: 'SFO-LON-Backup', type: 'Hub-Spoke', routers: ['RTR-SFO-01', 'RTR-LON-03', 'RTR-NYC-01'], source: 'RTR-SFO-01', destination: 'RTR-LON-03', protocol: 'IPSec', latency: 85, bandwidth: '1 Gbps', status: 'active' },
}

export default function XwanPathDetail() {
    console.log("XwanPathDetail mounting", useParams())
    const { pathId } = useParams()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState("topology")

    const pathData = mockPathData[Number(pathId) as keyof typeof mockPathData]

    if (!pathData) {
        return (
            <div className="flex-1 space-y-6 p-8 pt-6">
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/topology")}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Path Not Found</h2>
                    </div>
                </div>
            </div>
        )
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
            case 'degraded':
                return 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20'
            case 'down':
                return 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
            default:
                return ''
        }
    }

    return (
        <div className="flex-1 space-y-6 p-8 pt-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/topology")}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">{pathData.name}</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{pathData.type}</Badge>
                            <Badge className={`shadow-none border-0 ${getStatusColor(pathData.status)}`}>
                                {pathData.status}
                            </Badge>
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Protocol</CardTitle>
                        <Shield className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pathData.protocol}</div>
                        <p className="text-xs text-muted-foreground">Encryption protocol</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Latency</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pathData.latency}ms</div>
                        <p className="text-xs text-muted-foreground">Round-trip time</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Bandwidth</CardTitle>
                        <Zap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pathData.bandwidth}</div>
                        <p className="text-xs text-muted-foreground">Allocated capacity</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Routers</CardTitle>
                        <Network className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pathData.routers.length}</div>
                        <p className="text-xs text-muted-foreground">In this path</p>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="topology" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="topology">Topology Map</TabsTrigger>
                    <TabsTrigger value="paths">Paths</TabsTrigger>
                </TabsList>

                {/* Topology Map Tab */}
                <TabsContent value="topology" className="space-y-4">
                    <Card className="h-[600px] flex flex-col">
                        <CardHeader>
                            <CardTitle>Network Path Topology</CardTitle>
                            <CardDescription>
                                Visualizing {pathData.type} configuration for {pathData.name}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 p-0 relative bg-zinc-950/50">
                            <div className="absolute inset-0">
                                <InteractiveTopology />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Paths Tab */}
                <TabsContent value="paths" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Path Configuration</CardTitle>
                            <CardDescription>
                                Detailed information about the network path
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {/* Basic Information */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Path Name</p>
                                            <p className="font-medium">{pathData.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Topology Type</p>
                                            <p className="font-medium">{pathData.type}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Protocol</p>
                                            <p className="font-medium">{pathData.protocol}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Status</p>
                                            <Badge className={`shadow-none border-0 capitalize ${getStatusColor(pathData.status)}`}>
                                                {pathData.status}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                {/* Performance Metrics */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Latency</p>
                                            <p className="font-medium">{pathData.latency}ms</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Bandwidth</p>
                                            <p className="font-medium">{pathData.bandwidth}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Routers in Path */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Routers in Path</h3>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Order</TableHead>
                                                <TableHead>Router ID</TableHead>
                                                <TableHead>Role</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {pathData.routers.map((router, idx) => (
                                                <TableRow key={router}>
                                                    <TableCell>{idx + 1}</TableCell>
                                                    <TableCell className="font-medium">{router}</TableCell>
                                                    <TableCell>
                                                        {idx === 0 ? (
                                                            <Badge variant="secondary">Source</Badge>
                                                        ) : idx === pathData.routers.length - 1 ? (
                                                            <Badge variant="secondary">Destination</Badge>
                                                        ) : (
                                                            <Badge variant="outline">Intermediate</Badge>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
