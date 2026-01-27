import * as React from "react"
import { Plus, ShieldAlert, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"

type RouterItem = { id: string; name: string }

type AttackType = "UDP Flood" | "TCP SYN Flood" | "ICMP Flood"
type ActionType = "Block" | "Rate Limit" | "Challenge"

type MitigationRule = {
  id: string
  name: string
  description?: string
  attackType: AttackType
  action: ActionType
  timeSeconds: number
  sourceIp?: string
  destinationIp?: string
  sourcePort?: string
  destinationPort?: string
  routerIds: string[]
  createdAt: string
}

function nowIso() {
  return new Date().toISOString()
}

const textareaClass =
  "min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm " +
  "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring " +
  "disabled:cursor-not-allowed disabled:opacity-50"

export function DdosMitigationRules({ routers }: { routers: RouterItem[] }) {
  const [open, setOpen] = React.useState(false)
  const [routerSearch, setRouterSearch] = React.useState("")
  const [rules, setRules] = React.useState<MitigationRule[]>([])

  // form state
  const [name, setName] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [attackType, setAttackType] = React.useState<AttackType | "">("")
  const [action, setAction] = React.useState<ActionType | "">("")
  const [timeSeconds, setTimeSeconds] = React.useState<number>(60)
  const [sourceIp, setSourceIp] = React.useState("any")
  const [destinationIp, setDestinationIp] = React.useState("any")
  const [sourcePort, setSourcePort] = React.useState("any")
  const [destinationPort, setDestinationPort] = React.useState("any")
  const [selectedRouterIds, setSelectedRouterIds] = React.useState<string[]>([])

  const filteredRouters = React.useMemo(() => {
    const q = routerSearch.trim().toLowerCase()
    if (!q) return routers
    return routers.filter(
      (r) => r.name.toLowerCase().includes(q) || r.id.toLowerCase().includes(q)
    )
  }, [routers, routerSearch])

  const resetForm = () => {
    setName("")
    setDescription("")
    setAttackType("")
    setAction("")
    setTimeSeconds(60)
    setSourceIp("any")
    setDestinationIp("any")
    setSourcePort("any")
    setDestinationPort("any")
    setSelectedRouterIds([])
    setRouterSearch("")
  }

  const toggleRouter = (id: string) => {
    setSelectedRouterIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const canSave =
    name.trim().length > 0 &&
    attackType !== "" &&
    action !== "" &&
    Number.isFinite(timeSeconds) &&
    timeSeconds > 0 &&
    selectedRouterIds.length > 0

  const onSave = () => {
    if (!canSave) return

    const newRule: MitigationRule = {
      id: `rule_${Date.now()}`,
      name: name.trim(),
      description: description.trim() || undefined,
      attackType: attackType as AttackType,
      action: action as ActionType,
      timeSeconds,
      sourceIp: sourceIp.trim() || "any",
      destinationIp: destinationIp.trim() || "any",
      sourcePort: sourcePort.trim() || "any",
      destinationPort: destinationPort.trim() || "any",
      routerIds: selectedRouterIds,
      createdAt: nowIso(),
    }

    setRules((prev) => [newRule, ...prev])
    setOpen(false)
    resetForm()
  }

  const deleteRule = (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <div className="space-y-4">
      {/* Header row: title + create button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">Mitigation Rules</h3>
        </div>

        <Dialog
          open={open}
          onOpenChange={(v) => {
            setOpen(v)
            if (!v) resetForm()
          }}
        >
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Mitigation Rule
            </Button>
          </DialogTrigger>

          {/* Bigger + scrollable like your screenshot */}
          <DialogContent className="w-[95vw] max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create DDoS Rule</DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>
                  Rule Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rule Name"
                />
              </div>

              <div>
                <Label>Description</Label>
                <textarea
                  className={textareaClass}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe this rule"
                  rows={3}
                />
              </div>

              <div>
                <Label>
                  Attack Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={attackType}
                  onValueChange={(v) => setAttackType(v as AttackType)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="-- Select Attack Type --" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UDP Flood">UDP Flood</SelectItem>
                    <SelectItem value="TCP SYN Flood">TCP SYN Flood</SelectItem>
                    <SelectItem value="ICMP Flood">ICMP Flood</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>
                  Action <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={action}
                  onValueChange={(v) => setAction(v as ActionType)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="-- Select Action --" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Block">Block</SelectItem>
                    <SelectItem value="Rate Limit">Rate Limit</SelectItem>
                    <SelectItem value="Challenge">Challenge</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>
                  Time (seconds) <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  value={timeSeconds}
                  onChange={(e) => setTimeSeconds(Number(e.target.value))}
                  placeholder="Enter time in seconds"
                  min={1}
                />
              </div>

              <div />

              <div>
                <Label>Source IP</Label>
                <Input
                  value={sourceIp}
                  onChange={(e) => setSourceIp(e.target.value)}
                  placeholder="any"
                />
              </div>

              <div>
                <Label>Destination IP</Label>
                <Input
                  value={destinationIp}
                  onChange={(e) => setDestinationIp(e.target.value)}
                  placeholder="any"
                />
              </div>

              <div>
                <Label>Source Port</Label>
                <Input
                  value={sourcePort}
                  onChange={(e) => setSourcePort(e.target.value)}
                  placeholder="any"
                />
              </div>

              <div>
                <Label>Destination Port</Label>
                <Input
                  value={destinationPort}
                  onChange={(e) => setDestinationPort(e.target.value)}
                  placeholder="any"
                />
              </div>

              {/* Assign Routers */}
              <div className="sm:col-span-2 space-y-2">
                <Label>
                  Assign Routers <span className="text-red-500">*</span>
                </Label>

                <Input
                  value={routerSearch}
                  onChange={(e) => setRouterSearch(e.target.value)}
                  placeholder="Search routers..."
                />

                <div className="rounded-md border">
                  <ScrollArea className="h-52 p-2">
                    <div className="space-y-2">
                      {filteredRouters.map((r) => (
                        <label
                          key={r.id}
                          className="flex items-center gap-2 rounded px-2 py-1 hover:bg-muted"
                        >
                          <Checkbox
                            checked={selectedRouterIds.includes(r.id)}
                            onCheckedChange={() => toggleRouter(r.id)}
                          />
                          <span className="text-sm">{r.name}</span>
                          <span className="ml-auto text-xs text-muted-foreground">
                            {r.id}
                          </span>
                        </label>
                      ))}

                      {filteredRouters.length === 0 && (
                        <div className="p-2 text-sm text-muted-foreground">
                          No routers match your search.
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>

                {!canSave && (
                  <p className="text-xs text-muted-foreground">
                    Required: Rule Name, Attack Type, Action, Time, and at least one Router.
                  </p>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setOpen(false)
                  resetForm()
                }}
              >
                Cancel
              </Button>
              <Button onClick={onSave} disabled={!canSave}>
                Save Rule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Rules list */}
      <div className="rounded-lg border">
        {rules.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground">
            No mitigation rules created yet.
          </div>
        ) : (
          <div className="divide-y">
            {rules.map((r) => (
              <div key={r.id} className="p-4 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">{r.name}</div>
                    <Badge variant="outline">{r.attackType}</Badge>
                    <Badge>{r.action}</Badge>
                    <Badge variant="secondary">{r.timeSeconds}s</Badge>
                  </div>

                  {r.description ? (
                    <div className="text-sm text-muted-foreground">{r.description}</div>
                  ) : null}

                  <div className="text-xs text-muted-foreground">
                    Src: {r.sourceIp}:{r.sourcePort} → Dst: {r.destinationIp}:{r.destinationPort} • Routers:{" "}
                    {r.routerIds.length}
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteRule(r.id)}
                  title="Delete rule"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
