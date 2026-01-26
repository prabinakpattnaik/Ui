import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Shield, Trash2 } from "lucide-react"
import { AddPolicyDialog } from "./add-policy-dialog"

// Mock router-specific policies
const routerPolicies = [
    {
        id: "pol-001",
        name: "SSH Access Control",
        type: "Firewall",
        action: "Allow",
        source: "10.0.0.0/8",
        destination: "Any",
        port: "22",
        priority: 100,
        enabled: true
    },
    {
        id: "pol-002",
        name: "Block ICMP from External",
        type: "Firewall",
        action: "Deny",
        source: "0.0.0.0/0",
        destination: "Any",
        port: "ICMP",
        priority: 200,
        enabled: true
    },
    {
        id: "pol-003",
        name: "BGP Route Filter",
        type: "BGP",
        action: "Filter",
        source: "AS64512",
        destination: "Local",
        port: "-",
        priority: 50,
        enabled: true
    },
    {
        id: "pol-004",
        name: "QoS VoIP Priority",
        type: "Traffic Shaping",
        action: "Prioritize",
        source: "Any",
        destination: "Any",
        port: "5060-5061",
        priority: 10,
        enabled: true
    }
]

interface RouterPoliciesProps {
    routerId: string
}

export function RouterPolicies({ routerId }: RouterPoliciesProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Router ACL</h3>
                    <p className="text-sm text-muted-foreground">
                        Firewall rules, traffic shaping, and routing policies for {routerId}
                    </p>
                </div>
                <AddPolicyDialog routerId={routerId} />
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Policy Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Action</TableHead>
                            <TableHead>Source</TableHead>
                            <TableHead>Destination</TableHead>
                            <TableHead>Port/Protocol</TableHead>
                            <TableHead className="text-center">Priority</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {routerPolicies.map((policy) => (
                            <TableRow key={policy.id}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                        <Shield className="h-4 w-4 text-muted-foreground" />
                                        {policy.name}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">{policy.type}</Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            policy.action === "Allow" || policy.action === "Prioritize"
                                                ? "default"
                                                : policy.action === "Deny"
                                                    ? "destructive"
                                                    : "secondary"
                                        }
                                    >
                                        {policy.action}
                                    </Badge>
                                </TableCell>
                                <TableCell className="font-mono text-xs">{policy.source}</TableCell>
                                <TableCell className="font-mono text-xs">{policy.destination}</TableCell>
                                <TableCell className="font-mono text-xs">{policy.port}</TableCell>
                                <TableCell className="text-center">
                                    <Badge variant="outline" className="font-mono">
                                        {policy.priority}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Badge variant={policy.enabled ? "default" : "secondary"}>
                                        {policy.enabled ? "Enabled" : "Disabled"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
