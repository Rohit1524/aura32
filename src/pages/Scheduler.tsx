import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, Bell, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Scheduler = () => {
  const [meeting, setMeeting] = useState({
    title: "",
    date: "",
    time: "",
    duration: "",
    description: "",
    attendees: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!meeting.attendees.trim()) {
      toast({
        title: "Error",
        description: "Please add at least one attendee email",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const attendeeList = meeting.attendees.split(',').map(email => email.trim()).filter(email => email);
      
      const { data, error } = await supabase.functions.invoke('send-meeting-email', {
        body: {
          title: meeting.title,
          date: meeting.date,
          time: meeting.time,
          duration: meeting.duration,
          description: meeting.description,
          attendees: attendeeList,
        },
      });

      if (error) throw error;

      toast({
        title: "Meeting Scheduled!",
        description: `${meeting.title} has been scheduled and invitations sent to ${attendeeList.length} attendee(s)`,
      });

      setMeeting({
        title: "",
        date: "",
        time: "",
        duration: "",
        description: "",
        attendees: "",
      });
    } catch (error: any) {
      console.error('Error scheduling meeting:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send meeting invitations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8 text-center space-y-4">
          <h1 className="text-4xl font-bold">Meeting Scheduler</h1>
          <p className="text-lg text-muted-foreground">
            Schedule and manage your business meetings
          </p>
        </div>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">New Meeting</h2>
              <p className="text-sm text-muted-foreground">
                Create a new meeting with automatic notifications
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Meeting Title</Label>
              <Input
                id="title"
                value={meeting.title}
                onChange={(e) =>
                  setMeeting({ ...meeting, title: e.target.value })
                }
                placeholder="Enter meeting title"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={meeting.date}
                  onChange={(e) =>
                    setMeeting({ ...meeting, date: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={meeting.time}
                  onChange={(e) =>
                    setMeeting({ ...meeting, time: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={meeting.duration}
                  onChange={(e) =>
                    setMeeting({ ...meeting, duration: e.target.value })
                  }
                  placeholder="60"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={meeting.description}
                onChange={(e) =>
                  setMeeting({ ...meeting, description: e.target.value })
                }
                placeholder="What's this meeting about?"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="attendees">Attendees (comma-separated emails)</Label>
              <Input
                id="attendees"
                type="text"
                value={meeting.attendees}
                onChange={(e) =>
                  setMeeting({ ...meeting, attendees: e.target.value })
                }
                placeholder="email1@example.com, email2@example.com"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Invitations...
                </>
              ) : (
                <>
                  <Bell className="mr-2 h-4 w-4" />
                  Schedule Meeting
                </>
              )}
            </Button>
          </form>
        </Card>

        <Card className="mt-6 p-6 bg-primary/5">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-primary mt-1" />
            <div>
              <h3 className="font-semibold mb-2">Smart Notifications</h3>
              <p className="text-sm text-muted-foreground">
                Automatic reminders will be sent to all attendees 24 hours and 1 hour before 
                the meeting. Meeting invites will be sent immediately upon scheduling.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Scheduler;
