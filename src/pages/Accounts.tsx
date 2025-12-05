import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Wallet, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Calculator,
  Plus,
  Store,
  Briefcase,
  Receipt
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Transaction {
  id: string;
  type: "collection" | "payment";
  category: string;
  description: string;
  amount: number;
  date: string;
}

const initialTransactions: Transaction[] = [
  { id: "1", type: "collection", category: "Stall Billing", description: "Sharma Sweets - Daily Sales", amount: 5400, date: "2024-03-15" },
  { id: "2", type: "collection", category: "Employment Booking", description: "Kitchen Helper - 3 bookings", amount: 1500, date: "2024-03-15" },
  { id: "3", type: "collection", category: "Employment Registration", description: "5 new registrations", amount: 2500, date: "2024-03-15" },
  { id: "4", type: "payment", category: "Participant Payment", description: "Sharma Sweets - After 20% deduction", amount: 4320, date: "2024-03-15" },
  { id: "5", type: "payment", category: "Other Payment", description: "Stage decoration advance", amount: 5000, date: "2024-03-14" },
  { id: "6", type: "collection", category: "Stall Billing", description: "Dosa Corner - Daily Sales", amount: 7200, date: "2024-03-14" },
];

const EVENT_MARGIN = 20;

export default function Accounts() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentType, setPaymentType] = useState<"participant" | "other">("participant");
  
  const [participantPayment, setParticipantPayment] = useState({
    counterName: "",
    billedAmount: ""
  });

  const [otherPayment, setOtherPayment] = useState({
    narration: "",
    amount: ""
  });

  const collections = transactions.filter(t => t.type === "collection");
  const payments = transactions.filter(t => t.type === "payment");

  const totalCollected = collections.reduce((sum, t) => sum + t.amount, 0);
  const totalPaid = payments.reduce((sum, t) => sum + t.amount, 0);
  const cashBalance = totalCollected - totalPaid;

  const stallBillingTotal = collections
    .filter(t => t.category === "Stall Billing")
    .reduce((sum, t) => sum + t.amount, 0);

  const employmentBookingTotal = collections
    .filter(t => t.category === "Employment Booking")
    .reduce((sum, t) => sum + t.amount, 0);

  const employmentRegTotal = collections
    .filter(t => t.category === "Employment Registration")
    .reduce((sum, t) => sum + t.amount, 0);

  const participantPaymentsTotal = payments
    .filter(t => t.category === "Participant Payment")
    .reduce((sum, t) => sum + t.amount, 0);

  const otherPaymentsTotal = payments
    .filter(t => t.category === "Other Payment")
    .reduce((sum, t) => sum + t.amount, 0);

  const handleParticipantPayment = () => {
    if (!participantPayment.counterName || !participantPayment.billedAmount) {
      toast.error("Please fill all fields");
      return;
    }

    const billed = parseFloat(participantPayment.billedAmount);
    const deduction = billed * (EVENT_MARGIN / 100);
    const payable = billed - deduction;

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: "payment",
      category: "Participant Payment",
      description: `${participantPayment.counterName} - After ${EVENT_MARGIN}% deduction`,
      amount: payable,
      date: new Date().toISOString().split('T')[0]
    };

    setTransactions([newTransaction, ...transactions]);
    setParticipantPayment({ counterName: "", billedAmount: "" });
    setShowPaymentForm(false);
    toast.success(`Payment of ₹${payable} processed`);
  };

  const handleOtherPayment = () => {
    if (!otherPayment.narration || !otherPayment.amount) {
      toast.error("Please fill all fields");
      return;
    }

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: "payment",
      category: "Other Payment",
      description: otherPayment.narration,
      amount: parseFloat(otherPayment.amount),
      date: new Date().toISOString().split('T')[0]
    };

    setTransactions([newTransaction, ...transactions]);
    setOtherPayment({ narration: "", amount: "" });
    setShowPaymentForm(false);
    toast.success("Payment recorded");
  };

  return (
    <PageLayout>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Accounts & Cash Flow</h1>
            <p className="text-muted-foreground mt-1">Track complete event cash flow</p>
          </div>
          <Button onClick={() => setShowPaymentForm(!showPaymentForm)} variant="accent">
            <Plus className="h-4 w-4 mr-2" />
            New Payment
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Card className="border-l-4 border-l-success">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Collected</p>
                  <p className="text-3xl font-bold text-success">₹{totalCollected.toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <ArrowDownCircle className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-destructive">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Paid</p>
                  <p className="text-3xl font-bold text-destructive">₹{totalPaid.toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                  <ArrowUpCircle className="h-6 w-6 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-primary">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Cash Balance</p>
                  <p className="text-3xl font-bold text-primary">₹{cashBalance.toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {showPaymentForm && (
          <Card className="mb-8 animate-slide-up">
            <CardHeader>
              <CardTitle>Record Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Button
                  variant={paymentType === "participant" ? "default" : "outline"}
                  onClick={() => setPaymentType("participant")}
                >
                  <Store className="h-4 w-4 mr-2" />
                  Participant Payment
                </Button>
                <Button
                  variant={paymentType === "other" ? "default" : "outline"}
                  onClick={() => setPaymentType("other")}
                >
                  <Receipt className="h-4 w-4 mr-2" />
                  Other Payment
                </Button>
              </div>

              {paymentType === "participant" ? (
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Counter Name</Label>
                    <Input
                      value={participantPayment.counterName}
                      onChange={(e) => setParticipantPayment({ ...participantPayment, counterName: e.target.value })}
                      placeholder="Enter counter name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Total Billed Amount (₹)</Label>
                    <Input
                      type="number"
                      value={participantPayment.billedAmount}
                      onChange={(e) => setParticipantPayment({ ...participantPayment, billedAmount: e.target.value })}
                      placeholder="Enter billed amount"
                    />
                  </div>
                  {participantPayment.billedAmount && (
                    <div className="md:col-span-2 p-4 bg-muted rounded-lg">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-sm text-muted-foreground">Billed Amount</p>
                          <p className="text-lg font-semibold">₹{parseFloat(participantPayment.billedAmount).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Event Margin ({EVENT_MARGIN}%)</p>
                          <p className="text-lg font-semibold text-warning">
                            -₹{(parseFloat(participantPayment.billedAmount) * EVENT_MARGIN / 100).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Payable Amount</p>
                          <p className="text-lg font-bold text-success">
                            ₹{(parseFloat(participantPayment.billedAmount) * (1 - EVENT_MARGIN / 100)).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="md:col-span-2 flex gap-2">
                    <Button onClick={handleParticipantPayment}>Process Payment</Button>
                    <Button variant="outline" onClick={() => setShowPaymentForm(false)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Narration / Description</Label>
                    <Input
                      value={otherPayment.narration}
                      onChange={(e) => setOtherPayment({ ...otherPayment, narration: e.target.value })}
                      placeholder="Enter payment description"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Amount (₹)</Label>
                    <Input
                      type="number"
                      value={otherPayment.amount}
                      onChange={(e) => setOtherPayment({ ...otherPayment, amount: e.target.value })}
                      placeholder="Enter amount"
                    />
                  </div>
                  <div className="md:col-span-2 flex gap-2">
                    <Button onClick={handleOtherPayment}>Record Payment</Button>
                    <Button variant="outline" onClick={() => setShowPaymentForm(false)}>Cancel</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="collections" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="collections" className="flex items-center gap-2">
              <ArrowDownCircle className="h-4 w-4" />
              Cash Collected
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <ArrowUpCircle className="h-4 w-4" />
              Cash Paid
            </TabsTrigger>
          </TabsList>

          <TabsContent value="collections">
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-warning/10 flex items-center justify-center">
                      <Store className="h-5 w-5 text-warning" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Stall Billing</p>
                      <p className="text-xl font-bold text-foreground">₹{stallBillingTotal.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-info/10 flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-info" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Employment Booking</p>
                      <p className="text-xl font-bold text-foreground">₹{employmentBookingTotal.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Receipt className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Employment Reg.</p>
                      <p className="text-xl font-bold text-foreground">₹{employmentRegTotal.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="text-left p-4 font-medium text-muted-foreground">Date</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Category</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Description</th>
                        <th className="text-right p-4 font-medium text-muted-foreground">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {collections.map((t) => (
                        <tr key={t.id} className="border-b border-border/50">
                          <td className="p-4 text-muted-foreground">{t.date}</td>
                          <td className="p-4">
                            <span className="px-2 py-1 bg-success/10 text-success rounded-md text-sm">
                              {t.category}
                            </span>
                          </td>
                          <td className="p-4 text-foreground">{t.description}</td>
                          <td className="p-4 text-right font-semibold text-success">+₹{t.amount.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                      <Store className="h-5 w-5 text-destructive" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Participant Payments</p>
                      <p className="text-xl font-bold text-foreground">₹{participantPaymentsTotal.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-warning/10 flex items-center justify-center">
                      <Receipt className="h-5 w-5 text-warning" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Other Payments</p>
                      <p className="text-xl font-bold text-foreground">₹{otherPaymentsTotal.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="text-left p-4 font-medium text-muted-foreground">Date</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Category</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Description</th>
                        <th className="text-right p-4 font-medium text-muted-foreground">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((t) => (
                        <tr key={t.id} className="border-b border-border/50">
                          <td className="p-4 text-muted-foreground">{t.date}</td>
                          <td className="p-4">
                            <span className="px-2 py-1 bg-destructive/10 text-destructive rounded-md text-sm">
                              {t.category}
                            </span>
                          </td>
                          <td className="p-4 text-foreground">{t.description}</td>
                          <td className="p-4 text-right font-semibold text-destructive">-₹{t.amount.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
