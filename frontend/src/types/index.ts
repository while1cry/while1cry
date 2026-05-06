export interface Project {
  id: string
  title: string
  description: string
  url: string
  tags: string[]
}

export interface GalleryImage {
  id: string
  src: string
  thumbnail: string
  title?: string
  description?: string
}

export interface PlaylistTrack {
  id: string
  title: string
  artist: string
  cover?: string
  url?: string
}

export interface SocialLink {
  name: string
  url: string
  icon?: string
}
