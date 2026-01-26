import { useState } from "react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { InteractiveTopology } from "@/components/topology/interactive-topology"
import { AddXwanDialog } from "@/components/network/add-xwan-dialog"
import { Wifi, Activity, CheckCircle, Trash2 } from "lucide-react"

// Mock xWAN path data
const initialXwanPaths = [
    { id: 1, name: 'NYC-LON-Primary', type: 'Point-to-Point', routers: ['RTR-NYC-01', 'RTR-LON-03'], source: 'RTR-NYC-01', destination: 'RTR-LON-03', protocol: 'IPSec', latency: 45, bandwidth: '1 Gbps', status: 'active' },
    { id: 2, name: 'NYC-TKY-Primary', type: 'Hub-Spoke', routers: ['RTR-NYC-01', 'RTR-TKY-02', 'RTR-LON-03'], source: 'RTR-NYC-01', destination: 'RTR-TKY-02', protocol: 'WireGuard', latency: 120, bandwidth: '500 Mbps', status: 'down' },
    { id: 3, name: 'LON-TKY-Primary', type: 'Full Mesh', routers: ['RTR-LON-03', 'RTR-TKY-02', 'RTR-NYC-01'], source: 'RTR-LON-03', destination: 'RTR-TKY-02', protocol: 'IPSec', latency: 180, bandwidth: '500 Mbps', status: 'degraded' },
    { id: 4, name: 'SFO-NYC-Primary', type: 'Point-to-Point', routers: ['RTR-SFO-01', 'RTR-NYC-01'], source: 'RTR-SFO-01', destination: 'RTR-NYC-01', protocol: 'WireGuard', latency: 35, bandwidth: '10 Gbps', status: 'active' },
    { id: 5, name: 'SFO-LON-Backup', type: 'Hub-Spoke', routers: ['RTR-SFO-01', 'RTR-LON-03', 'RTR-NYC-01'], source: 'RTR-SFO-01', destination: 'RTR-LON-03', protocol: 'IPSec', latency: 85, bandwidth: '1 Gbps', status: 'active' },
]

export default function TopologyPage() {
    const [xwanPaths, setXwanPaths] = useState(initialXwanPaths)

    const handleAddXwan = (xwan: any) => {
        setXwanPaths([...xwanPaths, xwan])
    }

    const handleDeleteXwan = (id: number) => {
        setXwanPaths(xwanPaths.filter(p => p.id !== id))
    }
    return (
        <div className="flex-1 space-y-6 p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">xWAN</h2>
                    <p className="text-muted-foreground">Network topology and path visualization</p>
                </div>
                <AddXwanDialog onAdd={handleAddXwan} />
            </div>

            <Tabs defaultValue="topology" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="topology">Topology</TabsTrigger>
                    <TabsTrigger value="paths">Network Paths</TabsTrigger>
                </TabsList>

                {/* Topology Tab */}
                <TabsContent value="topology" className="space-y-4">
                    <Card className="h-[calc(100vh-280px)] flex flex-col">
                        <CardHeader>
                            <CardTitle>Global Mesh Topology</CardTitle>
                            <CardDescription>
                                Real-time visualization of your network infrastructure.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 p-0 relative bg-zinc-950/50">
                            {/* Full interactive topo */}
                            <div className="absolute inset-0">
                                <InteractiveTopology />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Network Paths Tab */}
                <TabsContent value="paths" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Network Paths</CardTitle>
                            <CardDescription>Active xWAN connections and paths</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="px-4 py-3 text-left text-sm font-medium">Path Name</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium">Routers</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium">Protocol</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium">Latency</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium">Bandwidth</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                                            <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {xwanPaths.map((path) => (
                                            <tr
                                                key={path.id}
                                                className="border-b last:border-0 hover:bg-muted/50"
                                            >
                                                <td className="px-4 py-3 font-medium">
                                                    <Link
                                                        to={`/network-paths/${path.id}`}
                                                        className="hover:underline hover:text-primary transition-colors"
                                                    >
                                                        {path.name}
                                                    </Link>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Badge variant="outline">{path.type}</Badge>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex flex-wrap gap-1">
                                                        {path.routers.map((router, idx) => (
                                                            <Badge key={idx} variant="secondary" className="text-xs">
                                                                {router}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Badge variant="outline">{path.protocol}</Badge>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`font-mono ${path.latency < 50 ? 'text-emerald-600' : path.latency < 100 ? 'text-amber-600' : 'text-red-600'}`}>
                                                        {path.latency}ms
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 font-mono">{path.bandwidth}</td>
                                                <td className="px-4 py-3">
                                                    <Badge variant={path.status === 'active' ? 'default' : path.status === 'degraded' ? 'secondary' : 'destructive'}>
                                                        {path.status}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleDeleteXwan(path.id)
                                                        }}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Path Statistics */}
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Paths</CardTitle>
                                <Wifi className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{xwanPaths.length}</div>
                                <p className="text-xs text-muted-foreground">Active connections</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Average Latency</CardTitle>
                                <Activity className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {Math.round(xwanPaths.reduce((acc, p) => acc + p.latency, 0) / xwanPaths.length)}ms
                                </div>
                                <p className="text-xs text-muted-foreground">Across all paths</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Healthy Paths</CardTitle>
                                <CheckCircle className="h-4 w-4 text-emerald-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-emerald-500">
                                    {xwanPaths.filter(p => p.status === 'active').length}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {xwanPaths.filter(p => p.status === 'degraded').length} degraded, {xwanPaths.filter(p => p.status === 'down').length} down
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
