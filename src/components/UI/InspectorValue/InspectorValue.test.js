import React from 'react'
import { render, cleanup } from 'react-testing-library'
import renderer from 'react-test-renderer'
import 'jest-dom/extend-expect'

import TextInput from './TextInput'

afterEach(cleanup)

test('TextInput with wrong class', () => {
    // Arrange
    const container = render(
        <TextInput title="MyInput" changed={() => {}} value="Value" />
    )
    const { getByDisplayValue } = container
    // Act
    // Assert
    expect(getByDisplayValue('Value')).toBeDefined()
})

test('Snapshot TextInput', () => {
    //Arrange
    const containerSS = renderer.create(
        <TextInput title="MyInput" changed={() => {}} value="Value" />
    )
    //Assert
    expect(containerSS.toJSON()).toMatchInlineSnapshot(`
<div
  className="Div"
>
  MyInput
  <input
    className="Input"
    data-testid="MyInput"
    onChange={[Function]}
    type="text"
    value="Value"
  />
</div>
`)
})
