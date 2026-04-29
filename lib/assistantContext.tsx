'use client'

import { createContext, useContext, useState } from 'react'

type AssistantContextType = {
  pendingQuestion: string
  setPendingQuestion: (q: string) => void
}

const AssistantContext = createContext<AssistantContextType>({
  pendingQuestion: '',
  setPendingQuestion: () => {},
})

export function AssistantProvider({ children }: { children: React.ReactNode }) {
  const [pendingQuestion, setPendingQuestion] = useState('')
  return (
    <AssistantContext.Provider value={{ pendingQuestion, setPendingQuestion }}>
      {children}
    </AssistantContext.Provider>
  )
}

export function useAssistant() {
  return useContext(AssistantContext)
}
