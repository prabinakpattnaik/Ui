import { useMemo } from 'react'
import { useOrgVrf } from '@/context/org-vrf-context'
import { isFeatureEnabled } from '@/services/vrf-features'
import type { Vrf } from '@/types/vrf-features'

/**
 * Hook to check which features are enabled for the currently selected VRF
 * Use this in router interface to show/hide tabs based on VRF features
 */
export function useVrfFeatures(vrfs: Vrf[]) {
  const { vrf: vrfName } = useOrgVrf()
  
  const features = useMemo(() => {
    // Find the VRF object by name
    const currentVrf = vrfs.find(v => v.name === vrfName)
    
    if (!currentVrf) {
      return {
        sxrEnabled: false,
        xwanEnabled: false,
        vrfId: null,
        vrfName: vrfName
      }
    }
    
    return {
      sxrEnabled: isFeatureEnabled(currentVrf.id, 'SxR'),
      xwanEnabled: isFeatureEnabled(currentVrf.id, 'xWAN'),
      vrfId: currentVrf.id,
      vrfName: currentVrf.name
    }
  }, [vrfName, vrfs])
  
  return features
}
