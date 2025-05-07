"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { Button, ProgressBar } from "react-native-paper"
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
        <ProgressBar progress={(currentStep + 1) / steps.length} color="#6366f1" style={styles.progressBar} />
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
              <Button
                mode="contained"
                onPress={startTimer}
                icon={() => <Ionicons name="play" size={24} color="#ffffff" />}
                style={styles.timerButton}
              >
                {t.start}
              </Button>
            ) : (
              <Button
                mode="contained"
                onPress={pauseTimer}
                icon={() => <Ionicons name="pause" size={24} color="#ffffff" />}
                style={[styles.timerButton, styles.pauseButton]}
              >
                {t.pause}
              </Button>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          mode="text"
          onPress={prevStep}
          disabled={currentStep === 0}
          style={styles.navButton}
          contentStyle={styles.navButtonContent}
          icon={() => <Ionicons name="chevron-back" size={20} color={currentStep === 0 ? "#9ca3af" : "#6366f1"} />}
        >
          {t.previous}
        </Button>

        <Button
          mode="text"
          onPress={nextStep}
          disabled={currentStep === steps.length - 1}
          style={styles.navButton}
          contentStyle={[styles.navButtonContent, styles.nextButtonContent]}
          icon={({ size, color }) => (
            <Ionicons
              name="chevron-forward"
              size={20}
              color={currentStep === steps.length - 1 ? "#9ca3af" : "#6366f1"}
            />
          )}
        >
          {t.next}
        </Button>
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
    borderRadius: 3,
    marginBottom: 8,
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
    borderRadius: 8,
  },
  pauseButton: {
    backgroundColor: "#f59e0b",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  navButton: {
    flex: 1,
  },
  navButtonContent: {
    flexDirection: "row-reverse",
  },
  nextButtonContent: {
    flexDirection: "row",
  },
})
