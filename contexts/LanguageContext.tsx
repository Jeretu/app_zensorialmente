"use client"

import { createContext, useState, useContext, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import type { ReactNode } from "react"

type LanguageContextType = {
  language: string
  setLanguage: (lang: string) => void
}

const LanguageContext = createContext<LanguageContextType>({
  language: "es",
  setLanguage: () => {},
})

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState("es")

  useEffect(() => {
    // Load saved language preference
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem("language")
        if (savedLanguage) {
          setLanguageState(savedLanguage)
        }
      } catch (error) {
        console.error("Error loading language preference:", error)
      }
    }

    loadLanguage()
  }, [])

  const setLanguage = async (lang: string) => {
    try {
      await AsyncStorage.setItem("language", lang)
      setLanguageState(lang)
    } catch (error) {
      console.error("Error saving language preference:", error)
    }
  }

  return <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>
}

export const useLanguage = () => useContext(LanguageContext)
