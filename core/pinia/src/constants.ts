import type { DesignerSettings, DesignerTheme } from '@poto/types'

export const designerOptions: DesignerSettings = {
  name: 'Designer',
  padding: [10, 10, 10, 10],
  margin: [0, 0, 0, 0],
  border: {
    has: false,
    width: [0, 0, 0, 0],
    style: 'solid',
    radius: [0, 0, 0, 0],
    color: {
      type: 'single',
      options: {
        colors: ['#26162f'],
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
}

export const designerTheme: DesignerTheme = {
  elFontSize: 32,
  fontFamily: '',
  fontColor: '#220425',
  backgroundColor: '#ffffff',
  primaryColor: '#26162f',
}

