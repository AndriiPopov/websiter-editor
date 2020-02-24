import { getInheritedPropertyName } from '../../../../utils/basic'

import { CloudFrontUrl, bucket } from '../../../../awsConfig'

import type Props from '../BuilderElement'

export default (props: Props) => {
    const result = {}
    for (let attribute in props.elementValues.properties) {
        const inheritedPropertyName = getInheritedPropertyName(
            props.elementValues.properties[attribute]
        )
        result[attribute] = inheritedPropertyName
            ? props.parentPluginProps[inheritedPropertyName]
            : props.elementValues.properties[attribute]
        result[attribute] = JSON.parse(
            JSON.stringify(result[attribute]).replace(
                // /\$[^:;\$\s]*\$/g,
                /\$[A-Za-z0-9]*\$/g,
                match => {
                    const inheritedPropertyName = getInheritedPropertyName(
                        match
                    )
                    return inheritedPropertyName
                        ? props.parentPluginProps[inheritedPropertyName] || ''
                        : ''
                }
            )
        )
        if (attribute === 'src') {
            let url = result[attribute] || ''
            const path = url.split('/')
            if (path.length > 1) {
                if (path[0] === 'websiter') {
                    path.shift()
                    let width, height
                    if (path.length > 1) {
                        const sizes = path[path.length - 1]
                        const indexW = sizes.indexOf('w')
                        const indexH = sizes.indexOf('h')
                        if (indexW > -1 && indexH > -1) {
                            if (indexW < indexH) {
                                width = sizes.substr(indexW + 1, indexH - 1)
                                height = sizes.substr(indexH + 1)
                            } else {
                                height = sizes.substr(indexH + 1, indexW - 1)
                                width = sizes.substr(indexW + 1)
                            }
                        } else {
                            if (indexW > -1) width = sizes.substr(indexW + 1)
                            if (indexH > -1) height = sizes.substr(indexH + 1)
                        }
                    }

                    if (isNaN(width)) width = null
                    else width = parseInt(width)
                    if (isNaN(height)) height = null
                    else height = parseInt(height)

                    if (width || height) {
                        path.pop()
                    }

                    const imageRequest = JSON.stringify({
                        bucket: bucket,
                        key: path.join('/'),
                        edits: {
                            resize: {
                                width: width || '',
                                height: height || null,
                                fit: 'cover',
                                background: { r: 0, g: 0, b: 0, alpha: 0 },
                            },
                            toFormat: 'png',
                        },
                    })

                    url = `${CloudFrontUrl}/${btoa(imageRequest)}`
                    result[attribute] = url
                }
            }
        }
    }
    return result
}

export const refinePropertiesFromCMS = mD => {
    const result = {}
    if (mD.pageTemplateDraft && mD.currentPageDraft)
        mD.pageTemplateDraft.structure.forEach(item => {
            if (item.path.length > 0) {
                if (item.path[0] === 'element_02') {
                    const resourceVariable = mD.currentPageDraft.values[item.id]

                    const itemValues = mD.pageTemplateDraft.values[item.id]
                    if (itemValues.CMSVariableSystemName)
                        if (itemValues.CMSVariableType === 'menuItems') {
                            result[
                                itemValues.CMSVariableSystemName
                            ] = resourceVariable
                                ? resourceVariable.menuItems
                                    ? resourceVariable.menuItems.length > 0
                                        ? resourceVariable.menuItems
                                        : itemValues.defaultMenuItems
                                    : itemValues.defaultMenuItems
                                : itemValues.defaultMenuItems
                        } else {
                            result[
                                itemValues.CMSVariableSystemName
                            ] = resourceVariable
                                ? resourceVariable.value ||
                                  itemValues.CMSVariableDefaultValue
                                : itemValues.CMSVariableDefaultValue
                        }
                }
            }
        })
    return result
}
