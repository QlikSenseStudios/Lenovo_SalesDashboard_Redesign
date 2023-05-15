import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import axios from "axios";
import PlaceHolder from "./components/PlaceHolder";

async function checkUserLogin(tenant, webIntegrationId) {
  try {
    // call your-tenant.us.qlikcloud.com/api/v1/users/me to
    // retrieve the user metadata, as a way to detect if they
    // are signed in. An error will be thrown if the response
    // is a non-2XX HTTP status:
    //const res = await fetch(`/api/v1/users/me`, {
    const res = await fetch(`https://${tenant}/api/v1/users/me`, {
      mode: "cors",
      credentials: "include",
      redirect: "follow",
      headers: {
        // web integration is sent as a header:
        "qlik-web-integration-id": webIntegrationId,
      },
    });
    if (res.status < 200 || res.status >= 400) throw res;
  } catch (err) {
    const returnTo = encodeURIComponent(window.location.href);
    // redirect your user to the tenant log in screen, and once they're
    // signed in, return to your web app:
    window.location.href = `https://${tenant}/login?returnto=${returnTo}&qlik-web-integration-id=${webIntegrationId}`;
    throw err;
  }
}

async function getQCSHeaders({ webIntegrationId, url }) {
  const response = await fetch(`${url}/api/v1/csrf-token`, {
    credentials: "include",
    headers: { "qlik-web-integration-id": webIntegrationId },
  });
  if (response.status === 401) {
    const loginUrl = new URL(`${url}/login`);
    loginUrl.searchParams.append("returnto", window.location.href);
    loginUrl.searchParams.append("qlik-web-integration-id", webIntegrationId);
    window.location.href = loginUrl;
    return undefined;
  }
  const csrfToken = new Map(response.headers).get("qlik-csrf-token");
  return {
    "qlik-web-integration-id": webIntegrationId,
    "qlik-csrf-token": csrfToken,
  };
}

//make an ajax call to dynamically get the appID once the app list has been filtered by tag name
const setup = async (name) => {
  //console.log("process",process.env)

  //for PRD
  // if(host==="ddwiel1pyau3r.cloudfront.net"){
  //   console.log("PRD");
  // }

  //   const tenant ="lenovo-lph-ai.us.qlikcloud.com";
  //   const webIntegrationId = "9Qj-tLrexDWjKAoOJRx9Gnh6a0z7oTmA";
  //   const spaceID = "61327a6341b8a9e9a21a53eb";

  //   (function() {
  //     var qtm = document.createElement('script'); qtm.type = 'text/javascript'; qtm.async = 1;
  //     qtm.src = 'https://cdn.quantummetric.com/qscripts/quantum-lenovopartnerhub.js';
  //     var d = document.getElementsByTagName('script')[0];
  //     !window.QuantumMetricAPI && d.parentNode.insertBefore(qtm, d);
  // })();

  //for UAT
  // if(host==="dyq9uf3gawydx.cloudfront.net"){
  //   console.log("UAT");
  // }

  // const tenant ="mbq71d0rz7otbdf.eu.qlikcloud.com";
  // const webIntegrationId = "pBw85_j9m_Thz5A6U5tDm37BiFmouLrH";
  // const spaceID = "618bd084eac3bd232c7a07ec";

  const tenant = process.env.tenant;
  const webIntegrationId = process.env.webIntegrationId;
  const spaceID = process.env.spaceID;

  // if (process.env.Qlik_ENV === "UAT")
  //   (function () {
  //     var qtm = document.createElement("script");
  //     qtm.type = "text/javascript";
  //     qtm.async = 1;
  //     qtm.src =
  //       "https://cdn.quantummetric.com/qscripts/quantum-lenovopartnerhub-test.js";
  //     var d = document.getElementsByTagName("script")[0];
  //     !window.QuantumMetricAPI && d.parentNode.insertBefore(qtm, d);
  //   })();

  if (process.env.Qlik_ENV === "PRD")
    (function () {
      var qtm = document.createElement("script");
      qtm.type = "text/javascript";
      qtm.async = 1;
      qtm.src =
        "https://cdn.quantummetric.com/qscripts/quantum-lenovopartnerhub.js";
      var d = document.getElementsByTagName("script")[0];
      !window.QuantumMetricAPI && d.parentNode.insertBefore(qtm, d);
    })();

  // show connecting message
  ReactDOM.render(
    <PlaceHolder message="Connecting, please wait" />,
    document.getElementById("root")
  );

  try {
    await checkUserLogin(tenant, webIntegrationId);

    const config = {
      url: "",
      host: tenant,
      isSecure: true,
      appname: "",
      webIntegrationId,
    };

    const settings = {
      crossDomain: true,
      withCredentials: true,
      url: `https://${tenant}/api/v1/items?resourceType=app&spaceId=${spaceID}&limit=50`,
      method: "GET",
      headers: { "qlik-web-integration-id": config.webIntegrationId },
      appName: name,
    };

    return axios(settings)
      .then(async ({ data: response }) => {
        const apps = response.data;
        //console.log(apps);
        const appname = apps.find(
          (app) => app.name === settings.appName
        )?.resourceId;
        config.appname = appname;
        const headers = await getQCSHeaders({
          url: `https://${tenant}`,
          webIntegrationId: webIntegrationId,
        });
        const params = Object.keys(headers)
          .map((key) => `${key}=${headers[key]}`)
          .join("&");

        config.url = `wss://${config.host}/app/${appname}?${params}`;
        //  console.log(config);
        return { config, apps };
      })
      .catch((error) => {
        return ReactDOM.render(
          <PlaceHolder message="Connection Failed" />,
          document.getElementById("root")
        );
      });
  } catch {
    return ReactDOM.render(
      <PlaceHolder message="Connecting, please wait" />,
      document.getElementById("root")
    );
  }
};
export default setup;

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

// async function handleAutomaticLogin() {  const { token } = await fetch("token").then(resp =>  resp.json());
//   const login = await fetch(    `https://${tenantDomain}/login/jwt-session?qlik-web-integration-id=${qlikWebIntegrationId}`,    {      method: "POST",      credentials: "include",      mode: "cors",      headers: {        "content-type": "application/json",        Authorization: `Bearer ${token}`,        "qlik-web-integration-id": qlikWebIntegrationId
//       },      rejectunAuthorized: false    }  );
// }
