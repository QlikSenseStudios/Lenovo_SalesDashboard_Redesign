"use strict";

const path = require("path");
const fs = require("fs");
const url = require("url");

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

const envPublicUrl = process.env.PUBLIC_URL;

function ensureSlash(inputPath, needsSlash) {
  const hasSlash = inputPath.endsWith("/");
  if (hasSlash && !needsSlash) {
    return inputPath.substr(0, inputPath.length - 1);
  } else if (!hasSlash && needsSlash) {
    return `${inputPath}/`;
  } else {
    return inputPath;
  }
}

const getPublicUrl = (appPackageJson) =>
require(appPackageJson).homepage;
  //envPublicUrl || process.env.APP_TARGET === "sales"
    // ? require(appPackageJson).sales_homepage
    // : envPublicUrl || process.env.APP_TARGET === "program"
    // ? require(appPackageJson).program_homepage
    // : envPublicUrl || process.env.APP_TARGET === "performance"
    // ? require(appPackageJson).performance_homepage
    // : require(appPackageJson).homepage;

// We use `PUBLIC_URL` environment variable or "homepage" field to infer
// "public path" at which the app is served.
// Webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
function getServedPath(appPackageJson) {
  const publicUrl = getPublicUrl(appPackageJson);
  const servedUrl =
    envPublicUrl || (publicUrl ? url.parse(publicUrl).pathname : "/");
  return ensureSlash(servedUrl, true);
}

const moduleFileExtensions = [
  "web.mjs",
  "mjs",
  "web.js",
  "js",
  "web.ts",
  "ts",
  "web.tsx",
  "tsx",
  "json",
  "web.jsx",
  "jsx",
];

// Resolve file paths in the same order as webpack
const resolveModule = (resolveFn, filePath) => {
  const extension = moduleFileExtensions.find((extension) =>
    fs.existsSync(resolveFn(`${filePath}.${extension}`))
  );

  if (extension) {
    return resolveFn(`${filePath}.${extension}`);
  }

  return resolveFn(`${filePath}.js`);
};

// config after eject: we're in ./config/
module.exports = {
  dotenv: resolveApp(".env"),
  appPath: resolveApp("."),
  appBuild: resolveApp("build"),
  // appBuild: resolveApp(
  //   process.env.APP_TARGET === "sales"
  //     ? "sales_build"
  //     : process.env.APP_TARGET === "program"
  //     ? "program_build"
  //     : process.env.APP_TARGET === "performance"
  //     ? "performance_build"
  //     : "build"
  // ),
  appPublic: resolveApp("public"),
  appHtml: resolveApp("public/index.html"),
  appIndexJs: resolveModule(
    resolveApp,
    "src/index"
    // process.env.APP_TARGET === "sales"
    //   ? "src/sales_index"
    //   : process.env.APP_TARGET === "program"
    //   ? "src/program_index"
    //   : process.env.APP_TARGET === "performance"
    //   ? "src/performance_index"
    //   : "src/index"
  ),
  appPackageJson: resolveApp("package.json"),
  appSrc: resolveApp("src"),
  appTsConfig: resolveApp("tsconfig.json"),
  appJsConfig: resolveApp("jsconfig.json"),
  yarnLockFile: resolveApp("yarn.lock"),
  testsSetup: resolveModule(resolveApp, "src/setupTests"),
  proxySetup: resolveApp("src/setupProxy.js"),
  appNodeModules: resolveApp("node_modules"),
  publicUrl: getPublicUrl(resolveApp("package.json")),
  servedPath: getServedPath(resolveApp("package.json")),
  qextPath: resolveApp("qext/lenovo-performance-dashboard.qext"),
  // qextPath: resolveApp(
  //   process.env.APP_TARGET === "sales"
  //     ? "qext/lenovo-sales-performance.qext"
  //     : process.env.APP_TARGET === "program"
  //     ? "qext/lenovo-program-dashboard.qext"
  //     : process.env.APP_TARGET === "performance"
  //     ? "qext/lenovo-performance-dashboard.qext"
  //     : "qext/lenovo-velocity-header.qext"
  // ),
};

module.exports.moduleFileExtensions = moduleFileExtensions;
module.exports.resolveApp = resolveApp;
