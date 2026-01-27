import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownLeft, Clock } from "lucide-react"

export type BgpNeighbor = {
  id: number
  neighborIp: string
  asn: string
  state: string
  uptime?: string
  receivedRoutes?: number
  sentRoutes?: number
  desc?: string
}

const defaultNeighbors: BgpNeighbor[] = []

export function BGPNeighborsTable({ neighbors = defaultNeighbors }: { neighbors?: BgpNeighbor[] }) {
  if (!neighbors.length) {
    return (
      <div className="rounded-md border p-4 text-sm text-muted-foreground">
        No BGP neighbors configured for this VRF.
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Neighbor</TableHead>
            <TableHead>ASN</TableHead>
            <TableHead>State</TableHead>
            <TableHead>Routes (Rx/Tx)</TableHead>
            <TableHead>Uptime</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {neighbors.map((peer) => (
            <TableRow key={peer.id}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium font-mono">{peer.neighborIp}</span>
                  {peer.desc ? <span className="text-xs text-muted-foreground">{peer.desc}</span> : null}
                </div>
              </TableCell>

              <TableCell className="font-mono">{peer.asn}</TableCell>

              <TableCell>
                <Badge variant={peer.state === "Established" ? "default" : "destructive"}>
                  {peer.state}
                </Badge>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1 text-emerald-500">
                    <ArrowDownLeft className="h-3 w-3" /> {peer.receivedRoutes ?? 0}
                  </span>
                  <span className="flex items-center gap-1 text-blue-500">
                    <ArrowUpRight className="h-3 w-3" /> {peer.sentRoutes ?? 0}
                  </span>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {peer.uptime ?? "0s"}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
