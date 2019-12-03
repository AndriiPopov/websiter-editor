import React from "react";
import {
  render,
  fireEvent,
  cleanup,
  waitForElement
} from "react-testing-library";
import renderer from "react-test-renderer";

import Spinner from "./Spinner";

afterEach(cleanup);

test("Spinner with cover must have cover", () => {
  // Arrange
  const container = render(<Spinner cover={true} />);
  const { queryByTestId, getByText } = container;
  // Act
  // Assert
  expect(getByText("Loading...")).toBeDefined();
  expect(queryByTestId("cover")).toBeDefined();
});

test("Spinner with cover must have cover", () => {
  // Arrange
  const container = render(<Spinner />);
  const { queryByTestId, getByText } = container;
  // Act
  // Assert
  expect(getByText("Loading...")).toBeDefined();
  expect(queryByTestId("cover")).toBeNull();
});

test("Snapshot Spinner", () => {
  //Arrange
  const containerSS = renderer.create(<Spinner cover={true} />);
  //Assert
  expect(containerSS.toJSON()).toMatchInlineSnapshot(`
<div
  className="Cover"
  data-testid="cover"
>
  <div
    className="Loader"
  >
    Loading...
  </div>
</div>
`);
});
