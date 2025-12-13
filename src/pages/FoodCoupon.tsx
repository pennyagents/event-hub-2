import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Utensils, Minus, Plus, Loader2 } from "lucide-react";

interface FoodOption {
  id: string;
  name: string;
  price: number;
}

interface Panchayath {
  id: string;
  name: string;
}

interface SelectedFoodItem {
  id: string;
  quantity: number;
}

export default function FoodCoupon() {
  const queryClient = useQueryClient();
  const [selectedPanchayath, setSelectedPanchayath] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [selectedFoods, setSelectedFoods] = useState<SelectedFoodItem[]>([]);

  const { data: panchayaths = [], isLoading: panchayathsLoading } = useQuery({
    queryKey: ["panchayaths"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("panchayaths")
        .select("*")
        .order("name");
      if (error) throw error;
      return data as Panchayath[];
    },
  });

  const { data: foodOptions = [], isLoading: foodOptionsLoading } = useQuery({
    queryKey: ["food-options-active"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("food_options")
        .select("*")
        .eq("is_active", true)
        .order("display_order");
      if (error) throw error;
      return data as FoodOption[];
    },
  });

  const toggleFoodOption = (optionId: string) => {
    setSelectedFoods((prev) => {
      const existing = prev.find((f) => f.id === optionId);
      if (existing) {
        return prev.filter((f) => f.id !== optionId);
      }
      return [...prev, { id: optionId, quantity: 1 }];
    });
  };

  const updateQuantity = (optionId: string, delta: number) => {
    setSelectedFoods((prev) =>
      prev.map((f) =>
        f.id === optionId
          ? { ...f, quantity: Math.max(1, f.quantity + delta) }
          : f
      )
    );
  };

  const getSelectedFood = (optionId: string) => selectedFoods.find((f) => f.id === optionId);

  const totalAmount = selectedFoods.reduce((sum, item) => {
    const option = foodOptions.find((o) => o.id === item.id);
    return sum + (option ? option.price * item.quantity : 0);
  }, 0);

  const bookingMutation = useMutation({
    mutationFn: async () => {
      // Insert each selected food as a separate booking
      const bookings = selectedFoods.map((item) => {
        const option = foodOptions.find((o) => o.id === item.id);
        return {
          panchayath_id: selectedPanchayath,
          name: name.trim(),
          mobile: mobile.trim(),
          food_option_id: item.id,
          quantity: item.quantity,
          total_amount: option ? option.price * item.quantity : 0,
        };
      });

      const { error } = await supabase.from("food_coupon_bookings").insert(bookings);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("ബുക്കിംഗ് വിജയകരമായി!", {
        description: "നിങ്ങളുടെ ഫുഡ് കൂപ്പൺ ബുക്ക് ചെയ്തു.",
      });
      setSelectedPanchayath("");
      setName("");
      setMobile("");
      setSelectedFoods([]);
      queryClient.invalidateQueries({ queryKey: ["food-coupon-bookings"] });
    },
    onError: (error: Error) => {
      toast.error("ബുക്കിംഗ് പരാജയപ്പെട്ടു", {
        description: error.message,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPanchayath || !name.trim() || !mobile.trim() || selectedFoods.length === 0) {
      toast.error("എല്ലാ ഫീൽഡുകളും പൂരിപ്പിക്കുക");
      return;
    }
    if (!/^\d{10}$/.test(mobile.trim())) {
      toast.error("സാധുവായ 10 അക്ക മൊബൈൽ നമ്പർ നൽകുക");
      return;
    }
    bookingMutation.mutate();
  };

  return (
    <PageLayout>
      <section className="container py-8 md:py-12">
        <div className="mx-auto max-w-lg">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Utensils className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">ഫുഡ് കൂപ്പൺ ബുക്കിംഗ്</h1>
            <p className="mt-2 text-muted-foreground">ഉച്ചഭക്ഷണത്തിന് മുൻകൂട്ടി ബുക്ക് ചെയ്യുക</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>ബുക്കിംഗ് ഫോം</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Panchayath Selection */}
                <div className="space-y-2">
                  <Label>പഞ്ചായത്ത് *</Label>
                  <Select value={selectedPanchayath} onValueChange={setSelectedPanchayath}>
                    <SelectTrigger>
                      <SelectValue placeholder={panchayathsLoading ? "ലോഡ് ചെയ്യുന്നു..." : "പഞ്ചായത്ത് തിരഞ്ഞെടുക്കുക"} />
                    </SelectTrigger>
                    <SelectContent>
                      {panchayaths.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Name */}
                <div className="space-y-2">
                  <Label>പേര് *</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="നിങ്ങളുടെ പേര്"
                  />
                </div>

                {/* Mobile */}
                <div className="space-y-2">
                  <Label>മൊബൈൽ നമ്പർ *</Label>
                  <Input
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="10 അക്ക മൊബൈൽ നമ്പർ"
                    maxLength={10}
                  />
                </div>

                {/* Food Options Multi-Select */}
                <div className="space-y-3">
                  <Label>ഫുഡ് ഓപ്ഷൻ * (ഒന്നിലധികം തിരഞ്ഞെടുക്കാം)</Label>
                  {foodOptionsLoading ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {foodOptions.map((option) => {
                        const selectedItem = getSelectedFood(option.id);
                        const isSelected = !!selectedItem;
                        
                        return (
                          <div
                            key={option.id}
                            className={`p-4 rounded-lg border transition-colors ${
                              isSelected ? "border-primary bg-primary/5" : "border-border"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Checkbox
                                  id={option.id}
                                  checked={isSelected}
                                  onCheckedChange={() => toggleFoodOption(option.id)}
                                />
                                <label
                                  htmlFor={option.id}
                                  className="cursor-pointer font-medium"
                                >
                                  {option.name}
                                </label>
                              </div>
                              <span className="text-primary font-semibold">₹{option.price}</span>
                            </div>
                            
                            {isSelected && (
                              <div className="flex items-center gap-4 mt-3 pl-7">
                                <span className="text-sm text-muted-foreground">എണ്ണം:</span>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => updateQuantity(option.id, -1)}
                                  disabled={selectedItem.quantity <= 1}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center font-semibold">
                                  {selectedItem.quantity}
                                </span>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => updateQuantity(option.id, 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                                <span className="ml-auto text-sm font-medium">
                                  = ₹{option.price * selectedItem.quantity}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Total */}
                {selectedFoods.length > 0 && (
                  <div className="p-4 rounded-lg bg-muted">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">ആകെ തുക:</span>
                      <span className="text-2xl font-bold text-primary">₹{totalAmount}</span>
                    </div>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={bookingMutation.isPending}>
                  {bookingMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  ബുക്ക് ചെയ്യുക
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </PageLayout>
  );
}
