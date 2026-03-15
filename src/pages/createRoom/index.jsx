'use client'

import { useEffect, useRef, useState } from 'react'

import { useTranslations } from '@utils/i18n/useTranslations'

import { useAuthStore } from '@stores/auth'

import ChatConfigEditorModal from './_components/chatConfigEditor'
import ChatConfigsGrid from './_components/chatConfigGrid'

import style from './style.module.scss'

const CreateRoomPage = () => {
    const modalRef = useRef(null)

    const t = useTranslations()

    const [configs, setConfigs] = useState([])

    const fetchWithAuth = useAuthStore((state) => state.fetchWithAuth)

    const loadConfigs = async () => {
        try {
            const response = await fetchWithAuth({
                method: 'get',
                url: '/chat-configs',
            })

            setConfigs(response.data.configs || [])
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        loadConfigs()
    }, [])

    return (
        <div className={style['chat-configs']}>
            {!configs?.length ? (
                <div className={style['chat-configs__content']}>
                    <h3 className={style['chat-configs__title']}>{t('ChatConfigsGrid.Empty.title')}</h3>

                    <p className={style['chat-configs__description']}>{t('ChatConfigsGrid.Empty.description')}</p>
                </div>
            ) : (
                <div className={style['chat-configs__content']}>
                    <h3 className={style['chat-configs__title']}>{t('ChatConfigsGrid.title')}</h3>

                    <p className={style['chat-configs__description']}>{t('ChatConfigsGrid.description')}</p>
                </div>
            )}
            <ChatConfigsGrid configs={configs} />
            <ChatConfigEditorModal ref={modalRef} />
        </div>
    )
}

export default CreateRoomPage
