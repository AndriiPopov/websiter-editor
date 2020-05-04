import React, { useEffect } from 'react'
import Menu, { SubMenu, MenuItem } from './MenuModule/index'
import buildItemsForMenu from './methods/buildItemsForMenu'
import { connect } from 'react-redux'

// import type { elementType, pageType } from '../../../store/reducer/reducer'

// export type Props = {
//     pageInStructure: pageType,
//     element,
//     document: {},
//     parentPluginProps: $PropertyType<elementType, 'properties'>,
// }

const activeKeys = []

const MenuElement = props => {
    useEffect(() => {
        if (!props.document.getElementById('__menu__popup__container__')) {
            const container = props.document.createElement('div')
            container.setAttribute('id', '__menu__popup__container__')
            container.setAttribute(
                'style',
                'z-index:100000;position: absolute;'
            )
            props.document.body.appendChild(container)
        }
    })
    const builtItems = buildItemsForMenu(props)

    activeKeys.length = 0
    const menuElements = builtItems.map((item, index) => {
        const key = item.id + '_' + index
        if (item.children.length === 0) {
            if (
                item.url === '/' + props.pageInStructure.relUrl ||
                (item.url === '' && props.pageInStructure.homepage)
            )
                activeKeys.push(key)
            return (
                <MenuItem
                    key={key}
                    className={item.properties ? item.properties.class : ''}
                    href={item.url}
                    target={
                        item.properties &&
                        (item.properties.newTab ? '_blank' : '_self')
                    }
                >
                    {item.name}
                </MenuItem>
            )
        } else {
            return (
                <SubMenu1
                    item={item}
                    key={key}
                    pageInStructure={props.pageInStructure}
                />
            )
        }
    })
    console.log(props.pageInStructure.relUrl)
    console.log(builtItems)
    console.log(props.refinedProperties)
    console.log(activeKeys)
    return (
        <Menu
            prefixCls={'systemclass_menu'}
            getPopupContainer={() =>
                props.document.getElementById('__menu__popup__container__')
            }
            topMenuBlockClasses={props.refinedProperties.topMenuBlockClasses}
            topMenuItemClasses={props.refinedProperties.topMenuItemClasses}
            topMenuItemActiveClasses={
                props.refinedProperties.topMenuItemActiveClasses
            }
            popupMenuBlockClasses={
                props.refinedProperties.popupMenuBlockClasses
            }
            popupMenuItemClasses={props.refinedProperties.popupMenuItemClasses}
            popupMenuItemActiveClasses={
                props.refinedProperties.popupMenuItemActiveClasses
            }
            mode={props.refinedProperties.mode}
            selectable={false}
            triggerSubMenuAction={props.refinedProperties.trigger}
            activeKeys={activeKeys}
            overflowedIndicator={props.overflowIcon}
        >
            {menuElements}
        </Menu>
    )
}

const SubMenu1 = props => {
    const { ...other } = props
    return (
        <SubMenu {...other} key={props.key} title={props.item.name}>
            {props.item.children.map((item, index) => {
                const key = props.key + '_' + index
                if (item.children.length === 0) {
                    if (
                        item.url === '/' + props.pageInStructure.relUrl ||
                        (item.url === '' && props.pageInStructure.homepage)
                    )
                        activeKeys.push(key)
                    return (
                        <MenuItem
                            key={key}
                            href={item.url}
                            target={
                                item.properties &&
                                (item.properties.newTab ? '_blank' : '_self')
                            }
                        >
                            {item.name}
                        </MenuItem>
                    )
                } else {
                    return (
                        <SubMenu2
                            {...other}
                            item={item}
                            key={key}
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
