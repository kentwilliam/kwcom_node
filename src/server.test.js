import { isValidRoute } from "./server.js";

const validUrls = [
  "/",
  "/feed",
  "/notes/my-post",
  "/static/image.jpg",
  "/?utm_source=threads&utm_medium=social&utm_content=link_in_bio",
  "/?ref=twitter.com",
  "/?q=hello+world&encoded=%20",
  "/notes/post?ref=home#section",
];

const invalidUrls = [
  "../etc/passwd",
  "/path/../secret",
  "/<script>alert(1)</script>",
  "/path?<script>",
  '/path?foo="bar"',
  "/path with spaces",
  "/path;semicolon",
  "/path|pipe",
  "/path`backtick`",
  "/path$(command)",
];

describe("isValidRoute", () => {
  test.each(validUrls)("accepts %s", (url) => {
    expect(isValidRoute(url)).toBe(true);
  });

  test.each(invalidUrls)("rejects %s", (url) => {
    expect(isValidRoute(url)).toBe(false);
  });
});
