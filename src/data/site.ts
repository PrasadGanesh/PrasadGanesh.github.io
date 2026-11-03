export const site = {
  name: 'Ganesh Prasad',
  title: 'Ganesh Prasad: Data and backend engineer',
  description:
    'Data and backend engineer. I build data platforms and backend systems in Python, Spark, and Airflow, and I lead the teams that build them.',
  ogTitle: 'Ganesh Prasad: Data and backend engineer who leads',
  ogDescription:
    'I own a data platform that handles millions of sensor readings a day, and I spent 3.5 years before that building Python backends.',
  email: 'ganeshprasad227@gmail.com',
  linkedin: 'https://www.linkedin.com/in/ganesh-prasad/',
  github: 'https://github.com/PrasadGanesh',
  medium: 'https://ganeshprasad227.medium.com/',
  resume:
    'https://drive.google.com/file/d/15hS3R7N3NwGuQ6dq1THi9Q5rEtmKaW_3/view?usp=sharing',
} as const;

export const nav = [
  { href: '/#work', label: 'Work' },
  { href: '/#lead', label: 'Leading' },
  { href: '/#writing', label: 'Writing' },
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
