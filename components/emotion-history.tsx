"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { EmotionRecord } from "@/types/emotions"
import { formatDistanceToNow } from "date-fns"
import { MoreVertical, Trash2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface EmotionHistoryProps {
  records: EmotionRecord[]
  onDeleteRecord: (id: string) => void
}

export default function EmotionHistory({ records, onDeleteRecord }: EmotionHistoryProps) {
  const [expandedRecords, setExpandedRecords] = useState<Set<string>>(new Set())

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedRecords)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedRecords(newExpanded)
  }

  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-muted-foreground mb-4">You haven't recorded any emotions yet</p>
        <Button variant="outline" onClick={() => window.history.back()}>
          Go Back to Matrix
        </Button>
      </div>
    )
  }

  // Group records by date
  const groupedRecords: Record<string, EmotionRecord[]> = {}

  records.forEach((record) => {
    const date = new Date(record.timestamp).toLocaleDateString()
    if (!groupedRecords[date]) {
      groupedRecords[date] = []
    }
    groupedRecords[date].push(record)
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Your Emotion Records</h2>
        <p className="text-sm text-muted-foreground">
          {records.length} {records.length === 1 ? "entry" : "entries"}
        </p>
      </div>

      <ScrollArea className="h-[500px] pr-4">
        <div className="space-y-6">
          {Object.entries(groupedRecords).map(([date, dateRecords]) => (
            <div key={date} className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">{date}</h3>

              {dateRecords.map((record) => (
                <Card key={record.id} className="overflow-hidden">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: record.emotion.color }} />
                        <CardTitle className="text-base">{record.emotion.label}</CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        <CardDescription>
                          {formatDistanceToNow(new Date(record.timestamp), { addSuffix: true })}
                        </CardDescription>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => onDeleteRecord(record.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-muted-foreground">
                          Energy:{" "}
                          {record.emotion.y === 0
                            ? "Very High"
                            : record.emotion.y === 1
                              ? "High"
                              : record.emotion.y === 2
                                ? "Moderate"
                                : record.emotion.y === 3
                                  ? "Low"
                                  : "Very Low"}
                        </span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">
                          Pleasure:{" "}
                          {record.emotion.x === 0
                            ? "Very Low"
                            : record.emotion.x === 1
                              ? "Low"
                              : record.emotion.x === 2
                                ? "Moderate"
                                : record.emotion.x === 3
                                  ? "High"
                                  : "Very High"}
                        </span>
                      </div>

                      <div className={expandedRecords.has(record.id) ? "" : "line-clamp-2"}>{record.notes}</div>

                      {record.notes.length > 100 && (
                        <Button variant="link" className="p-0 h-auto text-xs" onClick={() => toggleExpand(record.id)}>
                          {expandedRecords.has(record.id) ? "Show less" : "Show more"}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
