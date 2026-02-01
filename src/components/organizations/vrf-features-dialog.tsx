import * as React from 'react'
import { Shield, Network, Settings2, CheckCircle2, AlertCircle, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import type { OrgVrf } from '@/pages/organizations'
import type { VrfFeature } from '@/types/vrf-features'
import { getVrfFeatures, toggleFeature, initializeVrfFeatures } from '@/services/vrf-features'
import { FeatureConfigDialog } from './feature-config-dialog'

export function VrfFeaturesDialog({
  open,
  onOpenChange,
  vrf,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  vrf: OrgVrf | null
}) {
  const [features, setFeatures] = React.useState<VrfFeature[]>([])
  const [loading, setLoading] = React.useState(false)
  const [configOpen, setConfigOpen] = React.useState(false)
  const [selectedFeatureType, setSelectedFeatureType] = React.useState<'SxR' | 'xWAN' | null>(null)

  React.useEffect(() => {
    if (vrf) {
      loadFeatures()
    }
  }, [vrf])

  const loadFeatures = () => {
    if (!vrf) return
    
    // Initialize features if they don't exist
    const existing = getVrfFeatures(vrf.id)
    if (existing.length === 0) {
      initializeVrfFeatures(vrf.id)
    }
    
    setFeatures(getVrfFeatures(vrf.id))
  }

  const handleToggleFeature = async (featureType: 'SxR' | 'xWAN') => {
    if (!vrf) return
    
    setLoading(true)
    try {
      const currentFeature = features.find(f => f.featureType === featureType)
      const newEnabled = !currentFeature?.enabled
      
      const updated = toggleFeature(vrf.id, featureType, newEnabled, currentFeature?.configuration)
      
      // Update local state
      setFeatures(prev => {
        const filtered = prev.filter(f => f.featureType !== featureType)
        return [...filtered, updated]
      })
    } catch (error) {
      console.error('Failed to toggle feature:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleConfigureFeature = (featureType: 'SxR' | 'xWAN') => {
    setSelectedFeatureType(featureType)
    setConfigOpen(true)
  }

  const getSxRFeature = () => features.find(f => f.featureType === 'SxR')
  const getXWANFeature = () => features.find(f => f.featureType === 'xWAN')

  if (!vrf) return null

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[800px] p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <DialogTitle className="flex items-center gap-2">
              <Settings2 className="h-5 w-5" />
              VRF Features: {vrf.name}
            </DialogTitle>
            <DialogDescription>
              Manage SxR and xWAN features for this VRF
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-6 space-y-4">
            {/* SxR Feature Card */}
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <CardTitle>SxR (Secure Router)</CardTitle>
                      <CardDescription>
                        Security-focused routing with firewall, VPN, and threat protection
                      </CardDescription>
                    </div>
                  </div>
                  <Switch
                    checked={getSxRFeature()?.enabled || false}
                    onCheckedChange={() => handleToggleFeature('SxR')}
                    disabled={loading}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Status:</span>
                  {getSxRFeature()?.enabled ? (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Enabled
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Disabled
                    </Badge>
                  )}
                </div>

                {getSxRFeature()?.enabled && (
                  <div className="space-y-3">
                    <div className="text-sm">
                      <div className="font-medium mb-2">Available Features:</div>
                      <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <ChevronRight className="h-3 w-3" />
                          <span>Firewall Configuration</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <ChevronRight className="h-3 w-3" />
                          <span>VPN Settings (IPSec/SSL)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <ChevronRight className="h-3 w-3" />
                          <span>Intrusion Detection/Prevention</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <ChevronRight className="h-3 w-3" />
                          <span>Access Control Lists</span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleConfigureFeature('SxR')}
                      className="w-full"
                    >
                      <Settings2 className="h-4 w-4 mr-2" />
                      Configure SxR Settings
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* xWAN Feature Card */}
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-950 flex items-center justify-center">
                      <Network className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <CardTitle>xWAN (Software-defined WAN)</CardTitle>
                      <CardDescription>
                        WAN optimization, QoS, and intelligent path selection
                      </CardDescription>
                    </div>
                  </div>
                  <Switch
                    checked={getXWANFeature()?.enabled || false}
                    onCheckedChange={() => handleToggleFeature('xWAN')}
                    disabled={loading}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Status:</span>
                  {getXWANFeature()?.enabled ? (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Enabled
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Disabled
                    </Badge>
                  )}
                </div>

                {getXWANFeature()?.enabled && (
                  <div className="space-y-3">
                    <div className="text-sm">
                      <div className="font-medium mb-2">Available Features:</div>
                      <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <ChevronRight className="h-3 w-3" />
                          <span>WAN Optimization</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <ChevronRight className="h-3 w-3" />
                          <span>Quality of Service (QoS)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <ChevronRight className="h-3 w-3" />
                          <span>Load Balancing</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <ChevronRight className="h-3 w-3" />
                          <span>Application-aware Routing</span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleConfigureFeature('xWAN')}
                      className="w-full"
                    >
                      <Settings2 className="h-4 w-4 mr-2" />
                      Configure xWAN Settings
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="px-6 pb-6 flex justify-end border-t pt-4">
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>

      {selectedFeatureType && (
        <FeatureConfigDialog
          open={configOpen}
          onOpenChange={setConfigOpen}
          vrf={vrf}
          featureType={selectedFeatureType}
          feature={features.find(f => f.featureType === selectedFeatureType)}
          onSave={loadFeatures}
        />
      )}
    </>
  )
}
