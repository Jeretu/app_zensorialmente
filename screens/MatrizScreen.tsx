"use client"

import { useState, useRef } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Dimensions, Animated } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import ColorPicker from "react-native-wheel-color-picker"
import { useEmotions } from "../contexts/EmotionContext"
import { useLanguage } from "../contexts/LanguageContext"
import { translations } from "../data/translations"

const { width } = Dimensions.get("window")
const GRID_SIZE = 5
const CELL_SIZE = (width - 60) / GRID_SIZE

export default function MatrizScreen({ navigation }) {
  const { language } = useLanguage()
  const { emotionMatrix, updateEmotion, recordEmotion } = useEmotions()
  const [selectedCell, setSelectedCell] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [editingEmotion, setEditingEmotion] = useState(null)
  const [emotionLabel, setEmotionLabel] = useState("")
  const [emotionColor, setEmotionColor] = useState("#6366f1")
  const [notes, setNotes] = useState("")

  const t = translations[language]

  const fadeAnim = useRef(new Animated.Value(0)).current

  const handleCellPress = (x, y) => {
    const emotion = emotionMatrix.emotions.find((e) => e.x === x && e.y === y)
    setSelectedCell({ x, y, emotion })

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }

  const handleEditEmotion = () => {
    if (selectedCell && selectedCell.emotion) {
      setEditingEmotion(selectedCell.emotion)
      setEmotionLabel(selectedCell.emotion.label)
      setEmotionColor(selectedCell.emotion.color)
      setEditModalVisible(true)
    }
  }

  const handleSaveEdit = () => {
    if (editingEmotion) {
      updateEmotion(editingEmotion.x, editingEmotion.y, emotionLabel, emotionColor)
      setEditModalVisible(false)

      // Update the selected cell with new values
      if (selectedCell) {
        setSelectedCell({
          ...selectedCell,
          emotion: {
            ...selectedCell.emotion,
            label: emotionLabel,
            color: emotionColor,
          },
        })
      }
    }
  }

  const handleRecordEmotion = () => {
    if (selectedCell && selectedCell.emotion) {
      recordEmotion(selectedCell.emotion, notes)
      setModalVisible(false)
      setNotes("")

      // Show confirmation and navigate to registro
      navigation.navigate("Registro")
    }
  }

  const renderGrid = () => {
    const grid = []

    for (let y = 0; y < GRID_SIZE; y++) {
      const row = []
      for (let x = 0; x < GRID_SIZE; x++) {
        const emotion = emotionMatrix.emotions.find((e) => e.x === x && e.y === y)
        const isSelected = selectedCell && selectedCell.x === x && selectedCell.y === y

        row.push(
          <TouchableOpacity
            key={`${x}-${y}`}
            style={[styles.cell, isSelected && styles.selectedCell]}
            onPress={() => handleCellPress(x, y)}
          >
            {isSelected && (
              <View style={[styles.emotionBubble, { backgroundColor: emotion.color }]}>
                <Text style={styles.emotionText}>{emotion.label}</Text>
              </View>
            )}
          </TouchableOpacity>,
        )
      }
      grid.push(
        <View key={`row-${y}`} style={styles.row}>
          {row}
        </View>,
      )
    }

    return grid
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.matrixContainer}>
        <View style={styles.axisLabels}>
          <Text style={styles.axisLabel}>{t.energyAxis}</Text>
          <View style={styles.yAxisMarkers}>
            <Text style={styles.axisMarker}>{t.high}</Text>
            <Text style={styles.axisMarker}>{t.low}</Text>
          </View>
        </View>

        <View style={styles.gridContainer}>
          {renderGrid()}

          <View style={styles.xAxisContainer}>
            <Text style={styles.axisLabel}>{t.pleasureAxis}</Text>
            <View style={styles.xAxisMarkers}>
              <Text style={styles.axisMarker}>{t.low}</Text>
              <Text style={styles.axisMarker}>{t.high}</Text>
            </View>
          </View>
        </View>
      </View>

      <Animated.View style={[styles.selectionInfo, { opacity: fadeAnim }]}>
        {selectedCell && selectedCell.emotion && (
          <>
            <View style={styles.emotionHeader}>
              <View style={[styles.colorDot, { backgroundColor: selectedCell.emotion.color }]} />
              <Text style={styles.selectedEmotionText}>{selectedCell.emotion.label}</Text>
              <TouchableOpacity onPress={handleEditEmotion} style={styles.editButton}>
                <Ionicons name="pencil" size={18} color="#6366f1" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.recordButton} onPress={() => setModalVisible(true)}>
              <Text style={styles.recordButtonText}>{t.recordEmotion}</Text>
            </TouchableOpacity>
          </>
        )}
      </Animated.View>

      {/* Record Emotion Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t.recordYourEmotion}</Text>

            {selectedCell && selectedCell.emotion && (
              <View style={styles.emotionHeader}>
                <View style={[styles.colorDot, { backgroundColor: selectedCell.emotion.color }]} />
                <Text style={styles.selectedEmotionText}>{selectedCell.emotion.label}</Text>
              </View>
            )}

            <Text style={styles.inputLabel}>{t.notes}</Text>
            <TextInput
              style={styles.notesInput}
              multiline
              placeholder={t.whatInfluencedEmotion}
              value={notes}
              onChangeText={setNotes}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>{t.cancel}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.saveButton} onPress={handleRecordEmotion}>
                <Text style={styles.saveButtonText}>{t.save}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Emotion Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t.editEmotion}</Text>

            <Text style={styles.inputLabel}>{t.emotionName}</Text>
            <TextInput style={styles.textInput} value={emotionLabel} onChangeText={setEmotionLabel} />

            <Text style={styles.inputLabel}>{t.color}</Text>
            <View style={styles.colorPickerContainer}>
              <ColorPicker
                color={emotionColor}
                onColorChange={(color) => setEmotionColor(color)}
                thumbSize={30}
                sliderSize={20}
                noSnap={true}
                row={false}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setEditModalVisible(false)}>
                <Text style={styles.cancelButtonText}>{t.cancel}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.saveButton} onPress={handleSaveEdit}>
                <Text style={styles.saveButtonText}>{t.save}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  matrixContainer: {
    padding: 20,
    alignItems: "center",
  },
  axisLabels: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  axisLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#6b7280",
    marginRight: 10,
  },
  yAxisMarkers: {
    height: CELL_SIZE * GRID_SIZE,
    justifyContent: "space-between",
    marginRight: 5,
  },
  xAxisContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  xAxisMarkers: {
    width: CELL_SIZE * GRID_SIZE,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  axisMarker: {
    fontSize: 12,
    color: "#6b7280",
  },
  gridContainer: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#ffffff",
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderWidth: 0.5,
    borderColor: "#d1d5db",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedCell: {
    backgroundColor: "rgba(99, 102, 241, 0.1)",
  },
  emotionBubble: {
    padding: 4,
    borderRadius: 4,
    maxWidth: CELL_SIZE - 4,
  },
  emotionText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  selectionInfo: {
    margin: 20,
    padding: 15,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emotionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  selectedEmotionText: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
  },
  editButton: {
    padding: 8,
  },
  recordButton: {
    backgroundColor: "#6366f1",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  recordButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#4b5563",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    height: 120,
    textAlignVertical: "top",
  },
  colorPickerContainer: {
    height: 220,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#d1d5db",
    marginRight: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#4b5563",
    fontWeight: "bold",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#6366f1",
    padding: 12,
    borderRadius: 6,
    marginLeft: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
})
