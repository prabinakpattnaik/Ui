import * as React from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type RoleItem = { id: string | number; name: string }

type AddUserDialogProps = {
  roles?: RoleItem[] // pass roles from Users page
}

export function AddUserDialog({ roles = [] }: AddUserDialogProps) {
  const [open, setOpen] = React.useState(false)

  const [fullName, setFullName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [selectedRoles, setSelectedRoles] = React.useState<string[]>([])
  const [rolesError, setRolesError] = React.useState<string | null>(null)

  const roleOptions = React.useMemo(() => {
    // fallback if roles not provided
    if (!roles || roles.length === 0) {
      return [
        { id: "administrator", name: "Administrator" },
        { id: "network_engineer", name: "Network Engineer" },
        { id: "security_analyst", name: "Security Analyst" },
        { id: "viewer", name: "Viewer" },
        { id: "network_analyst", name: "Network Analyst" },
        { id: "security_engineer", name: "Security Engineer" },
        { id: "finance_analyst", name: "Finance Analyst" },
      ] as RoleItem[]
    }
    return roles
  }, [roles])

  const toggleRole = (roleId: string) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId) ? prev.filter((r) => r !== roleId) : [...prev, roleId]
    )
  }

  const resetForm = () => {
    setFullName("")
    setEmail("")
    setPassword("")
    setSelectedRoles([])
    setRolesError(null)
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedRoles.length === 0) {
      setRolesError("Users must have at least one role assigned")
      return
    }

    // TODO: hook API / parent callback
    console.log("Create user:", {
      fullName,
      email,
      password,
      roles: selectedRoles,
    })

    setOpen(false)
    resetForm()
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v)
        if (!v) resetForm()
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </DialogTrigger>

      {/* Matches screenshot: tall modal, scroll inside */}
      <DialogContent className="sm:max-w-lg p-0">
        <div className="max-h-[85vh] overflow-y-auto p-6">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-xl">Add New User</DialogTitle>
          </DialogHeader>

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm">
                Full Name
              </Label>
              <Input
                id="fullName"
                placeholder="e.g., John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm">
                Email Address
              </Label>
              <Input
                id="email"
                placeholder="e.g., john.doe@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter a secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
              <div className="text-xs text-muted-foreground">
                Minimum 8 characters
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Roles (select one or more)</Label>

              {/* Light panel like screenshot */}
              <div className="rounded-lg border bg-muted/20 p-4">
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  {roleOptions.map((role) => {
                    const roleId = String(role.id)
                    const checked = selectedRoles.includes(roleId)

                    return (
                      <label
                        key={roleId}
                        className="flex items-center gap-3 cursor-pointer select-none"
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() => {
                            setRolesError(null)
                            toggleRole(roleId)
                          }}
                        />
                        <span className="text-sm">{role.name}</span>
                      </label>
                    )
                  })}
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                Users must have at least one role assigned
              </div>

              {rolesError && (
                <div className="text-xs text-destructive">{rolesError}</div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpen(false)
                  resetForm()
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Create User</Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
