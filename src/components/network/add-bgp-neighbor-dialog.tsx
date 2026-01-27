import * as React from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Neighbor = { id: string; ip: string; remoteAs: string; status: "Established" | "Idle" }
type BgpConfig = { asn: string; routerId: string; neighbors: Neighbor[] }

// store config per VRF (dynamic routes are VRF-specific)
const initialByVrf: Record<string, BgpConfig> = {
  global: {
    asn: "65001",
    routerId: "1.1.1.1",
    neighbors: [
      { id: "n1", ip: "192.168.1.2", remoteAs: "65002", status: "Established" },
      { id: "n2", ip: "192.168.1.3", remoteAs: "65003", status: "Established" },
    ],
  },
  "ORG-BBL-BACKUP": { asn: "65010", routerId: "2.2.2.2", neighbors: [] },
  MGMT: { asn: "65099", routerId: "10.10.10.10", neighbors: [] },
}

export function BgpConfigPanel({ routerId, vrf }: { routerId: string; vrf: string }) {
  const [byVrf, setByVrf] = React.useState<Record<string, BgpConfig>>(initialByVrf)

  const cfg = byVrf[vrf] ?? { asn: "", routerId: "", neighbors: [] }

  const setCfg = (patch: Partial<BgpConfig>) => {
    setByVrf((prev) => ({ ...prev, [vrf]: { ...cfg, ...patch } }))
  }

  const addNeighbor = () => {
    setCfg({
      neighbors: [
        ...cfg.neighbors,
        { id: `${Date.now()}`, ip: "", remoteAs: "", status: "Idle" },
      ],
    })
  }

  const updateNeighbor = (id: string, patch: Partial<Neighbor>) => {
    setCfg({
      neighbors: cfg.neighbors.map((n) => (n.id === id ? { ...n, ...patch } : n)),
    })
  }

  const deleteNeighbor = (id: string) => {
    setCfg({ neighbors: cfg.neighbors.filter((n) => n.id !== id) })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-purple-500" />
        <h2 className="text-xl font-semibold">BGP Configuration</h2>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4">
          <div className="text-xs mb-1 text-muted-foreground">AS Number</div>
          <Input value={cfg.asn} onChange={(e) => setCfg({ asn: e.target.value })} />
        </div>

        <div className="col-span-8">
          <div className="text-xs mb-1 text-muted-foreground">Router ID</div>
          <Input value={cfg.routerId} onChange={(e) => setCfg({ routerId: e.target.value })} />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">BGP Neighbors</h3>
        <Button variant="outline" className="gap-2" onClick={addNeighbor}>
          <Plus className="h-4 w-4" /> Add Neighbor
        </Button>
      </div>

      <div className="space-y-3">
        {cfg.neighbors.map((n) => (
          <div key={n.id} className="rounded-lg border p-4">
            <div className="grid grid-cols-12 gap-3 items-center">
              <div className="col-span-5">
                <Input
                  value={n.ip}
                  onChange={(e) => updateNeighbor(n.id, { ip: e.target.value })}
                  placeholder="192.168.1.2"
                />
              </div>
              <div className="col-span-3">
                <Input
                  value={n.remoteAs}
                  onChange={(e) => updateNeighbor(n.id, { remoteAs: e.target.value })}
                  placeholder="65002"
                />
              </div>
              <div className="col-span-3 flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${
                    n.status === "Established" ? "bg-green-500" : "bg-yellow-500"
                  }`}
                />
                <span className="text-sm">{n.status}</span>
              </div>
              <div className="col-span-1 flex justify-end">
                <Button variant="ghost" size="icon" onClick={() => deleteNeighbor(n.id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          </div>
        ))}
        {cfg.neighbors.length === 0 && (
          <div className="text-sm text-muted-foreground">
            No BGP neighbors in <b>{vrf}</b>.
          </div>
        )}
      </div>
    </div>
  )
}
