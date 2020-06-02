import { menuItemType } from './menuItem'

export type elementType = {
    id: string
    path: Array<string>
    tag: string
    expanded?: boolean
    // properties: {
    //     name?: string
    //     topMenuBlockClasses?: Array<string>
    //     topMenuItemClasses?: Array<string>
    //     topMenuItemActiveClasses?: Array<string>
    //     popupMenuBlockClasses?: Array<string>
    //     popupMenuItemClasses?: Array<string>
    //     popupMenuItemActiveClasses?: Array<string>
    //     mode?: 'horizontal' | 'vertical'
    //     trigger?: 'click'
    //     id?: string
    //     class?: string
    // }
    // propertiesString: string
    // style?: string
    // expanded?: boolean
    // textMode: string
    // cursorPosition?: {
    //     row: number
    //     column: number
    // }
    text?: boolean
    // textContent?: string
    isChildren?: boolean
    forChildren?: boolean
    childrenTo?: string
    forModule?: string
    // forPlugin?: string
    // sourcePlugin?: string
    // menuItems?: Array<menuItemType>
    // currentMenuItem?: string
    // children?: Array<elementType>
    // isElementFromCMSVariable?: boolean
    // isCMSVariable?: boolean
    // CMSVariableType?: string
    // CMSVariableSystemName?: string
    // CMSVariableDescription?: string
    // CMSVariableDefaultValue?: any
    // currentMenuId?: string
    // defaultMenuItems?: Array<menuItemType>
    // value?: any
    forPropagatingPlugin?: {
        pluginId: string
        variable: string
    }
}
