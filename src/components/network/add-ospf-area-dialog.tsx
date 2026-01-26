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

interface AddOSPFAreaDialogProps {
    onAdd: (area: any) => void
}

export function AddOSPFAreaDialog({ onAdd }: AddOSPFAreaDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const area = {
            id: Date.now(),
            areaId: formData.get('areaId'),
            network: formData.get('network')
        }

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))

        onAdd(area)
        setLoading(false)
        setOpen(false)

        toast({
            title: "OSPF Area Added",
            description: `OSPF Area ${area.areaId} with network ${area.network} has been added.`,
        })

        // Reset form
        e.currentTarget.reset()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Area
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add OSPF Area</DialogTitle>
                        <DialogDescription>
                            Configure a new OSPF area and network.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="areaId" className="text-right">
                                Area ID <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="areaId"
                                name="areaId"
                                placeholder="0.0.0.0"
                                className="col-span-3"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="network" className="text-right">
                                Network <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="network"
                                name="network"
                                placeholder="10.0.0.0/24"
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
                            {loading ? "Adding..." : "Add Area"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
