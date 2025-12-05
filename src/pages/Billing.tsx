import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Receipt, 
  Plus, 
  Trash2,
  Printer,
  CreditCard,
  UserPlus,
  Briefcase
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface BillItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Bill {
  id: string;
  counterName: string;
  items: BillItem[];
  total: number;
  date: string;
  type: "billing" | "registration";
}

interface Registration {
  id: string;
  type: "stall" | "employment_booking" | "employment_reg";
  name: string;
  category?: string;
  phone: string;
  amount: number;
  date: string;
}

const stalls = [
  { id: "1", name: "Sharma Sweets", counter: "A1" },
  { id: "2", name: "Dosa Corner", counter: "A2" },
  { id: "3", name: "Chai Point", counter: "B1" },
];

const products: Record<string, { name: string; price: number }[]> = {
  "1": [
    { name: "Gulab Jamun (4pc)", price: 48 },
    { name: "Rasgulla (4pc)", price: 60 },
  ],
  "2": [
    { name: "Masala Dosa", price: 72 },
    { name: "Plain Dosa", price: 48 },
  ],
  "3": [
    { name: "Masala Chai", price: 24 },
    { name: "Coffee", price: 30 },
  ],
};

export default function Billing() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  
  const [selectedStall, setSelectedStall] = useState<string>("");
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  
  const [registration, setRegistration] = useState({
    type: "stall" as "stall" | "employment_booking" | "employment_reg",
    name: "",
    category: "",
    phone: "",
    amount: ""
  });

  const addItemToBill = (product: { name: string; price: number }) => {
    const existingItem = billItems.find(item => item.name === product.name);
    if (existingItem) {
      setBillItems(billItems.map(item =>
        item.name === product.name
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setBillItems([...billItems, {
        id: Date.now().toString(),
        name: product.name,
        quantity: 1,
        price: product.price
      }]);
    }
  };

  const removeItem = (id: string) => {
    setBillItems(billItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return removeItem(id);
    setBillItems(billItems.map(item =>
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const calculateTotal = () => {
    return billItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const generateBill = () => {
    if (!selectedStall || billItems.length === 0) {
      toast.error("Please select a stall and add items");
      return;
    }
    
    const stall = stalls.find(s => s.id === selectedStall);
    const newBill: Bill = {
      id: Date.now().toString(),
      counterName: `${stall?.name} (${stall?.counter})`,
      items: [...billItems],
      total: calculateTotal(),
      date: new Date().toLocaleString(),
      type: "billing"
    };
    
    setBills([newBill, ...bills]);
    setBillItems([]);
    setSelectedStall("");
    toast.success("Bill generated successfully!");
  };

  const handleRegistration = () => {
    if (!registration.name || !registration.phone || !registration.amount) {
      toast.error("Please fill all required fields");
      return;
    }

    const newReg: Registration = {
      id: Date.now().toString(),
      ...registration,
      amount: parseFloat(registration.amount),
      date: new Date().toLocaleString()
    };

    setRegistrations([newReg, ...registrations]);
    setRegistration({ type: "stall", name: "", category: "", phone: "", amount: "" });
    toast.success("Registration completed!");
  };

  return (
    <PageLayout>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Billing & Registrations</h1>
          <p className="text-muted-foreground mt-1">Process bills and manage registrations</p>
        </div>

        <Tabs defaultValue="billing" className="space-y-6">
          <TabsList className="grid w-full max-w-lg grid-cols-3">
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              Billing
            </TabsTrigger>
            <TabsTrigger value="receipts" className="flex items-center gap-2">
              <Printer className="h-4 w-4" />
              Receipts
            </TabsTrigger>
            <TabsTrigger value="registrations" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Registrations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="billing">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>New Bill</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select Counter</Label>
                    <select
                      value={selectedStall}
                      onChange={(e) => setSelectedStall(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="">Select stall</option>
                      {stalls.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.counter})</option>
                      ))}
                    </select>
                  </div>

                  {selectedStall && (
                    <div className="space-y-2">
                      <Label>Add Items</Label>
                      <div className="flex flex-wrap gap-2">
                        {products[selectedStall]?.map((product) => (
                          <Button
                            key={product.name}
                            variant="outline"
                            size="sm"
                            onClick={() => addItemToBill(product)}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            {product.name} - ₹{product.price}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {billItems.length > 0 && (
                    <div className="space-y-2">
                      <Label>Bill Items</Label>
                      <div className="border border-border rounded-lg divide-y divide-border">
                        {billItems.map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-3">
                            <div>
                              <p className="font-medium text-foreground">{item.name}</p>
                              <p className="text-sm text-muted-foreground">₹{item.price} each</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                -
                              </Button>
                              <span className="w-8 text-center font-medium">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                +
                              </Button>
                              <span className="w-16 text-right font-semibold">
                                ₹{item.price * item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                                onClick={() => removeItem(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <span className="text-lg font-semibold">Total</span>
                        <span className="text-2xl font-bold text-primary">₹{calculateTotal()}</span>
                      </div>

                      <Button onClick={generateBill} className="w-full" size="lg">
                        <Receipt className="h-4 w-4 mr-2" />
                        Generate Bill
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Bills</CardTitle>
                </CardHeader>
                <CardContent>
                  {bills.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No bills generated yet</p>
                  ) : (
                    <div className="space-y-4">
                      {bills.slice(0, 5).map((bill) => (
                        <div key={bill.id} className="p-4 border border-border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-foreground">{bill.counterName}</span>
                            <Badge variant="secondary">{bill.date}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {bill.items.length} items
                          </p>
                          <p className="text-lg font-bold text-primary mt-1">₹{bill.total}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="receipts">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cash Receipts from Billing</CardTitle>
                </CardHeader>
                <CardContent>
                  {bills.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No billing receipts</p>
                  ) : (
                    <div className="space-y-3">
                      {bills.map((bill) => (
                        <div key={bill.id} className="p-3 border border-border rounded-lg flex items-center justify-between">
                          <div>
                            <p className="font-medium">{bill.counterName}</p>
                            <p className="text-xs text-muted-foreground">{bill.date}</p>
                          </div>
                          <span className="font-bold text-success">₹{bill.total}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cash Receipts from Registrations</CardTitle>
                </CardHeader>
                <CardContent>
                  {registrations.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No registration receipts</p>
                  ) : (
                    <div className="space-y-3">
                      {registrations.map((reg) => (
                        <div key={reg.id} className="p-3 border border-border rounded-lg flex items-center justify-between">
                          <div>
                            <p className="font-medium">{reg.name}</p>
                            <p className="text-xs text-muted-foreground">{reg.type} - {reg.date}</p>
                          </div>
                          <span className="font-bold text-success">₹{reg.amount}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="registrations">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>New Registration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Registration Type</Label>
                    <select
                      value={registration.type}
                      onChange={(e) => setRegistration({ 
                        ...registration, 
                        type: e.target.value as typeof registration.type 
                      })}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="stall">Stall Counter Registration</option>
                      <option value="employment_booking">Employment Booking</option>
                      <option value="employment_reg">Employment Registration</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      value={registration.name}
                      onChange={(e) => setRegistration({ ...registration, name: e.target.value })}
                      placeholder={registration.type === "stall" ? "Counter Name" : "Applicant Name"}
                    />
                  </div>

                  {registration.type === "employment_booking" && (
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Input
                        value={registration.category}
                        onChange={(e) => setRegistration({ ...registration, category: e.target.value })}
                        placeholder="Enter category"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Mobile Number</Label>
                    <Input
                      value={registration.phone}
                      onChange={(e) => setRegistration({ ...registration, phone: e.target.value })}
                      placeholder="Enter mobile number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>
                      {registration.type === "stall" ? "Registration Fee" : "Amount"} (₹)
                    </Label>
                    <Input
                      type="number"
                      value={registration.amount}
                      onChange={(e) => setRegistration({ ...registration, amount: e.target.value })}
                      placeholder="Enter amount"
                    />
                  </div>

                  <Button onClick={handleRegistration} className="w-full">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Complete Registration
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Registrations</CardTitle>
                </CardHeader>
                <CardContent>
                  {registrations.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No registrations yet</p>
                  ) : (
                    <div className="space-y-3">
                      {registrations.map((reg) => (
                        <div key={reg.id} className="p-4 border border-border rounded-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                                reg.type === "stall" ? "bg-warning/10" : "bg-info/10"
                              }`}>
                                {reg.type === "stall" ? (
                                  <CreditCard className="h-5 w-5 text-warning" />
                                ) : (
                                  <Briefcase className="h-5 w-5 text-info" />
                                )}
                              </div>
                              <div>
                                <p className="font-semibold text-foreground">{reg.name}</p>
                                <p className="text-sm text-muted-foreground">{reg.phone}</p>
                                {reg.category && (
                                  <Badge variant="outline" className="mt-1">{reg.category}</Badge>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-primary">₹{reg.amount}</p>
                              <p className="text-xs text-muted-foreground">{reg.date}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
