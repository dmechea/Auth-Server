/**
 * @jest-environment node
 */

const axios = require("axios");
const { port } = require("../../../config");
const uuidv4 = require("uuid/v4");

describe("Change Password", () => {
  it("should reject a change password attempt from unverified user", async () => {
    const expectedResponseCode = 401;
    const expectedResponseText = "Unauthorized";

    const currentPassword = "Magic_Unicorn";
    const newPassword = "Magic_Dolphin";
    const confirmNewPassword = "Magic_Dolphin";

    try {
      const passwordResponse = await axios({
        url: `http://localhost:${port}/auth/password`,
        method: "PUT",
        data: { currentPassword }
      });
    } catch (error) {
      expect(error.response.status).toEqual(expectedResponseCode);
      expect(error.response.statusText).toEqual(expectedResponseText);
    }
  });
});
