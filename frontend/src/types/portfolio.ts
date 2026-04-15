export interface PersonalInfo {
  name: string
  title: string
  subtitle: string
  bio: string
  email: string
  phone: string
  location: string
  github: string
  linkedin: string
  twitter: string
}

export interface Skill {
  id: string
  name: string
  level: number
  category: string
  icon: string
}

export interface Experience {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  current: boolean
  description: string
  technologies: string[]
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string
  description: string
}

export interface Project {
  id: string
  name: string
  description: string
  technologies: string[]
  github: string
  demo: string
  image: string
}

export interface PortfolioData {
  personal: PersonalInfo
  skills: Skill[]
  experience: Experience[]
  education: Education[]
  projects: Project[]
  photoBase64: string | null
  photoMimeType?: string | null
  cvBase64: string | null
  cvFileName: string | null
}
