export interface Emotion {
  x: number
  y: number
  label: string
  color: string
}

export interface EmotionMatrixData {
  xAxis: string
  yAxis: string
  emotions: Emotion[]
}

export interface EmotionRecord {
  id: string
  timestamp: string
  emotion: Emotion
  notes: string
}
