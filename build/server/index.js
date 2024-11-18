import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable, redirect } from "@remix-run/node";
import { RemixServer, Outlet, Meta, Links, ScrollRestoration, Scripts, useLoaderData } from "@remix-run/react";
import * as isbotModule from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { rootAuthLoader, getAuth } from "@clerk/remix/ssr.server";
import { ClerkApp, SignIn, UserButton, SignOutButton } from "@clerk/remix";
import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
const ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  let prohibitOutOfOrderStreaming = isBotRequest(request.headers.get("user-agent")) || remixContext.isSpaMode;
  return prohibitOutOfOrderStreaming ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function isBotRequest(userAgent) {
  if (!userAgent) {
    return false;
  }
  if ("isbot" in isbotModule && typeof isbotModule.isbot === "function") {
    return isbotModule.isbot(userAgent);
  }
  if ("default" in isbotModule && typeof isbotModule.default === "function") {
    return isbotModule.default(userAgent);
  }
  return false;
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onAllReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
const meta = () => [{
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1"
}];
const loader$3 = (args) => rootAuthLoader(args);
function Layout({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsx(ScrollRestoration, {}),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
}
const root = ClerkApp(App);
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Layout,
  default: root,
  loader: loader$3,
  meta
}, Symbol.toStringTag, { value: "Module" }));
function Page$2() {
  return /* @__PURE__ */ jsxs("div", { className: "flex justify-center py-24", children: [
    "Please sign in.",
    /* @__PURE__ */ jsx(SignIn, {})
  ] });
}
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Page$2
}, Symbol.toStringTag, { value: "Module" }));
function Page$1() {
  return /* @__PURE__ */ jsxs("div", { className: "flex justify-center py-24", children: [
    "Please sign in.",
    /* @__PURE__ */ jsx(SignIn, {})
  ] });
}
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Page$1
}, Symbol.toStringTag, { value: "Module" }));
const loader$2 = async (args) => {
  const { userId, getToken } = await getAuth(args);
  if (!userId) {
    return redirect("/sign-in");
  }
  const authToken = await getToken();
  console.log(userId);
  if (!authToken) {
    return null;
  }
  const DATABASE_AUTHENTICATED_URL = process.env.NEXT_PUBLIC_DATABASE_AUTHENTICATED_URL;
  try {
    const sql2 = neon(DATABASE_AUTHENTICATED_URL ?? "", {
      authToken
    });
    const todosResponse = await sql2(`INSERT INTO login_history ("user_id") VALUES ($1) RETURNING *`, [userId]);
    const last10LoginsResponse = await sql2(`SELECT * FROM login_history WHERE user_id = $1 ORDER BY login_at DESC LIMIT 10`, [userId]);
    console.log(`Todos Response: ${JSON.stringify(todosResponse)}`);
    return last10LoginsResponse;
  } catch (error) {
    console.error(`Error inserting into login_history table: ${error.message}`);
    console.error(`Error details: ${JSON.stringify(error)}`);
    throw error;
  }
};
function Index() {
  const todos = useLoaderData();
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("h1", { children: "Signed in" }),
    /* @__PURE__ */ jsx("p", { children: "You are signed in!" }),
    /* @__PURE__ */ jsxs("p", { children: [
      " ",
      /* @__PURE__ */ jsx(UserButton, {})
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { children: "Recent Logins" }),
      todos == null ? void 0 : todos.map((todo) => /* @__PURE__ */ jsxs("li", { children: [
        todo.user_id,
        " login at: ",
        todo.login_at
      ] }, todo.id))
    ] }),
    /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(SignOutButton, { children: " Sign Out" }) })
  ] }) });
}
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Index,
  loader: loader$2
}, Symbol.toStringTag, { value: "Module" }));
const loader$1 = async (args) => {
  const { userId, getToken } = await getAuth(args);
  const authToken = await getToken();
  console.log(userId);
  if (!authToken) {
    return null;
  }
  const DATABASE_AUTHENTICATED_URL = process.env.NEXT_PUBLIC_DATABASE_AUTHENTICATED_URL;
  try {
    const sql2 = neon(DATABASE_AUTHENTICATED_URL ?? "", {
      authToken
    });
    const todosResponse = await sql2(`INSERT INTO login_history ("user_id") VALUES ($1) RETURNING *`, [userId]);
    const last10LoginsResponse = await sql2(`SELECT * FROM login_history WHERE user_id = $1 ORDER BY login_at DESC LIMIT 10`, [userId]);
    console.log(`Todos Response: ${JSON.stringify(todosResponse)}`);
    return last10LoginsResponse;
  } catch (error) {
    console.error(`Error inserting into login_history table: ${error.message}`);
    console.error(`Error details: ${JSON.stringify(error)}`);
    throw error;
  }
};
function TodoList() {
  const todos = useLoaderData();
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("h1", { style: { padding: "20px 0", marginBottom: "10px" }, children: "Your Last 10 Logins" }),
    /* @__PURE__ */ jsx("ul", { children: todos == null ? void 0 : todos.map((todo) => /* @__PURE__ */ jsxs("li", { children: [
      todo.user_id,
      " login at: ",
      todo.login_at
    ] }, todo.id)) })
  ] });
}
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: TodoList,
  loader: loader$1
}, Symbol.toStringTag, { value: "Module" }));
dotenv.config();
const sql = neon(process.env.DATABASE_URL);
const loader = async () => {
  const response = await sql`SELECT version()`;
  return response[0].version;
};
function Page() {
  const data = useLoaderData();
  return /* @__PURE__ */ jsx(Fragment, { children: data });
}
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Page,
  loader
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-DZgfouxx.js", "imports": ["/assets/components-BCDCSGm0.js", "/assets/browser-JwG-366k.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/root-A6_3nTWl.js", "imports": ["/assets/components-BCDCSGm0.js", "/assets/browser-JwG-366k.js", "/assets/index-NhthBudf.js"], "css": [] }, "routes/sign-in": { "id": "routes/sign-in", "parentId": "root", "path": "sign-in", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/sign-in-D_uLRn0T.js", "imports": ["/assets/components-BCDCSGm0.js", "/assets/index-NhthBudf.js", "/assets/browser-JwG-366k.js"], "css": [] }, "routes/sign-up": { "id": "routes/sign-up", "parentId": "root", "path": "sign-up", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/sign-up-D_uLRn0T.js", "imports": ["/assets/components-BCDCSGm0.js", "/assets/index-NhthBudf.js", "/assets/browser-JwG-366k.js"], "css": [] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_index-BSCG7FFI.js", "imports": ["/assets/components-BCDCSGm0.js", "/assets/index-NhthBudf.js", "/assets/browser-JwG-366k.js"], "css": [] }, "routes/ciient": { "id": "routes/ciient", "parentId": "root", "path": "ciient", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/ciient-DQu5dl6f.js", "imports": ["/assets/components-BCDCSGm0.js"], "css": [] }, "routes/dbtest": { "id": "routes/dbtest", "parentId": "root", "path": "dbtest", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/dbtest-IEet7w0m.js", "imports": ["/assets/components-BCDCSGm0.js"], "css": [] } }, "url": "/assets/manifest-59398e28.js", "version": "59398e28" };
const mode = "production";
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "v3_fetcherPersist": false, "v3_relativeSplatPath": false, "v3_throwAbortReason": false, "v3_singleFetch": false, "v3_lazyRouteDiscovery": false, "unstable_optimizeDeps": false };
const isSpaMode = false;
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/sign-in": {
    id: "routes/sign-in",
    parentId: "root",
    path: "sign-in",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/sign-up": {
    id: "routes/sign-up",
    parentId: "root",
    path: "sign-up",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route3
  },
  "routes/ciient": {
    id: "routes/ciient",
    parentId: "root",
    path: "ciient",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/dbtest": {
    id: "routes/dbtest",
    parentId: "root",
    path: "dbtest",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  mode,
  publicPath,
  routes
};
