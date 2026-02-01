import type { VrfFeature, FeatureType, FeatureConfiguration, Vrf } from '@/types/vrf-features'

const FEATURES_KEY = 'vrf_features_v1'
const CONFIGS_KEY = 'feature_configs_v1'

// Read all features
function readAllFeatures(): VrfFeature[] {
  try {
    return JSON.parse(localStorage.getItem(FEATURES_KEY) || '[]')
  } catch {
    return []
  }
}

// Write all features
function writeAllFeatures(features: VrfFeature[]) {
  localStorage.setItem(FEATURES_KEY, JSON.stringify(features))
}

// Read all configurations
function readAllConfigs(): FeatureConfiguration[] {
  try {
    return JSON.parse(localStorage.getItem(CONFIGS_KEY) || '[]')
  } catch {
    return []
  }
}

// Write all configurations
function writeAllConfigs(configs: FeatureConfiguration[]) {
  localStorage.setItem(CONFIGS_KEY, JSON.stringify(configs))
}

// Get features for a specific VRF
export function getVrfFeatures(vrfId: string): VrfFeature[] {
  return readAllFeatures().filter(f => f.vrfId === vrfId)
}

// Get a specific feature
export function getFeature(vrfId: string, featureType: FeatureType): VrfFeature | undefined {
  return readAllFeatures().find(f => f.vrfId === vrfId && f.featureType === featureType)
}

// Toggle feature (enable/disable)
export function toggleFeature(
  vrfId: string,
  featureType: FeatureType,
  enabled: boolean,
  configuration?: Record<string, unknown>
): VrfFeature {
  const all = readAllFeatures()
  const existingIndex = all.findIndex(f => f.vrfId === vrfId && f.featureType === featureType)
  
  if (existingIndex >= 0) {
    // Update existing
    all[existingIndex] = {
      ...all[existingIndex],
      enabled,
      configuration: configuration || all[existingIndex].configuration,
      updatedAt: new Date().toISOString(),
    }
    writeAllFeatures(all)
    return all[existingIndex]
  } else {
    // Create new
    const newFeature: VrfFeature = {
      id: `feature_${Date.now()}`,
      vrfId,
      featureType,
      enabled,
      configuration,
      createdAt: new Date().toISOString(),
    }
    all.push(newFeature)
    writeAllFeatures(all)
    return newFeature
  }
}

// Get feature configurations
export function getFeatureConfigurations(featureId: string): FeatureConfiguration[] {
  return readAllConfigs().filter(c => c.featureId === featureId)
}

// Update feature configurations
export function updateFeatureConfigurations(
  featureId: string,
  configs: Omit<FeatureConfiguration, 'id' | 'featureId'>[]
) {
  const all = readAllConfigs()
  // Remove old configs for this feature
  const filtered = all.filter(c => c.featureId !== featureId)
  
  // Add new configs
  const newConfigs = configs.map(c => ({
    ...c,
    id: `config_${Date.now()}_${Math.random()}`,
    featureId,
  }))
  
  writeAllConfigs([...filtered, ...newConfigs])
}

// Delete feature
export function deleteFeature(featureId: string) {
  // Delete feature
  const allFeatures = readAllFeatures()
  writeAllFeatures(allFeatures.filter(f => f.id !== featureId))
  
  // Delete associated configs
  const allConfigs = readAllConfigs()
  writeAllConfigs(allConfigs.filter(c => c.featureId !== featureId))
}

// Initialize default features for a VRF (all disabled)
export function initializeVrfFeatures(vrfId: string) {
  const existing = getVrfFeatures(vrfId)
  if (existing.length > 0) return
  
  const features: VrfFeature[] = [
    {
      id: `feature_${Date.now()}_sxr`,
      vrfId,
      featureType: 'SxR',
      enabled: false,
      configuration: {},
      createdAt: new Date().toISOString(),
    },
    {
      id: `feature_${Date.now()}_xwan`,
      vrfId,
      featureType: 'xWAN',
      enabled: false,
      configuration: {},
      createdAt: new Date().toISOString(),
    },
  ]
  
  const all = readAllFeatures()
  writeAllFeatures([...all, ...features])
}

// Delete all features for a VRF
export function deleteVrfFeatures(vrfId: string) {
  const features = getVrfFeatures(vrfId)
  features.forEach(f => deleteFeature(f.id))
}

// Check if feature is enabled (THIS IS KEY for router interface)
export function isFeatureEnabled(vrfId: string, featureType: FeatureType): boolean {
  const feature = getFeature(vrfId, featureType)
  return feature?.enabled || false
}

// Get VRF features by VRF name (helper for when you only have the name)
export function getVrfFeaturesByName(vrfs: Vrf[], vrfName: string): {
  sxrEnabled: boolean
  xwanEnabled: boolean
  vrfId: string | null
} {
  const vrf = vrfs.find(v => v.name === vrfName)
  if (!vrf) {
    return { sxrEnabled: false, xwanEnabled: false, vrfId: null }
  }
  
  return {
    sxrEnabled: isFeatureEnabled(vrf.id, 'SxR'),
    xwanEnabled: isFeatureEnabled(vrf.id, 'xWAN'),
    vrfId: vrf.id
  }
}
