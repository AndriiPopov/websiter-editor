export type menuItemsListType = Array<{
    id: string,
    hidden: boolean,
    all: boolean,
    type: 'page',
    pageId: string,
    path: Array<string>,
    newTab: boolean,
    name: string,
    url: string,
}>

export type filesStructureType = Array<{
    id: string,
    path: Array<string>,
    name: string,
}>

export type fileType = {
    id: string,
    path: Array<string>,
    name: string,
}

export type pluginsStructureType = Array<fileType>

export type resourcesObjectsType = {
    draft: {},
    present?: {},
    future: Array<{}>,
    past: Array<{}>,
}

export type pluginsObjectsType = {}

export type pageStructureElementType = {
    id: string,
    path: Array<string>,
    name: string,
    properties: { style: string },
    text: boolean,
    textContent: string,
    tag: string,
    menuItems: Array<{ id: string }>,
}

export type pageStructureType = Array<pageStructureElementType>

export type resourcesStructureElementType = {
    id: string,
    path: Array<string>,
    name: string,
    properties: { style: string },
    homepage: boolean,
    hidden: boolean,
}

export type resourcesStructureType = Array<resourcesStructureElementType>

export type pageType = {
    path: Array<string>,
    id: string,
    name: string,
    url: string,
}

export type pagesStructureType = Array<pageType>
