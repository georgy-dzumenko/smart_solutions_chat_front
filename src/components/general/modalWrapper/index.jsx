import { useEffect, useImperativeHandle, useState } from 'react'
import { createPortal } from 'react-dom'
import classNames from 'classnames'

import style from './style.module.scss'

export const ModalWrapper = (props) => {
    const { children, withCloseButton, onClose, onOpen, ref, className } = props
    const [isOpened, setIsOpened] = useState()

    const [mounted, setMounted] = useState(false)

    useEffect(() => setMounted(true), [])

    useEffect(() => {
        if (isOpened) {
            document?.body?.style?.setProperty?.('overflow', 'hidden')
        } else {
            document?.body?.style?.setProperty?.('overflow', 'auto')
        }
    }, [isOpened])

    useImperativeHandle(
        ref,
        () => ({
            open: () => {
                if (onOpen) onOpen()
                setIsOpened(true)
            },
            close: () => {
                if (onClose) onClose()
                setIsOpened(false)
            },
        }),
        []
    )

    const onOutsideClick = () => {
        ref.current?.close()
    }

    const onContentClick = (event) => event.stopPropagation()

    const onCloseButtonClick = (event) => {
        event.stopPropagation()
        ref.current?.close()
    }

    return mounted
        ? createPortal(
              <aside onClick={onOutsideClick} className={classNames(style['modal'], className)} data-opened={isOpened}>
                  <div className={classNames(style['modal__content'])} onClick={onContentClick}>
                      {children}
                  </div>
                  <div className={classNames(style['modal__actions'])}>
                      {withCloseButton ? (
                          <button onClick={onCloseButtonClick} className={classNames(style['modal__close'])} />
                      ) : null}
                  </div>
              </aside>,
              document?.body
          )
        : null
}
