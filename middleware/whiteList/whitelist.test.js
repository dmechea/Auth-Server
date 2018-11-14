/**
 * @jest-environment node
 */

const redis = require("redis");
const axios = require("axios");
const { port } = require("../../config");
const uuidv4 = require("uuid/v4");
const Whitelist = require("./index");

describe("Whitelist", () => {
  beforeAll(async () => {
    whitelist = new Whitelist(redis);
    whitelist.flushTokens();
  });
  afterAll(() => {
    whitelist.shutdown();
  });

  it("should correctly add an entry to redis", async () => {
    const status = await whitelist.addToken("token", "value");
    expect(status).toEqual("OK");

    const entry = await whitelist.lookUpToken("token");
    expect(entry).toEqual(expect.anything());
    expect(entry).toEqual("value");
  });

  it("should throw null for a random entry", async () => {
    const entry = await whitelist.lookUpToken(uuidv4());
    expect(entry).not.toEqual(expect.anything());
  });

  it("should add and remove an entry", async () => {
    const status = await whitelist.addToken("token", "value");
    expect(status).toEqual("OK");

    const entry = await whitelist.lookUpToken("token");
    expect(entry).toEqual(expect.anything());
    expect(entry).toEqual("value");

    const removed = await whitelist.removeToken("token");

    const check = await whitelist.lookUpToken("token");
    expect(check).not.toEqual(expect.anything());
  });
});
