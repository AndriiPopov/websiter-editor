import isEqual from 'lodash/isEqual'
import omit from 'lodash/omit'

export default (draft1, draft2) =>
    isEqual(
        {
            structure: draft1.structure.map(item =>
                omit(item, ['expanded', 'children', 'itemPath', 'itemIndex'])
            ),
            values: draft1.values,
        },
        {
            structure: draft2.structure.map(item =>
                omit(item, ['expanded', 'children', 'itemPath', 'itemIndex'])
            ),
            values: draft2.values,
        }
    )
