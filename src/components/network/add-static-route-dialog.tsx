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

interface AddStaticRouteDialogProps {
    onAdd: (route: any) => void
}

export function AddStaticRouteDialog({ onAdd }: AddStaticRouteDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const route = {
            id: Date.now(),
            vrf: formData.get('vrf'),
            prefix: formData.get('prefix'),
            nexthop: formData.get('nexthop'),
            interface: formData.get('interface'),
            metric: parseInt(formData.get('metric') as string)
        }

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))

        onAdd(route)
        setLoading(false)
        setOpen(false)

        toast({
            title: "Route Added",
            description: `Static route ${route.prefix} has been added successfully.`,
        })

        // Reset form
        e.currentTarget.reset()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Route
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add Static Route</DialogTitle>
                        <DialogDescription>
                            Configure a new static route for this router.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="vrf" className="text-right">
                                VRF
                            </Label>
                            <Select name="vrf" defaultValue="default" required>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="default">Default</SelectItem>
                                    <SelectItem value="customer_a">CUSTOMER_A</SelectItem>
                                    <SelectItem value="customer_b">CUSTOMER_B</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="prefix" className="text-right">
                                Prefix <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="prefix"
                                name="prefix"
                                placeholder="10.0.0.0/24"
                                className="col-span-3"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="nexthop" className="text-right">
                                Next Hop <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="nexthop"
                                name="nexthop"
                                placeholder="10.0.1.5"
                                className="col-span-3"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="interface" className="text-right">
                                Interface <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="interface"
                                name="interface"
                                placeholder="GigE 0/0"
                                className="col-span-3"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="metric" className="text-right">
                                Metric
                            </Label>
                            <Input
                                id="metric"
                                name="metric"
                                type="number"
                                defaultValue="10"
                                placeholder="10"
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
                            {loading ? "Adding..." : "Add Route"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
