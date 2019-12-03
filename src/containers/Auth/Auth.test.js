import React from 'react'
import {
    render,
    fireEvent,
    cleanup,
    waitForElement,
} from 'react-testing-library'
import renderer from 'react-test-renderer'
import 'jest-dom/extend-expect'

import Auth from './Auth'
import { renderWithReduxAndRouter } from '../../utils/renderWithRedux'

afterEach(cleanup)

test('can render with redux with defaults', () => {
    const { getByText, getByTestId } = renderWithReduxAndRouter(
        <Auth location={{ pathname: '/signup' }} test={true} />
    )

    expect(getByTestId('authMain')).toBeDefined()
    const email = getByTestId('email')
    const password = getByTestId('password')
    expect(email).not.toHaveClass('Invalid')
    expect(password).not.toHaveClass('Invalid')

    fireEvent.change(email, { target: { value: 'a' } })
    expect(email).toHaveClass('Invalid')
    expect(password).not.toHaveClass('Invalid')

    fireEvent.change(email, { target: { value: 'asaafhdskjhfsdkjhf' } })
    expect(email).toHaveClass('Invalid')
    expect(password).not.toHaveClass('Invalid')

    fireEvent.change(email, { target: { value: 'a@a.a' } })
    expect(email).toHaveClass('Invalid')
    expect(password).not.toHaveClass('Invalid')

    fireEvent.change(email, { target: { value: 'andriy.popov.vl@gmail.com' } })
    expect(email).not.toHaveClass('Invalid')
    expect(password).not.toHaveClass('Invalid')

    fireEvent.change(email, { target: { value: 'a@a.aa' } })
    expect(email).not.toHaveClass('Invalid')
    expect(password).not.toHaveClass('Invalid')

    fireEvent.change(email, { target: { value: '1@1.aa' } })
    expect(email).not.toHaveClass('Invalid')
    expect(password).not.toHaveClass('Invalid')

    fireEvent.change(email, { target: { value: '1@1.aa1' } })
    expect(email).toHaveClass('Invalid')
    expect(password).not.toHaveClass('Invalid')

    fireEvent.change(password, { target: { value: '1' } })
    expect(email).toHaveClass('Invalid')
    expect(password).toHaveClass('Invalid')

    fireEvent.change(password, { target: { value: '12345' } })
    expect(email).toHaveClass('Invalid')
    expect(password).toHaveClass('Invalid')

    fireEvent.change(password, { target: { value: '123456' } })
    expect(email).toHaveClass('Invalid')
    expect(password).not.toHaveClass('Invalid')

    fireEvent.change(email, { target: { value: 'andriy.popov.vl@gmail.com' } })
    expect(email).not.toHaveClass('Invalid')
    expect(password).not.toHaveClass('Invalid')
})

test('can render with redux with defaults', () => {
    const { getByText, getByTestId } = renderWithReduxAndRouter(
        <Auth location={{ pathname: '/signin' }} test={true} />
    )

    expect(getByTestId('authMain')).toBeDefined()
})
