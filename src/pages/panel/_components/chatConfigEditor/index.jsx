import { forwardRef, useEffect, useRef } from 'react'
import classNames from 'classnames'

import { ModalWrapper } from '@components/general/modalWrapper'
import { useChatConfigEditorStore } from '@stores/chatConfigEditor'
import ChatConfigEditorForm from './_components/chatConfigEditorForm'

import style from './style.module.scss'

const ChatConfigEditorModal = (props) => {
    const isOpened = useChatConfigEditorStore((state) => state.isOpened)
    const closeModal = useChatConfigEditorStore((state) => state.closeModal)

    const modalRef = useRef()

    useEffect(() => {
        // if (!ref?.current) return

        if (isOpened) {
            modalRef.current.open()
        } else {
            modalRef.current.close()
        }
    }, [isOpened])

    return (
        <ModalWrapper
            ref={modalRef}
            withCloseButton
            onClose={closeModal}
            className={classNames(style['chat-config-editor-modal'])}
        >
            <ChatConfigEditorForm />
        </ModalWrapper>
    )
}

ChatConfigEditorModal.displayName = 'ChatConfigEditorModal'

export default ChatConfigEditorModal
