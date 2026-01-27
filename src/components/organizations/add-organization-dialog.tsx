import * as React from "react"
import { Info } from "lucide-react"

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
import { ScrollArea } from "@/components/ui/scroll-area"

export type OrgCreateInput = {
  name: string
  code: string
  description?: string
  contactEmail?: string
}

export function AddOrganizationDialog({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  onCreate: (input: OrgCreateInput) => void
}) {
  const [name, setName] = React.useState("")
  const [code, setCode] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [contactEmail, setContactEmail] = React.useState("")

  const canSave = name.trim().length > 0 && code.trim().length > 0 && code.trim().length <= 10

  const reset = () => {
    setName("")
    setCode("")
    setDescription("")
    setContactEmail("")
  }

  const handleSave = () => {
    if (!canSave) return
    onCreate({
      name,
      code,
      description,
      contactEmail,
    })
    reset()
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v)
        if (!v) reset()
      }}
    >
      <DialogContent className="sm:max-w-[720px] p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Add New Organization</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[78vh] px-6 pb-6">
          <div className="grid gap-5">
            <div className="grid gap-2">
              <Label>
                Organization Name <span className="text-red-500">*</span>
              </Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Organization Name"
              />
            </div>

            <div className="grid gap-2">
              <Label>
                Organization Code <span className="text-red-500">*</span>
              </Label>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g., ACME"
                maxLength={10}
              />
              <p className="text-xs text-muted-foreground">
                Short code used for VRF naming (max 10 chars)
              </p>
            </div>

            <div className="grid gap-2">
              <Label>Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter a Brief Description of the Organization"
              />
            </div>

            <div className="grid gap-2">
              <Label>Contact Email</Label>
              <Input
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="network@organization.com"
              />
            </div>

            <div className="flex items-start gap-3 rounded-lg border bg-muted/30 p-3">
              <Info className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">
                A default VRF will be automatically created for this organization
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={!canSave}>
                Save
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
