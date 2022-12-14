import en from '~/locales/en.json'
import zhCN from '~/locales/zh-CN.json'
import PText from '~/components/Widgets/PText.vue'
import Group from '~/components/Widgets/Group.vue'
import List from '~/components/Widgets/List.vue'
import Markdown from '~/components/Widgets/Markdown.vue'
import PImage from '~/components/Widgets/PImage.vue'
import Divider from '~/components/Widgets/Divider.vue'
import PTextSetting from '~/components/Settings/PTextSetting.vue'
import GroupSetting from '~/components/Settings/GroupSetting.vue'
import PImageSetting from '~/components/Settings/PImageSetting.vue'
import DividerSetting from '~/components/Settings/DividerSetting.vue'
import { BlockType } from '~/types'
import type { BlockInfo, BlockItem, DividerSettings, Shadow, TextSettings } from '~/types'

// @unocss-include
export const TextConfig: BlockItem = {
  category: 'widget',
  icon: 'i-fluent-text-case-title-16-regular',
  blockType: BlockType.Text,
  options: {
    // basic options
    name: 'Text',
    padding: [0, 0, 0, 0],
    margin: [0, 0, 0, 0],
    border: {
      has: false,
      width: [0, 0, 0, 0],
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
    text: 'Text',
    font: {
      size: '1em',
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
      weight: 400,
      style: 'normal',
      decoration: 'none',
    },
    align: 'left',
  } as TextSettings,
}

export const GroupConfig: BlockItem = {
  category: 'group',
  icon: 'i-iconoir-square',
  blockType: BlockType.Group,
  options: {
    // basic options
    name: 'Group',
    padding: [0, 0, 0, 0],
    margin: [0, 0, 0, 0],
    border: {
      has: false,
      width: [0, 0, 0, 0],
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
    list: [],
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
    containerType: 'flex',
    flex: {
      display: 'flex',
      direction: 'row',
      wrap: 'wrap',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      grow: 1,
      shrink: 0,
      basis: 0,
    },
  },
}

export const ListConfig: BlockItem = {
  category: 'group',
  icon: 'i-iconoir-table-rows',
  blockType: BlockType.List,
  options: {
    // basic options
    name: 'List',
    padding: [0, 0, 0, 0],
    margin: [0, 0, 0, 0],
    border: {
      has: false,
      width: [0, 0, 0, 0],
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
    list: [],
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
    sourceData: {
      enable: true,
      actionId: '',
      transformer: {
        enable: false,
        rawData: 'return data',
      },
    },
    // component options
    containerType: 'flex',
    flex: {
      display: 'flex',
      direction: 'row',
      wrap: 'wrap',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      grow: 1,
      shrink: 0,
      basis: 0,
    },
  },
}

export const Columns2Config: BlockItem = {
  category: 'group',
  icon: 'i-iconoir-view-columns-2',
  blockType: BlockType.Columns2,
  options: {
    // basic options
    name: '2 Columns Group',
    padding: [0, 0, 0, 0],
    margin: [0, 0, 0, 0],
    border: {
      has: false,
      width: [0, 0, 0, 0],
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
    list: [GroupConfig, GroupConfig],
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
    containerType: 'flex',
    flex: {
      display: 'flex',
      direction: 'row',
      wrap: 'wrap',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      grow: 1,
      shrink: 0,
      basis: 50,
    },
  },
}

export const Columns3Config: BlockItem = {
  category: 'group',
  icon: 'i-iconoir-view-columns-3',
  blockType: BlockType.Columns3,
  options: {
    // basic options
    name: '3 Columns Group',
    padding: [0, 0, 0, 0],
    margin: [0, 0, 0, 0],
    border: {
      has: false,
      width: [0, 0, 0, 0],
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
    list: [GroupConfig, GroupConfig, GroupConfig],
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
    containerType: 'flex',
    flex: {
      display: 'flex',
      direction: 'row',
      wrap: 'wrap',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      grow: 1,
      shrink: 0,
      basis: 33.3,
    },
  },
}

export const TitleConfig: BlockItem = {
  category: 'widget',
  icon: 'i-iconoir-text',
  blockType: BlockType.Title,
  options: {
    // basic options
    name: 'Title',
    padding: [0, 0, 0, 0],
    margin: [0, 0, 0, 0],
    border: {
      has: false,
      width: [0, 0, 0, 0],
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
    text: 'Hello World!',
    font: {
      size: '2em',
      color: {
        type: 'colorful',
        options: {
          colors: ['#54c8faff', '#be1cfaff'],
          opacity: 1,
          degree: 45,
          gradient: true,
          url: '',
        },
      },
      weight: 500,
      style: 'normal',
      decoration: 'none',
    },
    align: 'left',
  } as TextSettings,
}

export const MarkdownConfig: BlockItem = {
  category: 'widget',
  icon: 'i-fluent-markdown-20-regular',
  blockType: BlockType.Markdown,
  options: {
    // basic options
    name: 'Markdown',
    padding: [0, 0, 0, 0],
    margin: [0, 0, 0, 0],
    border: {
      has: false,
      width: [0, 0, 0, 0],
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
    text: 'Markdown',
    font: {
      size: '1em',
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
      weight: 400,
      style: 'normal',
      decoration: 'none',
    },
    align: 'left',
  } as TextSettings,
}

export const PImageConfig: BlockItem = {
  category: 'widget',
  icon: 'i-carbon-image',
  blockType: BlockType.Image,
  options: {
    // basic options
    name: 'Image',
    padding: [0, 0, 0, 0],
    margin: [0, 0, 0, 0],
    border: {
      has: false,
      width: [0, 0, 0, 0],
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
    sourceData: {
      enable: true,
      actionId: '',
      transformer: {
        enable: false,
        rawData: 'return data',
      },
    },
    // component options
    src: '',
    fit: 'contain',
  },
}

export const DividerConfig: BlockItem = {
  category: 'widget',
  icon: 'i-radix-icons-divider-horizontal',
  blockType: BlockType.Div,
  options: {
    // basic options
    name: 'Divider',
    padding: [0, 0, 0, 0],
    margin: [8, 0, 8, 0],
    border: {
      has: true,
      width: [1, 0, 0, 0],
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
    direction: 'horizontal',
    height: '',
  } as DividerSettings,
}

export const BlockBasics: BlockInfo = {
  [BlockType.Text]: { blockView: PText, settingsView: PTextSetting, config: TextConfig },
  [BlockType.Title]: { blockView: PText, settingsView: PTextSetting, config: TitleConfig },
  [BlockType.Markdown]: { blockView: Markdown, settingsView: PTextSetting, config: MarkdownConfig },
  [BlockType.Group]: { blockView: Group, settingsView: GroupSetting, config: GroupConfig },
  [BlockType.Columns2]: { blockView: Group, settingsView: GroupSetting, config: Columns2Config },
  [BlockType.Columns3]: { blockView: Group, settingsView: GroupSetting, config: Columns3Config },
  [BlockType.List]: { blockView: List, settingsView: GroupSetting, config: ListConfig },
  [BlockType.Div]: { blockView: Divider, settingsView: DividerSetting, config: DividerConfig },
  [BlockType.Image]: { blockView: PImage, settingsView: PImageSetting, config: PImageConfig },
}

export const MermaidTemplates = {
  flow: `graph TD
A[Christmas] -->|Get money| B(Go shopping)
B --> C{Let me think}
C -->|One| D[Laptop]
C -->|Two| E[iPhone]
C -->|Three| F[Cars]`,
  sequence: `sequenceDiagram
Alice->>John: Hello John, how are you?
loop Healthcheck
    John->>John: Fight against hypochondria
end
Note right of John: Rational thoughts!
John-->>Alice: Great!
John->>Bob: How about you?
Bob-->>John: Jolly good!`,
  class: `classDiagram
Class01 <|-- AveryLongClass : Cool
<<interface>> Class01
Class09 --> C2 : Where am i?
Class09 --* C3
Class09 --|> Class07
Class07 : equals()
Class07 : Object[] elementData
Class01 : size()
Class01 : int chimp
Class01 : int gorilla
class Class10 {
  <<service>>
  int id
  size()
}`,
  state: `stateDiagram
[*] --> Still
Still --> [*]
Still --> Moving
Moving --> Still
Moving --> Crash
Crash --> [*]`,
  gantt: `gantt
title A Gantt Diagram
dateFormat  YYYY-MM-DD
section Section
A task           :a1, 2014-01-01, 30d
Another task     :after a1  , 20d
section Another
Task in sec      :2014-01-12  , 12d
another task      : 24d`,
}

export const i18nMessages = {
  'en': en,
  'zh-CN': zhCN,
}

export const shadowBoxLow: Shadow[] = [
  {
    hOffset: 2,
    vOffset: 2,
    blur: 8,
    spead: 1,
    color: 'hsl(0deg 0% 63% / 0.2)',
  },
]

export const shadowBoxMedium: Shadow[] = [
  {
    hOffset: 4,
    vOffset: 4,
    blur: 10,
    spead: 2,
    color: 'hsl(0deg 0% 63% / 0.2)',
  },
  {
    hOffset: -1,
    vOffset: 2,
    blur: 8,
    spead: 2,
    color: 'hsl(0deg 0% 63% / 0.1)',
  },
]

export const shadowBoxHigh: Shadow[] = [
  {
    hOffset: 8,
    vOffset: 8,
    blur: 16,
    spead: 4,
    color: 'hsl(0deg 0% 63% / 0.2)',
  },
  {
    hOffset: -2,
    vOffset: 2,
    blur: 8,
    spead: 4,
    color: 'hsl(0deg 0% 63% / 0.1)',
  },
]

export const shadowBoxElevation = {
  low: shadowBoxLow,
  medium: shadowBoxMedium,
  high: shadowBoxHigh,
}

export const shadowBoxMargin = {
  low: 10,
  medium: 14,
  high: 24,
}
