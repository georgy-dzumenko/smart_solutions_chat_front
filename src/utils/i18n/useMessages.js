import { useContext } from 'react'
import { LocalizationContext } from '@components/general/localizationProvider'

const useMessages = () => {
    const { messages } = useContext(LocalizationContext)

    return messages
}

export default useMessages
