import WrapperView from './Widgets/Wrapper.vue'
import LayoutWrapperView from './Widgets/LayoutWrapper.vue'
import BasicSettingView from './Settings/BasicSetting.vue'
import DesignerSettingView from './DesignerSetting.vue'

export const Wrapper = {
  name: 'Wrapper',
  view: WrapperView,
}

export const LayoutWrapper = {
  name: 'LayoutWrapper',
  view: LayoutWrapperView,
}

export const BasicSetting = {
  name: 'BasicSetting',
  view: BasicSettingView,
}

export const DesignerSetting = {
  name: 'DesignerSetting',
  view: DesignerSettingView,
}

