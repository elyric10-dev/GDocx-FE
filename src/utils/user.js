export function displayNameFromEmail(email) {
  if (!email) return 'User'
  const local = email.split('@')[0] || 'User'
  return local.charAt(0).toUpperCase() + local.slice(1)
}

export function initialFromEmail(email) {
  return email?.charAt(0).toUpperCase() || '?'
}
