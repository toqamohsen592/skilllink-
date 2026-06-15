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

export function mapStudentProfileToApi(form) {
  const { first_name, last_name } = splitFullName(form.fullName)
  return {
    first_name,
    last_name,
    university: form.university || undefined,
    college: form.major || undefined,
    brief: form.bio || undefined,
    skills: form.skills || []
  }
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
