import { useParams, useNavigate } from "react-router-dom"
import {
    ArrowLeft,
    MoreHorizontal,
    ExternalLink,
    Users,
    Network,
    Activity,
    HardDrive
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { LineChart } from "@/components/metrics/line-chart"

// Mock Data
const tenantData = {
    id: "tenant-123",
    name: "Acme Corp",
    status: "Active",
    tier: "Enterprise",
    users: 12,
    routers: 3,
    usage: {
        bandwidth: 75, // %
        routes: 45, // %
        storage: 20 // %
    }
}

const bandwidthHistory = Array.from({ length: 20 }, (_, i) => ({
    name: `Day ${i + 1}`,
    value: 40 + Math.random() * 40
}))

const mockUsers = [
    { id: 1, name: "Alice Johnson", email: "alice@acme.com", role: "Admin", status: "Active", lastActive: "2 mins ago" },
    { id: 2, name: "Bob Smith", email: "bob@acme.com", role: "Viewer", status: "Active", lastActive: "1 hour ago" },
    { id: 3, name: "Charlie Brown", email: "charlie@acme.com", role: "Editor", status: "Inactive", lastActive: "3 days ago" },
    { id: 4, name: "Diana Prince", email: "diana@acme.com", role: "admin", status: "Active", lastActive: "Just now" },
]

const mockRouters = [
    { id: "RTR-001", hostname: "core-router-01", ip: "10.0.1.1", status: "Online", model: "ISR 4451", version: "17.3.4" },
    { id: "RTR-002", hostname: "edge-router-01", ip: "192.168.1.1", status: "Online", model: "ASR 1001-X", version: "16.12.3" },
    { id: "RTR-003", hostname: "dist-switch-01", ip: "10.0.2.1", status: "Offline", model: "Cat 9300", version: "17.6.1" },
]

export default function TenantDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()

    return (
        <div className="flex-1 space-y-6 p-8 pt-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/tenants")}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">{tenantData.name}</h2>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <span className="mr-2">ID: {id || tenantData.id}</span>
                            <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                                {tenantData.status}
                            </Badge>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline">Edit Profile</Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>Suspend Tenant</DropdownMenuItem>
                            <DropdownMenuItem>Reset Keys</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">Delete Tenant</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <Separator />

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="users">Users</TabsTrigger>
                    <TabsTrigger value="routers">Routers</TabsTrigger>
                    <TabsTrigger value="settings" disabled>Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    {/* Overview Stats */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Assigned Users</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{tenantData.users}</div>
                                <p className="text-xs text-muted-foreground">Across 3 groups</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Active Routers</CardTitle>
                                <Network className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{tenantData.routers}</div>
                                <p className="text-xs text-muted-foreground">All operational</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Service Tier</CardTitle>
                                <Activity className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{tenantData.tier}</div>
                                <p className="text-xs text-muted-foreground">Next billing: Jan 1</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
                                <HardDrive className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">1.2 TB</div>
                                <p className="text-xs text-muted-foreground">of 5 TB Quota</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Detailed Usage */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>Bandwidth Usage</CardTitle>
                                <CardDescription>Daily egress traffic over the last 30 days.</CardDescription>
                            </CardHeader>
                            <CardContent className="pl-2">
                                <LineChart
                                    data={bandwidthHistory}
                                    lines={[{ key: "value", color: "#8b5cf6", name: "Traffic (GB)" }]}
                                    height={300}
                                />
                            </CardContent>
                        </Card>
                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>Resource Quotas</CardTitle>
                                <CardDescription>Current utilization vs hard limits.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-8">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium">Total Bandwidth</span>
                                        <span className="text-muted-foreground">{tenantData.usage.bandwidth}%</span>
                                    </div>
                                    <Progress value={tenantData.usage.bandwidth} className="h-2" />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium">Route Entries</span>
                                        <span className="text-muted-foreground">{tenantData.usage.routes}%</span>
                                    </div>
                                    <Progress value={tenantData.usage.routes} className="h-2 [&>div]:bg-blue-500" />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium">Object Storage</span>
                                        <span className="text-muted-foreground">{tenantData.usage.storage}%</span>
                                    </div>
                                    <Progress value={tenantData.usage.storage} className="h-2 [&>div]:bg-emerald-500" />
                                </div>

                                <div className="pt-4">
                                    <Button variant="outline" className="w-full">
                                        <ExternalLink className="mr-2 h-4 w-4" /> Request Quota Increase
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="users" className="space-y-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Users</CardTitle>
                                <CardDescription>Manage users with access to this tenant.</CardDescription>
                            </div>
                            <Button size="sm">
                                <Users className="mr-2 h-4 w-4" />
                                Add User
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Last Active</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mockUsers.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">{user.name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{user.role}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <span className={`h-2 w-2 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                                                    {user.status}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm">{user.lastActive}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm">Edit</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="routers" className="space-y-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Routers</CardTitle>
                                <CardDescription>View and manage routers associated with this tenant.</CardDescription>
                            </div>
                            <Button size="sm">
                                <Network className="mr-2 h-4 w-4" />
                                Add Router
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Hostname</TableHead>
                                        <TableHead>IP Address</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Model</TableHead>
                                        <TableHead>Version</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mockRouters.map((router) => (
                                        <TableRow key={router.id}>
                                            <TableCell className="font-medium">{router.hostname}</TableCell>
                                            <TableCell className="font-mono text-xs">{router.ip}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <span className={`h-2 w-2 rounded-full ${router.status === 'Online' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                                    {router.status}
                                                </div>
                                            </TableCell>
                                            <TableCell>{router.model}</TableCell>
                                            <TableCell>{router.version}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm">Manage</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
