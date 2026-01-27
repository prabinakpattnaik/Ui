import { useMemo, useState } from "react"
import { Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type VrfRow = {
  id: string
  name: string
  description?: string
  rd?: string
  interfaces: string[]
  system?: boolean
}

export function RouterVrf({ routerId }: { routerId: string }) {
  const [open, setOpen] = useState(false)

  const [vrfs, setVrfs] = useState<VrfRow[]>([
    {
      id: "global",
      name: "global",
      description: "Global routing table",
      rd: undefined,
      interfaces: ["GigE 0/0", "GigE 0/1"],
      system: true,
    },
    {
      id: "org-bbl-backup",
      name: "ORG-BBL-BACKUP",
      description: "Bright Building Ltd Backup Network",
      rd: "65000:100",
      interfaces: ["GigE 0/2"],
    },
    {
      id: "mgmt",
      name: "MGMT",
      description: "Management VRF",
      rd: "65000:999",
      interfaces: ["GigE 0/3"],
    },
  ])

  const [form, setForm] = useState({
    name: "",
    description: "",
    rd: "",
    interfaces: "",
  })

  const canSubmit = useMemo(() => form.name.trim().length > 0, [form.name])

  const addVrf = () => {
    const name = form.name.trim()
    const interfaces = form.interfaces
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)

    setVrfs((prev) => [
      ...prev,
      {
        id: `${name}-${Date.now()}`,
        name,
        description: form.description.trim() || undefined,
        rd: form.rd.trim() || undefined,
        interfaces,
      },
    ])

    setForm({ name: "", description: "", rd: "", interfaces: "" })
    setOpen(false)
  }

  const deleteVrf = (id: string) => {
    setVrfs((prev) => prev.filter((v) => v.id !== id))
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>VRF Configuration</CardTitle>
        </div>

        <Button onClick={() => setOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Add VRF
        </Button>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[220px]">NAME</TableHead>
                <TableHead>DESCRIPTION</TableHead>
                <TableHead className="w-[170px]">ROUTE DISTINGUISHER</TableHead>
                <TableHead className="w-[220px]">INTERFACES</TableHead>
                <TableHead className="w-[90px] text-right">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {vrfs.map((v) => (
                <TableRow key={v.id}>
                  <TableCell className="font-medium">{v.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {v.description || "-"}
                  </TableCell>
                  <TableCell>{v.rd || "-"}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {v.interfaces?.length ? (
                        v.interfaces.map((intf) => (
                          <Badge key={intf} variant="secondary" className="font-normal">
                            {intf}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={!!v.system}
                      onClick={() => deleteVrf(v.id)}
                      title={v.system ? "System VRF cannot be deleted" : "Delete"}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add VRF</DialogTitle>
              <DialogDescription>
                Create a VRF and map interfaces (comma separated).
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="MGMT"
                />
              </div>

              <div className="grid gap-2">
                <Label>Description</Label>
                <Input
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                  placeholder="Management VRF"
                />
              </div>

              <div className="grid gap-2">
                <Label>Route Distinguisher (RD)</Label>
                <Input
                  value={form.rd}
                  onChange={(e) => setForm((p) => ({ ...p, rd: e.target.value }))}
                  placeholder="65000:999"
                />
              </div>

              <div className="grid gap-2">
                <Label>Interfaces</Label>
                <Input
                  value={form.interfaces}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, interfaces: e.target.value }))
                  }
                  placeholder="GigE 0/3, GigE 0/4"
                />
              </div>
            </div>

            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button disabled={!canSubmit} onClick={addVrf}>
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
