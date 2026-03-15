'use client'

import { useMemo, useState } from 'react'

import { useTranslations } from '@utils/i18n/useTranslations'
import { useChatConfigEditorStore } from '@stores/chatConfigEditor'

import ChatConfigEditorField from '../chatConfigEditorField'
import ChatConfigEditorSection from '../chatConfigEditorSection'

import style from './style.module.scss'

const ChatConfigEditorForm = () => {
    const t = useTranslations()

    const mode = useChatConfigEditorStore((state) => state.mode)
    const form = useChatConfigEditorStore((state) => state.form)
    const isLoading = useChatConfigEditorStore((state) => state.isLoading)
    const error = useChatConfigEditorStore((state) => state.error)
    const publicUrl = useChatConfigEditorStore((state) => state.publicUrl)

    const setField = useChatConfigEditorStore((state) => state.setField)
    const submit = useChatConfigEditorStore((state) => state.submit)
    const closeModal = useChatConfigEditorStore((state) => state.closeModal)
    const clearError = useChatConfigEditorStore((state) => state.clearError)

    const [fieldErrors, setFieldErrors] = useState({})

    const isEditMode = mode === 'edit'

    const title = useMemo(() => {
        return isEditMode ? t('ChatConfigEditor.Edit.title') : t('ChatConfigEditor.Create.title')
    }, [isEditMode, t])

    const validate = () => {
        const nextErrors = {}

        if (!form.title.trim()) nextErrors.title = t('ChatConfigEditor.Errors.required')
        if (!form.topic.trim()) nextErrors.topic = t('ChatConfigEditor.Errors.required')
        if (!form.assistantRole.trim()) nextErrors.assistantRole = t('ChatConfigEditor.Errors.required')
        if (!form.goal.trim()) nextErrors.goal = t('ChatConfigEditor.Errors.required')
        if (!form.rules.trim()) nextErrors.rules = t('ChatConfigEditor.Errors.required')
        if (!form.endConditions.trim()) nextErrors.endConditions = t('ChatConfigEditor.Errors.required')
        if (!form.farewellMessage.trim()) nextErrors.farewellMessage = t('ChatConfigEditor.Errors.required')
        if (!form.summaryInstructions.trim()) nextErrors.summaryInstructions = t('ChatConfigEditor.Errors.required')

        return nextErrors
    }

    const handleChange = (field) => (event) => {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value

        setField(field, value)

        if (fieldErrors[field]) {
            setFieldErrors((prev) => ({
                ...prev,
                [field]: '',
            }))
        }

        if (error) {
            clearError()
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        const nextErrors = validate()

        if (Object.keys(nextErrors).length > 0) {
            setFieldErrors(nextErrors)
            return
        }

        try {
            clearError()
            setFieldErrors({})
            await submit()
        } catch (submitError) {
            console.error(submitError)
        }
    }

    const handleCopyPublicUrl = async () => {
        if (!publicUrl) return

        try {
            await navigator.clipboard.writeText(publicUrl)
        } catch (copyError) {
            console.error(copyError)
        }
    }

    return (
        <div className={style['chat-config-editor']}>
            <div className={style['chat-config-editor__header']}>
                <div className={style['chat-config-editor__header-texts']}>
                    <h2 className={style['chat-config-editor__title']}>{title}</h2>
                    <p className={style['chat-config-editor__description']}>{t('ChatConfigEditor.description')}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className={style['chat-config-editor__form']}>
                <ChatConfigEditorSection
                    title={t('ChatConfigEditor.Sections.basic.title')}
                    description={t('ChatConfigEditor.Sections.basic.description')}
                >
                    <ChatConfigEditorField
                        label={t('ChatConfigEditor.Fields.title.label')}
                        value={form.title}
                        onChange={handleChange('title')}
                        placeholder={t('ChatConfigEditor.Fields.title.placeholder')}
                        error={fieldErrors.title}
                    />

                    <ChatConfigEditorField
                        label={t('ChatConfigEditor.Fields.topic.label')}
                        value={form.topic}
                        onChange={handleChange('topic')}
                        placeholder={t('ChatConfigEditor.Fields.topic.placeholder')}
                        textarea
                        rows={3}
                        error={fieldErrors.topic}
                    />

                    {isEditMode ? (
                        <ChatConfigEditorField
                            type="checkbox"
                            label={t('ChatConfigEditor.Fields.isActive.label')}
                            checked={form.isActive}
                            onChange={handleChange('isActive')}
                        />
                    ) : null}
                </ChatConfigEditorSection>

                <ChatConfigEditorSection
                    title={t('ChatConfigEditor.Sections.ai.title')}
                    description={t('ChatConfigEditor.Sections.ai.description')}
                >
                    <ChatConfigEditorField
                        label={t('ChatConfigEditor.Fields.assistantRole.label')}
                        value={form.assistantRole}
                        onChange={handleChange('assistantRole')}
                        placeholder={t('ChatConfigEditor.Fields.assistantRole.placeholder')}
                        textarea
                        rows={5}
                        error={fieldErrors.assistantRole}
                    />

                    <ChatConfigEditorField
                        label={t('ChatConfigEditor.Fields.goal.label')}
                        value={form.goal}
                        onChange={handleChange('goal')}
                        placeholder={t('ChatConfigEditor.Fields.goal.placeholder')}
                        textarea
                        rows={4}
                        error={fieldErrors.goal}
                    />

                    <ChatConfigEditorField
                        label={t('ChatConfigEditor.Fields.rules.label')}
                        value={form.rules}
                        onChange={handleChange('rules')}
                        placeholder={t('ChatConfigEditor.Fields.rules.placeholder')}
                        textarea
                        rows={5}
                        error={fieldErrors.rules}
                    />
                </ChatConfigEditorSection>

                <ChatConfigEditorSection
                    title={t('ChatConfigEditor.Sections.flow.title')}
                    description={t('ChatConfigEditor.Sections.flow.description')}
                >
                    <ChatConfigEditorField
                        label={t('ChatConfigEditor.Fields.endConditions.label')}
                        value={form.endConditions}
                        onChange={handleChange('endConditions')}
                        placeholder={t('ChatConfigEditor.Fields.endConditions.placeholder')}
                        textarea
                        rows={4}
                        error={fieldErrors.endConditions}
                    />

                    <ChatConfigEditorField
                        label={t('ChatConfigEditor.Fields.farewellMessage.label')}
                        value={form.farewellMessage}
                        onChange={handleChange('farewellMessage')}
                        placeholder={t('ChatConfigEditor.Fields.farewellMessage.placeholder')}
                        textarea
                        rows={3}
                        error={fieldErrors.farewellMessage}
                    />
                </ChatConfigEditorSection>

                <ChatConfigEditorSection
                    title={t('ChatConfigEditor.Sections.summary.title')}
                    description={t('ChatConfigEditor.Sections.summary.description')}
                >
                    <ChatConfigEditorField
                        label={t('ChatConfigEditor.Fields.summaryInstructions.label')}
                        value={form.summaryInstructions}
                        onChange={handleChange('summaryInstructions')}
                        placeholder={t('ChatConfigEditor.Fields.summaryInstructions.placeholder')}
                        textarea
                        rows={5}
                        error={fieldErrors.summaryInstructions}
                    />
                </ChatConfigEditorSection>

                {error ? <div className={style['chat-config-editor__server-error']}>{error}</div> : null}

                {publicUrl ? (
                    <div className={style['chat-config-editor__public-url-block']}>
                        <div className={style['chat-config-editor__public-url-label']}>
                            {t('ChatConfigEditor.publicUrl.label')}
                        </div>

                        <div className={style['chat-config-editor__public-url-row']}>
                            <input
                                className={style['chat-config-editor__public-url-input']}
                                readOnly
                                value={publicUrl}
                            />

                            <button
                                type="button"
                                onClick={handleCopyPublicUrl}
                                className={style['chat-config-editor__secondary-button']}
                            >
                                {t('ChatConfigEditor.publicUrl.copy')}
                            </button>
                        </div>
                    </div>
                ) : null}

                <div className={style['chat-config-editor__actions']}>
                    <button
                        type="button"
                        onClick={closeModal}
                        className={style['chat-config-editor__secondary-button']}
                        disabled={isLoading}
                    >
                        {t('ChatConfigEditor.Actions.cancel')}
                    </button>

                    <button type="submit" className={style['chat-config-editor__primary-button']} disabled={isLoading}>
                        {isLoading
                            ? t('ChatConfigEditor.Actions.loading')
                            : isEditMode
                              ? t('ChatConfigEditor.Actions.save')
                              : t('ChatConfigEditor.Actions.create')}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ChatConfigEditorForm
