"use client"

import { useState, useEffect } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { SafeAreaProvider } from "react-native-safe-area-context"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { StatusBar } from "expo-status-bar"
import { Ionicons } from "@expo/vector-icons"
import { Text, View, ActivityIndicator } from "react-native"
import { Provider as PaperProvider } from "react-native-paper"

import MatrizScreen from "./screens/MatrizScreen"
import RegistroScreen from "./screens/RegistroScreen"
import EjerciciosScreen from "./screens/EjerciciosScreen"
import AjustesScreen from "./screens/AjustesScreen"
import { LanguageProvider } from "./contexts/LanguageContext"
import { EmotionProvider } from "./contexts/EmotionContext"
import { defaultEmotionMatrix } from "./data/defaultEmotions"
import { theme } from "./theme"

const Tab = createBottomTabNavigator()

export default function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [emotionMatrix, setEmotionMatrix] = useState(defaultEmotionMatrix)

  useEffect(() => {
    // Load saved emotion matrix data
    const loadEmotionMatrix = async () => {
      try {
        const savedMatrix = await AsyncStorage.getItem("emotionMatrix")
        if (savedMatrix) {
          setEmotionMatrix(JSON.parse(savedMatrix))
        }
      } catch (error) {
        console.error("Error loading emotion matrix:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadEmotionMatrix()
  }, [])

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={{ marginTop: 10 }}>Cargando...</Text>
      </View>
    )
  }

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <LanguageProvider>
          <EmotionProvider initialMatrix={emotionMatrix}>
            <NavigationContainer>
              <StatusBar style="auto" />
              <Tab.Navigator
                screenOptions={({ route }) => ({
                  tabBarIcon: ({ focused, color, size }) => {
                    let iconName

                    if (route.name === "Matriz") {
                      iconName = focused ? "grid" : "grid-outline"
                    } else if (route.name === "Registro") {
                      iconName = focused ? "journal" : "journal-outline"
                    } else if (route.name === "Ejercicios") {
                      iconName = focused ? "fitness" : "fitness-outline"
                    } else if (route.name === "Ajustes") {
                      iconName = focused ? "settings" : "settings-outline"
                    }

                    return <Ionicons name={iconName} size={size} color={color} />
                  },
                  tabBarActiveTintColor: "#6366f1",
                  tabBarInactiveTintColor: "gray",
                  headerShown: true,
                })}
              >
                <Tab.Screen name="Matriz" component={MatrizScreen} options={{ title: "Matriz Emocional" }} />
                <Tab.Screen name="Registro" component={RegistroScreen} options={{ title: "Registro Diario" }} />
                <Tab.Screen name="Ejercicios" component={EjerciciosScreen} options={{ title: "Ejercicios" }} />
                <Tab.Screen name="Ajustes" component={AjustesScreen} options={{ title: "Ajustes" }} />
              </Tab.Navigator>
            </NavigationContainer>
          </EmotionProvider>
        </LanguageProvider>
      </PaperProvider>
    </SafeAreaProvider>
  )
}
