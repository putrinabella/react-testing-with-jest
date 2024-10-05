import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import App from "./App";

const appData = {
  image: {
    testId: "image-banner",
    alt: "banner",
    src: "https://www.instacart.com/company/wp-content/uploads/2022/11/cooking-statistics-hero.jpg",
  },
};

const navbarData = {
  title: {
    testId: "my-recipe",
    text: "My Recipe",
  },
  form: {
    testId: "form-search",
    role: "search",
    input: {
      testId: "search-input",
      type: "search",
    },
  },
};

const footerData = {
  copyright: {
    testId: "footer-text",
    text: "© 2024 Company, Inc. All rights reserved.",
  },
  socialLinks: {
    facebook: {
      testId: "link-facebook",
      href: "https://facebook.com",
    },
    x: {
      testId: "link-x",
      href: "https://x.com",
    },
    instagram: {
      testId: "link-instagram",
      href: "https://instagram.com",
    },
  },
};

describe("App Component", () => {
  beforeEach(() => {
    render(<App />);
  });

  describe("Image Banner", () => {
    test("renders the banner with correct attributes", () => {
      const banner = screen.getByTestId(appData.image.testId);
      expect(banner).toBeInTheDocument();
      expect(banner).toHaveAttribute("src", appData.image.src);
      expect(banner).toHaveAttribute("alt", appData.image.alt);
    });
  });

  describe("NavBar", () => {
    test("displays the correct title", () => {
      const title = screen.getByTestId(navbarData.title.testId);
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent(navbarData.title.text);
    });

    test("renders the search form and submits a search", () => {
      const form = screen.getByTestId(navbarData.form.testId);
      expect(form).toBeInTheDocument();
      expect(form).toHaveAttribute("role", navbarData.form.role);

      const input = screen.getByTestId(navbarData.form.input.testId);
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("type", navbarData.form.input.type);

      // Simulate search input and form submission
      fireEvent.change(input, { target: { value: "Pizza" } });
      fireEvent.submit(form);
    });
  });

  describe("Footer", () => {
    test("displays the correct copyright text", () => {
      const footerText = screen.getByTestId(footerData.copyright.testId);
      expect(footerText).toBeInTheDocument();
      expect(footerText).toHaveTextContent(footerData.copyright.text);
    });

    test("renders social media links", () => {
      const { facebook, x, instagram } = footerData.socialLinks;

      const facebookLink = screen.getByTestId(facebook.testId);
      expect(facebookLink).toBeInTheDocument();
      expect(facebookLink).toHaveAttribute("href", facebook.href);

      const xLink = screen.getByTestId(x.testId);
      expect(xLink).toBeInTheDocument();
      expect(xLink).toHaveAttribute("href", x.href);

      const instagramLink = screen.getByTestId(instagram.testId);
      expect(instagramLink).toBeInTheDocument();
      expect(instagramLink).toHaveAttribute("href", instagram.href);
    });
  });
});

describe("API Fetch and Rendering Recipes", () => {
  beforeAll(() => {
    global.fetch = jest.fn();
  });

  test("should render Card components based on fetched recipes", async () => {
    const mockData = {
      recipes: [
        { id: 1, name: "Recipe 1", image: "image1.jpg", rating: 4.5, tags: ["tag1", "tag2"] },
        { id: 2, name: "Recipe 2", image: "image2.jpg", rating: 3.5, tags: ["tag3", "tag4"] },
        { id: 3, name: "Recipe 3", image: "image3.jpg", rating: 5, tags: ["tag5", "tag6"] },
      ],
    };

    global.fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockData),
    });

    render(<App />);

    const img1 = await screen.findByTestId(`img-recipe-1`);
    const title1 = await screen.findByTestId(`title-recipe-1`);

    const img2 = await screen.findByTestId(`img-recipe-2`);
    const title2 = await screen.findByTestId(`title-recipe-2`);

    const img3 = await screen.findByTestId(`img-recipe-3`);
    const title3 = await screen.findByTestId(`title-recipe-3`);

    expect(img1).toBeInTheDocument();
    expect(title1).toHaveTextContent("Recipe 1");

    expect(img2).toBeInTheDocument();
    expect(title2).toHaveTextContent("Recipe 2");

    expect(img3).toBeInTheDocument();
    expect(title3).toHaveTextContent("Recipe 3");
  });

  test("should handle fetch error and log the error", async () => {
    const errorMessage = "Failed to fetch";
    fetch.mockRejectedValueOnce(new Error(errorMessage));

    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    render(<App />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    });

    consoleSpy.mockRestore();
  });
});
