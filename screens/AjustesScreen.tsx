"use client"

import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { Card, Divider } from "react-native-paper"
import { useLanguage } from "../contexts/LanguageContext"
import { useEmotions } from "../contexts/EmotionContext"
import { translations } from "../data/translations"

export default function AjustesScreen() {
  const { language, setLanguage } = useLanguage()
  const { resetEmotionMatrix, clearEmotionRecords } = useEmotions()

  const t = translations[language]

  const toggleLanguage = () => {
    setLanguage(language === "es" ? "en" : "es")
  }

  const confirmResetMatrix = () => {
    Alert.alert(t.confirmResetMatrix, t.confirmResetMatrixMessage, [
      {
        text: t.cancel,
        style: "cancel",
      },
      {
        text: t.reset,
        onPress: resetEmotionMatrix,
        style: "destructive",
      },
    ])
  }

  const confirmClearRecords = () => {
    Alert.alert(t.confirmClearRecords, t.confirmClearRecordsMessage, [
      {
        text: t.cancel,
        style: "cancel",
      },
      {
        text: t.clear,
        onPress: clearEmotionRecords,
        style: "destructive",
      },
    ])
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{t.settings}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.preferences}</Text>

          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>{t.language}</Text>
                  <Text style={styles.settingDescription}>{t.languageDescription}</Text>
                </View>
                <View style={styles.languageToggle}>
                  <Text style={[styles.languageOption, language === "es" && styles.activeLanguage]}>ES</Text>
                  <Switch
                    value={language === "en"}
                    onValueChange={toggleLanguage}
                    trackColor={{ false: "#6366f1", true: "#6366f1" }}
                    thumbColor="#ffffff"
                  />
                  <Text style={[styles.languageOption, language === "en" && styles.activeLanguage]}>EN</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.data}</Text>

          <Card style={styles.card}>
            <Card.Content>
              <TouchableOpacity style={styles.settingButton} onPress={confirmResetMatrix}>
                <View style={styles.settingButtonContent}>
                  <Ionicons name="refresh" size={20} color="#ef4444" />
                  <Text style={styles.settingButtonText}>{t.resetEmotionMatrix}</Text>
                </View>
                <Text style={styles.settingButtonDescription}>{t.resetEmotionMatrixDescription}</Text>
              </TouchableOpacity>

              <Divider style={styles.divider} />

              <TouchableOpacity style={styles.settingButton} onPress={confirmClearRecords}>
                <View style={styles.settingButtonContent}>
                  <Ionicons name="trash-outline" size={20} color="#ef4444" />
                  <Text style={styles.settingButtonText}>{t.clearEmotionRecords}</Text>
                </View>
                <Text style={styles.settingButtonDescription}>{t.clearEmotionRecordsDescription}</Text>
              </TouchableOpacity>
            </Card.Content>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.about}</Text>

          <Card style={styles.card}>
            <Card.Content style={styles.aboutItem}>
              <Text style={styles.aboutTitle}>{t.appName}</Text>
              <Text style={styles.aboutVersion}>v1.0.0</Text>
              <Text style={styles.aboutDescription}>{t.appDescription}</Text>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
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
    marginBottom: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#4b5563",
  },
  card: {
    borderRadius: 12,
    elevation: 1,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: "#6b7280",
  },
  languageToggle: {
    flexDirection: "row",
    alignItems: "center",
  },
  languageOption: {
    fontSize: 14,
    fontWeight: "500",
    color: "#9ca3af",
    marginHorizontal: 8,
  },
  activeLanguage: {
    color: "#6366f1",
    fontWeight: "600",
  },
  divider: {
    marginVertical: 12,
  },
  settingButton: {
    paddingVertical: 8,
  },
  settingButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  settingButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#ef4444",
    marginLeft: 8,
  },
  settingButtonDescription: {
    fontSize: 14,
    color: "#6b7280",
  },
  aboutItem: {
    padding: 8,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  aboutVersion: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 12,
  },
  aboutDescription: {
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 20,
  },
})
