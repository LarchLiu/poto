import type { BasicSettings } from '@poto/types'

export const designerOptions: BasicSettings = {
  name: 'Designer',
  padding: [10, 10, 10, 10],
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
      colors: ['#00000000'],
      opacity: 1,
      degree: 45,
      gradient: true,
      url: '',
    },
  },
}

