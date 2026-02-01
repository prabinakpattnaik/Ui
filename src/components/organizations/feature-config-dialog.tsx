import * as React from 'react'
import { Plus, Trash2, Save, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'

import type { OrgVrf } from '@/pages/organizations'
import type { VrfFeature, FeatureConfiguration } from '@/types/vrf-features'
import { getFeatureConfigurations, updateFeatureConfigurations } from '@/services/vrf-features'

interface ConfigItem {
  configKey: string
  configValue: string
  description: string
}

// Default configurations based on feature type
const defaultSxRConfigs: ConfigItem[] = [
  { configKey: 'firewall_enabled', configValue: 'true', description: 'Enable firewall protection' },
  { configKey: 'vpn_protocol', configValue: 'IPSec', description: 'VPN protocol type (IPSec, SSL, L2TP)' },
  { configKey: 'intrusion_detection', configValue: 'enabled', description: 'IDS/IPS system status' },
  { configKey: 'security_level', configValue: 'high', description: 'Security level (low, medium, high, critical)' },
]

const defaultXWANConfigs: ConfigItem[] = [
  { configKey: 'optimization_mode', configValue: 'adaptive', description: 'WAN optimization strategy' },
  { configKey: 'qos_enabled', configValue: 'true', description: 'Enable Quality of Service' },
  { configKey: 'load_balancing', configValue: 'round-robin', description: 'Load balancing algorithm' },
  { configKey: 'bandwidth_limit', configValue: '1000', description: 'Bandwidth limit in Mbps' },
]

export function FeatureConfigDialog({
  open,
  onOpenChange,
  vrf,
  featureType,
  feature,
  onSave,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  vrf: OrgVrf
  featureType: 'SxR' | 'xWAN'
  feature?: VrfFeature
  onSave: () => void
}) {
  const [configs, setConfigs] = React.useState<ConfigItem[]>([])
  const [saving, setSaving] = React.useState(false)

  React.useEffect(() => {
    if (feature && open) {
      loadConfigurations()
    }
  }, [feature, open])

  const loadConfigurations = () => {
    if (!feature) return

    const existingConfigs = getFeatureConfigurations(feature.id)
    if (existingConfigs.length > 0) {
      setConfigs(
        existingConfigs.map(c => ({
          configKey: c.configKey,
          configValue: c.configValue,
          description: c.description || '',
        }))
      )
    } else {
      // Load defaults
      setConfigs(featureType === 'SxR' ? defaultSxRConfigs : defaultXWANConfigs)
    }
  }

  const handleAddConfig = () => {
    setConfigs([...configs, { configKey: '', configValue: '', description: '' }])
  }

  const handleRemoveConfig = (index: number) => {
    setConfigs(configs.filter((_, i) => i !== index))
  }

  const handleUpdateConfig = (index: number, field: keyof ConfigItem, value: string) => {
    const updated = [...configs]
    updated[index] = { ...updated[index], [field]: value }
    setConfigs(updated)
  }

  const handleLoadDefaults = () => {
    setConfigs(featureType === 'SxR' ? defaultSxRConfigs : defaultXWANConfigs)
  }

  const handleSave = async () => {
    if (!feature) return

    setSaving(true)
    try {
      // Filter out empty configs
      const validConfigs = configs.filter(c => c.configKey.trim() !== '')
      
      updateFeatureConfigurations(feature.id, validConfigs)
      
      onSave()
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to save configurations:', error)
    } finally {
      setSaving(false)
    }
  }

  // Predefined options for common config keys
  const getConfigValueOptions = (configKey: string) => {
    const options: Record<string, string[]> = {
      firewall_enabled: ['true', 'false'],
      vpn_protocol: ['IPSec', 'SSL', 'L2TP'],
      intrusion_detection: ['enabled', 'monitoring', 'disabled'],
      security_level: ['low', 'medium', 'high', 'critical'],
      optimization_mode: ['disabled', 'basic', 'adaptive', 'priority'],
      qos_enabled: ['true', 'false'],
      load_balancing: ['round-robin', 'least-connections', 'priority', 'weighted'],
      path_selection: ['automatic', 'manual', 'weighted'],
      application_aware: ['true', 'false'],
      compression: ['true', 'false'],
    }
    return options[configKey] || []
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle>{featureType} Configuration</DialogTitle>
          <DialogDescription>
            Configure {featureType} settings for VRF: {vrf.name}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(85vh-180px)]">
          <div className="px-6 py-4 space-y-4">
            {configs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No configurations added yet</p>
                <Button
                  variant="outline"
                  onClick={handleLoadDefaults}
                  className="mt-4"
                >
                  Load Default Configuration
                </Button>
              </div>
            ) : (
              configs.map((config, index) => (
                <div key={index} className="rounded-lg border p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Configuration {index + 1}</div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveConfig(index)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Key</Label>
                      <Input
                        value={config.configKey}
                        onChange={(e) => handleUpdateConfig(index, 'configKey', e.target.value)}
                        placeholder="e.g., firewall_enabled"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Value</Label>
                      {getConfigValueOptions(config.configKey).length > 0 ? (
                        <Select
                          value={config.configValue}
                          onValueChange={(value) => handleUpdateConfig(index, 'configValue', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {getConfigValueOptions(config.configKey).map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          value={config.configValue}
                          onChange={(e) => handleUpdateConfig(index, 'configValue', e.target.value)}
                          placeholder="e.g., true"
                        />
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={config.description}
                      onChange={(e) => handleUpdateConfig(index, 'description', e.target.value)}
                      placeholder="Brief description of this configuration"
                      rows={2}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="px-6 pb-6 border-t pt-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleAddConfig}>
                <Plus className="h-4 w-4 mr-2" />
                Add Configuration
              </Button>
              {configs.length > 0 && (
                <Button variant="ghost" onClick={handleLoadDefaults}>
                  Reset to Defaults
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving || configs.length === 0}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Configuration
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
