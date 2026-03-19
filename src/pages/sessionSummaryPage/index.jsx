'use client'

import { useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import classNames from 'classnames'

import { useTranslations } from '@utils/i18n/useTranslations'
import { usePanelSessionDetailsStore } from '@stores/panelSessionDetails'

import style from './style.module.scss'

const SessionSummaryPage = () => {
    const t = useTranslations()
    const navigate = useNavigate()
    const { configId, sessionId } = useParams()

    const report = usePanelSessionDetailsStore((state) => state.report)
    const isLoading = usePanelSessionDetailsStore((state) => state.isLoading)
    const error = usePanelSessionDetailsStore((state) => state.error)
    const messageOrder = usePanelSessionDetailsStore((state) => state.messageOrder)
    const messagesById = usePanelSessionDetailsStore((state) => state.messagesById)
    const loadSessionDetails = usePanelSessionDetailsStore((state) => state.loadSessionDetails)
    const reset = usePanelSessionDetailsStore((state) => state.reset)

    const messages = useMemo(() => {
        return messageOrder.map((id) => messagesById[id]).filter(Boolean)
    }, [messageOrder, messagesById])

    useEffect(() => {
        if (!sessionId) return

        loadSessionDetails(sessionId).catch(console.error)

        return () => {
            reset()
        }
    }, [sessionId, loadSessionDetails, reset])

    const handleBackClick = () => {
        if (configId) {
            navigate(`/panel/${configId}`)
            return
        }

        navigate('/panel')
    }

    return (
        <div className={style['panel-session-page']}>
            <div className={style['panel-session-page__container']}>
                <div className={style['panel-session-page__header']}>
                    <div className={style['panel-session-page__header-top']}>
                        <button
                            type="button"
                            onClick={handleBackClick}
                            className={style['panel-session-page__back-button']}
                        >
                            {t('PanelSession.back')}
                        </button>
                    </div>

                    <div className={style['panel-session-page__header-texts']}>
                        <h1 className={style['panel-session-page__title']}>{t('PanelSession.title')}</h1>

                        <p className={style['panel-session-page__description']}>{t('PanelSession.description')}</p>
                    </div>
                </div>

                {error ? <div className={style['panel-session-page__error']}>{error}</div> : null}

                {isLoading ? (
                    <div className={style['panel-session-page__state']}>{t('PanelSession.loading')}</div>
                ) : null}

                {!isLoading && report ? (
                    <>
                        <div className={style['panel-session-summary-grid']}>
                            <div className={style['panel-session-card']}>
                                <div className={style['panel-session-card__label']}>
                                    {t('PanelSession.fields.sessionId')}
                                </div>
                                <div className={style['panel-session-card__value']}>{report.session_id}</div>
                            </div>

                            <div className={style['panel-session-card']}>
                                <div className={style['panel-session-card__label']}>
                                    {t('PanelSession.fields.status')}
                                </div>
                                <div className={style['panel-session-card__value']}>
                                    <span
                                        className={classNames(style['panel-session-card__status'], {
                                            [style['panel-session-card__status--active']]: report.status === 'active',
                                            [style['panel-session-card__status--completed']]:
                                                report.status === 'completed',
                                        })}
                                    >
                                        {report.status}
                                    </span>
                                </div>
                            </div>

                            <div className={style['panel-session-card']}>
                                <div className={style['panel-session-card__label']}>
                                    {t('PanelSession.fields.configTitle')}
                                </div>
                                <div className={style['panel-session-card__value']}>{report.config_title || '—'}</div>
                            </div>

                            <div className={style['panel-session-card']}>
                                <div className={style['panel-session-card__label']}>
                                    {t('PanelSession.fields.topic')}
                                </div>
                                <div className={style['panel-session-card__value']}>{report.topic || '—'}</div>
                            </div>
                        </div>

                        <div className={style['panel-session-sections']}>
                            <section className={style['panel-session-section']}>
                                <h2 className={style['panel-session-section__title']}>
                                    {t('PanelSession.sections.summary')}
                                </h2>
                                <p className={style['panel-session-section__text']}>{report.summary || '—'}</p>
                            </section>

                            <section className={style['panel-session-section']}>
                                <h2 className={style['panel-session-section__title']}>
                                    {t('PanelSession.sections.result')}
                                </h2>
                                <p className={style['panel-session-section__text']}>{report.result || '—'}</p>
                            </section>

                            <section className={style['panel-session-section']}>
                                <h2 className={style['panel-session-section__title']}>
                                    {t('PanelSession.sections.clientProfile')}
                                </h2>
                                <p className={style['panel-session-section__text']}>{report.client_profile || '—'}</p>
                            </section>

                            <section className={style['panel-session-section']}>
                                <h2 className={style['panel-session-section__title']}>
                                    {t('PanelSession.sections.recommendation')}
                                </h2>
                                <p className={style['panel-session-section__text']}>{report.recommendation || '—'}</p>
                            </section>
                        </div>

                        <section className={style['panel-session-history']}>
                            <h2 className={style['panel-session-history__title']}>
                                {t('PanelSession.sections.history')}
                            </h2>

                            <div className={style['panel-session-history__messages']}>
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={classNames(style['panel-session-history__item'], {
                                            [style['panel-session-history__item--assistant']]:
                                                message.role === 'assistant',
                                            [style['panel-session-history__item--user']]: message.role === 'user',
                                        })}
                                    >
                                        <div className={style['panel-session-history__meta']}>
                                            <span className={style['panel-session-history__role']}>{message.role}</span>
                                            <span className={style['panel-session-history__date']}>
                                                {message.created_at
                                                    ? new Date(message.created_at).toLocaleString()
                                                    : '—'}
                                            </span>
                                        </div>

                                        <div className={style['panel-session-history__content']}>{message.content}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </>
                ) : null}
            </div>
        </div>
    )
}

export default SessionSummaryPage
