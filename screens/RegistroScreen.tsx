"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { format } from "date-fns"
import { es, enUS } from "date-fns/locale"
import { useEmotions } from "../contexts/EmotionContext"
import { useLanguage } from "../contexts/LanguageContext"
import { translations } from "../data/translations"

export default function RegistroScreen() {
  const { language } = useLanguage()
  const { emotionRecords, deleteEmotionRecord } = useEmotions()
  const [groupedRecords, setGroupedRecords] = useState({})
  const [expandedRecords, setExpandedRecords] = useState(new Set())

  const t = translations[language]
  const dateLocale = language === "es" ? es : enUS

  useEffect(() => {
    // Group records by date
    const grouped = {}
    emotionRecords.forEach((record) => {
      const date = format(new Date(record.timestamp), "yyyy-MM-dd")
      if (!grouped[date]) {
        grouped[date] = []
      }
      grouped[date].push(record)
    })
    setGroupedRecords(grouped)
  }, [emotionRecords])

  const toggleExpand = (id) => {
    setExpandedRecords((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const confirmDelete = (id) => {
    Alert.alert(t.confirmDelete, t.confirmDeleteMessage, [
      {
        text: t.cancel,
        style: "cancel",
      },
      {
        text: t.delete,
        onPress: () => deleteEmotionRecord(id),
        style: "destructive",
      },
    ])
  }

  const renderEmotionRecord = ({ item }) => {
    const isExpanded = expandedRecords.has(item.id)
    const formattedTime = format(new Date(item.timestamp), "HH:mm")

    return (
      <View style={styles.recordCard}>
        <View style={styles.recordHeader}>
          <View style={styles.timeAndEmotion}>
            <Text style={styles.recordTime}>{formattedTime}</Text>
            <View style={[styles.emotionTag, { backgroundColor: item.emotion.color }]}>
              <Text style={styles.emotionTagText}>{item.emotion.label}</Text>
            </View>
          </View>

          <View style={styles.recordActions}>
            <TouchableOpacity onPress={() => toggleExpand(item.id)}>
              <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={20} color="#6b7280" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => confirmDelete(item.id)} style={styles.deleteButton}>
              <Ionicons name="trash-outline" size={18} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.emotionDetails}>
          <View style={styles.emotionMetrics}>
            <Text style={styles.metricText}>
              {t.energy}:{" "}
              {item.emotion.y === 0
                ? t.veryHigh
                : item.emotion.y === 1
                  ? t.high
                  : item.emotion.y === 2
                    ? t.moderate
                    : item.emotion.y === 3
                      ? t.low
                      : t.veryLow}
            </Text>
            <Text style={styles.metricDivider}>•</Text>
            <Text style={styles.metricText}>
              {t.pleasure}:{" "}
              {item.emotion.x === 0
                ? t.veryLow
                : item.emotion.x === 1
                  ? t.low
                  : item.emotion.x === 2
                    ? t.moderate
                    : item.emotion.x === 3
                      ? t.high
                      : t.veryHigh}
            </Text>
          </View>

          {isExpanded && item.notes && (
            <View style={styles.notesContainer}>
              <Text style={styles.notesLabel}>{t.notes}:</Text>
              <Text style={styles.notesText}>{item.notes}</Text>
            </View>
          )}
        </View>
      </View>
    )
  }

  const renderDateSection = ({ item }) => {
    const date = item[0]
    const records = item[1]
    const formattedDate = format(new Date(date), "EEEE, d MMMM yyyy", { locale: dateLocale })

    return (
      <View style={styles.dateSection}>
        <Text style={styles.dateSectionTitle}>{formattedDate}</Text>
        <FlatList
          data={records}
          renderItem={renderEmotionRecord}
          keyExtractor={(record) => record.id}
          scrollEnabled={false}
        />
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t.emotionRecords}</Text>
        <Text style={styles.subtitle}>
          {emotionRecords.length} {emotionRecords.length === 1 ? t.entry : t.entries}
        </Text>
      </View>

      {emotionRecords.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="journal-outline" size={64} color="#d1d5db" />
          <Text style={styles.emptyStateText}>{t.noRecordsYet}</Text>
          <Text style={styles.emptyStateSubtext}>{t.recordEmotionsToSeeHere}</Text>
        </View>
      ) : (
        <FlatList
          data={Object.entries(groupedRecords).sort((a, b) => b[0].localeCompare(a[0]))}
          renderItem={renderDateSection}
          keyExtractor={(item) => item[0]}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },
  listContent: {
    padding: 16,
  },
  dateSection: {
    marginBottom: 24,
  },
  dateSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#4b5563",
  },
  recordCard: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  recordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  timeAndEmotion: {
    flexDirection: "row",
    alignItems: "center",
  },
  recordTime: {
    fontSize: 14,
    fontWeight: "500",
    marginRight: 8,
  },
  emotionTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  emotionTagText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
  },
  recordActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  deleteButton: {
    marginLeft: 16,
    padding: 4,
  },
  emotionDetails: {
    marginTop: 4,
  },
  emotionMetrics: {
    flexDirection: "row",
    alignItems: "center",
  },
  metricText: {
    fontSize: 12,
    color: "#6b7280",
  },
  metricDivider: {
    marginHorizontal: 6,
    color: "#9ca3af",
  },
  notesContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    color: "#6b7280",
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#9ca3af",
    marginTop: 8,
    textAlign: "center",
  },
})
