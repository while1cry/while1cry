export interface SocialLink {
  name: string
  url: string
  icon: string
  handle?: string
}

export const socialLinks: SocialLink[] = [
  { name: 'GitHub', url: 'https://github.com/while1cry', icon: 'github' },
  { name: 'bilibili', url: 'https://space.bilibili.com/518110970', icon: 'bilibili' },
  { name: 'Discord', url: '', icon: 'discord', handle: 'while1cry' },
  { name: 'QQ', url: '', icon: 'qq', handle: '2369024124' },
  { name: 'Email', url: 'mailto:while1cry@proton.me', icon: 'email' },
]
