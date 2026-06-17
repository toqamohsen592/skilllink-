const SIGNUP_DRAFT_KEY = 'skilllink_signup_draft'

export function getSignupDraft() {
  try {
    return JSON.parse(sessionStorage.getItem(SIGNUP_DRAFT_KEY) || 'null')
  } catch {
    return null
  }
}

export function saveSignupDraft(data) {
  const current = getSignupDraft() || {}
  sessionStorage.setItem(SIGNUP_DRAFT_KEY, JSON.stringify({ ...current, ...data }))
}

export function clearSignupDraft() {
  sessionStorage.removeItem(SIGNUP_DRAFT_KEY)
}
