import React from 'react'
import { connect } from 'react-redux'
import Menu, { SubMenu, MenuItem } from './MenuModule/index'
import { buildTree } from '../../../utils/basic'

import type {
    pageStructureElementType,
    pagesStructureType,
} from '../../../../flowTypes'

type Props = {
    element: pageStructureElementType,
    pagesStructure: pagesStructureType,
    document: {},
}

const MenuElement = (props: Props) => {
    const buildMenuItems = menuItems => {
        const structure = []
        if (menuItems)
            menuItems.forEach(item => {
                if (item.generatedFrom === 'all') {
                    props.pagesStructure.forEach(page => {
                        if (!hiddenPages.includes(page.id)) {
                            structure.push({
                                name: page.name,
                                properties: item.properties,
                                id: item.id + page.id,
                                path: [
                                    ...item.path,
                                    ...page.path.map(l => item.id + l),
                                ],
                                url: page.url,
                            })
                        }
                    })
                } else if (item.all) {
                    props.pagesStructure.forEach(page => {
                        if (
                            page.path.includes(item.generatedFrom) &&
                            !hiddenPages.includes(page.id)
                        ) {
                            structure.push({
                                id: item.id + page.id,
                                name: page.name,
                                properties: item.properties,
                                path: [
                                    ...item.path,
                                    ...page.path
                                        .slice(
                                            page.path.indexOf(
                                                item.generatedFrom
                                            ) - 1
                                        )
                                        .map(l => item.id + l),
                                ],
                                url: page.url,
                            })
                        }
                    })
                } else if (item.generatedFrom !== 'link') {
                    props.pagesStructure.forEach(page => {
                        if (
                            page.id === item.generatedFrom &&
                            !hiddenPages.includes(page.id)
                        ) {
                            structure.push({
                                id: item.id,
                                name: item.name,
                                properties: item.properties,
                                path: item.path,
                                url: page.url,
                            })
                        }
                    })
                } else if (item.generatedFrom === 'link') {
                    structure.push({
                        id: item.id,
                        name: item.name,
                        path: item.path,
                        url: item.properties ? item.properties.url || '' : '',
                        properties: item.properties,
                    })
                }
            })
        return structure
    }
    const hiddenPages = []
    props.pagesStructure.forEach(page => {
        if (page.hidden) hiddenPages.push(page.id)
    })
    props.pagesStructure.forEach(page => {
        page.path.forEach(id => {
            if (hiddenPages.includes(id)) {
                hiddenPages.push(page.id)
            }
        })
    })

    const builtItems = buildTree(buildMenuItems(props.element.menuItems))

    return (
        <Menu
            prefixCls={'systemclass_menu'}
            getPopupContainer={() => props.document.body}
            topMenuBlockClasses={props.element.properties.topMenuBlockClasses}
            topMenuItemClasses={props.element.properties.topMenuItemClasses}
            topMenuItemActiveClasses={
                props.element.properties.topMenuItemActiveClasses
            }
            popupMenuBlockClasses={
                props.element.properties.popupMenuBlockClasses
            }
            popupMenuItemClasses={props.element.properties.popupMenuItemClasses}
            popupMenuItemActiveClasses={
                props.element.properties.popupMenuItemActiveClasses
            }
            mode={props.element.properties.mode}
            selectable={false}
            triggerSubMenuAction={props.element.properties.trigger}
        >
            {builtItems.map((item, index) => {
                if (item.children.length === 0) {
                    return (
                        <MenuItem
                            key={item.id + '_' + index}
                            className={
                                props.properties
                                    ? props.properties.itemClass
                                    : ''
                            }
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
                    return <SubMenu1 item={item} key={item.id + '_' + index} />
                }
            })}
        </Menu>
    )
}

const SubMenu1 = props => {
    const { ...other } = props
    return (
        <SubMenu {...other} title={props.item.name}>
            {props.item.children.map((item, index) => {
                if (item.children.length === 0) {
                    return (
                        <MenuItem key={item.id + '_' + index}>
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
                        />
                    )
                }
            })}
        </SubMenu>
    )
}

const SubMenu2 = SubMenu1

const mapStateToProps = (state, props) => {
    return {
        pagesStructure: state.pagesStructure,
    }
}

export default connect(mapStateToProps)(MenuElement)
