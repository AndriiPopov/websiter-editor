import { buildTree } from '../../../../utils/basic'

// import type { Props } from '../Menu'

export default props => {
    const buildMenuItems = menuItems => {
        let structureAfterVariables = []
        const structure = []
        if (menuItems) {
            menuItems.forEach(item => {
                if (item.generatedFrom === 'variable') {
                    if (props.parentPluginProps[item.name]) {
                        structureAfterVariables = [
                            ...structureAfterVariables,
                            ...props.parentPluginProps[item.name],
                        ]
                    }
                } else {
                    structureAfterVariables.push(item)
                }
            })

            structureAfterVariables.forEach(item => {
                if (item.generatedFrom === 'all') {
                    props.pagesStructure.forEach(page => {
                        if (!page.hidden || page.folderPage) {
                            structure.push({
                                name: page.name,
                                properties: item.properties,
                                id: item.id + page.id,
                                path: [
                                    ...item.path,
                                    ...page.path.map(l => item.id + l),
                                ],
                                url: page.relUrl,
                            })
                        }
                    })
                } else if (item.all) {
                    props.pagesStructure.forEach(page => {
                        if (
                            page.path.includes(item.generatedFrom) &&
                            (!page.hidden || page.folderPage)
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
                                            ) + 1
                                        )
                                        .map(l => item.id + l),
                                ],
                                url: page.relUrl,
                            })
                        }
                    })
                } else if (item.generatedFrom !== 'link') {
                    props.pagesStructure.forEach(page => {
                        if (
                            page.id === item.generatedFrom &&
                            (!page.hidden || page.folderPage)
                        ) {
                            structure.push({
                                id: item.id,
                                name: item.name,
                                properties: item.properties,
                                path: item.path,
                                url: page.relUrl,
                            })
                        }
                    })
                } else if (item.generatedFrom === 'link') {
                    structure.push({
                        id: item.id,
                        name: item.name,
                        path: item.path,
                        url: item.properties.url || '',
                        properties: item.properties,
                    })
                }
            })
        }
        return structure
    }
    // const hiddenPages = []
    // props.pagesStructure.forEach(page => {
    //     if (page.hidden) hiddenPages.push(page.id)
    // })
    // props.pagesStructure.forEach(page => {
    //     page.path.forEach(id => {
    //         if (hiddenPages.includes(id)) {
    //             hiddenPages.push(page.id)
    //         }
    //     })
    // })

    return buildTree(buildMenuItems(props.elementValues.menuItems))
}
