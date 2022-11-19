import type { BlockItem, BlockPluginSettings } from '@poto/types'
import en from '~/locales/en.json'
import zhCN from '~/locales/zh-CN.json'

interface Coach {
  name: string
  avatar?: string
}

export interface Player extends Coach {
  num: number
  goals?: number
  assists?: number
  yellowCards?: number
  redCard?: boolean
  subOn?: boolean
  subOff?: boolean
  score?: number
}

export interface Lineup {
  [key: string | number]: Player[]
  substitutes: Player[]
}

interface Team {
  name: string
  coach: Coach
  logo: string
  teamColor: string
  textColor: string
  lineup: Lineup
  formation: string
  goals: number
}

export interface Settings {
  showLineup: boolean
  showGoals: boolean
  teamRed: Team
  teamBlue: Team
  matchTime?: number
  matchStadium?: string
  curPlayer?: string
}
// @unocss-include
export const config: BlockItem = {
  author: '[alex](github.com/larchliu)',
  category: 'widget',
  icon: 'i-mdi-soccer-field',
  blockType: __BLOCK_TYPE__,
  options: {
    // basic options
    name: 'Soccer Formations',
    padding: [0, 0, 0, 0],
    margin: [0, 0, 0, 0],
    border: {
      has: false,
      width: [1, 1, 1, 1],
      style: 'solid',
      radius: [0, 0, 0, 0],
      color: {
        type: 'single',
        options: {
          colors: ['#000000'],
          opacity: 1,
          degree: 45,
          gradient: true,
          url: '',
        },
      },
    },
    size: { width: 100, height: 100 },
    backgroundColor: {
      type: 'single',
      options: {
        colors: ['#ffffff'],
        opacity: 1,
        degree: 45,
        gradient: true,
        url: '',
      },
    },
    // component options
    matchSettings: {
      showLineup: true,
      showGoals: false,
      teamRed: {
        name: 'PSG',
        coach: {
          name: 'Christophe Galtier',
        },
        logo: 'https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg',
        teamColor: '#ef4444',
        textColor: '#fff',
        goals: 3,
        formation: '4-3-1-2',
        lineup: {
          0: [{ name: 'Donnarumma', num: 99 }],
          1: [{ name: 'Hakimi', num: 2 }, { name: 'Mukiele', num: 26 }, { name: 'Ramos', num: 4 }, { name: 'Mendes', num: 25 }],
          2: [{ name: 'Soler', num: 28 }, { name: 'Pereira', num: 15 }, { name: 'Verratti', num: 6 }],
          3: [{ name: 'Neymar', num: 10 }],
          4: [{
            name: 'Messi',
            num: 30,
            goals: 3,
            assists: 2,
            score: 10,
          },
          { name: 'Mbappe', num: 7 }],
          substitutes: [],
        },
      },
      teamBlue: {
        name: 'Auxerre',
        coach: {
          name: 'Christophe Pelissier',
        },
        logo: 'https://upload.wikimedia.org/wikipedia/en/5/51/AJAuxerreLogo.svg',
        teamColor: '#3b82f6',
        textColor: '#fff',
        goals: 1,
        formation: '5-3-2',
        lineup: {
          0: [{
            name: 'Messi',
            num: 10,
            yellowCards: 2,
            redCard: true,
            subOff: true,
            score: 5.6,
          }, { name: 'Messi', num: 10, score: 7.2, goals: 1 }],
          1: [{ name: 'Messi', num: 10 }, { name: 'Messi', num: 10 }, { name: 'Messi', num: 10 }],
          2: [{ name: 'Messi', num: 10 }, { name: 'Messi', num: 10 }, { name: 'Messi', num: 10 },
            { name: 'Messi', num: 10 }, { name: 'Messi', num: 10 }],
          3: [{ name: 'Messi', num: 10 }],
          substitutes: [],
        },
      },
    } as Settings,
  } as BlockPluginSettings,
}

export const i18nMessages = {
  'en': en,
  'zh-CN': zhCN,
}
