// "use client";
// import { useState, useEffect } from 'react'
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { Calendar as CalendarIcon, Clock, Video, User, Settings, Plus, X, ExternalLink, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Label } from "@/components/ui/label"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { Checkbox } from "@/components/ui/checkbox"
// import { ScrollArea } from "@/components/ui/scroll-area"

// type Event = {
//   id: string;
//   title: string;
//   url: string;
//   description: string;
//   startTime: string;
//   endTime: string;
//   date: string;
//   visited?: boolean;
//   missed?: boolean;
//   canVisit?: boolean;
//   playlistId?: string;
// }

// type Playlist = {
//   id: string;
//   name: string;
//   color: string;
// }

// const timeSlots = Array.from({ length: 24 * 4 }, (_, i) => {
//   const hour = Math.floor(i / 4);
//   const minute = (i % 4) * 15;
//   return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
// });

// const colorOptions = [
//   { name: 'Blue', value: 'bg-blue-500' },
//   { name: 'Purple', value: 'bg-purple-500' },
//   { name: 'Pink', value: 'bg-pink-500' },
//   { name: 'Orange', value: 'bg-orange-500' },
//   { name: 'Yellow', value: 'bg-yellow-500' },
//   { name: 'Teal', value: 'bg-teal-500' },
//   { name: 'Indigo', value: 'bg-indigo-500' },
// ];

// export default function Dashboard() {
//   const [events, setEvents] = useState<Event[]>([])
//   const [playlists, setPlaylists] = useState<Playlist[]>([])
//   const [newEvent, setNewEvent] = useState<Event>({ id: '', title: '', url: '', description: '', startTime: '09:00', endTime: '10:00', date: new Date().toISOString().split('T')[0] })
//   const [view, setView] = useState<'calendar' | 'cards'>('calendar')
//   const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
//   const [timeError, setTimeError] = useState<string | null>(null)
//   const [editingEvent, setEditingEvent] = useState<Event | null>(null)
//   const [isEventDialogOpen, setIsEventDialogOpen] = useState(false)
//   const [isPlaylistDialogOpen, setIsPlaylistDialogOpen] = useState(false)
//   const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false)
//   const [playlistUrl, setPlaylistUrl] = useState('')
//   const [playlistName, setPlaylistName] = useState('')
//   const [playlistColor, setPlaylistColor] = useState(colorOptions[0].value)
//   const [playlistFrequency, setPlaylistFrequency] = useState('daily')
//   const [playlistDays, setPlaylistDays] = useState<string[]>([])
//   const [playlistTime, setPlaylistTime] = useState('09:00')
//   const [playlistDuration, setPlaylistDuration] = useState('1')
//   const [currentWeekStart, setCurrentWeekStart] = useState(new Date())
//   const [selectedPlaylistToClear, setSelectedPlaylistToClear] = useState<string | null>(null)
//   const [selectedVideosToRemove, setSelectedVideosToRemove] = useState<string[]>([])

//   useEffect(() => {
//     const storedEvents = localStorage.getItem('events')
//     const storedPlaylists = localStorage.getItem('playlists')
//     if (storedEvents) {
//       setEvents(JSON.parse(storedEvents))
//     }
//     if (storedPlaylists) {
//       setPlaylists(JSON.parse(storedPlaylists))
//     }
//   }, [])

//   useEffect(() => {
//     localStorage.setItem('events', JSON.stringify(events))
//   }, [events])

//   useEffect(() => {
//     localStorage.setItem('playlists', JSON.stringify(playlists))
//   }, [playlists])

//   useEffect(() => {
//     const timer = setInterval(() => {
//       const now = new Date()
//       const currentDate = now.toISOString().split('T')[0]
//       const currentTime = now.toTimeString().slice(0, 5)

//       setEvents(prevEvents => prevEvents.map(event => {
//         if (event.date === currentDate) {
//           const startTime = new Date(`2000-01-01T${event.startTime}`)
//           const endTime = new Date(`2000-01-01T${event.endTime}`)
//           const currentDateTime = new Date(`2000-01-01T${currentTime}`)

//           const fiveMinutesBefore = new Date(startTime.getTime() - 5 * 60000)
//           const fiveMinutesAfter = new Date(startTime.getTime() + 5 * 60000)

//           if (currentDateTime >= fiveMinutesBefore && currentDateTime <= fiveMinutesAfter) {
//             return { ...event, canVisit: true, missed: false }
//           } else if (currentDateTime > endTime && !event.visited) {
//             return { ...event, missed: true, canVisit: false }
//           }
//         }
//         return event
//       }))
//     }, 60000) // Check every minute

//     return () => clearInterval(timer)
//   }, [])

//   const addEvent = () => {
//     if (newEvent.title && newEvent.startTime && newEvent.endTime && newEvent.date) {
//       const now = new Date();
//       //const eventDate = new Date(newEvent.date);
//       const eventDateTime = new Date(`${newEvent.date}T${newEvent.startTime}`);

//       if (eventDateTime <= now) {
//         setTimeError("Event time must be in the future")
//         return
//       }

//       if (newEvent.endTime <= newEvent.startTime) {
//         setTimeError("End time must be after start time")
//         return
//       }
//       setTimeError(null)
//       const eventWithId = { ...newEvent, id: Date.now().toString() }
//       setEvents([...events, eventWithId])
//       setNewEvent({ id: '', title: '', url: '', description: '', startTime: '09:00', endTime: '10:00', date: new Date().toISOString().split('T')[0] })
//       setIsEventDialogOpen(false)
//     }
//   }

//   const fetchPlaylistVideos = async (url: string): Promise<{ title: string, url: string }[]> => {
//     try {
//       const playlistId = new URL(url).searchParams.get('list');
//       if (!playlistId) throw new Error('Invalid playlist URL');

//       const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
//       const apiUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${apiKey}`;

//       const response = await fetch(apiUrl);
//       const data = await response.json();

//       if (data.error) throw new Error(data.error.message);

//       return data.items.map(item => ({
//         title: item.snippet.title,
//         url: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
//       }));
//     } catch (error) {
//       console.error('Error fetching playlist:', error);
//       throw error;
//     }
//   };

//   const addPlaylist = async () => {
//     if (playlistUrl && playlistName) {
//       try {
//         const playlistId = Date.now().toString();
//         const newPlaylist: Playlist = {
//           id: playlistId,
//           name: playlistName,
//           color: playlistColor,
//         };
//         setPlaylists(prevPlaylists => [...prevPlaylists, newPlaylist]);

//         const videoDetails = await fetchPlaylistVideos(playlistUrl);
        
//         const startDate = new Date(currentWeekStart);
//         let currentDate = new Date(startDate);

//         const newEvents = videoDetails.map((video, i) => {
//           if (playlistFrequency === 'daily') {
//             currentDate.setDate(currentDate.getDate() + 1);
//           } else if (playlistFrequency === 'every_two_days') {
//             currentDate.setDate(currentDate.getDate() + 2);
//           } else if (playlistFrequency === 'weekly') {
//             currentDate.setDate(currentDate.getDate() + 7);
//           } else if (playlistFrequency === 'custom') {
//             do {
//               currentDate.setDate(currentDate.getDate() + 1);
//             } while (!playlistDays.includes(currentDate.toLocaleDateString('en-US', { weekday: 'long' })));
//           }

//           const startTime = new Date(`2000-01-01T${playlistTime}`);
//           const endTime = new Date(startTime.getTime() + parseInt(playlistDuration) * 60 * 60 * 1000);

//           return {
//             id: `${Date.now().toString()}-${i}`,
//             title: video.title,
//             url: video.url,
//             description: 'Video from YouTube playlist',
//             startTime: playlistTime,
//             endTime: `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`,
//             date: new Date(currentDate).toISOString().split('T')[0],
//             playlistId: playlistId,
//           };
//         });

//         setEvents(prevEvents => [...prevEvents, ...newEvents]);

//         setPlaylistUrl('');
//         setPlaylistName('');
//         setPlaylistColor(colorOptions[0].value);
//         setPlaylistFrequency('daily');
//         setPlaylistDays([]);
//         setPlaylistTime('09:00');
//         setPlaylistDuration('1');
//         setIsPlaylistDialogOpen(false);
//       } catch (error) {
//         console.error('Error adding playlist:', error);
//         // You might want to show an error message to the user here
//       }
//     }
//   };

//   const handleVisit = (id: string) => {
//     setEvents(events.map(event => 
//       event.id === id ? { ...event, visited: true, canVisit: false } : event
//     ))
//   }

//   const deleteEvent = (id: string) => {
//     setEvents(events.filter(event => event.id !== id))
//     setSelectedEvent(null)
//   }

//   const startEditing = (event: Event) => {
//     setEditingEvent(event)
//     setSelectedEvent(null)
//     setIsEventDialogOpen(true)
//   }

//   const saveEdit = () => {
//     if (editingEvent) {
//       const now = new Date();
//       //const eventDate = new Date(editingEvent.date);
//       const eventDateTime = new Date(`${editingEvent.date}T${editingEvent.startTime}`);

//       if (eventDateTime <= now) {
//         setTimeError("Event time must be in the future")
//         return
//       }

//       if (editingEvent.endTime <= editingEvent.startTime) {
//         setTimeError("End time must be after start time")
//         return
//       }
//       setTimeError(null)
//       setEvents(events.map(event => 
//         event.id === editingEvent.id ? editingEvent : event
//       ))
//       setEditingEvent(null)
//       setIsEventDialogOpen(false)
//     }
//   }

//   const clearCalendar = () => {
//     setEvents([])
//     setPlaylists([])
//   }

//   const clearPlaylist = (playlistId: string) => {
//     setEvents(events.filter(event => event.playlistId !== playlistId))
//     setPlaylists(playlists.filter(playlist => playlist.id !== playlistId))
//   }

//   const removeSelectedVideos = () => {
//     setEvents(events.filter(event => !selectedVideosToRemove.includes(event.id)))
//     setSelectedVideosToRemove([])
//   }

//   const renderEvent = (event: Event) => {
//     const playlist = playlists.find(p => p.id === event.playlistId);
//     const bgColor = playlist ? playlist.color : 'bg-white/10';
//     const hoverColor = playlist ? bgColor.replace('bg-', 'hover:bg-').replace('500', '600') : 'hover:bg-white/20';

//     return (
//       <div 
//         key={event.id} 
//         className={`p-3 rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 ${
//           event.missed ? 'bg-red-500 hover:bg-red-600' :
//           event.visited ? 'bg-green-500 hover:bg-green-600' : 
//           `${bgColor} ${hoverColor}`
//         }`}
//         onClick={() => setSelectedEvent(event)}
//       >
//         <p className="font-medium text-sm mb-1 text-white">{event.title}</p>
//         <p className="text-xs text-white/80">{event.startTime} - {event.endTime}</p>
//       </div>
//     );
//   };

//   const TimeInput = ({ value, onChange, label }) => (
//     <div className="space-y-2">
//       <Label htmlFor={label}>{label}</Label>
//       <div className="relative">
//         <Input
//           id={label}
//           type="time"
//           value={value}
//           onChange={(e) => {
//             onChange(e.target.value)
//             setTimeError(null)
//           }}
//           className="bg-white/10 border-gray-800 text-white pr-10"
//         />
//         <Popover>
//           <PopoverTrigger asChild>
//             <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full">
//               <Clock className="h-4 w-4" />
//             </Button>
//           </PopoverTrigger>
//           <PopoverContent className="w-48 p-0 bg-gray-900 border-gray-800">
//             <div className="h-48 overflow-y-auto">
//               {timeSlots.map((time) => (
//                 <Button
//                   key={time}
//                   variant="ghost"
//                   className="w-full justify-start font-normal text-white hover:bg-gray-800"
//                   onClick={() => {
//                     onChange(time)
//                     setTimeError(null)
//                   }}
//                 >
//                   {time}
//                 </Button>
//               ))}
//             </div>
//           </PopoverContent>
//         </Popover>
//       </div>
//     </div>
//   )

//   const getWeekDates = (startDate: Date) => {
//     const dates = [];
//     const start = new Date(startDate);
//     start.setDate(start.getDate() - start.getDay()); // Adjust to start from Sunday
//     for (let i = 0; i < 7; i++) {
//       const date = new Date(start);
//       date.setDate(start.getDate() + i);
//       dates.push(date);
//     }
//     return dates;
//   };

//   const weekDates = getWeekDates(currentWeekStart)

//   const changeWeek = (direction: 'prev' | 'next') => {
//     setCurrentWeekStart(prevDate => {
//       const newDate = new Date(prevDate);
//       newDate.setDate(newDate.getDate() + (direction === 'prev' ? -7 : 7));
//       return newDate;
//     });
//   };

//   return (
//     <div className="min-h-screen bg-black text-white font-sans">
//       <header className="border-b border-gray-800 p-4 backdrop-blur-sm bg-black/30 sticky top-0 z-10">
//         <nav className="flex justify-between items-center">
//           <h1 className="text-3xl font-light tracking-wide">Torq</h1>
//           <div className="flex space-x-6">
//             <Button variant="ghost" size="icon" className="hover:bg-white/10 transition-colors" onClick={() => setView('calendar')}>
//               <CalendarIcon className="h-5 w-5" />
//             </Button>
//             <Button variant="ghost" size="icon" className="hover:bg-white/10 transition-colors" onClick={() => setView('cards')}>
//               <Video className="h-5 w-5" />
//             </Button>
//             <Button variant="ghost" size="icon" className="hover:bg-white/10 transition-colors"><User className="h-5 w-5" /></Button>
//             <Button variant="ghost" size="icon" className="hover:bg-white/10 transition-colors" onClick={() => setIsSettingsDialogOpen(true)}>
//               <Settings className="h-5 w-5" />
//             </Button>
//           </div>
//         </nav>
//       </header>

//       <main className="container mx-auto mt-12 px-4">
//         <div className="flex justify-between items-center mb-8">
//           <h2 className="text-4xl font-light">Your Schedule</h2>
//           <div className="space-x-4">
//             <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
//               <DialogTrigger asChild>
//                 <Button className="bg-white text-black hover:bg-gray-200 transition-colors" onClick={() => {
//                   setEditingEvent(null)
//                   setNewEvent({ id: '', title: '', url: '', description: '', startTime: '09:00', endTime: '10:00', date: new Date().toISOString().split('T')[0] })
//                 }}>
//                   <Plus className="h-5 w-5 mr-2" /> Add Event
//                 </Button>
//               </DialogTrigger>
//               <DialogContent className="bg-black/95 text-white border border-gray-800 max-w-md w-full backdrop-blur-md">
//                 <DialogHeader>
//                   <DialogTitle className="text-2xl font-light">
//                     {editingEvent ? 'Edit Event' : 'Create New Event'}
//                   </DialogTitle>
//                 </DialogHeader>
//                 <div className="flex flex-col space-y-4 mt-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="title">Event Title</Label>
//                     <Input 
//                       id="title"
//                       placeholder="Enter event title" 
//                       value={editingEvent ? editingEvent.title : newEvent.title}
//                       onChange={(e) => editingEvent ? setEditingEvent({...editingEvent, title: e.target.value}) : setNewEvent({...newEvent, title: e.target.value})}
//                       className="bg-white/10 border-gray-800 text-white placeholder-gray-500"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="url">URL (optional)</Label>
//                     <Input 
//                       id="url"
//                       placeholder="Enter URL" 
//                       value={editingEvent ? editingEvent.url : newEvent.url}
//                       onChange={(e) => editingEvent ? setEditingEvent({...editingEvent, url: e.target.value}) : setNewEvent({...newEvent, url: e.target.value})}
//                       className="bg-white/10 border-gray-800 text-white placeholder-gray-500"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="description">Description</Label>
//                     <Textarea 
//                       id="description"
//                       placeholder="Enter brief description" 
//                       value={editingEvent ? editingEvent.description : newEvent.description}
//                       onChange={(e) => editingEvent ? setEditingEvent({...editingEvent, description: e.target.value}) : setNewEvent({...newEvent, description: e.target.value})}
//                       className="bg-white/10 border-gray-800 text-white placeholder-gray-500"
//                     />
//                   </div>
//                   <div className="grid grid-cols-2 gap-4">
//                     <TimeInput
//                       label="Start Time"
//                       value={editingEvent ? editingEvent.startTime : newEvent.startTime}
//                       onChange={(time) => editingEvent ? setEditingEvent({...editingEvent, startTime: time}) : setNewEvent({...newEvent, startTime: time})}
//                     />
//                     <TimeInput
//                       label="End Time"
//                       value={editingEvent ? editingEvent.endTime : newEvent.endTime}
//                       onChange={(time) => editingEvent ? setEditingEvent({...editingEvent, endTime: time}) : setNewEvent({...newEvent, endTime: time})}
//                     />
//                   </div>
//                   {timeError && (
//                     <Alert variant="destructive">
//                       <AlertDescription>{timeError}</AlertDescription>
//                     </Alert>
//                   )}
//                   <div className="space-y-2">
//                     <Label htmlFor="date">Date</Label>
//                     <Input
//                       id="date"
//                       type="date"
//                       value={editingEvent ? editingEvent.date : newEvent.date}
//                       onChange={(e) => editingEvent ? setEditingEvent({...editingEvent, date: e.target.value}) : setNewEvent({...newEvent, date: e.target.value})}
//                       className="bg-white/10 border-gray-800 text-white"
//                     />
//                   </div>
//                   <Button onClick={editingEvent ? saveEdit : addEvent} className="bg-white text-black hover:bg-gray-200 transition-colors">
//                     {editingEvent ? 'Save Changes' : 'Create Event'}
//                   </Button>
//                 </div>
//               </DialogContent>
//             </Dialog>
//             <Dialog open={isPlaylistDialogOpen} onOpenChange={setIsPlaylistDialogOpen}>
//               <DialogTrigger asChild>
//                 <Button className="bg-white text-black hover:bg-gray-200 transition-colors">
//                   <Plus className="h-5 w-5 mr-2" /> Add Playlist
//                 </Button>
//               </DialogTrigger>
//               <DialogContent className="bg-black/95 text-white border border-gray-800 max-w-md w-full backdrop-blur-md">
//                 <DialogHeader>
//                   <DialogTitle className="text-2xl font-light">Add YouTube Playlist</DialogTitle>
//                 </DialogHeader>
//                 <div className="flex flex-col space-y-4 mt-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="playlistName">Playlist Name</Label>
//                     <Input 
//                       id="playlistName"
//                       placeholder="Enter playlist name" 
//                       value={playlistName}
//                       onChange={(e) => setPlaylistName(e.target.value)}
//                       className="bg-white/10 border-gray-800 text-white placeholder-gray-500"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="playlistUrl">YouTube Playlist URL</Label>
//                     <Input 
//                       id="playlistUrl"
//                       placeholder="Enter playlist URL" 
//                       value={playlistUrl}
//                       onChange={(e) => setPlaylistUrl(e.target.value)}
//                       className="bg-white/10 border-gray-800 text-white placeholder-gray-500"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="playlistColor">Playlist Color</Label>
//                     <Select onValueChange={setPlaylistColor} defaultValue={playlistColor}>
//                       <SelectTrigger className="bg-white/10 border-gray-800 text-white">
//                         <SelectValue placeholder="Select color" />
//                       </SelectTrigger>
//                       <SelectContent className="bg-gray-900 text-white border-gray-800">
//                         {colorOptions.map((color) => (
//                           <SelectItem key={color.value} value={color.value}>
//                             <div className="flex items-center">
//                               <div className={`w-4 h-4 rounded-full mr-2 ${color.value}`}></div>
//                               {color.name}
//                             </div>
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="frequency">Frequency</Label>
//                     <Select onValueChange={setPlaylistFrequency} defaultValue={playlistFrequency}>
//                       <SelectTrigger className="bg-white/10 border-gray-800 text-white">
//                         <SelectValue placeholder="Select frequency" />
//                       </SelectTrigger>
//                       <SelectContent className="bg-gray-900 text-white border-gray-800">
//                         <SelectItem value="daily">Daily</SelectItem>
//                         <SelectItem value="every_two_days">Every Two Days</SelectItem>
//                         <SelectItem value="weekly">Weekly</SelectItem>
//                         <SelectItem value="custom">Custom</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   {playlistFrequency === 'custom' && (
//                     <div className="space-y-2">
//                       <Label>Select Days</Label>
//                       <div className="flex flex-wrap gap-2">
//                         {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
//                           <div key={day} className="flex items-center space-x-2">
//                             <Checkbox
//                               id={day}
//                               checked={playlistDays.includes(day)}
//                               onCheckedChange={(checked) => {
//                                 if (checked) {
//                                   setPlaylistDays([...playlistDays, day])
//                                 } else {
//                                   setPlaylistDays(playlistDays.filter(d => d !== day))
//                                 }
//                               }}
//                             />
//                             <label htmlFor={day} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
//                               {day}
//                             </label>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                   <TimeInput
//                     label="Start Time"
//                     value={playlistTime}
//                     onChange={setPlaylistTime}
//                   />
//                   <div className="space-y-2">
//                     <Label htmlFor="duration">Duration (hours)</Label>
//                     <Input 
//                       id="duration"
//                       type="number"
//                       placeholder="Enter duration" 
//                       value={playlistDuration}
//                       onChange={(e) => setPlaylistDuration(e.target.value)}
//                       className="bg-white/10 border-gray-800 text-white placeholder-gray-500"
//                     />
//                   </div>
//                   <Button onClick={addPlaylist} className="bg-white text-black hover:bg-gray-200 transition-colors">
//                     Add Playlist
//                   </Button>
//                 </div>
//               </DialogContent>
//             </Dialog>
//           </div>
//         </div>
        
//         {view === 'calendar' && (
//           <>
//             <div className="mb-4 flex items-center justify-between">
//               <Button onClick={() => changeWeek('prev')} variant="outline" className="bg-white/10 text-white hover:bg-white/20 transition-colors">
//                 <ChevronLeft className="h-4 w-4 mr-2" />
//                 Previous Week
//               </Button>
//               <span className="text-lg font-semibold">
//                 {weekDates[0].toLocaleDateString()} - {weekDates[6].toLocaleDateString()}
//               </span>
//               <Button onClick={() => changeWeek('next')} variant="outline" className="bg-white/10 text-white hover:bg-white/20 transition-colors">
//                 Next Week
//                 <ChevronRight className="h-4 w-4 ml-2" />
//               </Button>
//             </div>

//             <div className="grid grid-cols-7 gap-4 mb-8">
//               {weekDates.map((date) => (
//                 <div key={date.toISOString()} className="border border-gray-800 p-4 backdrop-blur-md bg-white/5 rounded-lg">
//                   <h3 className="text-lg font-semibold mb-4 text-center">
//                     {date.toLocaleDateString('en-US', { weekday: 'short' })}
//                     <br />
//                     {date.toLocaleDateString()}
//                   </h3>
//                   <div className="space-y-2">
//                     {events
//                       .filter((event) => event.date === date.toISOString().split('T')[0])
//                       .map(renderEvent)}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </>
//         )}

//         {view === 'cards' && (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {events.map((event) => {
//               const playlist = playlists.find(p => p.id === event.playlistId);
//               const bgColor = playlist ? playlist.color : 'bg-white/5';
//               const borderColor = playlist ? `border-${playlist.color.split('-')[1]}-400` : 'border-gray-700';

//               return (
//                 <div 
//                   key={event.id} 
//                   className={`p-6 rounded-lg border hover:border-white transition-all duration-300 transform hover:scale-105 cursor-pointer backdrop-blur-md shadow-lg ${
//                     event.missed ? 'bg-red-500/30 border-red-400' :
//                     event.visited ? 'bg-green-500/30 border-green-400' : 
//                     `${bgColor.replace('500', '500/30')} ${borderColor}`
//                   }`}
//                   onClick={() => setSelectedEvent(event)}
//                 >
//                   <div className="flex justify-between items-start mb-4">
//                     <h3 className="text-xl font-semibold">{event.title}</h3>
//                     <CalendarIcon className="h-5 w-5 text-white/80" />
//                   </div>
//                   {event.url && (
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className={`mb-2 transition-colors ${
//                         event.missed ? 'bg-red-600 hover:bg-red-700 text-white border-red-400' :
//                         event.visited ? 'bg-green-600 hover:bg-green-700 text-white border-green-400' : 
//                         event.canVisit ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-400' :
//                         'bg-white/20 hover:bg-white/30 border-white/40'
//                       }`}
//                       disabled={!event.canVisit && !event.visited && !event.missed}
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         if (event.canVisit || event.visited) {
//                           window.open(event.url, '_blank');
//                           handleVisit(event.id);
//                         }
//                       }}
//                     >
//                       <ExternalLink className="h-4 w-4 mr-2" />
//                       {event.missed ? 'Missed' : event.visited ? 'Visited' : 'Visit Website'}
//                     </Button>
//                   )}
//                   <p className="text-white/80 mb-4 line-clamp-2">{event.description}</p>
//                   <div className="flex items-center justify-between text-sm">
//                     <div className="flex items-center">
//                       <CalendarIcon className="h-4 w-4 mr-2 text-white/80" />
//                       <p>{new Date(event.date).toLocaleDateString()}</p>
//                     </div>
//                     <div className="flex items-center">
//                       <Clock className="h-4 w-4 mr-2 text-white/80" />
//                       <p>{event.startTime} - {event.endTime}</p>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </main>

//       {selectedEvent && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
//           <div className={`p-6 rounded-lg border max-w-md w-full backdrop-blur-md ${
//             selectedEvent.missed ? 'bg-red-500/80 border-red-400' :
//             selectedEvent.visited ? 'bg-green-500/80 border-green-400' : 
//             selectedEvent.playlistId ? `${playlists.find(p => p.id === selectedEvent.playlistId)?.color.replace('500', '500/80')} border-${playlists.find(p => p.id === selectedEvent.playlistId)?.color.split('-')[1]}-400` :
//             'bg-gray-900/80 border-gray-700'
//           }`}>
//             <div className="flex justify-between items-start mb-4">
//               <h3 className="text-2xl font-semibold">{selectedEvent.title}</h3>
//               <Button variant="ghost" size="icon" onClick={() => setSelectedEvent(null)}>
//                 <X className="h-5 w-5" />
//               </Button>
//             </div>
//             {selectedEvent.url && (
//               <Button
//                 variant="outline"
//                 size="sm"
//                 className={`mb-4 transition-colors ${
//                   selectedEvent.missed ? 'bg-red-600 hover:bg-red-700 text-white border-red-400' :
//                   selectedEvent.visited ? 'bg-green-600 hover:bg-green-700 text-white border-green-400' : 
//                   selectedEvent.canVisit ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-400' :
//                   'bg-white/20 hover:bg-white/30 border-white/40'
//                 }`}
//                 disabled={!selectedEvent.canVisit && !selectedEvent.visited && !selectedEvent.missed}
//                 onClick={() => {
//                   if (selectedEvent.canVisit || selectedEvent.visited) {
//                     window.open(selectedEvent.url, '_blank');
//                     handleVisit(selectedEvent.id);
//                   }
//                 }}
//               >
//                 <ExternalLink className="h-4 w-4 mr-2" />
//                 {selectedEvent.missed ? 'Missed' : selectedEvent.visited ? 'Visited' : 'Visit Website'}
//               </Button>
//             )}
//             <p className="text-white/80 mb-4">{selectedEvent.description}</p>
//             <div className="flex items-center justify-between text-sm mb-4">
//               <div className="flex items-center">
//                 <CalendarIcon className="h-4 w-4 mr-2 text-white/80" />
//                 <p>{new Date(selectedEvent.date).toLocaleDateString()}</p>
//               </div>
//               <div className="flex items-center">
//                 <Clock className="h-4 w-4 mr-2 text-white/80" />
//                 <p>{selectedEvent.startTime} - {selectedEvent.endTime}</p>
//               </div>
//             </div>
//             <div className="flex justify-end space-x-2">
//               <Button variant="outline" size="sm" onClick={() => startEditing(selectedEvent)} className="bg-blue-600 text-white hover:bg-blue-700">
//                 <Edit className="h-4 w-4 mr-2" />
//                 Edit
//               </Button>
//               <Button variant="destructive" size="sm" onClick={() => deleteEvent(selectedEvent.id)}>
//                 <Trash2 className="h-4 w-4 mr-2" />
//                 Delete
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

//       <Dialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen}>
//         <DialogContent className="bg-gray-900/95 text-white border border-gray-800 max-w-md w-full backdrop-blur-md">
//           <DialogHeader>
//             <DialogTitle className="text-2xl font-light">Settings</DialogTitle>
//           </DialogHeader>
//           <div className="flex flex-col space-y-4 mt-4">
//             <Button onClick={clearCalendar} variant="destructive">
//               Clear Entire Calendar
//             </Button>
//             <div className="space-y-2">
//               <Label htmlFor="clearPlaylist">Clear Playlist</Label>
//               <Select onValueChange={setSelectedPlaylistToClear}>
//                 <SelectTrigger className="bg-white/10 border-gray-800 text-white">
//                   <SelectValue placeholder="Select playlist" />
//                 </SelectTrigger>
//                 <SelectContent className="bg-gray-900 text-white border-gray-800">
//                   {playlists.map((playlist) => (
//                     <SelectItem key={playlist.id} value={playlist.id}>{playlist.name}</SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               <Button onClick={() => selectedPlaylistToClear && clearPlaylist(selectedPlaylistToClear)} variant="destructive" disabled={!selectedPlaylistToClear}>
//                 Clear Selected Playlist
//               </Button>
//             </div>
//             <div className="space-y-2">
//               <Label>Remove Videos from Playlist</Label>
//               <Select onValueChange={setSelectedPlaylistToClear}>
//                 <SelectTrigger className="bg-white/10 border-gray-800 text-white">
//                   <SelectValue placeholder="Select playlist" />
//                 </SelectTrigger>
//                 <SelectContent className="bg-gray-900 text-white border-gray-800">
//                   {playlists.map((playlist) => (
//                     <SelectItem key={playlist.id} value={playlist.id}>{playlist.name}</SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               {selectedPlaylistToClear && (
//                 <ScrollArea className="h-60 overflow-y-auto">
//                   <div className="space-y-2 p-2">
//                     {events
//                       .filter(event => event.playlistId === selectedPlaylistToClear)
//                       .map(event => (
//                         <div key={event.id} className="flex items-center space-x-2">
//                           <Checkbox
//                             id={event.id}
//                             checked={selectedVideosToRemove.includes(event.id)}
//                             onCheckedChange={(checked) => {
//                               if (checked) {
//                                 setSelectedVideosToRemove([...selectedVideosToRemove, event.id])
//                               } else {
//                                 setSelectedVideosToRemove(selectedVideosToRemove.filter(id => id !== event.id))
//                               }
//                             }}
//                           />
//                           <label htmlFor={event.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
//                             {event.title}
//                           </label>
//                         </div>
//                       ))
//                     }
//                   </div>
//                 </ScrollArea>
//               )}
//               <Button onClick={removeSelectedVideos} variant="destructive" disabled={selectedVideosToRemove.length === 0}>
//                 Remove Selected Videos
//               </Button>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }
"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar as CalendarIcon, Clock, Video, User, Settings, Plus, X, ExternalLink, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format, parse, addMinutes, isBefore, isAfter } from 'date-fns'

type Event = {
  id: string;
  title: string;
  url: string;
  description: string;
  startTime: string;
  endTime: string;
  date: string;
  visited?: boolean;
  missed?: boolean;
  canVisit?: boolean;
  playlistId?: string;
}

type Playlist = {
  id: string;
  name: string;
  color: string;
}

const colorOptions = [
  { name: 'Blue', value: 'bg-blue-500' },
  { name: 'Purple', value: 'bg-purple-500' },
  { name: 'Pink', value: 'bg-pink-500' },
  { name: 'Orange', value: 'bg-orange-500' },
  { name: 'Yellow', value: 'bg-yellow-500' },
  { name: 'Teal', value: 'bg-teal-500' },
  { name: 'Indigo', value: 'bg-indigo-500' },
];

export default function Dashboard() {
  const [events, setEvents] = useState<Event[]>([])
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [newEvent, setNewEvent] = useState<Event>({ 
    id: '', 
    title: '', 
    url: '', 
    description: '', 
    startTime: format(new Date().setHours(9, 0, 0, 0), 'HH:mm'),
    endTime: format(new Date().setHours(10, 0, 0, 0), 'HH:mm'),
    date: format(new Date(), 'yyyy-MM-dd')
  })
  const [view, setView] = useState<'calendar' | 'cards'>('calendar')
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [timeError, setTimeError] = useState<string | null>(null)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false)
  const [isPlaylistDialogOpen, setIsPlaylistDialogOpen] = useState(false)
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false)
  const [playlistUrl, setPlaylistUrl] = useState('')
  const [playlistName, setPlaylistName] = useState('')
  const [playlistColor, setPlaylistColor] = useState(colorOptions[0].value)
  const [playlistFrequency, setPlaylistFrequency] = useState('daily')
  const [playlistDays, setPlaylistDays] = useState<string[]>([])
  const [playlistTime, setPlaylistTime] = useState('09:00')
  const [playlistDuration, setPlaylistDuration] = useState('1')
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date())
  const [selectedPlaylistToClear, setSelectedPlaylistToClear] = useState<string | null>(null)
  const [selectedVideosToRemove, setSelectedVideosToRemove] = useState<string[]>([])

  useEffect(() => {
    const storedEvents = localStorage.getItem('events')
    const storedPlaylists = localStorage.getItem('playlists')
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents))
    }
    if (storedPlaylists) {
      setPlaylists(JSON.parse(storedPlaylists))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events))
  }, [events])

  useEffect(() => {
    localStorage.setItem('playlists', JSON.stringify(playlists))
  }, [playlists])

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const currentDate = format(now, 'yyyy-MM-dd')
      const currentTime = format(now, 'HH:mm')

      setEvents(prevEvents => prevEvents.map(event => {
        if (event.date === currentDate) {
          const startTime = parse(event.startTime, 'HH:mm', new Date())
          const endTime = parse(event.endTime, 'HH:mm', new Date())
          const currentDateTime = parse(currentTime, 'HH:mm', new Date())

          const fiveMinutesBefore = addMinutes(startTime, -5)
          const fiveMinutesAfter = addMinutes(startTime, 5)

          if (isAfter(currentDateTime, fiveMinutesBefore) && isBefore(currentDateTime, fiveMinutesAfter)) {
            return { ...event, canVisit: true, missed: false }
          } else if (isAfter(currentDateTime, endTime) && !event.visited) {
            return { ...event, missed: true, canVisit: false }
          }
        }
        return event
      }))
    }, 60000) // Check every minute

    return () => clearInterval(timer)
  }, [])

  const addEvent = () => {
    if (newEvent.title && newEvent.startTime && newEvent.endTime && newEvent.date) {
      const now = new Date()
      const eventDateTime = parse(`${newEvent.date} ${newEvent.startTime}`, 'yyyy-MM-dd HH:mm', new Date())

      if (isBefore(eventDateTime, now)) {
        setTimeError("Event time must be in the future")
        return
      }

      if (newEvent.endTime <= newEvent.startTime) {
        setTimeError("End time must be after start time")
        return
      }
      setTimeError(null)
      const eventWithId = { ...newEvent, id: Date.now().toString() }
      setEvents([...events, eventWithId])
      setNewEvent({ 
        id: '', 
        title: '', 
        url: '', 
        description: '', 
        startTime: format(new Date().setHours(9, 0, 0, 0), 'HH:mm'),
        endTime: format(new Date().setHours(10, 0, 0, 0), 'HH:mm'),
        date: format(new Date(), 'yyyy-MM-dd')
      })
      setIsEventDialogOpen(false)
    }
  }

  const fetchPlaylistVideos = async (url: string): Promise<{ title: string, url: string }[]> => {
    try {
      const playlistId = new URL(url).searchParams.get('list');
      if (!playlistId) throw new Error('Invalid playlist URL');

      const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
      const apiUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${apiKey}`;

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.error) throw new Error(data.error.message);

      return data.items.map(item => ({
        title: item.snippet.title,
        url: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
      }));
    } catch (error) {
      console.error('Error fetching playlist:', error);
      throw error;
    }
  };

  const addPlaylist = async () => {
    if (playlistUrl && playlistName) {
      try {
        const playlistId = Date.now().toString();
        const newPlaylist: Playlist = {
          id: playlistId,
          name: playlistName,
          color: playlistColor,
        };
        setPlaylists(prevPlaylists => [...prevPlaylists, newPlaylist]);

        const videoDetails = await fetchPlaylistVideos(playlistUrl);
        
        const startDate = new Date(currentWeekStart);
        let currentDate = new Date(startDate);

        const newEvents = videoDetails.map((video, i) => {
          if (playlistFrequency === 'daily') {
            currentDate.setDate(currentDate.getDate() + 1);
          } else if (playlistFrequency === 'every_two_days') {
            currentDate.setDate(currentDate.getDate() + 2);
          } else if (playlistFrequency === 'weekly') {
            currentDate.setDate(currentDate.getDate() + 7);
          } else if (playlistFrequency === 'custom') {
            do {
              currentDate.setDate(currentDate.getDate() + 1);
            } while (!playlistDays.includes(format(currentDate, 'EEEE')));
          }

          const startTime = parse(playlistTime, 'HH:mm', new Date());
          const endTime = addMinutes(startTime, parseInt(playlistDuration) * 60);

          return {
            id: `${Date.now().toString()}-${i}`,
            title: video.title,
            url: video.url,
            description: 'Video from YouTube playlist',
            startTime: playlistTime,
            endTime: format(endTime, 'HH:mm'),
            date: format(currentDate, 'yyyy-MM-dd'),
            playlistId: playlistId,
          };
        });

        setEvents(prevEvents => [...prevEvents, ...newEvents]);

        setPlaylistUrl('');
        setPlaylistName('');
        setPlaylistColor(colorOptions[0].value);
        setPlaylistFrequency('daily');
        setPlaylistDays([]);
        setPlaylistTime('09:00');
        setPlaylistDuration('1');
        setIsPlaylistDialogOpen(false);
      } catch (error) {
        console.error('Error adding playlist:', error);
        // You might want to show an error message to the user here
      }
    }
  };

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
    setIsEventDialogOpen(true)
  }

  const saveEdit = () => {
    if (editingEvent) {
      const now = new Date()
      const eventDateTime = parse(`${editingEvent.date} ${editingEvent.startTime}`, 'yyyy-MM-dd HH:mm', new Date())

      if (isBefore(eventDateTime, now)) {
        setTimeError("Event time must be in the future")
        return
      }

      if (editingEvent.endTime <= editingEvent.startTime) {
        setTimeError("End time must be after start time")
        return
      }
      setTimeError(null)
      setEvents(events.map(event => 
        event.id === editingEvent.id ? editingEvent : event
      ))
      setEditingEvent(null)
      setIsEventDialogOpen(false)
    }
  }

  const clearCalendar = () => {
    setEvents([])
    setPlaylists([])
  }

  const clearPlaylist = (playlistId: string) => {
    setEvents(events.filter(event => event.playlistId !== playlistId))
    setPlaylists(playlists.filter(playlist => playlist.id !== playlistId))
  }

  const removeSelectedVideos = () => {
    setEvents(events.filter(event => !selectedVideosToRemove.includes(event.id)))
    setSelectedVideosToRemove([])
  }

  const TimeInput = ({ value, onChange, label }) => {
    const [isOpen, setIsOpen] = useState(false)
    const parsedTime = parse(value, 'HH:mm', new Date())
    
    const timeOptions = Array.from({ length: 96 }, (_, i) => {
      const time = addMinutes(new Date().setHours(0, 0, 0, 0), i * 15)
      return format(time, 'HH:mm')
    })

    return (
      <div className="space-y-2">
        <Label htmlFor={label}>{label}</Label>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={isOpen}
              className="w-full justify-between bg-white/10 border-gray-800 text-white"
            >
              {value}
              <Clock className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-0 bg-gray-900 border-gray-800">
            <ScrollArea className="h-72">
              <div className="grid grid-cols-1 gap-1 p-1">
                {timeOptions.map((time) => (
                  <Button
                    key={time}
                    variant="ghost"
                    className="justify-start font-normal text-white hover:bg-gray-800"
                    onClick={() => {
                      onChange(time)
                      setIsOpen(false)
                    }}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>
      </div>
    )
  }

  const renderEvent = (event: Event) => {
    const playlist = playlists.find(p => p.id === event.playlistId);
    const bgColor = playlist ? playlist.color : 'bg-white/10';
    const hoverColor = playlist ? bgColor.replace('bg-', 'hover:bg-').replace('500', '600') : 'hover:bg-white/20';

    return (
      <div 
        key={event.id} 
        className={`p-3 rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 ${
          event.missed ? 'bg-red-500 hover:bg-red-600' :
          event.visited ? 'bg-green-500 hover:bg-green-600' :
          `${bgColor} ${hoverColor}`
        }`}
        onClick={() => setSelectedEvent(event)}
      >
        <p className="font-medium text-sm mb-1 text-white">{event.title}</p>
        <p className="text-xs text-white/80">{event.startTime} - {event.endTime}</p>
      </div>
    );
  };

  const getWeekDates = (startDate: Date) => {
    const dates = [];
    const start = new Date(startDate);
    start.setDate(start.getDate() - start.getDay()); // Adjust to start from Sunday
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates(currentWeekStart)

  const changeWeek = (direction: 'prev' | 'next') => {
    setCurrentWeekStart(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + (direction === 'prev' ? -7 : 7));
      return newDate;
    });
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <header className="border-b border-gray-800 p-4 backdrop-blur-sm bg-black/30 sticky top-0 z-10">
        <nav className="flex justify-between items-center">
          <h1 className="text-3xl font-light tracking-wide">Torq</h1>
          <div className="flex space-x-6">
            <Button variant="ghost" size="icon" className="hover:bg-white/10 transition-colors" onClick={() => setView('calendar')}>
              <CalendarIcon className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-white/10 transition-colors" onClick={() => setView('cards')}>
              <Video className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-white/10 transition-colors"><User className="h-5 w-5" /></Button>
            <Button variant="ghost" size="icon" className="hover:bg-white/10 transition-colors" onClick={() => setIsSettingsDialogOpen(true)}>
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </nav>
      </header>

      <main className="container mx-auto mt-12 px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-light">Your Schedule</h2>
          <div className="space-x-4">
            <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-white text-black hover:bg-gray-200 transition-colors" onClick={() => {
                  setEditingEvent(null)
                  setNewEvent({ 
                    id: '', 
                    title: '', 
                    url: '', 
                    description: '', 
                    startTime: format(new Date().setHours(9, 0, 0, 0), 'HH:mm'),
                    endTime: format(new Date().setHours(10, 0, 0, 0), 'HH:mm'),
                    date: format(new Date(), 'yyyy-MM-dd')
                  })
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
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={editingEvent ? editingEvent.date : newEvent.date}
                      onChange={(e) => editingEvent ? setEditingEvent({...editingEvent, date: e.target.value}) : setNewEvent({...newEvent, date: e.target.value})}
                      className="bg-white/10 border-gray-800 text-white"
                    />
                  </div>
                  <Button onClick={editingEvent ? saveEdit : addEvent} className="bg-white text-black hover:bg-gray-200 transition-colors">
                    {editingEvent ? 'Save Changes' : 'Create Event'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={isPlaylistDialogOpen} onOpenChange={setIsPlaylistDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-white text-black hover:bg-gray-200 transition-colors">
                  <Plus className="h-5 w-5 mr-2" /> Add Playlist
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-black/95 text-white border border-gray-800 max-w-md w-full backdrop-blur-md">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-light">Add YouTube Playlist</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="playlistName">Playlist Name</Label>
                    <Input 
                      id="playlistName"
                      placeholder="Enter playlist name" 
                      value={playlistName}
                      onChange={(e) => setPlaylistName(e.target.value)}
                      className="bg-white/10 border-gray-800 text-white placeholder-gray-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="playlistUrl">YouTube Playlist URL</Label>
                    <Input 
                      id="playlistUrl"
                      placeholder="Enter playlist URL" 
                      value={playlistUrl}
                      onChange={(e) => setPlaylistUrl(e.target.value)}
                      className="bg-white/10 border-gray-800 text-white placeholder-gray-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="playlistColor">Playlist Color</Label>
                    <Select onValueChange={setPlaylistColor} defaultValue={playlistColor}>
                      <SelectTrigger className="bg-white/10 border-gray-800 text-white">
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 text-white border-gray-800">
                        {colorOptions.map((color) => (
                          <SelectItem key={color.value} value={color.value}>
                            <div className="flex items-center">
                              <div className={`w-4 h-4 rounded-full mr-2 ${color.value}`}></div>
                              {color.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Frequency</Label>
                    <Select onValueChange={setPlaylistFrequency} defaultValue={playlistFrequency}>
                      <SelectTrigger className="bg-white/10 border-gray-800 text-white">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 text-white border-gray-800">
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="every_two_days">Every Two Days</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {playlistFrequency === 'custom' && (
                    <div className="space-y-2">
                      <Label>Select Days</Label>
                      <div className="flex flex-wrap gap-2">
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                          <div key={day} className="flex items-center space-x-2">
                            <Checkbox
                              id={day}
                              checked={playlistDays.includes(day)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setPlaylistDays([...playlistDays, day])
                                } else {
                                  setPlaylistDays(playlistDays.filter(d => d !== day))
                                }
                              }}
                            />
                            <label htmlFor={day} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              {day}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <TimeInput
                    label="Start Time"
                    value={playlistTime}
                    onChange={setPlaylistTime}
                  />
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (hours)</Label>
                    <Input 
                      id="duration"
                      type="number"
                      placeholder="Enter duration" 
                      value={playlistDuration}
                      onChange={(e) => setPlaylistDuration(e.target.value)}
                      className="bg-white/10 border-gray-800 text-white placeholder-gray-500"
                    />
                  </div>
                  <Button onClick={addPlaylist} className="bg-white text-black hover:bg-gray-200 transition-colors">
                    Add Playlist
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {view === 'calendar' && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <Button onClick={() => changeWeek('prev')} variant="outline" className="bg-white/10 text-white hover:bg-white/20 transition-colors">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous Week
              </Button>
              <span className="text-lg font-semibold">
                {format(weekDates[0], 'MMM d, yyyy')} - {format(weekDates[6], 'MMM d, yyyy')}
              </span>
              <Button onClick={() => changeWeek('next')} variant="outline" className="bg-white/10 text-white hover:bg-white/20 transition-colors">
                Next Week
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>

            <div className="grid grid-cols-7 gap-4 mb-8">
              {weekDates.map((date) => (
                <div key={date.toISOString()} className="border border-gray-800 p-4 backdrop-blur-md bg-white/5 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 text-center">
                    {format(date, 'EEE')}
                    <br />
                    {format(date, 'MMM d')}
                  </h3>
                  <div className="space-y-2">
                    {events
                      .filter((event) => event.date === format(date, 'yyyy-MM-dd'))
                      .map(renderEvent)}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {view === 'cards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => {
              const playlist = playlists.find(p => p.id === event.playlistId);
              const bgColor = playlist ? playlist.color : 'bg-white/5';
              const borderColor = playlist ? `border-${playlist.color.split('-')[1]}-400` : 'border-gray-700';

              return (
                <div 
                  key={event.id} 
                  className={`p-6 rounded-lg border hover:border-white transition-all duration-300 transform hover:scale-105 cursor-pointer backdrop-blur-md shadow-lg ${
                    event.missed ? 'bg-red-500/30 border-red-400' :
                    event.visited ? 'bg-green-500/30 border-green-400' : 
                    `${bgColor.replace('500', '500/30')} ${borderColor}`
                  }`}
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold">{event.title}</h3>
                    <CalendarIcon className="h-5 w-5 text-white/80" />
                  </div>
                  {event.url && (
                    <Button
                      variant="outline"
                      size="sm"
                      className={`mb-2 transition-colors ${
                        event.missed ? 'bg-red-600 hover:bg-red-700 text-white border-red-400' :
                        event.visited ? 'bg-green-600 hover:bg-green-700 text-white border-green-400' : 
                        event.canVisit ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-400' :
                        'bg-white/20 hover:bg-white/30 border-white/40'
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
                  <p className="text-white/80 mb-4 line-clamp-2">{event.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-2 text-white/80" />
                      <p>{format(parse(event.date, 'yyyy-MM-dd', new Date()), 'MMM d, yyyy')}</p>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-white/80" />
                      <p>{event.startTime} - {event.endTime}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
          <div className={`p-6 rounded-lg border max-w-md w-full backdrop-blur-md ${
            selectedEvent.missed ? 'bg-red-500/80 border-red-400' :
            selectedEvent.visited ? 'bg-green-500/80 border-green-400' : 
            selectedEvent.playlistId ? `${playlists.find(p => p.id === selectedEvent.playlistId)?.color.replace('500', '500/80')} border-${playlists.find(p => p.id === selectedEvent.playlistId)?.color.split('-')[1]}-400` :
            'bg-gray-900/80 border-gray-700'
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
                  selectedEvent.missed ? 'bg-red-600 hover:bg-red-700 text-white border-red-400' :
                  selectedEvent.visited ? 'bg-green-600 hover:bg-green-700 text-white border-green-400' : 
                  selectedEvent.canVisit ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-400' :
                  'bg-white/20 hover:bg-white/30 border-white/40'
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
            <p className="text-white/80 mb-4">{selectedEvent.description}</p>
            <div className="flex items-center justify-between text-sm mb-4">
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-2 text-white/80" />
                <p>{format(parse(selectedEvent.date, 'yyyy-MM-dd', new Date()), 'MMM d, yyyy')}</p>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-white/80" />
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

      <Dialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen}>
        <DialogContent className="bg-gray-900/95 text-white border border-gray-800 max-w-md w-full backdrop-blur-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-light">Settings</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col space-y-4 mt-4">
            <Button onClick={clearCalendar} variant="destructive">
              Clear Entire Calendar
            </Button>
            <div className="space-y-2">
              <Label htmlFor="clearPlaylist">Clear Playlist</Label>
              <Select onValueChange={setSelectedPlaylistToClear}>
                <SelectTrigger className="bg-white/10 border-gray-800 text-white">
                  <SelectValue placeholder="Select playlist" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 text-white border-gray-800">
                  {playlists.map((playlist) => (
                    <SelectItem key={playlist.id} value={playlist.id}>{playlist.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={() => selectedPlaylistToClear && clearPlaylist(selectedPlaylistToClear)} variant="destructive" disabled={!selectedPlaylistToClear}>
                Clear Selected Playlist
              </Button>
            </div>
            <div className="space-y-2">
              <Label>Remove Videos from Playlist</Label>
              <Select onValueChange={setSelectedPlaylistToClear}>
                <SelectTrigger className="bg-white/10 border-gray-800 text-white">
                  <SelectValue placeholder="Select playlist" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 text-white border-gray-800">
                  {playlists.map((playlist) => (
                    <SelectItem key={playlist.id} value={playlist.id}>{playlist.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedPlaylistToClear && (
                <ScrollArea className="h-60 overflow-y-auto">
                  <div className="space-y-2 p-2">
                    {events
                      .filter(event => event.playlistId === selectedPlaylistToClear)
                      .map(event => (
                        <div key={event.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={event.id}
                            checked={selectedVideosToRemove.includes(event.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedVideosToRemove([...selectedVideosToRemove, event.id])
                              } else {
                                setSelectedVideosToRemove(selectedVideosToRemove.filter(id => id !== event.id))
                              }
                            }}
                          />
                          <label htmlFor={event.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {event.title}
                          </label>
                        </div>
                      ))
                    }
                  </div>
                </ScrollArea>
              )}
              <Button onClick={removeSelectedVideos} variant="destructive" disabled={selectedVideosToRemove.length === 0}>
                Remove Selected Videos
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}