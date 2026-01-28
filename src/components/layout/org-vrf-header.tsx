import * as React from "react"
import { Building2, Network } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useOrgVrf, type Organization, type Vrf } from "@/context/org-vrf-context"

type Props = {
  title?: string
  subtitle?: string
  organizations: Organization[]
  vrfs: Vrf[] // all vrfs
  className?: string
}

export function OrgVrfHeader({
  title,
  subtitle,
  organizations,
  vrfs,
  className,
}: Props) {
  const { orgId, vrf, setOrgId, setVrf } = useOrgVrf()

  const orgVrfs = React.useMemo(() => {
    if (!orgId) return []
    return vrfs.filter((v) => v.orgId === orgId)
  }, [orgId, vrfs])

  // When org changes -> default VRF to global (if exists) else first
  const onChangeOrg = (newOrgId: string) => {
    setOrgId(newOrgId)
    const list = vrfs.filter((v) => v.orgId === newOrgId)
    const global = list.find((v) => v.name === "global")
    setVrf(global?.name ?? list[0]?.name ?? "global")
  }

  const selectedOrg = organizations.find((o) => o.id === orgId)

  return (
    <div className={cn("flex items-start justify-between gap-6", className)}>
      <div className="space-y-1">
        {title && (
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
            {selectedOrg?.name && (
              <Badge variant="secondary" className="gap-1">
                <Building2 className="h-3.5 w-3.5" />
                {selectedOrg.name}
              </Badge>
            )}
            {vrf && (
              <Badge variant="outline" className="gap-1">
                <Network className="h-3.5 w-3.5" />
                VRF: {vrf}
              </Badge>
            )}
          </div>
        )}
        {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
      </div>

      <div className="flex items-end gap-4">
        {/* Organization selector */}
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Organization</Label>
          <Select value={orgId ?? ""} onValueChange={onChangeOrg}>
            <SelectTrigger className="w-[260px]">
              <SelectValue placeholder="Select organization..." />
            </SelectTrigger>
            <SelectContent>
              {organizations.map((o) => (
                <SelectItem key={o.id} value={o.id}>
                  {o.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* VRF selector */}
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">VRF</Label>
          <Select
            value={vrf}
            onValueChange={(v) => setVrf(v)}
            disabled={!orgId || orgVrfs.length === 0}
          >
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Select VRF..." />
            </SelectTrigger>
            <SelectContent>
              {orgVrfs.map((v) => (
                <SelectItem key={v.id} value={v.name}>
                  {v.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
