"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, SafeAreaView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useLanguage } from "../contexts/LanguageContext"
import { translations } from "../data/translations"

export default function InteroceptiveExercise({ onClose }) {
  const { language } = useLanguage()
  const [currentStep, setCurrentStep] = useState(0)
  const [challenge, setChallenge] = useState("")
  const [options, setOptions] = useState(["", ""])
  const [bodyResponses, setBodyResponses] = useState(["", ""])

  const t = translations[language]

  const steps = [
    {
      title: t.interoceptiveStep1Title,
      instruction: t.interoceptiveStep1Instruction,
      hasInput: true,
      inputType: "challenge",
    },
    {
      title: t.interoceptiveStep2Title,
      instruction: t.interoceptiveStep2Instruction,
      hasInput: true,
      inputType: "options",
    },
    {
      title: t.interoceptiveStep3Title,
      instruction: t.interoceptiveStep3Instruction,
      hasInput: false,
    },
    {
      title: t.interoceptiveStep4Title,
      instruction: t.interoceptiveStep4Instruction,
      hasInput: true,
      inputType: "bodyResponses",
    },
    {
      title: t.interoceptiveStep5Title,
      instruction: t.interoceptiveStep5Instruction,
      hasInput: false,
    },
  ]

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const addOption = () => {
    setOptions([...options, ""])
  }

  const updateOption = (text, index) => {
    const newOptions = [...options]
    newOptions[index] = text
    setOptions(newOptions)
  }

  const updateBodyResponse = (text, index) => {
    const newResponses = [...bodyResponses]
    newResponses[index] = text
    setBodyResponses(newResponses)
  }

  const renderInput = () => {
    const step = steps[currentStep]

    if (!step.hasInput) return null

    switch (step.inputType) {
      case "challenge":
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{t.yourChallenge}:</Text>
            <TextInput
              style={styles.textInput}
              multiline
              placeholder={t.enterYourChallenge}
              value={challenge}
              onChangeText={setChallenge}
            />
          </View>
        )
      case "options":
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{t.possibleOptions}:</Text>
            {options.map((option, index) => (
              <TextInput
                key={`option-${index}`}
                style={styles.textInput}
                placeholder={`${t.option} ${index + 1}`}
                value={option}
                onChangeText={(text) => updateOption(text, index)}
              />
            ))}
            {options.length < 5 && (
              <TouchableOpacity style={styles.addButton} onPress={addOption}>
                <Ionicons name="add-circle-outline" size={20} color="#6366f1" />
                <Text style={styles.addButtonText}>{t.addOption}</Text>
              </TouchableOpacity>
            )}
          </View>
        )
      case "bodyResponses":
        return (
          <View style={styles.inputContainer}>
            {options.map((option, index) => (
              <View key={`response-${index}`} style={styles.responseContainer}>
                <Text style={styles.optionLabel}>
                  {t.option} {index + 1}: {option}
                </Text>
                <TextInput
                  style={styles.textInput}
                  multiline
                  placeholder={t.howBodyResponds}
                  value={bodyResponses[index] || ""}
                  onChangeText={(text) => updateBodyResponse(text, index)}
                />
              </View>
            ))}
          </View>
        )
      default:
        return null
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.interoceptiveTitle}</Text>
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

        {renderInput()}

        {currentStep === steps.length - 1 && (
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>{t.exerciseSummary}</Text>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>{t.yourChallenge}:</Text>
              <Text style={styles.summaryText}>{challenge}</Text>
            </View>

            <Text style={styles.summaryLabel}>{t.yourOptions}:</Text>
            {options.map((option, index) => (
              <View key={`summary-option-${index}`} style={styles.summaryItem}>
                <Text style={styles.summaryText}>
                  {index + 1}. {option}
                </Text>
                <Text style={styles.summarySubtext}>
                  {t.bodyResponse}: {bodyResponses[index] || t.noResponseRecorded}
                </Text>
              </View>
            ))}

            <Text style={styles.summaryConclusion}>{t.exerciseConclusion}</Text>
          </View>
        )}
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
    marginBottom: 24,
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
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    minHeight: 48,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  addButtonText: {
    color: "#6366f1",
    fontSize: 16,
    marginLeft: 4,
  },
  responseContainer: {
    marginBottom: 16,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  summaryContainer: {
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  summaryItem: {
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  summaryText: {
    fontSize: 16,
    marginBottom: 4,
  },
  summarySubtext: {
    fontSize: 14,
    color: "#6b7280",
    marginLeft: 16,
  },
  summaryConclusion: {
    fontSize: 16,
    fontStyle: "italic",
    marginTop: 16,
    color: "#4b5563",
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
