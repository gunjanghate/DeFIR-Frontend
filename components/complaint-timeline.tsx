import { CheckCircle, Clock } from "lucide-react"

interface TimelineItem {
  id: number
  status: string
  title: string
  description: string
  timestamp: string | null
  completed: boolean
}

interface ComplaintTimelineProps {
  timeline: TimelineItem[]
}

export function ComplaintTimeline({ timeline }: ComplaintTimelineProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "received":
        return "bg-blue-500"
      case "processing":
        return "bg-purple-500"
      case "assigned":
        return "bg-yellow-500"
      case "dispatched":
        return "bg-orange-500"
      case "arrived":
        return "bg-cyan-500"
      case "action":
        return "bg-indigo-500"
      case "resolved":
        return "bg-green-500"
      case "escalated":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }
  
  // Sort timeline by ID to ensure correct order
  const sortedTimeline = [...timeline].sort((a, b) => a.id - b.id);
  
  // Find the highest completed item index
  const highestCompletedIndex = sortedTimeline.reduce((highest, item, index) => {
    return item.completed ? Math.max(highest, index) : highest;
  }, -1);
  
  // Create a new timeline with all previous items marked as completed
  const processedTimeline = sortedTimeline.map((item, index) => {
    if (index <= highestCompletedIndex) {
      return { ...item, completed: true };
    }
    return item;
  });

  return (
    <div className="space-y-4">
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-3.5 top-3 bottom-3 w-0.5 bg-muted"></div>
        
        {/* Timeline items */}
        <div className="space-y-6">
          {processedTimeline.map((item, index) => (
            <div key={item.id} className="flex gap-4">
              <div className="relative flex items-center justify-center flex-shrink-0 mt-1">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center ${
                    item.completed ? getStatusColor(item.status) : "bg-muted"
                  }`}
                >
                  {item.completed ? (
                    <CheckCircle className="h-4 w-4 text-white" />
                  ) : (
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </div>
              <div className="flex-1 pt-0.5">
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                {item.timestamp && (
                  <p className="text-xs text-muted-foreground mt-1">{new Date(item.timestamp).toLocaleString()}</p>
                )}
                {!item.timestamp && !item.completed && <p className="text-xs text-muted-foreground mt-1">Pending</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}