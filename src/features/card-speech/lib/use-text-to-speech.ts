"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { detectSpeechLang } from "./detect-speech-lang"

export function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const utteranceIdRef = useRef(0)

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return

    const updateVoices = () => setVoices(window.speechSynthesis.getVoices())
    updateVoices()
    window.speechSynthesis.onvoiceschanged = updateVoices

    return () => {
      window.speechSynthesis.onvoiceschanged = null
      window.speechSynthesis.cancel()
    }
  }, [])

  const stop = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return
    utteranceIdRef.current += 1
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }, [])

  const speak = useCallback(
    (text: string) => {
      if (typeof window === "undefined" || !window.speechSynthesis || !text)
        return

      const id = ++utteranceIdRef.current
      window.speechSynthesis.cancel()

      const targetLang = detectSpeechLang(text)
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = targetLang

      const systemVoice =
        voices.find(
          (v) => v.lang.startsWith(targetLang) && v.name.includes("Google")
        ) ||
        voices.find(
          (v) => v.lang.startsWith(targetLang) && v.name.includes("Microsoft")
        ) ||
        voices.find((v) =>
          v.lang.toLowerCase().startsWith(targetLang.split("-")[0])
        )

      if (systemVoice) utterance.voice = systemVoice
      utterance.rate = 0.9

      utterance.onstart = () => {
        if (utteranceIdRef.current === id) setIsSpeaking(true)
      }
      utterance.onend = () => {
        if (utteranceIdRef.current === id) setIsSpeaking(false)
      }
      utterance.onerror = () => {
        if (utteranceIdRef.current === id) setIsSpeaking(false)
      }

      window.speechSynthesis.speak(utterance)
    },
    [voices]
  )

  return { speak, stop, isSpeaking }
}
