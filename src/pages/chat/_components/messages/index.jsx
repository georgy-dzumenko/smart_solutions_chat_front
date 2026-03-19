'use client'

import { useEffect, useMemo, useRef } from 'react'
import classNames from 'classnames'

import { usePublicChatStore } from '@stores/publicChat'

import style from './style.module.scss'

const ChatMessages = () => {
    const containerRef = useRef(null)

    const messageOrder = usePublicChatStore((state) => state.messageOrder)
    const messagesById = usePublicChatStore((state) => state.messagesById)

    const messages = useMemo(() => {
        return messageOrder.map((id) => messagesById[id]).filter(Boolean)
    }, [messageOrder, messagesById])

    useEffect(() => {
        const node = containerRef.current

        if (!node) return

        node.scrollTop = node.scrollHeight
    }, [messages])

    return (
        <div ref={containerRef} className={style['chat-messages']}>
            {messages.map((message) => (
                <div
                    key={message.id}
                    className={classNames(style['chat-messages__item'], {
                        [style['chat-messages__item--assistant']]: message.role === 'assistant',
                        [style['chat-messages__item--user']]: message.role === 'user',
                    })}
                >
                    <div className={style['chat-messages__bubble']}>{message.content}</div>
                </div>
            ))}
        </div>
    )
}

export default ChatMessages
