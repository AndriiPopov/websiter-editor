import React from 'react'
import { render, cleanup } from 'react-testing-library'
import renderer from 'react-test-renderer'
import 'jest-dom/extend-expect'

import LoginInput from './LoginInput'

afterEach(cleanup)

test('LoginInput can be rendered', () => {
    // Arrange
    const container = render(
        <LoginInput
            invalid={true}
            touched={true}
            shouldValidate={true}
            type="password"
            passwordVisible={true}
            password={true}
            togglePasswordVisible={() => {}}
            changed={() => {}}
            value="Value"
            placeholder="placeholder"
            label="label"
        />
    )
    const { getByDisplayValue, getByText, rerender } = container
    // Act
    // Assert
    expect(getByDisplayValue('Value')).toBeDefined()
    expect(getByText('label')).toBeDefined()
    expect(getByDisplayValue('Value')).toHaveClass('Invalid')
    expect(getByDisplayValue('Value')).toHaveProperty('type', 'text')

    rerender(<LoginInput passwordVisible={false} />)
    expect(getByDisplayValue('Value')).toHaveProperty('type', 'text')
})

test('Snapshot LoginInput', () => {
    //Arrange
    const containerSS = renderer.create(
        <LoginInput
            invalid={true}
            touched={true}
            type="password"
            passwordVisible={true}
            password={true}
            togglePasswordVisible={() => {}}
            changed={() => {}}
            value="Value"
            placeholder="placeholder"
            label="label"
        />
    )
    //Assert
    expect(containerSS.toJSON()).toMatchInlineSnapshot(`
<div
  className="Input"
>
  <label
    className="Label"
  >
    label
  </label>
  <input
    className="InputElement"
    data-testid="loginInput"
    onChange={[Function]}
    placeholder="placeholder"
    type="text"
    value="Value"
  />
  <div
    className="PasswordIsVisible"
    data-testid="toggle"
    onClick={[Function]}
  />
</div>
`)
})
