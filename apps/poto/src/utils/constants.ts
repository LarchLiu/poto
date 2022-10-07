import type { Component } from 'vue'
import PText from '~/components/Widget/PText.vue'
import Group from '~/components/Widget/Group.vue'
import List from '~/components/Widget/List.vue'
import Markdown from '~/components/Widget/Markdown.vue'
import PTextSetting from '~/components/SettingPanel/WidgetSetting/PTextSetting.vue'
import GroupSetting from '~/components/SettingPanel/WidgetSetting/GroupSetting.vue'
import { BlockType } from '~/types'
import type { BasicSettings, Item, TextSettings } from '~/types'

// @unocss-include
export const TextConfig: Item = {
  type: 'widget',
  icon: 'i-fluent-text-case-title-16-regular',
  blockType: BlockType.Text,
  options: {
    // basic options
    name: 'Text',
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
        colors: ['#00000000'],
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
        },
      },
      weight: 400,
      style: 'normal',
      decoration: 'none',
    },
    align: 'left',
  } as TextSettings,
}

export const GroupConfig: Item = {
  type: 'group',
  icon: 'i-iconoir-square',
  blockType: BlockType.Group,
  options: {
    // basic options
    name: 'Group',
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
    list: [],
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

export const ListConfig: Item = {
  type: 'group',
  icon: 'i-iconoir-table-rows',
  blockType: BlockType.List,
  options: {
    // basic options
    name: 'List',
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
    list: [],
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

export const Columns2Config: Item = {
  type: 'group',
  icon: 'i-iconoir-view-columns-2',
  blockType: BlockType.Group,
  options: {
    // basic options
    name: '2 Columns Group',
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
    list: [GroupConfig, GroupConfig],
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

export const Columns3Config: Item = {
  type: 'group',
  icon: 'i-iconoir-view-columns-3',
  blockType: BlockType.Group,
  options: {
    // basic options
    name: '3 Columns Group',
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
    list: [GroupConfig, GroupConfig, GroupConfig],
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

export const TitleConfig: Item = {
  type: 'widget',
  icon: 'i-iconoir-text',
  blockType: BlockType.Title,
  options: {
    // basic options
    name: 'Title',
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
        colors: ['#00000000'],
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
        },
      },
      weight: 500,
      style: 'normal',
      decoration: 'none',
    },
    align: 'left',
  } as TextSettings,
}

export const MarkdownConfig: Item = {
  type: 'widget',
  icon: 'i-fluent-markdown-20-regular',
  blockType: BlockType.Markdown,
  options: {
    // basic options
    name: 'Markdown',
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
        colors: ['#00000000'],
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
        },
      },
      weight: 400,
      style: 'normal',
      decoration: 'none',
    },
    align: 'left',
  } as TextSettings,
}

export const BlockComponents: Record<string, { widget: string | Component; setting: Component; config: Item }> = {
  [BlockType.Text]: { widget: PText, setting: PTextSetting, config: TextConfig },
  [BlockType.Title]: { widget: PText, setting: PTextSetting, config: TitleConfig },
  [BlockType.Markdown]: { widget: Markdown, setting: PTextSetting, config: MarkdownConfig },
  [BlockType.Group]: { widget: Group, setting: GroupSetting, config: GroupConfig },
  [BlockType.Columns2]: { widget: Group, setting: GroupSetting, config: Columns2Config },
  [BlockType.Columns3]: { widget: Group, setting: GroupSetting, config: Columns3Config },
  [BlockType.List]: { widget: List, setting: GroupSetting, config: ListConfig },
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

