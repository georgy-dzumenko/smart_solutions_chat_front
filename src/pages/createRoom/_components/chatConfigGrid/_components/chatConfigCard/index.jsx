'use client'

import classNames from 'classnames'
import { useNavigate } from 'react-router-dom'

import { useTranslations } from '@utils/i18n/useTranslations'
import { useChatConfigEditorStore } from '@stores/chatConfigEditor'

import style from './style.module.scss'

const ChatConfigCard = ({ config = {} }) => {
    const t = useTranslations()
    const navigate = useNavigate()

    const openEditModal = useChatConfigEditorStore((state) => state.openEditModal)

    const handleCardClick = () => {
        navigate(`/summary/${config.id}`)
    }

    const handleEditClick = async (event) => {
        event.stopPropagation()

        try {
            await openEditModal(config.id)
        } catch (error) {
            console.error(error)
        }
    }

    const handleCopyClick = async (event) => {
        event.stopPropagation()

        if (!config.public_url) return

        try {
            await navigator.clipboard.writeText(config.public_url)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <article className={style['chat-config-card']} onClick={handleCardClick} role="button" tabIndex={0}>
            <div className={style['chat-config-card__header']}>
                <div className={style['chat-config-card__title-wrap']}>
                    <h3 className={style['chat-config-card__title']}>{config.title}</h3>

                    <div
                        className={classNames(style['chat-config-card__status'], {
                            [style['chat-config-card__status--active']]: config.is_active,
                            [style['chat-config-card__status--inactive']]: !config.is_active,
                        })}
                    >
                        {config.is_active
                            ? t('ChatConfigsGrid.Card.statusActive')
                            : t('ChatConfigsGrid.Card.statusInactive')}
                    </div>
                </div>
            </div>

            <div className={style['chat-config-card__body']}>
                <div className={style['chat-config-card__block']}>
                    <div className={style['chat-config-card__label']}>{t('ChatConfigsGrid.Card.topic')}</div>
                    <p className={style['chat-config-card__text']}>{config.topic}</p>
                </div>

                <div className={style['chat-config-card__block']}>
                    <div className={style['chat-config-card__label']}>{t('ChatConfigsGrid.Card.goal')}</div>
                    <p className={style['chat-config-card__text']}>{config.goal}</p>
                </div>

                <div className={style['chat-config-card__meta']}>
                    <div className={style['chat-config-card__meta-item']}>
                        <span className={style['chat-config-card__meta-label']}>{t('ChatConfigsGrid.Card.slug')}</span>
                        <span className={style['chat-config-card__meta-value']}>{config.slug}</span>
                    </div>

                    <div className={style['chat-config-card__meta-item']}>
                        <span className={style['chat-config-card__meta-label']}>
                            {t('ChatConfigsGrid.Card.createdAt')}
                        </span>
                        <span className={style['chat-config-card__meta-value']}>
                            {config.created_at ? new Date(config.created_at).toLocaleDateString() : '—'}
                        </span>
                    </div>
                </div>

                {config.public_url ? (
                    <div className={style['chat-config-card__link-block']}>
                        <div className={style['chat-config-card__label']}>{t('ChatConfigsGrid.Card.publicLink')}</div>

                        <div className={style['chat-config-card__link-row']}>
                            <input
                                readOnly
                                value={config.public_url}
                                className={style['chat-config-card__link-input']}
                                onClick={(event) => event.stopPropagation()}
                            />

                            <button
                                type="button"
                                className={style['chat-config-card__secondary-button']}
                                onClick={handleCopyClick}
                            >
                                {t('ChatConfigsGrid.Card.copy')}
                            </button>
                        </div>
                    </div>
                ) : null}
            </div>

            <div className={style['chat-config-card__actions']}>
                <button type="button" className={style['chat-config-card__edit-button']} onClick={handleEditClick} />
            </div>
        </article>
    )
}

export default ChatConfigCard
