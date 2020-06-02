import { imageType } from './image'
import { templateType } from './template'

export type websiteType = {
    _id: string
    domain: string
    name: string
    customDomain?: string
    domainHidden?: boolean
    customDomainHidden?: boolean
    customDomainVerified?: boolean
    verifyCode?: string
    cname?: string
    domainNoIndex?: boolean
    sharing: Array<{
        userId: string
        rights: Array<string>
    }>
    user: string
    storage: number
    filesStructure: Array<imageType>
    pagesStructure: Array<templateType>
    pluginsStructure: Array<templateType>
    templatesStructure: Array<templateType>
    nextFileId: number
}
