import React from 'react'
import {
    render,
    fireEvent,
    waitForElement,
    cleanup,
} from 'react-testing-library'
import 'jest-dom/extend-expect'

import SizeDragController from './SizeDragController'

afterEach(cleanup)

test('can render and return value on move', () => {
    const drawerMoved = jest.fn()
    let container = render(
        <SizeDragController
            addClass="heightControll"
            vertical
            startValue={300}
            changed={value => drawerMoved(value)}
        />
    )

    const div = container.getByTestId('sizeDragController')
    expect(div).toBeDefined()

    fireEvent.mouseDown(div)
    fireEvent.mouseMove(window, {
        target: { pageX: 100, pageY: 400 },
    })

    expect(drawerMoved).toHaveBeenCalledWith(400)

    // container.store.dispatch(actions.previewPage())
    // expect(container.queryByText('Height')).toBeNull()

    // container.store.dispatch(actions.previewPage())
    // const unit = container.getByText('Height')
    // expect(unit).toBeDefined()
})
