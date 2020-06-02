import { menuItemType } from './menuItem'

export type elementValuesType = {
    properties: {
        name?: string
        topMenuBlockClasses?: Array<string>
        topMenuItemClasses?: Array<string>
        topMenuItemActiveClasses?: Array<string>
        popupMenuBlockClasses?: Array<string>
        popupMenuItemClasses?: Array<string>
        popupMenuItemActiveClasses?: Array<string>
        mode?: 'horizontal' | 'vertical'
        trigger?: 'click'
        id?: string
        class?: string
        style?: string
    }
    propertiesString: string
    style?: string
    // expanded?: boolean
    // textMode: string
    // cursorPosition?: {
    //     row: number
    //     column: number
    // }
    // text?: boolean
    // textContent?: string
    // isChildren?: boolean
    // childrenTo?: string
    // forPlugin?: string
    // sourcePlugin?: string
    menuItems?: Array<menuItemType>
    currentMenuItem?: string
    currentMenuId?: number | string
    // children?: Array<elementType>
    // isElementFromCMSVariable?: boolean
    // isCMSVariable?: boolean
    CMSVariableType: string
    // CMSVariableSystemName?: string
    // CMSVariableDescription?: string
    // CMSVariableDefaultValue?: any
    // defaultMenuItems?: Array<menuItemType>
    value?: any
    // forPropagatingPlugin?: string
}
