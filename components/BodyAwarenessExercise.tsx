"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useLanguage } from "../contexts/LanguageContext"
import { translations } from "../data/translations"

export default function BodyAwarenessExercise({ onClose }) {
  const { language } = useLanguage()
  const [currentStep, setCurrentStep] = useState(0)
  const [timer, setTimer] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)

  const t = translations[language]

  const steps = [
    {
      title: t.bodyAwarenessStep1Title,
      instruction: t.bodyAwarenessStep1Instruction,
      duration: 60, // seconds
    },
    {
      title: t.bodyAwarenessStep2Title,
      instruction: t.bodyAwarenessStep2Instruction,
      duration: 90,
    },
    {
      title: t.bodyAwarenessStep3Title,
      instruction: t.bodyAwarenessStep3Instruction,
      duration: 120,
    },
    {
      title: t.bodyAwarenessStep4Title,
      instruction: t.bodyAwarenessStep4Instruction,
      duration: 90,
    },
    {
      title: t.bodyAwarenessStep5Title,
      instruction: t.bodyAwarenessStep5Instruction,
      duration: 60,
    },
  ]

  useEffect(() => {
    let interval

    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1)
      }, 1000)
    } else if (timer === 0 && isTimerRunning) {
      setIsTimerRunning(false)
    }

    return () => clearInterval(interval)
  }, [isTimerRunning, timer])

  const startTimer = () => {
    setTimer(steps[currentStep].duration)
    setIsTimerRunning(true)
  }

  const pauseTimer = () => {
    setIsTimerRunning(false)
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
      setTimer(steps[currentStep + 1].duration)
      setIsTimerRunning(false)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setTimer(steps[currentStep - 1].duration)
      setIsTimerRunning(false)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.bodyAwarenessTitle}</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${((currentStep + 1) / steps.length) * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {currentStep + 1} / {steps.length}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>{steps[currentStep].title}</Text>
          <Text style={styles.stepInstruction}>{steps[currentStep].instruction}</Text>
        </View>

        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{formatTime(timer)}</Text>
          <View style={styles.timerControls}>
            {!isTimerRunning ? (
              <TouchableOpacity style={styles.timerButton} onPress={startTimer}>
                <Ionicons name="play" size={24} color="#ffffff" />
                <Text style={styles.timerButtonText}>{t.start}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={[styles.timerButton, styles.pauseButton]} onPress={pauseTimer}>
                <Ionicons name="pause" size={24} color="#ffffff" />
                <Text style={styles.timerButtonText}>{t.pause}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.navButton, currentStep === 0 && styles.disabledButton]}
          onPress={prevStep}
          disabled={currentStep === 0}
        >
          <Ionicons name="chevron-back" size={20} color={currentStep === 0 ? "#9ca3af" : "#6366f1"} />
          <Text style={[styles.navButtonText, currentStep === 0 && styles.disabledButtonText]}>{t.previous}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, currentStep === steps.length - 1 && styles.disabledButton]}
          onPress={nextStep}
          disabled={currentStep === steps.length - 1}
        >
          <Text style={[styles.navButtonText, currentStep === steps.length - 1 && styles.disabledButtonText]}>
            {t.next}
          </Text>
          <Ionicons name="chevron-forward" size={20} color={currentStep === steps.length - 1 ? "#9ca3af" : "#6366f1"} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  placeholder: {
    width: 32,
  },
  progressContainer: {
    padding: 16,
    paddingTop: 0,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#e5e7eb",
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#6366f1",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "right",
  },
  content: {
    padding: 20,
    paddingTop: 0,
  },
  stepContainer: {
    marginBottom: 32,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  stepInstruction: {
    fontSize: 16,
    lineHeight: 24,
    color: "#4b5563",
  },
  timerContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  timerText: {
    fontSize: 48,
    fontWeight: "300",
    marginBottom: 24,
  },
  timerControls: {
    flexDirection: "row",
    justifyContent: "center",
  },
  timerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6366f1",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  pauseButton: {
    backgroundColor: "#f59e0b",
  },
  timerButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#6366f1",
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledButtonText: {
    color: "#9ca3af",
  },
})
