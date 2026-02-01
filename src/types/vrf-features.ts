// VRF Features Types
export type FeatureType = 'SxR' | 'xWAN'

export type FeatureStatus = 'enabled' | 'disabled'

export interface VrfFeature {
  id: string
  vrfId: string
  featureType: FeatureType
  enabled: boolean
  configuration?: Record<string, unknown>
  createdAt: string
  updatedAt?: string
}

export interface FeatureConfiguration {
  id: string
  featureId: string
  configKey: string
  configValue: string
  description?: string
}

// SxR Feature Configuration Options
export interface SxRConfiguration {
  firewall_enabled?: boolean
  vpn_protocol?: 'IPSec' | 'SSL' | 'L2TP'
  intrusion_detection?: 'enabled' | 'monitoring' | 'disabled'
  security_level?: 'low' | 'medium' | 'high' | 'critical'
  acl_entries?: number
  mfa_required?: boolean
  session_timeout?: number
  threat_monitoring?: 'real-time' | 'scheduled' | 'disabled'
}

// xWAN Feature Configuration Options
export interface XWANConfiguration {
  optimization_mode?: 'disabled' | 'basic' | 'adaptive' | 'priority'
  qos_enabled?: boolean
  qos_classes?: number
  load_balancing?: 'round-robin' | 'least-connections' | 'priority' | 'weighted'
  bandwidth_limit?: number | 'unlimited'
  path_selection?: 'automatic' | 'manual' | 'weighted'
  application_aware?: boolean
  compression?: boolean
  latency_optimization?: boolean
}

// Organization type
export interface Organization {
  id: string
  name: string
  code: string
  description?: string
  contactEmail?: string
  createdAt: string
}

// VRF type with features
export interface Vrf {
  id: string
  orgId: string
  name: string
  description?: string
  rd?: string
  createdAt?: string
  // Feature flags
  sxrEnabled?: boolean
  xwanEnabled?: boolean
}

// Extended VRF with feature details
export interface VrfWithFeatures extends Vrf {
  features?: VrfFeature[]
}
