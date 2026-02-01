import * as React from "react"
import { Building2, Plus, Settings, Trash2, Shield, Network } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import type { Org, OrgVrf } from "@/pages/organizations"
import { AddVrfDialog } from "@/components/organizations/add-vrf-dialog"
import { VrfFeaturesDialog } from "@/components/organizations/vrf-features-dialog"
import { isFeatureEnabled } from "@/services/vrf-features"

export function OrganizationSettingsDialog({
  open,
  onOpenChange,
  org,
  vrfs,
  onAddVrf,
  onDeleteVrf,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  org: Org | null
  vrfs: OrgVrf[]
  onAddVrf: (orgId: string, vrf: Omit<OrgVrf, "id" | "orgId">) => void
  onDeleteVrf: (vrfId: string) => void
}) {
  const [addVrfOpen, setAddVrfOpen] = React.useState(false)
  const [featuresOpen, setFeaturesOpen] = React.useState(false)
  const [selectedVrf, setSelectedVrf] = React.useState<OrgVrf | null>(null)
  const [vrfFeatureStatus, setVrfFeatureStatus] = React.useState<Record<string, {sxr: boolean, xwan: boolean}>>({})

  // Load feature status for all VRFs
  React.useEffect(() => {
    if (open && vrfs.length > 0) {
      const statusMap: Record<string, {sxr: boolean, xwan: boolean}> = {}
      vrfs.forEach(vrf => {
        statusMap[vrf.id] = {
          sxr: isFeatureEnabled(vrf.id, 'SxR'),
          xwan: isFeatureEnabled(vrf.id, 'xWAN'),
        }
      })
      setVrfFeatureStatus(statusMap)
    }
  }, [open, vrfs])

  const handleOpenFeatures = (vrf: OrgVrf) => {
    setSelectedVrf(vrf)
    setFeaturesOpen(true)
  }

  const handleFeaturesClosed = () => {
    setFeaturesOpen(false)
    // Refresh feature status when dialog closes
    if (vrfs.length > 0) {
      const statusMap: Record<string, {sxr: boolean, xwan: boolean}> = {}
      vrfs.forEach(vrf => {
        statusMap[vrf.id] = {
          sxr: isFeatureEnabled(vrf.id, 'SxR'),
          xwan: isFeatureEnabled(vrf.id, 'xWAN'),
        }
      })
      setVrfFeatureStatus(statusMap)
    }
  }

  if (!org) return null

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[980px] p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <DialogTitle className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                <Building2 className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex items-center gap-2">
                <span>{org.name}</span>
                <Badge variant="secondary">{org.code}</Badge>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="px-6 py-4">
            <Tabs defaultValue="vrfs" className="w-full">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="vrfs">VRFs ({vrfs.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="pt-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border p-4">
                    <div className="text-xs text-muted-foreground">Organization Name</div>
                    <div className="mt-1 font-medium">{org.name}</div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <div className="text-xs text-muted-foreground">Organization Code</div>
                    <div className="mt-1 font-medium">{org.code}</div>
                  </div>

                  <div className="rounded-lg border p-4 md:col-span-2">
                    <div className="text-xs text-muted-foreground">Description</div>
                    <div className="mt-1 text-sm text-muted-foreground">{org.description ?? "-"}</div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <div className="text-xs text-muted-foreground">Contact Email</div>
                    <div className="mt-1 text-sm">{org.contactEmail ?? "-"}</div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <div className="text-xs text-muted-foreground">Created</div>
                    <div className="mt-1 text-sm">{org.createdAt}</div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="vrfs" className="pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Manage VRFs and their features (SxR, xWAN) for this organization.
                  </div>

                  <Button onClick={() => setAddVrfOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add VRF
                  </Button>
                </div>

                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>VRF NAME</TableHead>
                        <TableHead>DESCRIPTION</TableHead>
                        <TableHead className="w-32">FEATURES</TableHead>
                        <TableHead className="w-28 text-right">ACTIONS</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {vrfs.map((v) => (
                        <TableRow key={v.id}>
                          <TableCell className="font-semibold">{v.name}</TableCell>
                          <TableCell className="text-muted-foreground">{v.description ?? "-"}</TableCell>
                          <TableCell>
                            <div className="flex gap-1.5">
                              <Badge 
                                variant={vrfFeatureStatus[v.id]?.sxr ? "default" : "secondary"}
                                className="text-xs"
                              >
                                <Shield className="h-3 w-3 mr-1" />
                                SxR
                              </Badge>
                              <Badge 
                                variant={vrfFeatureStatus[v.id]?.xwan ? "default" : "secondary"}
                                className="text-xs"
                              >
                                <Network className="h-3 w-3 mr-1" />
                                xWAN
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="inline-flex items-center gap-2">
                              <Button 
                                variant="outline" 
                                size="icon" 
                                title="Manage Features"
                                onClick={() => handleOpenFeatures(v)}
                              >
                                <Settings className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                title="Delete"
                                onClick={() => onDeleteVrf(v.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}

                      {vrfs.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="p-6 text-center text-sm text-muted-foreground">
                            No VRFs created for this organization yet.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="px-6 pb-6 flex justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          </div>

          <AddVrfDialog
            open={addVrfOpen}
            onOpenChange={setAddVrfOpen}
            onCreate={(vrf) => onAddVrf(org.id, vrf)}
          />
        </DialogContent>
      </Dialog>

      <VrfFeaturesDialog
        open={featuresOpen}
        onOpenChange={(open) => {
          setFeaturesOpen(open)
          if (!open) handleFeaturesClosed()
        }}
        vrf={selectedVrf}
      />
    </>
  )
}
