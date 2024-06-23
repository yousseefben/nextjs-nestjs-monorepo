import { render, screen, fireEvent } from "@testing-library/react";
import Carousel from "./Carousel";

const mockPhotos = [
  { url: "/url1.jpg", name: "Photo 1" },
  { url: "/url2.jpg", name: "Photo 2" },
  { url: "/url3.jpg", name: "Photo 3" },
];

describe("Carousel", () => {
  test("renders correctly", () => {
    render(<Carousel photos={mockPhotos} />);
    expect(screen.getByTestId("default-carousel")).toBeInTheDocument();
  });

  test("displays the first slide by default", () => {
    render(<Carousel photos={mockPhotos} />);
    expect(screen.getByAltText("Photo 1")).toBeInTheDocument();
  });

  test("updates the active slide when an indicator is clicked", () => {
    render(<Carousel photos={mockPhotos} />);
    const indicators = screen.getAllByRole("button");
    fireEvent.click(indicators[1]); // Click the second indicator
    expect(screen.getByAltText("Photo 2")).toBeInTheDocument();
  });
});
