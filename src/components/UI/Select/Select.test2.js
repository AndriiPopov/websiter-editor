// import React from 'react'
// import {
//     render,
//     fireEvent,
//     cleanup,
//     waitForElement,
// } from 'react-testing-library'
// import renderer from 'react-test-renderer'

// import { Checkbox } from './Checkbox'

// afterEach(cleanup)

// test('Checkbox can be rendered with title, function and icon', () => {
//     // Arrange
//     const container = render(
//         <Checkbox checked={true} title="MyButton" onChange={() => {}} />
//     )
//     const { getByText } = container
//     // Act
//     // Assert
//     expect(getByText('MyButton')).toBeDefined()
// })

// test('Snapshot Checkbox', () => {
//     //Arrange
//     const containerSS = renderer.create(
//         <Checkbox checked={true} title="MyButton" onChange={() => {}} />
//     )
//     //Assert
//     expect(containerSS.toJSON()).toMatchInlineSnapshot(`
// <div
//   className="Div"
// >
//   <input
//     checked={true}
//     className="Input"
//     onChange={[Function]}
//     type="checkbox"
//   />
//   MyButton
// </div>
// `)
// })
