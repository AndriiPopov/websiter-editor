import React from 'react'
import { waitForElement, cleanup } from 'react-testing-library'
import 'jest-dom/extend-expect'

import renderWithRedux from '../../../utils/renderWithRedux'
import Websites from './Websites'
import { initialState as websiteInitialState } from '../../../store/reducers/WebsiteReducer/website'
import * as actions from '../../../store/actions/index'

const websiteAdditionalState = {
    websites: [
        { _id: 'website1', domain: 'dom1', name: 'new web1' },
        { _id: 'website2', domain: 'dom2', name: 'new web2' },
    ],
}

afterEach(cleanup)

test('can render', async () => {
    let container = renderWithRedux(<Websites notVirtual={true} />, {
        initialState: {
            website: {
                ...websiteInitialState,
                ...websiteAdditionalState,
            },
        },
    })
    const websiteInTree1 = container.getByTestId('new web1')
    expect(websiteInTree1).toBeDefined()

    const websiteInTree2 = container.getByTestId('new web2')
    expect(websiteInTree2).toBeDefined()

    container.store.dispatch(actions.chooseWebsite('website1'))
    let websiteDomain = await waitForElement(
        () => container.getByValue('dom1'),
        10000
    )
    expect(websiteDomain).toBeDefined()

    container.store.dispatch(actions.chooseWebsite('website2'))
    websiteDomain = await waitForElement(
        () => container.getByValue('dom2'),
        10000
    )
    expect(websiteDomain).toBeDefined()
})
