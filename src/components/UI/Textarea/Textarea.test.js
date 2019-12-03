import React from 'react'
import { render, cleanup } from 'react-testing-library'
import renderer from 'react-test-renderer'
import 'jest-dom/extend-expect'

import Textarea from './Textarea'

afterEach(cleanup)

test('Textarea with wrong class', () => {
    // Arrange
    const container = render(
        <Textarea
            title="MyButton"
            changed={() => {}}
            isWrong={true}
            startValue="Default"
        />
    )
    const { getByText } = container
    // Act
    // Assert
    expect(getByText('Default')).toBeDefined()
    expect(getByText('Default')).toHaveClass('Wrong')
})

test('Textarea without wrong class ', () => {
    // Arrange
    const container = render(
        <Textarea
            title="MyButton"
            changed={() => {}}
            isWrong={false}
            startValue="Default"
        />
    )
    const { getByText } = container
    // Act
    // Assert
    expect(getByText('Default')).toBeDefined()
    expect(getByText('Default')).not.toHaveClass('Wrong')
})

test('Snapshot Textarea', () => {
    //Arrange
    const containerSS = renderer.create(
        <Textarea
            title="MyButton"
            changed={() => {}}
            isWrong={true}
            startValue="Default"
        />
    )
    //Assert
    expect(containerSS.toJSON()).toMatchInlineSnapshot(`
<div
  className="Div"
>
  MyButton
  <textarea
    className="Wrong"
    data-testid="Input"
    onChange={[Function]}
    value="Default"
  />
</div>
`)
})
