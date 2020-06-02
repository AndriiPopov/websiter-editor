// import type { requiredRightsType } from '../store/reducer/reducer'

export default (requiredRights: Array<string>, noShowAlert?: boolean) => (
    dispatch,
    getState
) => {
    if (sessionStorage.getItem('tryWebsiter')) return true
    const { mD } = getState()

    if (requiredRights && !mD.tryWebsiter) {
        if (requiredRights.length === 0) return true
        let website = mD.currentWebsiteObject
        if (!website) {
            if (!noShowAlert) alert('No website.')
            return false
        }
        const account = website.sharing.find(item => item.userId === mD.userId)
        if (!account) {
            if (!noShowAlert) alert('You do not have rights for this action')
            return false
        }
        let allow = false
        requiredRights.forEach(item => {
            if (account.rights.includes(item)) allow = true
        })
        if (!allow) {
            if (!noShowAlert) alert('You do not have rights for this action')
            return false
        }
    }
    return true
}
