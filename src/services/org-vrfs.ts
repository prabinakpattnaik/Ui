export type OrgVrf = {
  id: string
  orgId: string
  name: string
  description?: string
  rd?: string
  createdAt?: string
}

const KEY = "org_vrfs_v1"

function readAll(): OrgVrf[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]")
  } catch {
    return []
  }
}

function writeAll(v: OrgVrf[]) {
  localStorage.setItem(KEY, JSON.stringify(v))
}

export function listVrfsByOrg(orgId: string): OrgVrf[] {
  return readAll().filter(v => v.orgId === orgId)
}

export function ensureDefaultVrf(orgId: string, orgCode: string) {
  const all = readAll()
  const exists = all.some(v => v.orgId === orgId && v.name === "global")
  if (exists) return

  all.push({
    id: `vrf_${Date.now()}`,
    orgId,
    name: "global",
    description: `${orgCode} Global routing table`,
    rd: "-",
    createdAt: new Date().toISOString(),
  })
  writeAll(all)
}

export function addOrgVrf(vrf: Omit<OrgVrf, "id" | "createdAt">) {
  const all = readAll()
  all.push({
    ...vrf,
    id: `vrf_${Date.now()}`,
    createdAt: new Date().toISOString(),
  })
  writeAll(all)
}

export function deleteOrgVrf(id: string) {
  writeAll(readAll().filter(v => v.id !== id))
}
