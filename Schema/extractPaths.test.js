/**
 * @jest-environment node
 */

const { convertToPathsConfig } = require("./extractPaths");

describe("Extract Schema Paths", () => {
  it("should produce an object describing paths and services", async () => {
    const exampleSchema = {
      paths: {
        "/auth/login": { post: { operationId: "login" } },
        "/auth/register": { post: { operationId: "register" } },
        "/auth/logout": { delete: { operationId: "logout" } }
      }
    };

    const expectedResult = {
      paths: {
        login: { service: "/auth", endpoint: "/login", method: "POST" },
        register: { service: "/auth", endpoint: "/register", method: "POST" },
        logout: { service: "/auth", endpoint: "/logout", method: "DELETE" }
      },
      services: {
        auth: "/auth"
      }
    };

    const expectedServices = ["auth"];
    const expectedLogin = expectedResult.paths.login;
    const expectedRegister = expectedResult.paths.register;
    const expectedlogout = expectedResult.paths.logout;

    const result = await convertToPathsConfig(exampleSchema);

    expect(
      Object.keys(result.services).toEqual(
        expect.arrayContaining(expectedServices)
      )
    );
    expect(result.paths.login).toEqual(expect.objectContaining(expectedlogin));
    expect(result.paths.register).toEqual(
      expect.objectContaining(expectedRegister)
    );
    expect(result.paths.logout).toEqual(
      expect.objectContaining(expectedlogout)
    );
  });

  it("should produce an object describing paths and services even when two requests share an endpoint and other service found", async () => {
    const exampleSchema = {
      paths: {
        "/auth/login": {
          post: { operationId: "login" },
          put: { operationId: "superPutLogin" }
        },
        "/auth/register": { post: { operationId: "register" } },
        "/some_other_auth_route/logout": { delete: { operationId: "logout" } }
      }
    };

    const expectedResult = {
      paths: {
        superPutLogin: { service: "/auth", endpoint: "/login", method: "PUT" },
        login: { service: "/auth", endpoint: "/login", method: "POST" },
        register: { service: "/auth", endpoint: "/register", method: "POST" },
        logout: {
          service: "/some_other_auth_route",
          endpoint: "/logout",
          method: "DELETE"
        }
      },
      services: {
        auth: "/auth",
        some_other_auth_route: "/some_other_auth_route"
      }
    };

    const expectedServices = ["auth", "some_other_auth_route"];
    const expectedSuperPutLogin = expectedResult.paths.superPutLogin;
    const expectedLogin = expectedResult.paths.login;
    const expectedRegister = expectedResult.paths.register;
    const expectedlogout = expectedResult.paths.logout;

    const result = await convertToPathsConfig(exampleSchema);

    expect(
      Object.keys(result.services).toEqual(
        expect.arrayContaining(expectedServices)
      )
    );
    expect(result.paths.login).toEqual(expect.objectContaining(expectedlogin));
    expect(result.paths.register).toEqual(
      expect.objectContaining(expectedRegister)
    );
    expect(result.paths.logout).toEqual(
      expect.objectContaining(expectedlogout)
    );
    expect(result.paths.superPutLogin).toEqual(
      expect.objectContaining(expectedSuperPutLogin)
    );
  });

  it("should consider consider endpoint to simply be '/' if endpoint is located on route service", async () => {
    const exampleSchema = {
      paths: {
        "/auth": {
          post: { operationId: "login" },
          delete: { operationId: "logout" }
        }
      }
    };

    const expectedResult = {
      paths: {
        login: { service: "/auth", endpoint: "/", method: "POST" },
        logout: {
          service: "/auth",
          endpoint: "/",
          method: "DELETE"
        }
      },
      services: {
        auth: "/auth"
      }
    };

    const expectedServices = ["auth"];
    const expectedSuperPutLogin = expectedResult.paths.superPutLogin;
    const expectedLogin = expectedResult.paths.login;
    const expectedRegister = expectedResult.paths.register;
    const expectedlogout = expectedResult.paths.logout;
    const result = await convertToPathsConfig(exampleSchema);

    expect(
      Object.keys(result.services).toEqual(
        expect.arrayContaining(expectedServices)
      )
    );
    expect(result.paths.login).toEqual(expect.objectContaining(expectedlogin));
    expect(result.paths.register).toEqual(
      expect.objectContaining(expectedRegister)
    );
    expect(result.paths.logout).toEqual(
      expect.objectContaining(expectedlogout)
    );
    expect(result.paths.superPutLogin).toEqual(
      expect.objectContaining(expectedSuperPutLogin)
    );
  });
});
