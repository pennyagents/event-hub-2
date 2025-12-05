import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  CalendarDays, 
  Plus, 
  MapPin, 
  Clock,
  Edit,
  Trash2
} from "lucide-react";
import { useState } from "react";

interface Program {
  id: string;
  name: string;
  date: string;
  time: string;
  venue: string;
  description: string;
}

const initialPrograms: Program[] = [
  { id: "1", name: "Opening Ceremony", date: "2024-03-15", time: "09:00", venue: "Main Stage", description: "Grand opening with cultural performances" },
  { id: "2", name: "Tech Workshop", date: "2024-03-15", time: "11:00", venue: "Hall A", description: "Interactive technology workshop" },
  { id: "3", name: "Food Festival Launch", date: "2024-03-15", time: "13:00", venue: "Food Court", description: "Launch of food stalls" },
  { id: "4", name: "Cultural Night", date: "2024-03-15", time: "18:00", venue: "Amphitheater", description: "Evening cultural programs" },
];

const venues = [
  { id: "main", name: "Main Stage", position: { x: 50, y: 20 } },
  { id: "halla", name: "Hall A", position: { x: 20, y: 50 } },
  { id: "hallb", name: "Hall B", position: { x: 80, y: 50 } },
  { id: "food", name: "Food Court", position: { x: 50, y: 70 } },
  { id: "amphi", name: "Amphitheater", position: { x: 50, y: 90 } },
];

export default function Programs() {
  const [programs, setPrograms] = useState<Program[]>(initialPrograms);
  const [showForm, setShowForm] = useState(false);
  const [newProgram, setNewProgram] = useState({
    name: "",
    date: "",
    time: "",
    venue: "",
    description: ""
  });

  const handleAddProgram = () => {
    if (newProgram.name && newProgram.date && newProgram.time && newProgram.venue) {
      setPrograms([...programs, { ...newProgram, id: Date.now().toString() }]);
      setNewProgram({ name: "", date: "", time: "", venue: "", description: "" });
      setShowForm(false);
    }
  };

  const handleDeleteProgram = (id: string) => {
    setPrograms(programs.filter(p => p.id !== id));
  };

  return (
    <PageLayout>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Program Scheduling</h1>
            <p className="text-muted-foreground mt-1">Manage event programs and venue locations</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} variant="accent">
            <Plus className="h-4 w-4 mr-2" />
            Add Program
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8 animate-slide-up">
            <CardHeader>
              <CardTitle>New Program</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Program Name</Label>
                  <Input
                    id="name"
                    value={newProgram.name}
                    onChange={(e) => setNewProgram({ ...newProgram, name: e.target.value })}
                    placeholder="Enter program name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="venue">Venue</Label>
                  <select
                    id="venue"
                    value={newProgram.venue}
                    onChange={(e) => setNewProgram({ ...newProgram, venue: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Select venue</option>
                    {venues.map(v => (
                      <option key={v.id} value={v.name}>{v.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newProgram.date}
                    onChange={(e) => setNewProgram({ ...newProgram, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newProgram.time}
                    onChange={(e) => setNewProgram({ ...newProgram, time: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newProgram.description}
                    onChange={(e) => setNewProgram({ ...newProgram, description: e.target.value })}
                    placeholder="Enter program description"
                  />
                </div>
                <div className="md:col-span-2 flex gap-2">
                  <Button onClick={handleAddProgram}>Save Program</Button>
                  <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Programs List */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Scheduled Programs</h2>
            <div className="space-y-4">
              {programs.map((program) => (
                <Card key={program.id} className="animate-fade-in">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                          <CalendarDays className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{program.name}</h3>
                          <p className="text-sm text-muted-foreground">{program.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {program.date} at {program.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {program.venue}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleDeleteProgram(program.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Venue Map */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Venue Map</h2>
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative bg-muted h-96">
                  <div className="absolute inset-4 border-2 border-dashed border-border rounded-lg">
                    {venues.map((venue) => (
                      <div
                        key={venue.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                        style={{ left: `${venue.position.x}%`, top: `${venue.position.y}%` }}
                      >
                        <div className="flex flex-col items-center">
                          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                            <MapPin className="h-4 w-4 text-primary-foreground" />
                          </div>
                          <span className="mt-1 text-xs font-medium text-foreground bg-card px-2 py-0.5 rounded shadow-sm">
                            {venue.name}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="absolute bottom-4 left-4 text-xs text-muted-foreground">
                    Event Venue Layout
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
