export type templateType = {
    id: string
    path: Array<string>
    name: string
    url: string
    template: string
    homepage: boolean
    notPublished: boolean
    hidden: boolean
    connectedResources: {
        name: string
        type: string
    }
    generalSettings?: boolean
    propagating?: boolean
}
