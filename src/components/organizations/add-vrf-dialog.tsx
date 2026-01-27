import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function AddVrfDialog({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  onCreate: (vrf: { name: string; description?: string; rd?: string }) => void
}) {
  const [name, setName] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [rd, setRd] = React.useState("")

  const canSave = name.trim().length > 0

  const reset = () => {
    setName("")
    setDescription("")
    setRd("")
  }

  const handleSave = () => {
    if (!canSave) return
    onCreate({
      name,
      description,
      rd,
    })
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v)
        if (!v) reset()
      }}
    >
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Add VRF</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>
              VRF Name <span className="text-red-500">*</span>
            </Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="ORG-BBL-BACKUP" />
          </div>

          <div className="grid gap-2">
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe this VRF" />
          </div>

          <div className="grid gap-2">
            <Label>Route Distinguisher</Label>
            <Input value={rd} onChange={(e) => setRd(e.target.value)} placeholder="65000:100" />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!canSave}>
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
