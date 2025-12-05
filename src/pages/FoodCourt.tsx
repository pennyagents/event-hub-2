import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Store, 
  Plus, 
  Package,
  CheckCircle,
  Clock,
  Trash2,
  IndianRupee
} from "lucide-react";
import { useState } from "react";

interface Stall {
  id: string;
  name: string;
  owner: string;
  phone: string;
  counterNumber: string;
  status: "pending" | "verified";
}

interface Product {
  id: string;
  stallId: string;
  name: string;
  costPrice: number;
  margin: number;
  mrp: number;
}

const initialStalls: Stall[] = [
  { id: "1", name: "Sharma Sweets", owner: "Ramesh Sharma", phone: "9876543210", counterNumber: "A1", status: "verified" },
  { id: "2", name: "Dosa Corner", owner: "Lakshmi Rao", phone: "9876543211", counterNumber: "A2", status: "verified" },
  { id: "3", name: "Chai Point", owner: "Akash Gupta", phone: "9876543212", counterNumber: "B1", status: "pending" },
];

const initialProducts: Product[] = [
  { id: "1", stallId: "1", name: "Gulab Jamun (4pc)", costPrice: 40, margin: 20, mrp: 48 },
  { id: "2", stallId: "1", name: "Rasgulla (4pc)", costPrice: 50, margin: 20, mrp: 60 },
  { id: "3", stallId: "2", name: "Masala Dosa", costPrice: 60, margin: 20, mrp: 72 },
  { id: "4", stallId: "2", name: "Plain Dosa", costPrice: 40, margin: 20, mrp: 48 },
];

const EVENT_MARGIN = 20;

export default function FoodCourt() {
  const [stalls, setStalls] = useState<Stall[]>(initialStalls);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [showStallForm, setShowStallForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [selectedStall, setSelectedStall] = useState<string>("");
  
  const [newStall, setNewStall] = useState({
    name: "",
    owner: "",
    phone: "",
    counterNumber: ""
  });

  const [newProduct, setNewProduct] = useState({
    name: "",
    costPrice: ""
  });

  const handleAddStall = () => {
    if (newStall.name && newStall.owner) {
      const counter = newStall.counterNumber || `${String.fromCharCode(65 + Math.floor(stalls.length / 10))}${(stalls.length % 10) + 1}`;
      setStalls([...stalls, { 
        ...newStall, 
        id: Date.now().toString(),
        counterNumber: counter,
        status: "pending"
      }]);
      setNewStall({ name: "", owner: "", phone: "", counterNumber: "" });
      setShowStallForm(false);
    }
  };

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.costPrice && selectedStall) {
      const cost = parseFloat(newProduct.costPrice);
      const mrp = Math.ceil(cost * (1 + EVENT_MARGIN / 100));
      setProducts([...products, {
        id: Date.now().toString(),
        stallId: selectedStall,
        name: newProduct.name,
        costPrice: cost,
        margin: EVENT_MARGIN,
        mrp
      }]);
      setNewProduct({ name: "", costPrice: "" });
      setShowProductForm(false);
    }
  };

  const handleVerifyStall = (id: string) => {
    setStalls(stalls.map(s => s.id === id ? { ...s, status: "verified" } : s));
  };

  const handleDeleteStall = (id: string) => {
    setStalls(stalls.filter(s => s.id !== id));
    setProducts(products.filter(p => p.stallId !== id));
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const getStallProducts = (stallId: string) => products.filter(p => p.stallId === stallId);

  return (
    <PageLayout>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Food Court & Stalls</h1>
            <p className="text-muted-foreground mt-1">Manage stall registrations and product listings</p>
          </div>
        </div>

        <Tabs defaultValue="stalls" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="stalls" className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              Stall Booking
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Products
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stalls">
            <div className="flex justify-end mb-4">
              <Button onClick={() => setShowStallForm(!showStallForm)} variant="accent">
                <Plus className="h-4 w-4 mr-2" />
                Register Stall
              </Button>
            </div>

            {showStallForm && (
              <Card className="mb-6 animate-slide-up">
                <CardHeader>
                  <CardTitle>Stall Registration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stallName">Stall Name</Label>
                      <Input
                        id="stallName"
                        value={newStall.name}
                        onChange={(e) => setNewStall({ ...newStall, name: e.target.value })}
                        placeholder="Enter stall name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="owner">Owner Name</Label>
                      <Input
                        id="owner"
                        value={newStall.owner}
                        onChange={(e) => setNewStall({ ...newStall, owner: e.target.value })}
                        placeholder="Enter owner name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stallPhone">Phone</Label>
                      <Input
                        id="stallPhone"
                        value={newStall.phone}
                        onChange={(e) => setNewStall({ ...newStall, phone: e.target.value })}
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="counter">Counter Number (Auto-assigned if empty)</Label>
                      <Input
                        id="counter"
                        value={newStall.counterNumber}
                        onChange={(e) => setNewStall({ ...newStall, counterNumber: e.target.value })}
                        placeholder="e.g., A1, B2"
                      />
                    </div>
                    <div className="md:col-span-2 flex gap-2">
                      <Button onClick={handleAddStall}>Register Stall</Button>
                      <Button variant="outline" onClick={() => setShowStallForm(false)}>Cancel</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stalls.map((stall) => (
                <Card key={stall.id} className="animate-fade-in">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-warning/10 flex items-center justify-center">
                          <Store className="h-6 w-6 text-warning" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{stall.name}</h3>
                          <p className="text-sm text-muted-foreground">Counter: {stall.counterNumber}</p>
                        </div>
                      </div>
                      <Badge variant={stall.status === "verified" ? "default" : "secondary"}>
                        {stall.status === "verified" ? (
                          <><CheckCircle className="h-3 w-3 mr-1" /> Verified</>
                        ) : (
                          <><Clock className="h-3 w-3 mr-1" /> Pending</>
                        )}
                      </Badge>
                    </div>
                    <div className="mt-4 text-sm text-muted-foreground">
                      <p>Owner: {stall.owner}</p>
                      <p>Phone: {stall.phone}</p>
                      <p className="mt-2 text-xs">Products: {getStallProducts(stall.id).length}</p>
                    </div>
                    <div className="mt-4 flex gap-2">
                      {stall.status === "pending" && (
                        <Button size="sm" onClick={() => handleVerifyStall(stall.id)}>
                          Verify
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDeleteStall(stall.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="products">
            <div className="flex justify-end mb-4 gap-4">
              <select
                value={selectedStall}
                onChange={(e) => setSelectedStall(e.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select Stall</option>
                {stalls.filter(s => s.status === "verified").map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.counterNumber})</option>
                ))}
              </select>
              <Button 
                onClick={() => setShowProductForm(!showProductForm)} 
                variant="accent"
                disabled={!selectedStall}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>

            {showProductForm && selectedStall && (
              <Card className="mb-6 animate-slide-up">
                <CardHeader>
                  <CardTitle>Add Product (20% Event Margin Applied)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="productName">Item Name</Label>
                      <Input
                        id="productName"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        placeholder="Enter item name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="costPrice">Cost Price (₹)</Label>
                      <Input
                        id="costPrice"
                        type="number"
                        value={newProduct.costPrice}
                        onChange={(e) => setNewProduct({ ...newProduct, costPrice: e.target.value })}
                        placeholder="Enter cost price"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>MRP (Auto-calculated)</Label>
                      <div className="h-10 flex items-center px-3 bg-muted rounded-md text-sm font-medium">
                        ₹{newProduct.costPrice ? Math.ceil(parseFloat(newProduct.costPrice) * 1.2) : 0}
                      </div>
                    </div>
                    <div className="md:col-span-3 flex gap-2">
                      <Button onClick={handleAddProduct}>Add Product</Button>
                      <Button variant="outline" onClick={() => setShowProductForm(false)}>Cancel</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {stalls.filter(s => s.status === "verified").map((stall) => {
              const stallProducts = getStallProducts(stall.id);
              if (stallProducts.length === 0) return null;
              
              return (
                <Card key={stall.id} className="mb-6 animate-fade-in">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Store className="h-5 w-5 text-warning" />
                      {stall.name} ({stall.counterNumber})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-2 font-medium text-muted-foreground">Item Name</th>
                            <th className="text-right py-2 font-medium text-muted-foreground">Cost Price</th>
                            <th className="text-right py-2 font-medium text-muted-foreground">Margin</th>
                            <th className="text-right py-2 font-medium text-muted-foreground">MRP</th>
                            <th className="text-right py-2 font-medium text-muted-foreground">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stallProducts.map((product) => (
                            <tr key={product.id} className="border-b border-border/50">
                              <td className="py-3 font-medium text-foreground">{product.name}</td>
                              <td className="py-3 text-right text-muted-foreground">₹{product.costPrice}</td>
                              <td className="py-3 text-right text-success">{product.margin}%</td>
                              <td className="py-3 text-right font-semibold text-foreground">₹{product.mrp}</td>
                              <td className="py-3 text-right">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-destructive"
                                  onClick={() => handleDeleteProduct(product.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
