

// url_test.ts
import { assertEquals } from "https://deno.land/std@0.168.0/testing/asserts.ts";

Deno.test("url test", () => {
  // const media: MediaObject = {}
  // const video = new HTMLVideoElement()

  const url = new URL("./foo.js", "https://deno.land/");
  assertEquals(url.href, "https://deno.land/foo.js");
});