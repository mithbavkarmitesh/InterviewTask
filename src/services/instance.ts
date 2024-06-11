import ky from "ky";

import { store } from "@/store";
import { selectUser, setToken } from "@/store/userSlice";
const chalk = require("chalk");
const ctx = new chalk.Instance({ level: 3 });
const prefixUrl = `${process.env.API_URL ? process.env.API_URL : ""}/`;
const log = console.debug;
export const instance = ky.extend({
  prefixUrl: "http://api.treefe.com:8084/",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  hooks: {
    beforeRequest: [
      (request) => {
        // Check if the request needs a token
        const isTokenRequired = request.headers.get("AuthorizationRequired"); // AuthorizationRequired is a Custom Header

        // If a token is required, add it to the Authorization header
        if (isTokenRequired) {
          const token = selectUser(store?.getState()).accessToken || ""; // Retrieve your token from wherever store
          request.headers.set("Authorization", `Bearer ${token}`);
        }
        // console.group("beforeRequest");
        // Log request details with color
        log(
          `🚀 ${ctx.green("Request:")} ${request.method} ${ctx.green(
            request.url
          )}`
        );
        log(`🔗 ${ctx.blue("Headers:")} ${JSON.stringify(request.headers)}`);
        if (request.body) {
          log(`📦 ${ctx.yellow("Body:")} ${JSON.stringify(request.body)}`);
        }
        // console.groupEnd();

        return request;
      },
    ],
    afterResponse: [
      async (_input, _options, response) => {
        // Log response details with color
        // console.group("afterResponse");
        // console.log("afterResponse");
        log(`🎉 ${ctx.green("Response:")} ${response.status} ${response.url}`);
        log(`🔗 ${ctx.blue("Headers:")} ${JSON.stringify(response.headers)}`);
        log(
          `📦 ${ctx.yellow("Body:")} ${JSON.stringify(await response.json())}`
        );
        // console.groupEnd();
        // Or return a `Response` instance to overwrite the response.

        return response;
      },

      // Or retry with a fresh token on a 403 error
      async (input, options, response) => {
        if (response.status === 403) {
          // Get a fresh token
          const token = await ky(`${prefixUrl}/auth/refreshToken`, {
            body: JSON.stringify(selectUser(store.getState()).token),
          }).text();
          if (token) store.dispatch(setToken(token));
          // Retry with the token
          options.headers?.set("Authorization", `Bearer ${token}`);
          return ky(input, options);
        }
        if (response.status === 404) {
          return new Response(
            JSON.stringify({
              flag: true,
              code: 200,
              message: "",
              data: null,
            }),
            {
              status: 200,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        }
      },
    ],
    beforeError: [
      async (error) => {
        const { response, request } = error;
        // console.debug("Error in API", response, request);
        log(`💥 ${ctx.red("Error:")} ${error.message}`);
        const _response = await response?.json();
        if (_response && _response?.message) {
          error.name = "API ERROR";
          error.message = `${_response?.message}`;
        }

        return error;
      },
    ],
  },
});
