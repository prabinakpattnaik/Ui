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

interface AddPolicyDialogProps {
    routerId: string
    onPolicyAdded?: () => void
}

export function AddPolicyDialog({ routerId, onPolicyAdded }: AddPolicyDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        setLoading(false)
        setOpen(false)
        toast({
            title: "Policy Created",
            description: "The new policy has been successfully added to the router.",
        })

        onPolicyAdded?.()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Policy
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add New Policy</DialogTitle>
                        <DialogDescription>
                            Create a new policy for router {routerId}. Configure firewall rules, traffic shaping, or routing policies.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Policy Name
                            </Label>
                            <Input
                                id="name"
                                placeholder="e.g., Block SSH External"
                                className="col-span-3"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="type" className="text-right">
                                Type
                            </Label>
                            <Select required>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select policy type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="firewall">Firewall</SelectItem>
                                    <SelectItem value="bgp">BGP</SelectItem>
                                    <SelectItem value="traffic-shaping">Traffic Shaping</SelectItem>
                                    <SelectItem value="qos">QoS</SelectItem>
                                    <SelectItem value="nat">NAT</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="action" className="text-right">
                                Action
                            </Label>
                            <Select required>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select action" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="allow">Allow</SelectItem>
                                    <SelectItem value="deny">Deny</SelectItem>
                                    <SelectItem value="filter">Filter</SelectItem>
                                    <SelectItem value="prioritize">Prioritize</SelectItem>
                                    <SelectItem value="rate-limit">Rate Limit</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="source" className="text-right">
                                Source
                            </Label>
                            <Input
                                id="source"
                                placeholder="e.g., 10.0.0.0/8 or Any"
                                className="col-span-3"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="destination" className="text-right">
                                Destination
                            </Label>
                            <Input
                                id="destination"
                                placeholder="e.g., 192.168.1.0/24 or Any"
                                className="col-span-3"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="port" className="text-right">
                                Port/Protocol
                            </Label>
                            <Input
                                id="port"
                                placeholder="e.g., 22, 80, 443, ICMP"
                                className="col-span-3"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="priority" className="text-right">
                                Priority
                            </Label>
                            <Input
                                id="priority"
                                type="number"
                                placeholder="0-1000 (lower is higher priority)"
                                className="col-span-3"
                                min="0"
                                max="1000"
                                defaultValue="100"
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Creating..." : "Create Policy"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
