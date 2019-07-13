import fetch from "node-fetch";
import { translate } from "../wrapper";

const serviceURL = "http://localhost:3000";

describe("HTTP", () => {
  test("GET 200 - OK", async () => {
    const r = await fetch(serviceURL);
    expect(r.status).toBe(200);
    expect(r.statusText).toBe("OK");
    const body = await r.text();
    expect(body).toBe("OK");
  });

  test("GET 200 - Payment OK", async () => {
    const r = await fetch(`${serviceURL}/payment`);
    expect(r.status).toBe(200);
    expect(r.statusText).toBe("OK");
    const body = await r.text();
    expect(body).toBe("OK - payment");
  });
});

describe("Providers", () => {
  test("Translate", async () => {
    expect(await translate("Hallo", "auto", "en")).toBe("Hello");
    expect(await translate("Hello", "en", "de")).toBe("Hallo");
    expect(await translate("Hallo", "de", "en")).toBe("Hello");
  });
});
