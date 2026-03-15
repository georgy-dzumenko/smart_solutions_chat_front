import React, { createContext, useEffect, useState } from 'react'

import { loadLocale } from '@utils/i18n/loadLocale'

export const LocalizationContext = createContext()

export const LocalizationProvider = ({ children, locale }) => {
    const [messages, setMessages] = useState({})
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        ;(async () => {
            const newMessages = await loadLocale(locale)

            setMessages(newMessages)
            setIsLoading(false)
        })()
    }, [locale])

    return (
        <LocalizationContext.Provider value={{ isLoading, locale, messages }}>{children}</LocalizationContext.Provider>
    )
}
