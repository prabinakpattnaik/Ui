import * as React from "react"

// Re-export types for convenience
export type { Organization, Vrf, VrfWithFeatures } from "@/types/vrf-features"

type OrgVrfState = {
  orgId: string | null
  vrf: string // default "global"
  setOrgId: (id: string | null) => void
  setVrf: (vrf: string) => void
}

const OrgVrfContext = React.createContext<OrgVrfState | null>(null)

export function OrgVrfProvider({ children }: { children: React.ReactNode }) {
  const [orgId, setOrgId] = React.useState<string | null>(null)
  const [vrf, setVrf] = React.useState<string>("global")

  return (
    <OrgVrfContext.Provider value={{ orgId, vrf, setOrgId, setVrf }}>
      {children}
    </OrgVrfContext.Provider>
  )
}

export function useOrgVrf() {
  const ctx = React.useContext(OrgVrfContext)
  if (!ctx) throw new Error("useOrgVrf must be used within OrgVrfProvider")
  return ctx
}
