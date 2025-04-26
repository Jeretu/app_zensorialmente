"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { defaultEmotionMatrix } from "../data/defaultEmotions"

type Emotion = {
  x: number
  y: number
  label: string
  color: string
}

type EmotionMatrixData = {
  xAxis: string
  yAxis: string
  emotions: Emotion[]
}

type EmotionRecord = {
  id: string
  timestamp: string
  emotion: Emotion
  notes: string
}

type EmotionContextType = {
  emotionMatrix: EmotionMatrixData
  emotionRecords: EmotionRecord[]
  updateEmotion: (x: number, y: number, label: string, color: string) => void
  recordEmotion: (emotion: Emotion, notes: string) => void
  deleteEmotionRecord: (id: string) => void
  resetEmotionMatrix: () => void
  clearEmotionRecords: () => void
}

const EmotionContext = createContext<EmotionContextType>({
  emotionMatrix: defaultEmotionMatrix,
  emotionRecords: [],
  updateEmotion: () => {},
  recordEmotion: () => {},
  deleteEmotionRecord: () => {},
  resetEmotionMatrix: () => {},
  clearEmotionRecords: () => {},
})

export const EmotionProvider: React.FC<{
  children: React.ReactNode
  initialMatrix: EmotionMatrixData
}> = ({ children, initialMatrix }) => {
  const [emotionMatrix, setEmotionMatrix] = useState<EmotionMatrixData>(initialMatrix)
  const [emotionRecords, setEmotionRecords] = useState<EmotionRecord[]>([])

  useEffect(() => {
    // Load saved emotion records
    const loadEmotionRecords = async () => {
      try {
        const savedRecords = await AsyncStorage.getItem("emotionRecords")
        if (savedRecords) {
          setEmotionRecords(JSON.parse(savedRecords))
        }
      } catch (error) {
        console.error("Error loading emotion records:", error)
      }
    }

    loadEmotionRecords()
  }, [])

  const updateEmotion = async (x: number, y: number, label: string, color: string) => {
    const updatedEmotions = emotionMatrix.emotions.map((emotion) => {
      if (emotion.x === x && emotion.y === y) {
        return { ...emotion, label, color }
      }
      return emotion
    })

    const updatedMatrix = {
      ...emotionMatrix,
      emotions: updatedEmotions,
    }

    setEmotionMatrix(updatedMatrix)

    try {
      await AsyncStorage.setItem("emotionMatrix", JSON.stringify(updatedMatrix))
    } catch (error) {
      console.error("Error saving emotion matrix:", error)
    }
  }

  const recordEmotion = async (emotion: Emotion, notes: string) => {
    const newRecord: EmotionRecord = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      emotion,
      notes,
    }

    const updatedRecords = [newRecord, ...emotionRecords]
    setEmotionRecords(updatedRecords)

    try {
      await AsyncStorage.setItem("emotionRecords", JSON.stringify(updatedRecords))
    } catch (error) {
      console.error("Error saving emotion record:", error)
    }
  }

  const deleteEmotionRecord = async (id: string) => {
    const updatedRecords = emotionRecords.filter((record) => record.id !== id)
    setEmotionRecords(updatedRecords)

    try {
      await AsyncStorage.setItem("emotionRecords", JSON.stringify(updatedRecords))
    } catch (error) {
      console.error("Error saving updated emotion records:", error)
    }
  }

  const resetEmotionMatrix = async () => {
    setEmotionMatrix(defaultEmotionMatrix)

    try {
      await AsyncStorage.setItem("emotionMatrix", JSON.stringify(defaultEmotionMatrix))
    } catch (error) {
      console.error("Error resetting emotion matrix:", error)
    }
  }

  const clearEmotionRecords = async () => {
    setEmotionRecords([])

    try {
      await AsyncStorage.setItem("emotionRecords", JSON.stringify([]))
    } catch (error) {
      console.error("Error clearing emotion records:", error)
    }
  }

  return (
    <EmotionContext.Provider
      value={{
        emotionMatrix,
        emotionRecords,
        updateEmotion,
        recordEmotion,
        deleteEmotionRecord,
        resetEmotionMatrix,
        clearEmotionRecords,
      }}
    >
      {children}
    </EmotionContext.Provider>
  )
}

export const useEmotions = () => useContext(EmotionContext)
