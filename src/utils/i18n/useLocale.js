import React, { useContext } from 'react'
import { LocalizationContext } from '@components/general/localizationProvider'

const useLocale = () => {
    const { locale } = useContext(LocalizationContext)

    return locale
}

export default useLocale
