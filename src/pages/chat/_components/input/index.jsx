'use client'

import { useState } from 'react'

import { useTranslations } from '@utils/i18n/useTranslations'
import { usePublicChatStore } from '@stores/publicChat'

import style from './style.module.scss'

const ChatInput = ({ disabled }) => {
    const t = useTranslations()

    const [value, setValue] = useState('')

    const sendMessage = usePublicChatStore((state) => state.sendMessage)
    const isAssistantThinking = usePublicChatStore((state) => state.isAssistantThinking)

    const handleSubmit = async (event) => {
        event.preventDefault()

        const nextValue = value.trim()

        if (!nextValue || disabled || isAssistantThinking) return

        await sendMessage(nextValue)
        setValue('')
    }

    return (
        <form onSubmit={handleSubmit} className={style['chat-input']}>
            <input
                value={value}
                onChange={(event) => setValue(event.target.value)}
                placeholder={t('PublicChat.inputPlaceholder')}
                className={style['chat-input__field']}
                disabled={disabled || isAssistantThinking}
            />

            <button
                type="submit"
                className={style['chat-input__submit']}
                disabled={disabled || isAssistantThinking || !value.trim()}
            >
                {t('PublicChat.send')}
            </button>
        </form>
    )
}

export default ChatInput
