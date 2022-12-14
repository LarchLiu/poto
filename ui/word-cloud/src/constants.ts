import type { BlockItem, BlockPluginSettings, EleColor } from '@poto/types'
import type WordCloud from './components/WordCloud'
import en from '~/locales/en.json'
import zhCN from '~/locales/zh-CN.json'

type WeightFactor = (size: number) => number
type ColorFactor = (word: string, weight: number) => string
type Origin = [number, number]
export interface Word {
  word: string
  weight: number
  repeat: number
  color?: string
  rotate?: number
}
export interface Settings {
  height: number // percent size of width
  gridSize: number
  fontFamily: string
  weightFactor: number | WeightFactor
  color: string | ColorFactor
  backgroundColor: string
  fontColor: EleColor
  minRotation: number
  maxRotation: number
  customRotations: number[]
  randomRotation: boolean
  rotateRatio: number
  rotationSteps: number
  origin: Origin | null
  clearCanvas: boolean
  ellipticity: number
  showMaskShape: boolean
  maskOpacity: number
  shape: 'cardioid' | 'diamond' | 'square' | 'triangle-forward' | 'triangle' | 'pentagon' | 'circle' | 'star'
  list: Word[]
  ratio: number
  run: boolean
  maskCanvas?: HTMLCanvasElement
  wordCloudInstance?: WordCloud
}
// @unocss-include
export const config: BlockItem = {
  author: '[timdream](https://https://github.com/timdream/wordcloud2.js)',
  category: 'widget',
  icon: 'i-carbon-word-cloud',
  blockType: __BLOCK_TYPE__,
  options: {
    // basic options
    name: 'Word Cloud',
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
    settings: {
      height: 65,
      gridSize: 4,
      fontFamily: 'Times, serif',
      weightFactor: 1,
      color: '',
      backgroundColor: '#fff',
      fontColor: {
        type: 'colorful',
        options: {
          colors: ['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51'],
          opacity: 1,
          degree: 45,
          gradient: true,
          url: '',
        },
      },
      minRotation: -Math.PI / 2,
      maxRotation: Math.PI / 2,
      rotateRatio: 0.5,
      rotationSteps: 0,
      customRotations: [90, 270, 45, 315],
      randomRotation: false,
      origin: null,
      clearCanvas: true,
      ellipticity: 0.65,
      shape: 'circle',
      showMaskShape: true,
      maskOpacity: 5,
      ratio: 1,
      run: false,
      list: [{ word: 'Poto', weight: 100, repeat: 1, rotate: 0, color: '#FF0000' },
        { word: 'Word Cloud', weight: 64, repeat: 1, rotate: 0, color: '#0000FF' },
        { word: 'Word', weight: 36, repeat: 10 },
        { word: 'Cloud', weight: 36, repeat: 10 },
        { word: 'Word', weight: 16, repeat: 100 },
        { word: 'Cloud', weight: 16, repeat: 100 },
        { word: 'Word', weight: 9, repeat: 100 },
        { word: 'Cloud', weight: 9, repeat: 100 },
        { word: 'Word', weight: 4, repeat: 100 },
        { word: 'Cloud', weight: 4, repeat: 100 },
        // { word: 'Word', weight: 1, repeat: 100 },
        // { word: 'Cloud', weight: 1, repeat: 100 },
      ],
    } as Settings,

  } as BlockPluginSettings,
}

export const i18nMessages = {
  'en': en,
  'zh-CN': zhCN,
}
