export const getPhoneFormat = (phone: string | undefined): string => {
  if (!phone) return '+### (###) ##-###' 

  const digits = phone.replace(/\D/g, '')
  
  if (digits.startsWith('373')) {
    return '+### (###) ##-###' 
  }
  if (digits.startsWith('7') || digits.startsWith('1')) {
    return '+# (###) ###-##-##' 
  }
  if (digits.startsWith('375')) {
    return '+### (##) ###-##-##' 
  }
  if (digits.startsWith('380')) {
    return '+### (##) ###-##-##' 
  }
  if (digits.startsWith('44') || digits.startsWith('49')) {
    return '+## (####) ######' 
  }

  
  return '+###############'
}
