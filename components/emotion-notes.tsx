"use client"

import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { Emotion } from "@/types/emotions"
import { Save } from "lucide-react"

interface EmotionNotesProps {
  selectedEmotion: Emotion | null
  notes: string
  onNotesChange: (notes: string) => void
  onRecord: () => void
}

export default function EmotionNotes({ selectedEmotion, notes, onNotesChange, onRecord }: EmotionNotesProps) {
  if (!selectedEmotion) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-muted-foreground mb-4">Please select an emotion from the matrix first</p>
        <Button variant="outline" onClick={() => window.history.back()}>
          Go Back to Matrix
        </Button>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: selectedEmotion.color }} />
          <CardTitle>Notes for: {selectedEmotion.label}</CardTitle>
        </div>
        <CardDescription>Record what influenced this emotion and activities that helped you transition</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">What influenced this emotion?</h3>
            <Textarea
              placeholder="Describe what events, thoughts, or circumstances led to this emotional state..."
              className="min-h-[100px]"
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
            />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Helpful activities for transitioning from this state:</h3>
            <ul className="text-sm text-muted-foreground space-y-2 ml-4 list-disc">
              <li>Physical activities (walking, exercise, stretching)</li>
              <li>Mental practices (meditation, deep breathing)</li>
              <li>Social interactions (talking to a friend)</li>
              <li>Creative outlets (drawing, writing, music)</li>
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onRecord} className="w-full flex items-center gap-2" disabled={!notes.trim()}>
          <Save className="h-4 w-4" />
          Record This Emotion
        </Button>
      </CardFooter>
    </Card>
  )
}
