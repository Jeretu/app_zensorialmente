"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, Modal } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { Card, Title, Paragraph } from "react-native-paper"
import { useLanguage } from "../contexts/LanguageContext"
import { translations } from "../data/translations"
import BodyAwarenessExercise from "../components/BodyAwarenessExercise"
import InteroceptiveExercise from "../components/InteroceptiveExercise"

export default function EjerciciosScreen() {
  const { language } = useLanguage()
  const [activeExercise, setActiveExercise] = useState(null)

  const t = translations[language]

  const exercises = [
    {
      id: "body-awareness",
      icon: "🧠",
      title: t.bodyAwarenessTitle,
      description: t.bodyAwarenessDescription,
      duration: t.bodyAwarenessDuration,
      frequency: t.bodyAwarenessFrequency,
    },
    {
      id: "interoceptive",
      icon: "🌿",
      title: t.interoceptiveTitle,
      description: t.interoceptiveDescription,
      duration: t.interoceptiveDuration,
      frequency: t.interoceptiveFrequency,
    },
  ]

  const startExercise = (exerciseId) => {
    setActiveExercise(exerciseId)
  }

  const closeExercise = () => {
    setActiveExercise(null)
  }

  const renderExerciseContent = () => {
    switch (activeExercise) {
      case "body-awareness":
        return <BodyAwarenessExercise onClose={closeExercise} />
      case "interoceptive":
        return <InteroceptiveExercise onClose={closeExercise} />
      default:
        return null
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{t.exercises}</Text>
        <Text style={styles.subtitle}>{t.exercisesDescription}</Text>

        {exercises.map((exercise) => (
          <Card key={exercise.id} style={styles.exerciseCard} onPress={() => startExercise(exercise.id)}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.exerciseIconContainer}>
                <Text style={styles.exerciseIcon}>{exercise.icon}</Text>
              </View>
              <View style={styles.exerciseInfo}>
                <Title style={styles.exerciseTitle}>{exercise.title}</Title>
                <Paragraph style={styles.exerciseDescription}>{exercise.description}</Paragraph>
                <View style={styles.exerciseMetadata}>
                  <View style={styles.metadataItem}>
                    <Ionicons name="time-outline" size={14} color="#6b7280" />
                    <Text style={styles.metadataText}>{exercise.duration}</Text>
                  </View>
                  <View style={styles.metadataItem}>
                    <Ionicons name="calendar-outline" size={14} color="#6b7280" />
                    <Text style={styles.metadataText}>{exercise.frequency}</Text>
                  </View>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#6b7280" />
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      <Modal
        visible={activeExercise !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeExercise}
      >
        {renderExerciseContent()}
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 24,
    lineHeight: 22,
  },
  exerciseCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  exerciseIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  exerciseIcon: {
    fontSize: 24,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  exerciseDescription: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
    lineHeight: 20,
  },
  exerciseMetadata: {
    flexDirection: "row",
    alignItems: "center",
  },
  metadataItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  metadataText: {
    fontSize: 12,
    color: "#6b7280",
    marginLeft: 4,
  },
})
