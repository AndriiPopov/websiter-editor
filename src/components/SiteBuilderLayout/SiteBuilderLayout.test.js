import React from 'react'
import { fireEvent, render, cleanup } from 'react-testing-library'
import 'jest-dom/extend-expect'

import renderWithRedux from '../../utils/renderWithRedux'
import SiteBuilderLayout from './SiteBuilderLayout'
import * as actions from '../../store/actions/index'

afterEach(cleanup)

test('can render with defaults', async () => {
    const container = renderWithRedux(<SiteBuilderLayout />)

    //Check if the elements are defined
    expect(container.getByTestId('outer')).toBeDefined()

    const unit = container.getByTestId('siteBuilderLayoutMain')
    expect(unit).toHaveClass('Content')
    expect(unit).not.toHaveClass('ContentPreview')

    container.store.dispatch(actions.previewPage())
    expect(unit).not.toHaveClass('Content')
    expect(unit).toHaveClass('ContentPreview')

    container.store.dispatch(actions.previewPage())
    expect(unit).toHaveClass('Content')
    expect(unit).not.toHaveClass('ContentPreview')
})
