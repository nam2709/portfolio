export const fallbackLng = "vi"
export const languages = [fallbackLng, , "en"]
export const defaultNS = "translation"

export function getOptions(lng = fallbackLng, ns = defaultNS) {
  return {
    supportedLngs: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns
  }
}
