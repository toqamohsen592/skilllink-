export function splitFullName(fullName) {
  const parts = (fullName || '').trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return { first_name: '', last_name: '' }
  return {
    first_name: parts[0],
    last_name: parts.slice(1).join(' ') || parts[0]
  }
}

export function joinFullName(firstName, lastName, fallback = '') {
  const name = [firstName, lastName].filter(Boolean).join(' ').trim()
  return name || fallback
}

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || '{}')
  } catch {
    return {}
  }
}

export function mapStudentProfileFromApi(profileData, user = getStoredUser()) {
  const p = profileData || {}
  return {
    full_name: joinFullName(user.first_name, user.last_name, user.username || ''),
    title: p.speciality || p.college || '',
    bio: p.brief || '',
    email: user.email || '',
    phone: user.phone_number || '',
    location: p.address || '',
    university: p.university || '',
    major: p.college || '',
    skills: Array.isArray(p.skills) ? p.skills : [],
    reviews: p.reviews || [],
    rating: p.rating || 0,
    review_count: p.review_count || 0,
    profile_picture: p.profile_picture_url || p.profile_picture || '',
    socials: {
      linkedin: p.linkedin_url || '',
      github: p.github_url || '',
      behance: p.behance_url || '',
      website: p.website || ''
    }
  }
}

export function normalizeSkillsList(skills) {
  if (Array.isArray(skills)) return skills.filter(Boolean)
  if (typeof skills === 'string' && skills.trim()) {
    return skills.split(',').map(s => s.trim()).filter(Boolean)
  }
  return []
}

export function mapStudentProfileToApi(form) {
  const { first_name, last_name } = splitFullName(form.fullName)
  return {
    first_name,
    last_name,
    university: form.university || undefined,
    college: form.major || undefined,
    brief: form.bio || undefined,
    skills: normalizeSkillsList(form.skills)
  }
}

export function mapSignupDraftToApi(draft = {}) {
  const firstName = draft.firstName || ''
  const lastName = draft.lastName || ''
  const payload = {
    first_name: firstName || undefined,
    last_name: lastName || undefined,
    address: draft.address || undefined,
    brief: draft.bio || undefined,
    university: draft.university || undefined,
    college: draft.college || draft.major || undefined,
    speciality: draft.category || undefined,
    skills: normalizeSkillsList(draft.skills),
    linkedin_url: draft.linkedin || undefined,
    github_url: draft.github || undefined,
    behance_url: draft.behance || undefined
  }
  return Object.fromEntries(Object.entries(payload).filter(([, v]) => v !== undefined && v !== ''))
}

export function mapSignupDraftToLocalProfile(draft = {}) {
  const user = getStoredUser()
  const fullName = joinFullName(draft.firstName, draft.lastName, user.username || '')
  return {
    accountData: {
      email: draft.email || user.email || '',
      username: draft.username || user.username || fullName,
      accountType: 'Student'
    },
    profileData: {
      fullName,
      bio: draft.bio || '',
      location: draft.address || '',
      university: draft.university || '',
      major: draft.college || draft.major || '',
      skills: normalizeSkillsList(draft.skills),
      socials: {
        linkedin: draft.linkedin || '',
        github: draft.github || '',
        behance: draft.behance || ''
      }
    },
    profilePhoto: draft.profilePhoto || '',
    securityData: {
      recoveryEmail: draft.email || user.email || '',
      recoveryPhone: draft.phone || user.phone_number || ''
    }
  }
}

export function mergeProfileViews(apiProfile, localProfile) {
  if (!localProfile) return apiProfile
  if (!apiProfile) return localProfile
  const merged = { ...apiProfile }
  const fillIfEmpty = (key) => {
    const apiVal = merged[key]
    const localVal = localProfile[key]
    if (Array.isArray(apiVal) && !apiVal.length && Array.isArray(localVal) && localVal.length) {
      merged[key] = localVal
    } else if (!apiVal && localVal) {
      merged[key] = localVal
    }
  }
  ;['full_name', 'title', 'bio', 'email', 'phone', 'location', 'university', 'major', 'profile_picture'].forEach(fillIfEmpty)
  fillIfEmpty('skills')
  if (localProfile.socials) {
    merged.socials = { ...localProfile.socials, ...(merged.socials || {}) }
    Object.keys(merged.socials).forEach((key) => {
      if (!merged.socials[key] && localProfile.socials[key]) {
        merged.socials[key] = localProfile.socials[key]
      }
    })
  }
  return merged
}

export function mapStudentSettingsFromApi(profileData, user = getStoredUser()) {
  const mapped = mapStudentProfileFromApi(profileData, user)
  return {
    accountData: {
      email: mapped.email,
      username: user.username || mapped.full_name,
      accountType: 'Student'
    },
    profileData: {
      fullName: mapped.full_name,
      bio: mapped.bio,
      university: mapped.university,
      major: mapped.major,
      skills: mapped.skills
    },
    profilePhoto: mapped.profile_picture,
    securityData: {
      recoveryEmail: mapped.email,
      recoveryPhone: mapped.phone
    }
  }
}

export function mapClientProfileFromApi(data) {
  const p = data || {}
  return {
    full_name: joinFullName(p.first_name, p.last_name, p.username || ''),
    title: p.industry || 'Business Owner',
    bio: p.about || '',
    email: p.email || '',
    phone: p.phone_number || '',
    location: p.location || '',
    company_name: p.company_name || '',
    industry: p.industry || '',
    website: p.website || '',
    company_description: p.company_description || p.about || '',
    account_type: 'Business Owner',
    skills: Array.isArray(p.skills) ? p.skills : [],
    reviews: p.reviews || [],
    rating: p.rating || 0,
    review_count: p.review_count || 0,
    profile_picture: p.profile_picture_url || p.profile_picture || p.avatar || '',
    socials: {}
  }
}

export function mapClientProfileToApi(form) {
  const { first_name, last_name } = splitFullName(form.fullName)
  return {
    first_name,
    last_name,
    about: form.bio || undefined,
    company_name: form.companyName || undefined,
    industry: form.industry || undefined,
    website: form.website || undefined,
    location: form.location || undefined,
    skills: form.skills || []
  }
}

export function mapClientSettingsFromApi(data) {
  const mapped = mapClientProfileFromApi(data)
  return {
    accountData: {
      email: mapped.email,
      username: data?.username || mapped.full_name,
      accountType: 'Business Owner'
    },
    profileData: {
      fullName: mapped.full_name,
      bio: mapped.bio,
      companyName: mapped.company_name,
      industry: mapped.industry,
      website: mapped.website,
      location: mapped.location,
      skills: mapped.skills
    },
    profilePhoto: mapped.profile_picture,
    securityData: {
      recoveryEmail: mapped.email,
      recoveryPhone: mapped.phone
    }
  }
}

export function storeAuthSession(loginResponse, accountType) {
  const body = loginResponse?.data || {}
  const nested = body.data || body
  const token = nested.token || nested.access_token
  const account = nested.account || nested.user || {}
  if (!token) return false

  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify({
    ...account,
    user_type: accountType === 'client' ? 'client' : 'student',
    role: accountType === 'client' ? 'client' : 'student'
  }))
  return true
}
