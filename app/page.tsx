"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EmotionMatrix from "@/components/emotion-matrix"
import EmotionHistory from "@/components/emotion-history"
import EmotionNotes from "@/components/emotion-notes"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import type { EmotionRecord, EmotionMatrixData } from "@/types/emotions"
import { defaultEmotionMatrix } from "@/lib/default-emotions"

export default function EmotionTrackerApp() {
  const [activeTab, setActiveTab] = useState("matrix")
  const [matrixData, setMatrixData] = useLocalStorage<EmotionMatrixData>("emotion-matrix-data", defaultEmotionMatrix)
  const [emotionRecords, setEmotionRecords] = useLocalStorage<EmotionRecord[]>("emotion-records", [])
  const [selectedEmotion, setSelectedEmotion] = useState<{ x: number; y: number } | null>(null)
  const [notes, setNotes] = useState("")

  const handleRecordEmotion = () => {
    if (selectedEmotion) {
      const emotion = matrixData.emotions.find((e) => e.x === selectedEmotion.x && e.y === selectedEmotion.y)

      if (emotion) {
        const newRecord: EmotionRecord = {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          emotion: emotion,
          notes: notes,
        }

        setEmotionRecords([newRecord, ...emotionRecords])
        setNotes("")
        setSelectedEmotion(null)
        setActiveTab("history")
      }
    }
  }

  const handleUpdateEmotion = (x: number, y: number, label: string, color: string) => {
    const updatedEmotions = matrixData.emotions.map((emotion) => {
      if (emotion.x === x && emotion.y === y) {
        return { ...emotion, label, color }
      }
      return emotion
    })

    setMatrixData({
      ...matrixData,
      emotions: updatedEmotions,
    })
  }

  const handleDeleteRecord = (id: string) => {
    setEmotionRecords(emotionRecords.filter((record) => record.id !== id))
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Emotion Tracker</h1>
        <p className="text-muted-foreground">Track and visualize your emotions based on pleasure and energy levels</p>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="matrix">Emotion Matrix</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="matrix" className="mt-6">
          <EmotionMatrix
            matrixData={matrixData}
            selectedEmotion={selectedEmotion}
            onSelectEmotion={setSelectedEmotion}
            onUpdateEmotion={handleUpdateEmotion}
          />

          {selectedEmotion && (
            <div className="mt-6 flex justify-center">
              <Button onClick={() => setActiveTab("notes")} className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Add Notes for This Emotion
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="notes" className="mt-6">
          <EmotionNotes
            selectedEmotion={
              selectedEmotion
                ? matrixData.emotions.find((e) => e.x === selectedEmotion.x && e.y === selectedEmotion.y)
                : null
            }
            notes={notes}
            onNotesChange={setNotes}
            onRecord={handleRecordEmotion}
          />
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <EmotionHistory records={emotionRecords} onDeleteRecord={handleDeleteRecord} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
