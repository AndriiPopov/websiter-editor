export type pinnedElementType = {
    resourceType: 'page' | 'plugin' | 'template'
    resource: string
    element: string
    id: string
    title?: string
    pinned?: boolean
}
