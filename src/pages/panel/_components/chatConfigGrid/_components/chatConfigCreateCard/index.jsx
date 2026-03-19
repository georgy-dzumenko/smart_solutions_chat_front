import { useChatConfigEditorStore } from '@stores/chatConfigEditor'
import { useTranslations } from '@utils/i18n/useTranslations'

import style from './style.module.scss'

const ChatConfigCreateCard = () => {
    const openCreateModal = useChatConfigEditorStore((state) => state.openCreateModal)
    const t = useTranslations()

    return (
        <div className={style['chat-config-create-card']} onClick={openCreateModal}>
            <span className={style['chat-config-create-card__title']}>{t('ChatConfigsGrid.CreateCard.title')}</span>
        </div>
    )
}

export default ChatConfigCreateCard
