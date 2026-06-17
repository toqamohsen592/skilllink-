const STUDENT_PROFILE_KEY = 'skilllink_student_profile'
const CLIENT_PROFILE_KEY = 'skilllink_client_profile'

function read(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function write(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

export function getLocalStudentProfile() {
  return read(STUDENT_PROFILE_KEY)
}

export function saveLocalStudentProfile(data) {
  write(STUDENT_PROFILE_KEY, data)
}

export function getLocalClientProfile() {
  return read(CLIENT_PROFILE_KEY)
}

export function saveLocalClientProfile(data) {
  write(CLIENT_PROFILE_KEY, data)
}

export function applyLocalStudentProfile(component) {
  const local = getLocalStudentProfile()
  if (!local) return false
  if (local.accountData) component.accountData = { ...component.accountData, ...local.accountData }
  if (local.profileData) component.profileData = { ...component.profileData, ...local.profileData }
  if (local.profilePhoto) component.profilePhoto = local.profilePhoto
  return true
}

export function applyLocalClientProfile(component) {
  const local = getLocalClientProfile()
  if (!local) return false
  if (local.accountData) component.accountData = { ...component.accountData, ...local.accountData }
  if (local.profileData) component.profileData = { ...component.profileData, ...local.profileData }
  if (local.profilePhoto) component.profilePhoto = local.profilePhoto
  return true
}

export function localStudentToProfileView(local) {
  if (!local?.profileData) return null
  const p = local.profileData
  const normalizeSkills = (skills) => {
    if (Array.isArray(skills)) return skills
    if (typeof skills === 'string' && skills.trim()) {
      return skills.split(',').map(s => s.trim()).filter(Boolean)
    }
    return []
  }
  return {
    full_name: p.fullName || '',
    title: p.major || '',
    bio: p.bio || '',
    email: local.accountData?.email || '',
    phone: local.securityData?.recoveryPhone || '',
    location: p.location || '',
    university: p.university || '',
    major: p.major || '',
    skills: normalizeSkills(p.skills),
    reviews: [],
    rating: 0,
    review_count: 0,
    profile_picture: local.profilePhoto || '',
    socials: p.socials || {}
  }
}

export function localClientToProfileView(local) {
  if (!local?.profileData) return null
  const p = local.profileData
  return {
    full_name: p.fullName || '',
    title: local.accountData?.accountType || 'Business Owner',
    bio: p.bio || '',
    email: local.accountData?.email || '',
    phone: local.securityData?.recoveryPhone || '',
    location: p.location || '',
    company_name: p.companyName || '',
    industry: p.industry || '',
    website: p.website || '',
    company_description: p.bio || '',
    account_type: local.accountData?.accountType || 'Business Owner',
    skills: Array.isArray(p.skills) ? p.skills : [],
    reviews: [],
    rating: 0,
    review_count: 0,
    profile_picture: local.profilePhoto || '',
    socials: {}
  }
}
