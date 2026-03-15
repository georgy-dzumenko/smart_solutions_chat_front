import { IntlMessageFormat } from 'intl-messageformat'

import useMessages from './useMessages'

const createLocalizationHandler =
    (prefix, messages) =>
    (key, variables, fallbackValue = null) => {
        const fullKey = (prefix ? prefix + '.' : '') + key
        const keyArr = fullKey.split('.')

        const value = keyArr.reduce((prev, cur) => prev?.[cur], messages)

        return new IntlMessageFormat(value || (fallbackValue !== null ? fallbackValue : fullKey)).format(
            variables || {}
        )
    }

export const useTranslations = (prefix = '') => {
    const messages = useMessages()

    return createLocalizationHandler(prefix, messages)
}
