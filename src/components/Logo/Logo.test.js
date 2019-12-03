import React from 'react'

import Logo from './Logo'
import { renderWithRouter } from '../../utils/renderWithRedux'

test('can render with defaults', () => {
    const container = renderWithRouter(<Logo />)

    expect(container.getByText('Websiter')).toBeDefined()
})
