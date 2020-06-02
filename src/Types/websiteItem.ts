import { requiredRightsType } from './requiredRights'

export type websiteItemType = {
    name: string
    domain: string
    user: string
    storage: number
    sharing: [
        {
            userId: string
            rights: requiredRightsType
            accountInfo: {
                displayName: string
                emails: Array<string>
                photos: Array<string>
            }
        }
    ]
    id: string
}
