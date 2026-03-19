import style from './style.module.scss'

const ChatConfigEditorSection = ({ title, description, children }) => {
    return (
        <section className={style['chat-config-editor-section']}>
            <div className={style['chat-config-editor-section__header']}>
                <h3 className={style['chat-config-editor-section__title']}>{title}</h3>
                {description ? <p className={style['chat-config-editor-section__description']}>{description}</p> : null}
            </div>

            <div className={style['chat-config-editor-section__content']}>{children}</div>
        </section>
    )
}

export default ChatConfigEditorSection
