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
import { Plus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface AddBGPNeighborDialogProps {
    onAdd: (neighbor: any) => void
}

export function AddBGPNeighborDialog({ onAdd }: AddBGPNeighborDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const neighbor = {
            id: Date.now(),
            ip: formData.get('ip'),
            asn: formData.get('asn'),
            state: 'Idle' // New neighbors start in Idle state
        }

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))

        onAdd(neighbor)
        setLoading(false)
        setOpen(false)

        toast({
            title: "BGP Neighbor Added",
            description: `BGP neighbor ${neighbor.ip} (AS ${neighbor.asn}) has been added.`,
        })

        // Reset form
        e.currentTarget.reset()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Neighbor
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add BGP Neighbor</DialogTitle>
                        <DialogDescription>
                            Configure a new BGP peering session.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="ip" className="text-right">
                                IP Address <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="ip"
                                name="ip"
                                placeholder="192.168.1.2"
                                className="col-span-3"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="asn" className="text-right">
                                AS Number <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="asn"
                                name="asn"
                                placeholder="65002"
                                className="col-span-3"
                                required
                            />
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
                        <Button type="submit" disabled={loading}>
                            {loading ? "Adding..." : "Add Neighbor"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
