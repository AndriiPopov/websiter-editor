import React from 'react'
import { render, cleanup } from 'react-testing-library'
import renderer from 'react-test-renderer'
import 'jest-dom/extend-expect'

import ValueInput from './ValueInput'

afterEach(cleanup)

test('ValueInput with wrong class', () => {
    // Arrange
    const container = render(
        <ValueInput
            title="MyInput"
            changed={() => {}}
            value="78"
            min="0"
            max="100"
        />
    )
    const { getByDisplayValue } = container
    // Act
    // Assert
    expect(getByDisplayValue('78')).toBeDefined()
})

test('Snapshot ValueInput', () => {
    //Arrange
    const containerSS = renderer.create(
        <ValueInput
            title="MyInput"
            changed={() => {}}
            value="78"
            min="0"
            max="100"
        />
    )
    //Assert
    expect(containerSS.toJSON()).toMatchInlineSnapshot(`
<div
  className="Div"
>
  MyInput
  <input
    className="Input"
    data-testid="input"
    onChange={[Function]}
    type="number"
    value="78"
  />
</div>
`)
})
