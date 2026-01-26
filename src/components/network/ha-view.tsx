import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { CheckCircle2, XCircle, ArrowLeftRight, Activity, Shield } from "lucide-react"
import { AddHAPairDialog } from "@/components/network/add-ha-pair-dialog"

// Mock HA Pair data
const initialHAPairs = [
    {
        id: "ha-pair-1",
        name: "US-West HA Cluster",
        primaryRouter: "router-us-west-1",
        secondaryRouter: "router-us-west-2",
        status: "active",
        protocol: "VRRP",
        virtualIP: "10.0.1.254",
        priority: {
            primary: 100,
            secondary: 90
        },
        state: {
            primary: "MASTER",
            secondary: "BACKUP"
        },
        lastFailover: "2025-12-01 14:32:00",
        syncStatus: "synced"
    },
    {
        id: "ha-pair-2",
        name: "US-East HA Cluster",
        primaryRouter: "router-us-east-1",
        secondaryRouter: "router-us-east-2",
        status: "active",
        protocol: "HSRP",
        virtualIP: "10.0.2.254",
        priority: {
            primary: 100,
            secondary: 95
        },
        state: {
            primary: "ACTIVE",
            secondary: "STANDBY"
        },
        lastFailover: "Never",
        syncStatus: "synced"
    },
    {
        id: "ha-pair-3",
        name: "EU-West HA Cluster",
        primaryRouter: "router-eu-west-1",
        secondaryRouter: "router-eu-west-2",
        status: "degraded",
        protocol: "VRRP",
        virtualIP: "10.1.1.254",
        priority: {
            primary: 100,
            secondary: 80
        },
        state: {
            primary: "MASTER",
            secondary: "FAULT"
        },
        lastFailover: "2026-01-20 09:15:00",
        syncStatus: "out-of-sync"
    }
]

export function HAView() {
    const [haPairs, setHaPairs] = useState(initialHAPairs)

    const handleAddHAPair = (haPair: any) => {
        setHaPairs([...haPairs, haPair])
    }
    return (
        <div className="space-y-4">
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">HA Pairs</CardTitle>
                        <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{haPairs.length}</div>
                        <p className="text-xs text-muted-foreground">Active clusters</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Healthy Pairs</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-500">
                            {haPairs.filter(p => p.status === 'active').length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {haPairs.filter(p => p.status === 'degraded').length} degraded
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sync Status</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {haPairs.filter(p => p.syncStatus === 'synced').length}/{haPairs.length}
                        </div>
                        <p className="text-xs text-muted-foreground">Pairs in sync</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Protocols</CardTitle>
                        <Shield className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {new Set(haPairs.map(p => p.protocol)).size}
                        </div>
                        <p className="text-xs text-muted-foreground">VRRP, HSRP</p>
                    </CardContent>
                </Card>
            </div>

            {/* HA Pairs Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>High Availability Pairs</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Failover clusters and redundancy configurations
                            </p>
                        </div>
                        <AddHAPairDialog onAdd={handleAddHAPair} />
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Cluster Name</TableHead>
                                <TableHead>Protocol</TableHead>
                                <TableHead>Primary Router</TableHead>
                                <TableHead>Secondary Router</TableHead>
                                <TableHead>Virtual IP</TableHead>
                                <TableHead>Sync Status</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Last Failover</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {haPairs.map((pair) => (
                                <TableRow key={pair.id}>
                                    <TableCell className="font-medium">{pair.name}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="font-mono text-xs">
                                            {pair.protocol}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-sm font-medium">{pair.primaryRouter}</span>
                                            <Badge variant="secondary" className="w-fit text-[10px]">
                                                {pair.state.primary}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-sm font-medium">{pair.secondaryRouter}</span>
                                            <Badge
                                                variant={pair.state.secondary === 'FAULT' ? 'destructive' : 'secondary'}
                                                className="w-fit text-[10px]"
                                            >
                                                {pair.state.secondary}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-mono text-xs">{pair.virtualIP}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {pair.syncStatus === 'synced' ? (
                                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                            ) : (
                                                <XCircle className="h-4 w-4 text-destructive" />
                                            )}
                                            <span className="text-xs capitalize">{pair.syncStatus}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={pair.status === 'active' ? 'default' : 'destructive'}
                                            className="capitalize"
                                        >
                                            {pair.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">
                                        {pair.lastFailover}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
