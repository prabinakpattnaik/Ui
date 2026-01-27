import * as React from "react"
import { Plus, Search, Settings, Trash2, ChevronRight, Building2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { AddOrganizationDialog, type OrgCreateInput } from "@/components/organizations/add-organization-dialog"
import { OrganizationSettingsDialog } from "@/components/organizations/organization-settings-dialog"

export type Org = {
  id: string
  name: string
  code: string
  description?: string
  contactEmail?: string
  createdAt: string // YYYY-MM-DD
}

export type OrgVrf = {
  id: string
  orgId: string
  name: string
  description?: string
  rd?: string
}

function todayYmd() {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}`
}

function makeDefaultVrfName(orgCode: string) {
  // your naming convention can change later
  return `ORG-${orgCode}-DEFAULT`
}

export default function OrganizationsPage() {
  // ✅ mock seed data (replace later with API)
  const [orgs, setOrgs] = React.useState<Org[]>([
    { id: "org_1", name: "Bright Building Ltd", code: "BBL", description: "Hospitality management company", createdAt: "2022-02-02" },
    { id: "org_2", name: "Goal Print Corp", code: "GPC", description: "Consumer electronics company", createdAt: "2020-10-27" },
    { id: "org_3", name: "The Apex Engineering", code: "APX", description: "Education technology provider", createdAt: "2020-07-16" },
  ])

  const [vrfs, setVrfs] = React.useState<OrgVrf[]>([
    { id: "vrf_1", orgId: "org_1", name: "ORG-BBL-BACKUP", description: "Bright Building Ltd Backup Network", rd: "65000:100" },
    { id: "vrf_2", orgId: "org_1", name: "ORG-BBL-GUEST", description: "Bright Building Ltd Guest Network", rd: "65000:101" },
    { id: "vrf_3", orgId: "org_1", name: "ORG-BBL-WAREHOUSE", description: "Bright Building Ltd Warehouse Network", rd: "65000:102" },
    { id: "vrf_4", orgId: "org_2", name: "ORG-GPC-DEFAULT", description: "Default VRF", rd: "65000:200" },
    { id: "vrf_5", orgId: "org_3", name: "ORG-APX-DEFAULT", description: "Default VRF", rd: "65000:300" },
  ])

  const [query, setQuery] = React.useState("")
  const [addOpen, setAddOpen] = React.useState(false)

  const [settingsOpen, setSettingsOpen] = React.useState(false)
  const [selectedOrgId, setSelectedOrgId] = React.useState<string | null>(null)

  const filteredOrgs = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return orgs
    return orgs.filter((o) =>
      o.name.toLowerCase().includes(q) ||
      o.code.toLowerCase().includes(q) ||
      (o.description ?? "").toLowerCase().includes(q)
    )
  }, [orgs, query])

  const vrfCountByOrg = React.useMemo(() => {
    const map: Record<string, number> = {}
    for (const v of vrfs) map[v.orgId] = (map[v.orgId] ?? 0) + 1
    return map
  }, [vrfs])

  const selectedOrg = React.useMemo(
    () => orgs.find((o) => o.id === selectedOrgId) ?? null,
    [orgs, selectedOrgId]
  )

  const selectedOrgVrfs = React.useMemo(
    () => (selectedOrgId ? vrfs.filter((v) => v.orgId === selectedOrgId) : []),
    [vrfs, selectedOrgId]
  )

  const onCreateOrg = (input: OrgCreateInput) => {
    const id = `org_${Date.now()}`
    const newOrg: Org = {
      id,
      name: input.name.trim(),
      code: input.code.trim().toUpperCase(),
      description: input.description?.trim() || undefined,
      contactEmail: input.contactEmail?.trim() || undefined,
      createdAt: todayYmd(),
    }

    // ✅ attach a default VRF on org creation
    const defaultVrf: OrgVrf = {
      id: `vrf_${Date.now()}`,
      orgId: id,
      name: makeDefaultVrfName(newOrg.code),
      description: "Default VRF",
      rd: `65000:${Math.floor(Math.random() * 900 + 100)}`,
    }

    setOrgs((prev) => [newOrg, ...prev])
    setVrfs((prev) => [defaultVrf, ...prev])
    setAddOpen(false)
  }

  const onDeleteOrg = (orgId: string) => {
    setOrgs((prev) => prev.filter((o) => o.id !== orgId))
    setVrfs((prev) => prev.filter((v) => v.orgId !== orgId))
    if (selectedOrgId === orgId) {
      setSelectedOrgId(null)
      setSettingsOpen(false)
    }
  }

  const onAddVrf = (orgId: string, vrf: Omit<OrgVrf, "id" | "orgId">) => {
    const newVrf: OrgVrf = {
      id: `vrf_${Date.now()}`,
      orgId,
      name: vrf.name.trim(),
      description: vrf.description?.trim() || undefined,
      rd: vrf.rd?.trim() || undefined,
    }
    setVrfs((prev) => [newVrf, ...prev])
  }

  const onDeleteVrf = (vrfId: string) => {
    setVrfs((prev) => prev.filter((v) => v.id !== vrfId))
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Organization Management</h2>
          <p className="text-sm text-muted-foreground">
            Manage Organizations and their Global VRFs
          </p>
        </div>

        <Button onClick={() => setAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Organization
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-[420px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Organizations..."
            className="pl-10"
          />
        </div>
      </div>

      <div className="rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead>ORGANIZATION NAME</TableHead>
              <TableHead>DESCRIPTION</TableHead>
              <TableHead className="w-32">CREATED</TableHead>
              <TableHead className="w-20 text-center">VRFS</TableHead>
              <TableHead className="w-28 text-right">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredOrgs.map((org) => (
              <TableRow key={org.id}>
                <TableCell>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <div className="font-semibold">{org.name}</div>
                    <Badge variant="secondary">{org.code}</Badge>
                  </div>
                </TableCell>

                <TableCell className="text-muted-foreground">
                  {org.description ?? "-"}
                </TableCell>

                <TableCell>{org.createdAt}</TableCell>

                <TableCell className="text-center">
                  <Badge variant="secondary" className="px-2">
                    {vrfCountByOrg[org.id] ?? 0}
                  </Badge>
                </TableCell>

                <TableCell className="text-right">
                  <div className="inline-flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setSelectedOrgId(org.id)
                        setSettingsOpen(true)
                      }}
                      title="Settings"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onDeleteOrg(org.id)}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {filteredOrgs.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="p-8 text-center text-sm text-muted-foreground">
                  No organizations match your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AddOrganizationDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onCreate={onCreateOrg}
      />

      <OrganizationSettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        org={selectedOrg}
        vrfs={selectedOrgVrfs}
        onAddVrf={onAddVrf}
        onDeleteVrf={onDeleteVrf}
      />
    </div>
  )
}
