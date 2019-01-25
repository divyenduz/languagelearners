import fetch from "node-fetch";

const serviceURL = "http://localhost:3000";

test("GET 200 - OK", async () => {
  const r = await fetch(serviceURL);
  expect(r.status).toBe(200);
  expect(r.statusText).toBe("OK");
});
