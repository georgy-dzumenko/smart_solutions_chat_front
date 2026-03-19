import { useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import classNames from 'classnames'

import { useTranslations } from '@utils/i18n/useTranslations'
import { usePanelResultsStore } from '@stores/panelResults'

import style from './style.module.scss'

const ConfigSummaryPage = () => {
    const t = useTranslations()
    const navigate = useNavigate()
    const params = useParams()

    const configId = params.configId || null

    const rows = usePanelResultsStore((state) => state.rows)
    const isLoading = usePanelResultsStore((state) => state.isLoading)
    const error = usePanelResultsStore((state) => state.error)
    const loadResults = usePanelResultsStore((state) => state.loadResults)
    const reset = usePanelResultsStore((state) => state.reset)

    useEffect(() => {
        loadResults(configId).catch(console.error)

        return () => {
            reset()
        }
    }, [configId, loadResults, reset])

    const isEmpty = useMemo(() => !rows.length && !isLoading, [rows, isLoading])

    const handleRowClick = (sessionId) => {
        navigate(`/panel/${configId}/${sessionId}`)
    }

    const handleBackClick = () => {
        navigate('/panel')
    }

    return (
        <div className={style['panel-page']}>
            <div className={style['panel-page__container']}>
                <button type="button" onClick={handleBackClick} className={style['panel-page__back-button']}>
                    {t('PanelSession.back')}
                </button>
                <div className={style['panel-page__header']}>
                    <div className={style['panel-page__header-texts']}>
                        <h1 className={style['panel-page__title']}>{t('Panel.title')}</h1>

                        <p className={style['panel-page__description']}>
                            {configId ? t('Panel.descriptionByConfig') : t('Panel.descriptionAll')}
                        </p>
                    </div>
                </div>

                {error ? <div className={style['panel-page__error']}>{error}</div> : null}

                {isLoading ? <div className={style['panel-page__state']}>{t('Panel.loading')}</div> : null}

                {isEmpty ? (
                    <div className={style['panel-page__empty']}>
                        <h3 className={style['panel-page__empty-title']}>{t('Panel.emptyTitle')}</h3>

                        <p className={style['panel-page__empty-description']}>{t('Panel.emptyDescription')}</p>
                    </div>
                ) : null}

                {!isLoading && rows.length ? (
                    <div className={style['panel-table']}>
                        <div className={style['panel-table__head']}>
                            <div className={style['panel-table__row']}>
                                <div
                                    className={classNames(
                                        style['panel-table__cell'],
                                        style['panel-table__cell--session']
                                    )}
                                >
                                    {t('Panel.columns.sessionId')}
                                </div>
                                <div
                                    className={classNames(
                                        style['panel-table__cell'],
                                        style['panel-table__cell--status']
                                    )}
                                >
                                    {t('Panel.columns.status')}
                                </div>
                                <div
                                    className={classNames(
                                        style['panel-table__cell'],
                                        style['panel-table__cell--summary']
                                    )}
                                >
                                    {t('Panel.columns.summary')}
                                </div>
                                <div
                                    className={classNames(
                                        style['panel-table__cell'],
                                        style['panel-table__cell--result']
                                    )}
                                >
                                    {t('Panel.columns.result')}
                                </div>
                                <div
                                    className={classNames(
                                        style['panel-table__cell'],
                                        style['panel-table__cell--created']
                                    )}
                                >
                                    {t('Panel.columns.createdAt')}
                                </div>
                            </div>
                        </div>

                        <div className={style['panel-table__body']}>
                            {rows.map((row) => (
                                <button
                                    key={row.session_id || row.id}
                                    type="button"
                                    className={style['panel-table__row']}
                                    onClick={() => handleRowClick(row.session_id || row.id)}
                                >
                                    <div
                                        className={classNames(
                                            style['panel-table__cell'],
                                            style['panel-table__cell--session']
                                        )}
                                    >
                                        {row.session_id || row.id}
                                    </div>

                                    <div
                                        className={classNames(
                                            style['panel-table__cell'],
                                            style['panel-table__cell--status']
                                        )}
                                    >
                                        <span
                                            className={classNames(style['panel-table__status'], {
                                                [style['panel-table__status--active']]: row.status === 'active',
                                                [style['panel-table__status--completed']]: row.status === 'completed',
                                            })}
                                        >
                                            {row.status || '—'}
                                        </span>
                                    </div>

                                    <div
                                        className={classNames(
                                            style['panel-table__cell'],
                                            style['panel-table__cell--summary']
                                        )}
                                    >
                                        {row.summary || '—'}
                                    </div>

                                    <div
                                        className={classNames(
                                            style['panel-table__cell'],
                                            style['panel-table__cell--result']
                                        )}
                                    >
                                        {row.result || '—'}
                                    </div>

                                    <div
                                        className={classNames(
                                            style['panel-table__cell'],
                                            style['panel-table__cell--created']
                                        )}
                                    >
                                        {row.created_at ? new Date(row.created_at).toLocaleDateString() : '—'}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    )
}

export default ConfigSummaryPage
