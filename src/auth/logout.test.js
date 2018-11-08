/**
 * @jest-environment node
 */

const axios = require("axios");
const { port } = require("../../config");
const uuidv4 = require("uuid/v4");

describe("Logout", () => {
  it("should reject a logout attempt if no authentication is provided and response with 401", async () => {
    const expectedResponseCode = 401;
    const expectedResponseText = "Unauthorized";

    try {
      const logoutResponse = await axios({
        url: `http://localhost:${port}/auth/logout`,
        method: "DELETE"
      });
      if (response) throw new Error();
    } catch (error) {
      expect(error.response.status).toEqual(expectedResponseCode);
      expect(error.response.statusText).toEqual(expectedResponseText);
    }
    /////////////////////////////////////
  });

  it("should approve request to auth route prior to logout. it should respond with 401 after logout", () => {
    // register
    // login to get token
    // authenticate to test route
    // logout
    // use same token and authenticate to test route

    const email = `${uuidv4()}@testing.com`;
    const password = uuidv4();

    // create account.
    const regResponse = axios({
      url: `http://localhost:${port}/auth/register`,
      method: "POST",
      data: { email, password, confirmPassword: password }
    }).then(() => {
      // Then login
      axios({
        url: `http://localhost:${port}/auth/login`,
        method: "POST",
        data: { email, password }
      }).then(loginResponse => {
        // Then save token and check verification path
        expect(loginResponse.status).toEqual(201);
        const token = loginResponse.data.token;
        const headers = { Authorization: `Bearer ${token}` };

        axios({
          url: `http://localhost:${port}/test/verify_jwt`,
          headers
        }).then(authTestResponse => {
          // Then confirm that I have access and logout
          expect(authTestResponse.data).toEqual("access_granted");

          axios({
            url: `http://localhost:${port}/auth/logout`,
            method: "DELETE",
            headers
          }).then(() => {
            // Then to to access authed route again
            axios({
              url: `http://localhost:${port}/test/verify_jwt`,
              headers
            })
              .then(authTestResponse2 => {
                if (authTestResponse2) throw new Error();
              })
              .catch(error => {
                // Catch an unauthorized error
                expect(error.response.status).toEqual(401);
                expect(error.response.statusText).toEqual("Unauthorized");
              });
          });
        });
      });
    });
  });
});
