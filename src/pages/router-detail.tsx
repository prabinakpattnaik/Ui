import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Server, Activity, Terminal, Shield, Network, Route } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { WebTerminal } from "@/components/terminal/web-terminal"
import { LineChart } from "@/components/metrics/line-chart"
import { RouterPolicies } from "@/components/network/router-policies"
import { RouterRouting } from "@/components/network/router-routing"
import { isFeatureEnabled } from "@/services/vrf-features"
import type { Vrf } from "@/types/vrf-features"

// Mock Data - Replace with actual data from your API/state
const routerData = {
    id: "rtr-us-west-01",
    name: "Edge Router - Seattle",
    status: "Active",
    ip: "10.45.2.1",
    uptime: "14d 2h 12m",
    version: "v2.4.1"
}

// Mock VRFs - Replace with actual VRF data from your org/context
// IMPORTANT: Replace this with your actual VRF data!
const mockVrfs: Vrf[] = [
    { id: "vrf_1", orgId: "org_1", name: "global", description: "Global routing table" },
    { id: "vrf_2", orgId: "org_1", name: "ORG-BBL-BACKUP", description: "Bright Building Ltd Backup Network", rd: "65000:100" },
    { id: "vrf_3", orgId: "org_1", name: "ORG-BBL-GUEST", description: "Bright Building Ltd Guest Network", rd: "65000:101" },
    { id: "vrf_4", orgId: "org_1", name: "ORG-BBL-WAREHOUSE", description: "Bright Building Ltd Warehouse Network", rd: "65000:102" },
]

export default function RouterDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState("overview")
    const routerId = id ?? routerData.id
    
    // VRF selection state
    const [selectedVrfName, setSelectedVrfName] = useState("global")
    
    // Find the VRF object and check features
    const currentVrf = mockVrfs.find(v => v.name === selectedVrfName)
    const sxrEnabled = currentVrf ? isFeatureEnabled(currentVrf.id, 'SxR') : false
    const xwanEnabled = currentVrf ? isFeatureEnabled(currentVrf.id, 'xWAN') : false
    
    return (
        <div className="flex-1 space-y-6 p-8 pt-6">
            {/* Header with VRF Selector */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/routers")}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">{routerData.name}</h2>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <span className="mr-2">ID: {routerData.id}</span>
                            <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 shadow-none border-0">
                                {routerData.status}
                            </Badge>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    {/* VRF Selector */}
                    <div className="flex items-center gap-2 mr-4">
                        <span className="text-sm text-muted-foreground">VRF:</span>
                        <Select value={selectedVrfName} onValueChange={setSelectedVrfName}>
                            <SelectTrigger className="w-[280px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {mockVrfs.map((vrf) => (
                                    <SelectItem key={vrf.id} value={vrf.name}>
                                        <div className="flex items-center gap-2">
                                            <span>{vrf.name}</span>
                                            {vrf.description && (
                                                <span className="text-xs text-muted-foreground">
                                                    - {vrf.description}
                                                </span>
                                            )}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        
                        {/* Feature Badges */}
                        <div className="flex gap-1">
                            {sxrEnabled && (
                                <Badge variant="default" className="text-xs">
                                    <Shield className="h-3 w-3 mr-1" />
                                    SxR
                                </Badge>
                            )}
                            {xwanEnabled && (
                                <Badge variant="default" className="text-xs">
                                    <Network className="h-3 w-3 mr-1" />
                                    xWAN
                                </Badge>
                            )}
                        </div>
                    </div>
                    
                    <Button disabled variant="outline">
                        <Activity className="mr-2 h-4 w-4 text-orange-500" /> Maintenance Mode
                    </Button>
                    <Button>
                        Reboot Router
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="overview" onValueChange={setActiveTab} className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    
                    {/* Show Routing tab only if SxR is enabled for this VRF */}
                    {sxrEnabled && (
                        <TabsTrigger value="routing">
                            <Route className="h-3 w-3 mr-2" />
                            Routing Configuration
                        </TabsTrigger>
                    )}
                    
                    {/* Show xWAN tab only if xWAN is enabled for this VRF */}
                    {xwanEnabled && (
                        <TabsTrigger value="xwan">
                            <Network className="h-3 w-3 mr-2" />
                            xWAN
                        </TabsTrigger>
                    )}
                    
                    {/* Show Security/ACL tab only if SxR is enabled */}
                    {sxrEnabled && (
                        <TabsTrigger value="policies">
                            <Shield className="h-3 w-3 mr-2" />
                            ACL
                        </TabsTrigger>
                    )}
                    
                    <TabsTrigger value="terminal" className="flex items-center gap-2">
                        <Terminal className="h-3 w-3" /> Console
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Uptime</CardTitle>
                                <Activity className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{routerData.uptime}</div>
                                <p className="text-xs text-muted-foreground">Since last patch</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Throughput</CardTitle>
                                <Network className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">4.2 Gbps</div>
                                <p className="text-xs text-muted-foreground">+12% peak usage</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">CPU Load</CardTitle>
                                <Server className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">45%</div>
                                <p className="text-xs text-muted-foreground">Normal load</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">VRF Features</CardTitle>
                                <Shield className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-2 flex-wrap">
                                    {sxrEnabled && (
                                        <Badge variant="default" className="text-xs">SxR</Badge>
                                    )}
                                    {xwanEnabled && (
                                        <Badge variant="default" className="text-xs">xWAN</Badge>
                                    )}
                                    {!sxrEnabled && !xwanEnabled && (
                                        <span className="text-sm text-muted-foreground">None enabled</span>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    For VRF: {selectedVrfName}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>Traffic Analysis</CardTitle>
                                <CardDescription>Ingress vs Egress traffic over time.</CardDescription>
                            </CardHeader>
                            <CardContent className="pl-2">
                                <LineChart
                                    data={Array.from({ length: 12 }, (_, i) => ({ name: `${i}h`, value: Math.floor(Math.random() * 100) }))}
                                    lines={[{ key: "value", color: "#3b82f6", name: "Traffic" }]}
                                    height={300}
                                />
                            </CardContent>
                        </Card>
                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>System Properties</CardTitle>
                                <CardDescription>Hardware and software details.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="text-muted-foreground">Hostname</div>
                                    <div className="font-medium">{routerData.id}</div>

                                    <div className="text-muted-foreground">IP Address</div>
                                    <div className="font-medium">{routerData.ip}</div>

                                    <div className="text-muted-foreground">Firmware</div>
                                    <div className="font-medium">{routerData.version}</div>

                                    <div className="text-muted-foreground">Kernel</div>
                                    <div className="font-medium">Linux 6.1.0-generic</div>

                                    <div className="text-muted-foreground">Architecture</div>
                                    <div className="font-medium">amd64</div>
                                    
                                    <div className="text-muted-foreground">Active VRF</div>
                                    <div className="font-medium">{selectedVrfName}</div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Routing tab - only shown if SxR enabled */}
                {sxrEnabled && (
                    <TabsContent value="routing" className="space-y-4">
                        <RouterRouting routerId={routerId} vrf={selectedVrfName} />
                    </TabsContent>
                )}

                {/* xWAN tab - only shown if xWAN enabled */}
                {xwanEnabled && (
                    <TabsContent value="xwan" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>xWAN Configuration</CardTitle>
                                <CardDescription>
                                    Software-defined WAN optimization for VRF: {selectedVrfName}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8 text-muted-foreground">
                                    <Network className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>xWAN configuration interface</p>
                                    <p className="text-sm mt-2">Configure WAN optimization, QoS, and path selection</p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                )}

                {/* Security/Policies tab - only shown if SxR enabled */}
                {sxrEnabled && (
                    <TabsContent value="policies" className="space-y-4">
                        <RouterPolicies routerId={routerData.id} />
                    </TabsContent>
                )}
               
                <TabsContent value="terminal" className="space-y-4">
                    <Card className="border-0 shadow-none bg-transparent">
                        <WebTerminal routerId={routerData.id} />
                        <div className="mt-2 text-xs text-muted-foreground text-center">
                            Connected via secure WebSocket (TLS 1.3) • Session ID: #88219A
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
