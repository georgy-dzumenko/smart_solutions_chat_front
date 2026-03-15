'use client'

import classNames from 'classnames'

import style from './style.module.scss'

const ChatConfigEditorField = ({
    label,
    value,
    onChange,
    placeholder,
    textarea = false,
    rows = 4,
    type = 'text',
    checked,
    error,
}) => {
    if (type === 'checkbox') {
        return (
            <div className={style['chat-config-editor-field']}>
                <label className={style['chat-config-editor-field__checkbox-label']}>
                    <input
                        type="checkbox"
                        checked={checked}
                        onChange={onChange}
                        className={style['chat-config-editor-field__checkbox']}
                    />
                    <span>{label}</span>
                </label>
            </div>
        )
    }

    return (
        <div className={style['chat-config-editor-field']}>
            <label className={style['chat-config-editor-field__label']}>{label}</label>

            {textarea ? (
                <textarea
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    rows={rows}
                    className={classNames(
                        style['chat-config-editor-field__control'],
                        style['chat-config-editor-field__textarea'],
                        {
                            [style['chat-config-editor-field__control--error']]: !!error,
                        }
                    )}
                />
            ) : (
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={classNames(style['chat-config-editor-field__control'], {
                        [style['chat-config-editor-field__control--error']]: !!error,
                    })}
                />
            )}

            {error ? <div className={style['chat-config-editor-field__error']}>{error}</div> : null}
        </div>
    )
}

export default ChatConfigEditorField
