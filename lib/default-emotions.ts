import type { EmotionMatrixData } from "@/types/emotions"

export const defaultEmotionMatrix: EmotionMatrixData = {
  xAxis: "Pleasure",
  yAxis: "Energy",
  emotions: [
    // Row 0 (High Energy)
    { x: 0, y: 0, label: "Stressed", color: "#e11d48" },
    { x: 1, y: 0, label: "Angry", color: "#dc2626" },
    { x: 2, y: 0, label: "Excited", color: "#f59e0b" },
    { x: 3, y: 0, label: "Enthusiastic", color: "#16a34a" },
    { x: 4, y: 0, label: "Elated", color: "#059669" },

    // Row 1
    { x: 0, y: 1, label: "Anxious", color: "#ef4444" },
    { x: 1, y: 1, label: "Frustrated", color: "#f97316" },
    { x: 2, y: 1, label: "Energetic", color: "#84cc16" },
    { x: 3, y: 1, label: "Motivated", color: "#22c55e" },
    { x: 4, y: 1, label: "Joyful", color: "#10b981" },

    // Row 2 (Medium Energy)
    { x: 0, y: 2, label: "Worried", color: "#f97316" },
    { x: 1, y: 2, label: "Uneasy", color: "#eab308" },
    { x: 2, y: 2, label: "Neutral", color: "#6b7280" },
    { x: 3, y: 2, label: "Content", color: "#3b82f6" },
    { x: 4, y: 2, label: "Happy", color: "#06b6d4" },

    // Row 3
    { x: 0, y: 3, label: "Sad", color: "#6366f1" },
    { x: 1, y: 3, label: "Disappointed", color: "#8b5cf6" },
    { x: 2, y: 3, label: "Relaxed", color: "#0ea5e9" },
    { x: 3, y: 3, label: "Satisfied", color: "#0284c7" },
    { x: 4, y: 3, label: "Pleased", color: "#0369a1" },

    // Row 4 (Low Energy)
    { x: 0, y: 4, label: "Depressed", color: "#7c3aed" },
    { x: 1, y: 4, label: "Bored", color: "#8b5cf6" },
    { x: 2, y: 4, label: "Calm", color: "#6366f1" },
    { x: 3, y: 4, label: "Peaceful", color: "#4f46e5" },
    { x: 4, y: 4, label: "Serene", color: "#4338ca" },
  ],
}
