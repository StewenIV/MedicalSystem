export const getPhoneFormat = (phone: string | undefined): string => {
  if (!phone) return '+### (###) ##-###' // default to moldova or generic

  const digits = phone.replace(/\D/g, '')
  
  if (digits.startsWith('373')) {
    return '+### (###) ##-###' // Moldova
  }
  if (digits.startsWith('7') || digits.startsWith('1')) {
    return '+# (###) ###-##-##' // Russia, Kazakhstan, USA
  }
  if (digits.startsWith('375')) {
    return '+### (##) ###-##-##' // Belarus
  }
  if (digits.startsWith('380')) {
    return '+### (##) ###-##-##' // Ukraine
  }
  if (digits.startsWith('44') || digits.startsWith('49')) {
    return '+## (####) ######' // UK, Germany (generic)
  }

  // Fallback to max 15 digits without strict brackets
  return '+###############'
}
