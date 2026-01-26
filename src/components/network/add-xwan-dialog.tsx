import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
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

interface AddXwanDialogProps {
    onAdd: (xwan: any) => void
}

const availableRouters = [
    { id: 'RTR-NYC-01', name: 'RTR-NYC-01' },
    { id: 'RTR-LON-03', name: 'RTR-LON-03' },
    { id: 'RTR-TKY-02', name: 'RTR-TKY-02' },
    { id: 'RTR-SFO-01', name: 'RTR-SFO-01' },
]

export function AddXwanDialog({ onAdd }: AddXwanDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [selectedRouters, setSelectedRouters] = useState<string[]>([])
    const { toast } = useToast()

    const handleRouterToggle = (routerId: string) => {
        setSelectedRouters(prev =>
            prev.includes(routerId)
                ? prev.filter(id => id !== routerId)
                : [...prev, routerId]
        )
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (selectedRouters.length < 2) {
            toast({
                title: "Invalid Selection",
                description: "Please select at least 2 routers for the xWAN path.",
                variant: "destructive"
            })
            return
        }

        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const xwan = {
            id: Date.now(),
            name: formData.get('name'),
            type: formData.get('type'),
            routers: selectedRouters,
            source: selectedRouters[0], // First router as source
            destination: selectedRouters[selectedRouters.length - 1], // Last router as destination
            protocol: formData.get('protocol'),
            latency: Math.floor(Math.random() * 150) + 20, // Random for demo
            bandwidth: formData.get('bandwidth'),
            status: 'active'
        }

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))

        onAdd(xwan)
        setLoading(false)
        setOpen(false)
        setSelectedRouters([])

        toast({
            title: "xWAN Path Created",
            description: `Network path ${xwan.name} has been created with ${selectedRouters.length} routers.`,
        })

        // Reset form
        e.currentTarget.reset()
    }

    return (
        <Dialog open={open} onOpenChange={(newOpen) => {
            setOpen(newOpen)
            if (!newOpen) {
                setSelectedRouters([])
            }
        }}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add xWAN
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add xWAN Path</DialogTitle>
                        <DialogDescription>
                            Create a new network path between routers.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Path Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="NYC-LON-Primary"
                                className="col-span-3"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="type" className="text-right">
                                Topology Type <span className="text-red-500">*</span>
                            </Label>
                            <Select name="type" defaultValue="Point-to-Point" required>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Full Mesh">Full Mesh</SelectItem>
                                    <SelectItem value="Hub-Spoke">Hub-Spoke</SelectItem>
                                    <SelectItem value="Point-to-Point">Point-to-Point</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-4 items-start gap-4">
                            <Label className="text-right mt-2">
                                Routers <span className="text-red-500">*</span>
                            </Label>
                            <div className="col-span-3 space-y-2">
                                <p className="text-sm text-muted-foreground mb-2">
                                    Select at least 2 routers ({selectedRouters.length} selected)
                                </p>
                                {availableRouters.map((router) => (
                                    <div key={router.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={router.id}
                                            checked={selectedRouters.includes(router.id)}
                                            onCheckedChange={() => handleRouterToggle(router.id)}
                                        />
                                        <Label
                                            htmlFor={router.id}
                                            className="text-sm font-normal cursor-pointer"
                                        >
                                            {router.name}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="protocol" className="text-right">
                                Protocol <span className="text-red-500">*</span>
                            </Label>
                            <Select name="protocol" defaultValue="IPSec" required>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="IPSec">IPSec</SelectItem>
                                    <SelectItem value="WireGuard">WireGuard</SelectItem>
                                    <SelectItem value="GRE">GRE</SelectItem>
                                    <SelectItem value="VXLAN">VXLAN</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="bandwidth" className="text-right">
                                Bandwidth <span className="text-red-500">*</span>
                            </Label>
                            <Select name="bandwidth" defaultValue="1 Gbps" required>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="100 Mbps">100 Mbps</SelectItem>
                                    <SelectItem value="500 Mbps">500 Mbps</SelectItem>
                                    <SelectItem value="1 Gbps">1 Gbps</SelectItem>
                                    <SelectItem value="10 Gbps">10 Gbps</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">
                                Description
                            </Label>
                            <Input
                                id="description"
                                name="description"
                                placeholder="Optional description"
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading || selectedRouters.length < 2}>
                            {loading ? "Creating..." : "Create Path"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
