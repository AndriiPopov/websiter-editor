import { websiteItemType } from './websiteItem'

export type userType = {
    websites: Array<websiteItemType>
    settings: {
        currentWebsite?: string
        websites: {
            [key: string]: {
                currentPageId: string
                currentPageFSBId: string
                currentTemplateId: string
                currentPluginId: string
                currentFileId: string
            }
        }
    }
    userid: string
    accountInfo: {}
    platformId: string
    logoutAllDate: number
}
