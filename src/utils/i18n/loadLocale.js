const locales = {
    uk: () => import('./locales/uk.json'),
    en: () => import('./locales/en.json'),
}

export async function loadLocale(locale) {
    const loader = locales[locale]
    if (!loader) throw new Error(`Locale ${locale} not found`)
    return (await loader()).default
}
