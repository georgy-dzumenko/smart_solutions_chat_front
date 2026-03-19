'use client'

import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { useTranslations } from '@utils/i18n/useTranslations'
import { usePublicChatStore } from '@stores/publicChat'

import ChatMessages from './_components/messages'
import ChatInput from './_components/input'

import style from './style.module.scss'

const ChatPage = () => {
    const t = useTranslations()
    const { configId } = useParams()

    const config = usePublicChatStore((state) => state.config)
    const status = usePublicChatStore((state) => state.status)
    const error = usePublicChatStore((state) => state.error)
    const isInitialized = usePublicChatStore((state) => state.isInitialized)
    const isAssistantThinking = usePublicChatStore((state) => state.isAssistantThinking)

    const initializeChat = usePublicChatStore((state) => state.initializeChat)
    const destroyChat = usePublicChatStore((state) => state.destroyChat)

    useEffect(() => {
        if (!configId) return

        initializeChat(configId)

        return () => {
            destroyChat()
        }
    }, [configId, initializeChat, destroyChat])

    return (
        <div className={style['public-chat-page']}>
            <div className={style['public-chat-page__container']}>
                <div className={style['public-chat-page__header']}>
                    <h1 className={style['public-chat-page__title']}>{config?.title || t('PublicChat.title')}</h1>

                    {config?.topic ? <p className={style['public-chat-page__topic']}>{config.topic}</p> : null}
                </div>

                {error ? <div className={style['public-chat-page__error']}>{error}</div> : null}

                {!isInitialized ? (
                    <div className={style['public-chat-page__state']}>{t('PublicChat.loading')}</div>
                ) : (
                    <>
                        <ChatMessages />

                        {isAssistantThinking ? (
                            <div className={style['public-chat-page__thinking']}>
                                {t('PublicChat.assistantThinking')}
                            </div>
                        ) : null}

                        {status === 'completed' ? (
                            <div className={style['public-chat-page__completed']}>{t('PublicChat.completed')}</div>
                        ) : null}

                        <ChatInput disabled={status === 'completed'} />
                    </>
                )}
            </div>
        </div>
    )
}

export default ChatPage
