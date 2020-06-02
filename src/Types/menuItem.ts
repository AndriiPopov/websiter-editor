export type menuItemType = {
    all: boolean,
    id: string,
    generatedFrom: string,
    sourceItem: boolean,
    name: string,
    type: string,
    path: Array<string>,
    properties: {
        url: string,
        class: string,
    },
}
