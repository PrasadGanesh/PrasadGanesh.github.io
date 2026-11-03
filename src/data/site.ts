export const site = {
  name: 'Ganesh Prasad',
  title: 'Ganesh Prasad — Data engineer for solar and battery storage',
  description:
    'Ganesh Prasad is a data engineer for solar and battery storage at SmartHelio. He builds time-series platforms, fault and soiling detection, and AI agents.',
  email: 'ganeshprasad227@gmail.com',
  linkedin: 'https://www.linkedin.com/in/ganesh-prasad/',
  github: 'https://github.com/PrasadGanesh',
  medium: 'https://ganeshprasad227.medium.com',
  resume:
    'https://drive.google.com/file/d/15hS3R7N3NwGuQ6dq1THi9Q5rEtmKaW_3/view?usp=sharing',
  themeColor: '#10130c',
} as const;

export const nav = [
  { href: '/#work', label: 'What I do' },
  { href: '/#case-studies', label: 'Case studies' },
  { href: '/#live-demo', label: 'Live demo' },
  { href: '/#thinking', label: 'Thinking' },
  { href: '/#foundations', label: 'Foundations' },
  { href: '/#contact', label: 'Contact' },
] as const;

export const earlier = [
  {
    href: 'https://github.com/fluid-lab/Discovery-Cat',
    title: 'Discovery Cat',
    detail:
      'Google Summer of Code 2016. A game meant to be usable across age and disability, to help people discover their digital and learning preferences.',
  },
  {
    href: 'https://chrome.google.com/webstore/detail/fearch/kalmlbhhgndofalfencmggfncedfajgj',
    title: 'FEARCH',
    detail:
      'A Chrome extension that searches FTP servers for music, videos, books, and similar files (900+ active users).',
  },
  {
    href: '/blog/pages/referenceforcpalgo.html',
    title: 'cp-algorithms solution notes',
    detail: 'Practice-problem references for cp-algorithms.com.',
  },
] as const;
