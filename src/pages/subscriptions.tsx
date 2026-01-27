import * as React from "react"
import { Check, CreditCard, Download, ShieldCheck, BadgeCheck } from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"

type PlanId = "business" | "enterprise"

type Plan = {
  id: PlanId
  name: string
  tagline: string
  price: string
  billingNote: string
  features: string[]
  recommended?: boolean
}

type Invoice = {
  id: string
  date: string
  description: string
  amount: string
  status: "Paid" | "Pending" | "Failed"
}

const PLANS: Plan[] = [
  {
    id: "business",
    name: "Business",
    tagline: "For organizations of all sizes",
    price: "$50",
    billingNote: "/month/router",
    features: [
      "Per-router pricing",
      "Unlimited xWANs",
      "Full security suite",
      "Priority support",
      "API access",
      "Standard SLA",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "For large enterprises with custom needs",
    price: "Custom",
    billingNote: "pricing",
    recommended: true,
    features: [
      "Volume discounts",
      "Unlimited xWANs",
      "Full security suite",
      "24/7 dedicated support",
      "API access",
      "Custom integrations",
      "Premium SLA guarantee",
      "Dedicated account manager",
    ],
  },
]

const MOCK_INVOICES: Invoice[] = [
  { id: "inv_2026_01", date: "Jan 20, 2026", description: "Enterprise Plan - Monthly", amount: "$499", status: "Paid" },
  { id: "inv_2025_12", date: "Dec 20, 2025", description: "Enterprise Plan - Monthly", amount: "$499", status: "Paid" },
  { id: "inv_2025_11", date: "Nov 20, 2025", description: "Enterprise Plan - Monthly", amount: "$499", status: "Paid" },
]

function StatusBadge({ status }: { status: Invoice["status"] }) {
  const variant =
    status === "Paid" ? "default" : status === "Pending" ? "secondary" : "destructive"
  return <Badge variant={variant}>{status}</Badge>
}

function Feature({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <Check className="h-4 w-4 mt-0.5" />
      <div className="text-sm">{children}</div>
    </div>
  )
}

export default function SubscriptionsPage() {
  // Mock “active plan” and “usage”
  const [activePlan, setActivePlan] = React.useState<PlanId>("business")
  const [routerCount] = React.useState(12)
  const [routersLimit] = React.useState(50)

  const activePlanObj = PLANS.find((p) => p.id === activePlan)!

  const usagePct = Math.min(100, Math.round((routerCount / routersLimit) * 100))

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">My Subscriptions</h2>
        <p className="text-muted-foreground">
          Manage plans, billing, payment methods, and invoices.
        </p>
      </div>

      <Tabs defaultValue="plans" className="space-y-6">
        <TabsList>
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="history">Transaction History</TabsTrigger>
        </TabsList>

        {/* ===================== Plans Tab ===================== */}
        <TabsContent value="plans" className="space-y-6">
          {/* Top summary row */}
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BadgeCheck className="h-5 w-5" />
                  Current Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-lg font-semibold">{activePlanObj.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {activePlanObj.price}
                      <span className="ml-1">{activePlanObj.billingNote}</span>
                    </div>
                  </div>
                  <Badge className="gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    Active
                  </Badge>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Current usage</span>
                    <span className="font-medium">
                      {routerCount} / {routersLimit} routers ({usagePct}%)
                    </span>
                  </div>

                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${usagePct}%` }}
                    />
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Next billing date: <span className="font-medium">Feb 20, 2026</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border p-4">
                  <div className="text-sm font-medium">Visa •••• 4242</div>
                  <div className="text-xs text-muted-foreground">Expires 09/27</div>
                </div>

                <Button variant="outline" className="w-full">
                  Update Card
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Billing details row */}
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Billing Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">Company</div>
                    <Input value="Sxalable Networks" readOnly />
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">VAT / Tax ID</div>
                    <Input value="IN-XXXX-XXXX" readOnly />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <div className="text-xs text-muted-foreground">Address</div>
                    <Input value="123, Business Park Road, Bangalore, KA 560001, India" readOnly />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button variant="outline">Edit Billing Address</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Invoices</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {MOCK_INVOICES.slice(0, 2).map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <div className="text-sm font-medium">{inv.amount}</div>
                      <div className="text-xs text-muted-foreground">{inv.date}</div>
                    </div>
                    <Button size="sm" variant="outline" className="gap-2">
                      <Download className="h-4 w-4" />
                      PDF
                    </Button>
                  </div>
                ))}
                <Button variant="ghost" className="w-full">
                  View all invoices
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Available plans */}
          <div className="space-y-3">
            <div className="text-xl font-semibold">Available Plans</div>

            <div className="grid gap-6 lg:grid-cols-2">
              {PLANS.map((plan) => {
                const isActive = plan.id === activePlan
                return (
                  <Card key={plan.id} className={isActive ? "border-primary" : ""}>
                    <CardHeader className="space-y-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl">{plan.name}</CardTitle>

                        {plan.recommended && (
                          <Badge variant="secondary">Recommended</Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">{plan.tagline}</div>
                    </CardHeader>

                    <CardContent className="space-y-5">
                      <div className="flex items-end gap-2">
                        <div className="text-4xl font-bold">{plan.price}</div>
                        <div className="text-muted-foreground">{plan.billingNote}</div>
                      </div>

                      <div className="space-y-2">
                        {plan.features.map((f) => (
                          <Feature key={f}>{f}</Feature>
                        ))}
                      </div>

                      {isActive ? (
                        <Button className="w-full" variant="outline" disabled>
                          Current Plan
                        </Button>
                      ) : plan.id === "enterprise" ? (
                        <Button className="w-full">Contact Sales</Button>
                      ) : (
                        <Button className="w-full" onClick={() => setActivePlan(plan.id)}>
                          Switch to {plan.name}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </TabsContent>

        {/* ===================== Transaction History Tab ===================== */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Invoice</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_INVOICES.map((inv) => (
                      <TableRow key={inv.id}>
                        <TableCell className="font-medium">{inv.date}</TableCell>
                        <TableCell>{inv.description}</TableCell>
                        <TableCell className="text-right font-medium">{inv.amount}</TableCell>
                        <TableCell>
                          <StatusBadge status={inv.status} />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="gap-2">
                            <Download className="h-4 w-4" />
                            Download
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="text-xs text-muted-foreground">
                Tip: You can integrate this table with your billing provider (Stripe, Razorpay, etc.) later.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
