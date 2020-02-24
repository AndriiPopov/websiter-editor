import React from 'react'
import Menu, { SubMenu, MenuItem } from './MenuModule/index'
import buildItemsForMenu from './methods/buildItemsForMenu'
import { connect } from 'react-redux'

import type { elementType, pageType } from '../../../store/reducer/reducer'

export type Props = {
    pageInStructure: pageType,
    element: elementType,
    document: {},
    parentPluginProps: $PropertyType<elementType, 'properties'>,
}

const activeKeys = []

const MenuElement = (props: Props) => {
    const builtItems = buildItemsForMenu(props)

    activeKeys.length = 0
    const menuElements = builtItems.map((item, index) => {
        if (item.children.length === 0) {
            const key = item.id + '_' + index
            if (
                item.url === props.pageInStructure.url ||
                (item.url === '' && props.pageInStructure.homepage)
            )
                activeKeys.push(key)
            return (
                <MenuItem
                    key={key}
                    className={item.properties ? item.properties.class : ''}
                >
                    <div
                        style={{ height: '100%', width: '100%' }}
                        onClick={() => (window.location = item.url)}
                    >
                        {item.name}
                    </div>
                </MenuItem>
            )
        } else {
            return (
                <SubMenu1
                    item={item}
                    key={item.id + '_' + index}
                    pageInStructure={props.pageInStructure}
                />
            )
        }
    })
    return (
        <Menu
            prefixCls={'systemclass_menu'}
            // $FlowFixMe
            getPopupContainer={() => props.document.body}
            topMenuBlockClasses={
                props.elementValues.properties.topMenuBlockClasses
            }
            topMenuItemClasses={
                props.elementValues.properties.topMenuItemClasses
            }
            topMenuItemActiveClasses={
                props.elementValues.properties.topMenuItemActiveClasses
            }
            popupMenuBlockClasses={
                props.elementValues.properties.popupMenuBlockClasses
            }
            popupMenuItemClasses={
                props.elementValues.properties.popupMenuItemClasses
            }
            popupMenuItemActiveClasses={
                props.elementValues.properties.popupMenuItemActiveClasses
            }
            mode={props.elementValues.properties.mode}
            selectable={false}
            triggerSubMenuAction={props.elementValues.properties.trigger}
            activeKeys={activeKeys}
        >
            {menuElements}
        </Menu>
    )
}

const SubMenu1 = props => {
    const { ...other } = props
    return (
        <SubMenu {...other} title={props.item.name}>
            {props.item.children.map((item, index) => {
                if (item.children.length === 0) {
                    const key = item.id + '_' + index
                    if (
                        item.url === props.pageInStructure.url ||
                        (item.url === '' && props.pageInStructure.homepage)
                    )
                        activeKeys.push(key)
                    return (
                        <MenuItem key={key}>
                            <div
                                style={{ height: '100%', width: '100%' }}
                                onClick={() => (window.location = item.url)}
                            >
                                {item.name}
                            </div>
                        </MenuItem>
                    )
                } else {
                    return (
                        <SubMenu2
                            item={item}
                            {...other}
                            key={item.id + '_' + index}
                            pageInStructure={props.pageInStructure}
                        />
                    )
                }
            })}
        </SubMenu>
    )
}

const SubMenu2 = SubMenu1

const mapStateToProps = state => {
    return {
        pagesStructure: state.mD.pagesStructure,
        pageInStructure: state.mD.currentPageItem,
    }
}

export default connect(mapStateToProps)(MenuElement)
