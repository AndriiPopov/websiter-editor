import React from "react";
import {
  render,
  fireEvent,
  cleanup,
  waitForElement
} from "react-testing-library";
import renderer from "react-test-renderer";
import "jest-dom/extend-expect";

import RangeInput from "./RangeInput";

afterEach(cleanup);

test("RangeInput can be rendered with title, function and icon", () => {
  // Arrange
  const container = render(
    <RangeInput
      min="-10"
      max="100"
      step="1"
      changed={() => {}}
      title="MyButton"
      value="50"
    />
  );
  const { getByText, getByTestId } = container;
  // Act
  // Assert
  expect(getByText("MyButton")).toBeDefined();
  expect(getByTestId("input").value).toBe("50");
});

test("Snapshot RangeInput", () => {
  //Arrange
  const containerSS = renderer.create(
    <RangeInput
      min="-10"
      max="100"
      step="1"
      changed={() => {}}
      saveToHistory={() => {}}
      title="MyButton"
      value="5"
    />
  );
  //Assert
  expect(containerSS.toJSON()).toMatchInlineSnapshot(`
<div
  className="Div"
>
  MyButton
  <input
    className="Input"
    data-testid="input"
    max="100"
    min="-10"
    onChange={[Function]}
    onMouseDown={[Function]}
    step="1"
    type="range"
    value="5"
  />
</div>
`);
});
