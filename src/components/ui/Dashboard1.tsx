"use client";
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar as CalendarIcon, Clock, Video, User, Settings, Plus, X, ExternalLink, Edit, Trash2 } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Alert, AlertDescription } from "@/components/ui/alert"

type Event = {
  id: string;
  title: string;
  url: string;
  description: string;
  startTime: string;
  endTime: string;
  day: string;
  visited?: boolean;
  missed?: boolean;
  canVisit?: boolean;
}

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const timeSlots = Array.from({ length: 24 * 4 }, (_, i) => {
  const hour = Math.floor(i / 4);
  const minute = (i % 4) * 15;
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
});

export default function Dashboard() {
  const [events, setEvents] = useState<Event[]>([])
  const [newEvent, setNewEvent] = useState<Event>({ id: '', title: '', url: '', description: '', startTime: '09:00', endTime: '10:00', day: 'Monday' })
  const [showCalendar, setShowCalendar] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [timeError, setTimeError] = useState<string | null>(null)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    const storedEvents = localStorage.getItem('events')
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events))
  }, [events])

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const currentDay = days[now.getDay() === 0 ? 6 : now.getDay() - 1]
      const currentTime = now.toTimeString().slice(0, 5)

      setEvents(prevEvents => prevEvents.map(event => {
        if (event.day === currentDay) {
          const startTime = new Date(`2000-01-01T${event.startTime}`)
          const endTime = new Date(`2000-01-01T${event.endTime}`)
          const currentDateTime = new Date(`2000-01-01T${currentTime}`)

          const fiveMinutesBefore = new Date(startTime.getTime() - 5 * 60000)
          const fiveMinutesAfter = new Date(startTime.getTime() + 5 * 60000)

          if (currentDateTime >= fiveMinutesBefore && currentDateTime <= fiveMinutesAfter) {
            return { ...event, canVisit: true, missed: false }
          } else if (currentDateTime > endTime && !event.visited) {
            return { ...event, missed: true, canVisit: false }
          }
        }
        return event
      }))
    }, 60000) // Check every minute

    return () => clearInterval(timer)
  }, [])

  const addEvent = () => {
    if (newEvent.title && newEvent.startTime && newEvent.endTime && newEvent.day) {
      if (newEvent.endTime <= newEvent.startTime) {
        setTimeError("End time must be after start time")
        return
      }
      setTimeError(null)
      const eventWithId = { ...newEvent, id: Date.now().toString() }
      setEvents([...events, eventWithId])
      setNewEvent({ id: '', title: '', url: '', description: '', startTime: '09:00', endTime: '10:00', day: 'Monday' })
      setIsDialogOpen(false)
    }
  }

  const handleVisit = (id: string) => {
    setEvents(events.map(event => 
      event.id === id ? { ...event, visited: true, canVisit: false } : event
    ))
  }

  const deleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id))
    setSelectedEvent(null)
  }

  const startEditing = (event: Event) => {
    setEditingEvent(event)
    setSelectedEvent(null)
    setIsDialogOpen(true)
  }

  const saveEdit = () => {
    if (editingEvent) {
      setEvents(events.map(event => 
        event.id === editingEvent.id ? editingEvent : event
      ))
      setEditingEvent(null)
      setIsDialogOpen(false)
    }
  }

  const TimeInput = ({ value, onChange, label }) => (
    <div className="space-y-2">
      <Label htmlFor={label}>{label}</Label>
      <div className="relative">
        <Input
          id={label}
          type="time"
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
            setTimeError(null)
          }}
          className="bg-white/10 border-gray-800 text-white pr-10"
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full">
              <Clock className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-0 bg-gray-900 border-gray-800">
            <div className="h-48 overflow-y-auto">
              {timeSlots.map((time) => (
                <Button
                  key={time}
                  variant="ghost"
                  className="w-full justify-start font-normal text-white hover:bg-gray-800"
                  onClick={() => {
                    onChange(time)
                    setTimeError(null)
                  }}
                >
                  {time}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Header */}
      <header className="border-b border-gray-800 p-4 backdrop-blur-sm bg-black/30 sticky top-0 z-10">
        <nav className="flex justify-between items-center">
          <h1 className="text-3xl font-light tracking-wide">Torq</h1>
          <div className="flex space-x-6">
            <Button variant="ghost" size="icon" className="hover:bg-white/10 transition-colors" onClick={() => setShowCalendar(!showCalendar)}>
              <CalendarIcon className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-white/10 transition-colors"><Video className="h-5 w-5" /></Button>
            <Button variant="ghost" size="icon" className="hover:bg-white/10 transition-colors"><User className="h-5 w-5" /></Button>
            <Button variant="ghost" size="icon" className="hover:bg-white/10 transition-colors"><Settings className="h-5 w-5" /></Button>
          </div>
        </nav>
      </header>

      {/* Main Section */}
      <main className="container mx-auto mt-12 px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-light">Your Schedule</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-white text-black hover:bg-gray-200 transition-colors" onClick={() => {
                setEditingEvent(null)
                setNewEvent({ id: '', title: '', url: '', description: '', startTime: '09:00', endTime: '10:00', day: 'Monday' })
              }}>
                <Plus className="h-5 w-5 mr-2" /> Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black/95 text-white border border-gray-800 max-w-md w-full backdrop-blur-md">
              <DialogHeader>
                <DialogTitle className="text-2xl font-light">
                  {editingEvent ? 'Edit Event' : 'Create New Event'}
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Event Title</Label>
                  <Input 
                    id="title"
                    placeholder="Enter event title" 
                    value={editingEvent ? editingEvent.title : newEvent.title}
                    onChange={(e) => editingEvent ? setEditingEvent({...editingEvent, title: e.target.value}) : setNewEvent({...newEvent, title: e.target.value})}
                    className="bg-white/10 border-gray-800 text-white placeholder-gray-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="url">URL (optional)</Label>
                  <Input 
                    id="url"
                    placeholder="Enter URL" 
                    value={editingEvent ? editingEvent.url : newEvent.url}
                    onChange={(e) => editingEvent ? setEditingEvent({...editingEvent, url: e.target.value}) : setNewEvent({...newEvent, url: e.target.value})}
                    className="bg-white/10 border-gray-800 text-white placeholder-gray-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description"
                    placeholder="Enter brief description" 
                    value={editingEvent ? editingEvent.description : newEvent.description}
                    onChange={(e) => editingEvent ? setEditingEvent({...editingEvent, description: e.target.value}) : setNewEvent({...newEvent, description: e.target.value})}
                    className="bg-white/10 border-gray-800 text-white placeholder-gray-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <TimeInput
                    label="Start Time"
                    value={editingEvent ? editingEvent.startTime : newEvent.startTime}
                    onChange={(time) => editingEvent ? setEditingEvent({...editingEvent, startTime: time}) : setNewEvent({...newEvent, startTime: time})}
                  />
                  <TimeInput
                    label="End Time"
                    value={editingEvent ? editingEvent.endTime : newEvent.endTime}
                    onChange={(time) => editingEvent ? setEditingEvent({...editingEvent, endTime: time}) : setNewEvent({...newEvent, endTime: time})}
                  />
                </div>
                {timeError && (
                  <Alert variant="destructive">
                    <AlertDescription>{timeError}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="day">Day of the Week</Label>
                  <Select onValueChange={(value) => editingEvent ? setEditingEvent({...editingEvent, day: value}) : setNewEvent({...newEvent, day: value})}>
                    <SelectTrigger className="bg-white/10 border-gray-800 text-white">
                      <SelectValue placeholder="Select a day" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 text-white border-gray-800">
                      {days.map((day) => (
                        <SelectItem key={day} value={day}>{day}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={editingEvent ? saveEdit : addEvent} className="bg-white text-black hover:bg-gray-200 transition-colors">
                  {editingEvent ? 'Save Changes' : 'Create Event'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        {showCalendar ? (
          <div className="grid grid-cols-7 gap-4 mb-8">
            {days.map((day) => (
              <div key={day} className="border border-gray-800 p-4 backdrop-blur-sm bg-white/5 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-center">{day}</h3>
                <div className="space-y-2">
                  {events
                    .filter((event) => event.day === day)
                    .map((event) => (
                      <div 
                        key={event.id} 
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          event.missed ? 'bg-red-900/30 hover:bg-red-800/40' :
                          event.visited ? 'bg-green-900/30 hover:bg-green-800/40' : 
                          'bg-white/10 hover:bg-gray-800'
                        }`}
                        onClick={() => setSelectedEvent(event)}
                      >
                        <p className="font-medium text-sm mb-1">{event.title}</p>
                        <p className="text-xs text-gray-400">{event.startTime} - {event.endTime}</p>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div 
                key={event.id} 
                className={`p-6 rounded-lg border hover:border-gray-700 transition-all hover:scale-105 cursor-pointer backdrop-blur-sm shadow-lg ${
                  event.missed ? 'bg-red-900/30 border-red-800' :
                  event.visited ? 'bg-green-900/30 border-green-800' : 
                  'bg-white/5 border-gray-800'
                }`}
                onClick={() => setSelectedEvent(event)}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold">{event.title}</h3>
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                </div>
                {event.url && (
                  <Button
                    variant="outline"
                    size="sm"
                    className={`mb-2 transition-colors ${
                      event.missed ? 'bg-red-700 hover:bg-red-600 text-white border-red-600' :
                      event.visited ? 'bg-green-700 hover:bg-green-600 text-white border-green-600' : 
                      event.canVisit ? 'bg-blue-700 hover:bg-blue-600 text-white border-blue-600' :
                      'bg-white/10 hover:bg-white/20 border-gray-700'
                    }`}
                    disabled={!event.canVisit && !event.visited && !event.missed}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (event.canVisit || event.visited) {
                        window.open(event.url, '_blank');
                        handleVisit(event.id);
                      }
                    }}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    {event.missed ? 'Missed' : event.visited ? 'Visited' : 'Visit Website'}
                  </Button>
                )}
                <p className="text-gray-400 mb-4 line-clamp-2">{event.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                    <p>{event.day}</p>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-400" />
                    <p>{event.startTime} - {event.endTime}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
          <div className={`p-6 rounded-lg border max-w-md w-full ${
            selectedEvent.missed ? 'bg-red-900/80 border-red-700' :
            selectedEvent.visited ? 'bg-green-900/80 border-green-700' : 
            'bg-black/95 border-gray-800'
          }`}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-semibold">{selectedEvent.title}</h3>
              <Button variant="ghost" size="icon" onClick={() => setSelectedEvent(null)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            {selectedEvent.url && (
              <Button
                variant="outline"
                size="sm"
                className={`mb-4 transition-colors ${
                  selectedEvent.missed ? 'bg-red-700 hover:bg-red-600 text-white border-red-600' :
                  selectedEvent.visited ? 'bg-green-700 hover:bg-green-600 text-white border-green-600' : 
                  selectedEvent.canVisit ? 'bg-blue-700 hover:bg-blue-600 text-white border-blue-600' :
                  'bg-white/10 hover:bg-white/20 border-gray-700'
                }`}
                disabled={!selectedEvent.canVisit && !selectedEvent.visited && !selectedEvent.missed}
                onClick={() => {
                  if (selectedEvent.canVisit || selectedEvent.visited) {
                    window.open(selectedEvent.url, '_blank');
                    handleVisit(selectedEvent.id);
                  }
                }}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                {selectedEvent.missed ? 'Missed' : selectedEvent.visited ? 'Visited' : 'Visit Website'}
              </Button>
            )}
            <p className="text-gray-400 mb-4">{selectedEvent.description}</p>
            <div className="flex items-center justify-between text-sm mb-4">
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                <p>{selectedEvent.day}</p>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-gray-400" />
                <p>{selectedEvent.startTime} - {selectedEvent.endTime}</p>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" size="sm" onClick={() => startEditing(selectedEvent)} className="bg-blue-600 text-white hover:bg-blue-700">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => deleteEvent(selectedEvent.id)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}