'use client'

import ChatConfigCard from './_components/chatConfigCard'
import ChatConfigCreateCard from './_components/chatConfigCreateCard'

import style from './style.module.scss'

const ChatConfigsGrid = ({ configs = [] }) => {
    return (
        <div className={style['chat-configs-grid']}>
            <ChatConfigCreateCard />
            {configs.map((config) => (
                <ChatConfigCard key={config.id} config={config} />
            ))}
        </div>
    )
}

export default ChatConfigsGrid
