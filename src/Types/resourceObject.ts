import { resourceType } from './resource'

export type resourceObjectType = {
    website: string
    draft?: resourceType
    present: resourceType
}
