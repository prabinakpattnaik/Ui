import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Plus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface AddHAPairDialogProps {
    onAdd: (haPair: any) => void
}

const availableRouters = [
    { id: 'RTR-NYC-01', name: 'RTR-NYC-01' },
    { id: 'RTR-LON-03', name: 'RTR-LON-03' },
    { id: 'RTR-TKY-02', name: 'RTR-TKY-02' },
    { id: 'RTR-SFO-01', name: 'RTR-SFO-01' },
]

export function AddHAPairDialog({ onAdd }: AddHAPairDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const haPair = {
            id: `ha-pair-${Date.now()}`,
            name: formData.get('name'),
            primaryRouter: formData.get('primaryRouter'),
            secondaryRouter: formData.get('secondaryRouter'),
            protocol: formData.get('protocol'),
            virtualIP: formData.get('virtualIP'),
            priority: {
                primary: parseInt(formData.get('primaryPriority') as string) || 100,
                secondary: parseInt(formData.get('secondaryPriority') as string) || 90
            },
            state: {
                primary: 'MASTER',
                secondary: 'BACKUP'
            },
            status: 'active',
            lastFailover: 'Never',
            syncStatus: 'synced'
        }

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))

        onAdd(haPair)
        setLoading(false)
        setOpen(false)

        toast({
            title: "HA Pair Created",
            description: `High availability pair ${haPair.name} has been created successfully.`,
        })

        // Reset form
        e.currentTarget.reset()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add HA Pair
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add HA Pair</DialogTitle>
                        <DialogDescription>
                            Create a new high availability router pair for failover protection.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Pair Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="US-West HA Cluster"
                                className="col-span-3"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="protocol" className="text-right">
                                Protocol <span className="text-red-500">*</span>
                            </Label>
                            <Select name="protocol" defaultValue="VRRP" required>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="VRRP">VRRP (Virtual Router Redundancy Protocol)</SelectItem>
                                    <SelectItem value="HSRP">HSRP (Hot Standby Router Protocol)</SelectItem>
                                    <SelectItem value="CARP">CARP (Common Address Redundancy Protocol)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="primaryRouter" className="text-right">
                                Primary Router <span className="text-red-500">*</span>
                            </Label>
                            <Select name="primaryRouter" required>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select primary router" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableRouters.map((router) => (
                                        <SelectItem key={router.id} value={router.id}>
                                            {router.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="primaryPriority" className="text-right">
                                Primary Priority
                            </Label>
                            <Input
                                id="primaryPriority"
                                name="primaryPriority"
                                type="number"
                                placeholder="100"
                                defaultValue="100"
                                min="1"
                                max="255"
                                className="col-span-3"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="secondaryRouter" className="text-right">
                                Secondary Router <span className="text-red-500">*</span>
                            </Label>
                            <Select name="secondaryRouter" required>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select secondary router" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableRouters.map((router) => (
                                        <SelectItem key={router.id} value={router.id}>
                                            {router.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="secondaryPriority" className="text-right">
                                Secondary Priority
                            </Label>
                            <Input
                                id="secondaryPriority"
                                name="secondaryPriority"
                                type="number"
                                placeholder="90"
                                defaultValue="90"
                                min="1"
                                max="255"
                                className="col-span-3"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="virtualIP" className="text-right">
                                Virtual IP <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="virtualIP"
                                name="virtualIP"
                                placeholder="10.0.1.254"
                                className="col-span-3"
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Creating..." : "Create HA Pair"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
