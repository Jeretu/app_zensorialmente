"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { Button, ProgressBar, Card, Divider } from "react-native-paper"
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
    setBodyResponses([...bodyResponses, ""])
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
              textAlignVertical="top"
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
              <Button
                mode="text"
                onPress={addOption}
                icon={() => <Ionicons name="add-circle-outline" size={20} color="#6366f1" />}
                style={styles.addButton}
              >
                {t.addOption}
              </Button>
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
                  textAlignVertical="top"
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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t.interoceptiveTitle}</Text>
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

          {renderInput()}

          {currentStep === steps.length - 1 && (
            <Card style={styles.summaryContainer}>
              <Card.Content>
                <Text style={styles.summaryTitle}>{t.exerciseSummary}</Text>

                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>{t.yourChallenge}:</Text>
                  <Text style={styles.summaryText}>{challenge}</Text>
                </View>

                <Divider style={styles.divider} />

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

                <Divider style={styles.divider} />

                <Text style={styles.summaryConclusion}>{t.exerciseConclusion}</Text>
              </Card.Content>
            </Card>
          )}
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
      </KeyboardAvoidingView>
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
    paddingBottom: 100,
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
    alignSelf: "flex-start",
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
    marginTop: 16,
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
  divider: {
    marginVertical: 12,
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
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#ffffff",
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
