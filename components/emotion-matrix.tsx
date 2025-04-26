"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit, Info } from "lucide-react"
import type { EmotionMatrixData, Emotion } from "@/types/emotions"
import { cn } from "@/lib/utils"

interface EmotionMatrixProps {
  matrixData: EmotionMatrixData
  selectedEmotion: { x: number; y: number } | null
  onSelectEmotion: (coords: { x: number; y: number } | null) => void
  onUpdateEmotion: (x: number, y: number, label: string, color: string) => void
}

export default function EmotionMatrix({
  matrixData,
  selectedEmotion,
  onSelectEmotion,
  onUpdateEmotion,
}: EmotionMatrixProps) {
  const [editingEmotion, setEditingEmotion] = useState<Emotion | null>(null)
  const [editLabel, setEditLabel] = useState("")
  const [editColor, setEditColor] = useState("")
  const [hoveredCell, setHoveredCell] = useState<{ x: number; y: number } | null>(null)

  const gridSize = 5 // 5x5 grid
  const gridArray = Array.from({ length: gridSize }, (_, i) => i)

  const handleCellClick = (x: number, y: number) => {
    onSelectEmotion({ x, y })
  }

  const getEmotionAtPosition = (x: number, y: number): Emotion | undefined => {
    return matrixData.emotions.find((emotion) => emotion.x === x && emotion.y === y)
  }

  const handleEditClick = (emotion: Emotion) => {
    setEditingEmotion(emotion)
    setEditLabel(emotion.label)
    setEditColor(emotion.color)
  }

  const handleSaveEdit = () => {
    if (editingEmotion) {
      onUpdateEmotion(editingEmotion.x, editingEmotion.y, editLabel, editColor)
      setEditingEmotion(null)
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="mb-8 flex items-center justify-center gap-2">
        <Info className="h-4 w-4 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Click on a cell to select an emotion. Hover to see the emotion label.
        </p>
      </div>

      <div className="relative w-full max-w-md aspect-square">
        {/* Y-axis label */}
        <div className="absolute -left-10 top-1/2 -translate-y-1/2 -rotate-90 text-sm font-medium text-muted-foreground whitespace-nowrap">
          Energy Level
        </div>

        {/* X-axis label */}
        <div className="absolute bottom-[-30px] left-1/2 -translate-x-1/2 text-sm font-medium text-muted-foreground">
          Pleasure Level
        </div>

        {/* Y-axis markers */}
        <div className="absolute -left-6 top-0 h-full flex flex-col justify-between text-xs text-muted-foreground">
          <span>High</span>
          <span>Low</span>
        </div>

        {/* X-axis markers */}
        <div className="absolute -bottom-6 left-0 w-full flex justify-between text-xs text-muted-foreground">
          <span>Low</span>
          <span>High</span>
        </div>

        {/* Matrix grid */}
        <div className="grid grid-cols-5 grid-rows-5 h-full w-full border border-border">
          {gridArray.map((y) =>
            gridArray.map((x) => {
              const emotion = getEmotionAtPosition(x, y)
              const isSelected = selectedEmotion?.x === x && selectedEmotion?.y === y
              const isHovered = hoveredCell?.x === x && hoveredCell?.y === y

              return (
                <div
                  key={`${x}-${y}`}
                  className={cn(
                    "relative border border-border transition-all duration-200",
                    isSelected ? "ring-2 ring-primary" : "",
                    isHovered ? "bg-accent/50" : "",
                  )}
                  onClick={() => handleCellClick(x, y)}
                  onMouseEnter={() => setHoveredCell({ x, y })}
                  onMouseLeave={() => setHoveredCell(null)}
                >
                  {(isHovered || isSelected) && emotion && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className="px-2 py-1 rounded text-xs font-medium text-white"
                        style={{ backgroundColor: emotion.color }}
                      >
                        {emotion.label}
                      </div>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-0 right-0 h-5 w-5"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEditClick(emotion)
                            }}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Emotion</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="emotion-label">Emotion Label</Label>
                              <Input
                                id="emotion-label"
                                value={editLabel}
                                onChange={(e) => setEditLabel(e.target.value)}
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="emotion-color">Color</Label>
                              <div className="flex gap-2">
                                <Input
                                  id="emotion-color"
                                  value={editColor}
                                  onChange={(e) => setEditColor(e.target.value)}
                                  placeholder="#hex or color name"
                                />
                                <input
                                  type="color"
                                  value={editColor}
                                  onChange={(e) => setEditColor(e.target.value)}
                                  className="w-10 h-10 p-1 border rounded"
                                />
                              </div>
                            </div>
                          </div>
                          <Button onClick={handleSaveEdit}>Save Changes</Button>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </div>
              )
            }),
          )}
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground mb-2">
          {selectedEmotion
            ? `Selected: ${getEmotionAtPosition(selectedEmotion.x, selectedEmotion.y)?.label}`
            : "No emotion selected"}
        </p>
        <p className="text-xs text-muted-foreground">Click the edit icon to customize any emotion</p>
      </div>
    </div>
  )
}
