import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

// If you DO have a Textarea component, use it.
// If not, you can replace <Textarea> with a <textarea> (see below).
import { Textarea } from "@/components/ui/textarea"

export type PermissionKey =
  | "full_access"
  | "manage_sxr" | "view_sxr"
  | "manage_xwan" | "view_xwan"
  | "manage_xsecurity" | "view_xsecurity"
  | "manage_orgs" | "view_orgs"
  | "manage_iam" | "view_iam"
  | "manage_subscriptions" | "view_subscriptions"

export type RoleCreateInput = {
  name: string
  description?: string
  permissions: PermissionKey[]
}

const MANAGE_PERMS: { key: PermissionKey; label: string }[] = [
  { key: "manage_sxr", label: "Manage SxR" },
  { key: "manage_xwan", label: "Manage xWAN" },
  { key: "manage_xsecurity", label: "Manage xSecurity" },
  { key: "manage_orgs", label: "Manage Organizations" },
  { key: "manage_iam", label: "Manage IAM" },
  { key: "manage_subscriptions", label: "Manage Subscriptions" },
]

const VIEW_PERMS: { key: PermissionKey; label: string }[] = [
  { key: "view_sxr", label: "View SxR" },
  { key: "view_xwan", label: "View xWAN" },
  { key: "view_xsecurity", label: "View xSecurity" },
  { key: "view_orgs", label: "View Organizations" },
  { key: "view_iam", label: "View IAM" },
  { key: "view_subscriptions", label: "View Subscriptions" },
]

const ALL_PERMS: PermissionKey[] = [
  "full_access",
  ...MANAGE_PERMS.map(p => p.key),
  ...VIEW_PERMS.map(p => p.key),
]

export function CreateRoleDialog({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  onCreate: (input: RoleCreateInput) => void
}) {
  const [name, setName] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [perms, setPerms] = React.useState<Set<PermissionKey>>(new Set())

  React.useEffect(() => {
    if (!open) {
      setName("")
      setDescription("")
      setPerms(new Set())
    }
  }, [open])

  const has = (k: PermissionKey) => perms.has(k)

  const setChecked = (k: PermissionKey, checked: boolean) => {
    setPerms((prev) => {
      const next = new Set(prev)

      // Full access toggles everything
      if (k === "full_access") {
        if (checked) ALL_PERMS.forEach(x => next.add(x))
        else ALL_PERMS.forEach(x => next.delete(x))
        return next
      }

      // normal toggle
      if (checked) next.add(k)
      else next.delete(k)

      // If any permission unchecked, full_access should be off
      next.delete("full_access")

      // convenience: if they check manage_X, auto-check view_X
      if (checked) {
        if (k === "manage_sxr") next.add("view_sxr")
        if (k === "manage_xwan") next.add("view_xwan")
        if (k === "manage_xsecurity") next.add("view_xsecurity")
        if (k === "manage_orgs") next.add("view_orgs")
        if (k === "manage_iam") next.add("view_iam")
        if (k === "manage_subscriptions") next.add("view_subscriptions")
      }

      return next
    })
  }

  const canSave = name.trim().length > 0

  const submit = () => {
    if (!canSave) return
    onCreate({
      name: name.trim(),
      description: description.trim() || undefined,
      permissions: Array.from(perms),
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Role</DialogTitle>
          <DialogDescription>
            Define role permissions for platform access.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label>Role Name</Label>
            <Input
              placeholder="e.g., Support Engineer"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Describe what this role can do..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          <div className="space-y-3">
            <Label>Permissions</Label>

            <div className="rounded-lg border bg-muted/20 p-4 space-y-4">
              {/* Full access */}
              <label className="flex items-center gap-3">
                <Checkbox
                  checked={has("full_access")}
                  onCheckedChange={(v) => setChecked("full_access", Boolean(v))}
                />
                <span className="text-sm">Full Access</span>
              </label>

              {/* Two columns: Manage / View */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-3">
                  {MANAGE_PERMS.map((p) => (
                    <label key={p.key} className="flex items-center gap-3">
                      <Checkbox
                        checked={has(p.key)}
                        onCheckedChange={(v) => setChecked(p.key, Boolean(v))}
                        disabled={has("full_access")}
                      />
                      <span className="text-sm">{p.label}</span>
                    </label>
                  ))}
                </div>

                <div className="space-y-3">
                  {VIEW_PERMS.map((p) => (
                    <label key={p.key} className="flex items-center gap-3">
                      <Checkbox
                        checked={has(p.key)}
                        onCheckedChange={(v) => setChecked(p.key, Boolean(v))}
                        disabled={has("full_access")}
                      />
                      <span className="text-sm">{p.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={submit} disabled={!canSave}>
              Save Role
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
