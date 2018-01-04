import * as RestUrls from "./config";

export function ApiCall(url, idToken, body, method = "POST") {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json"
  };

  if (idToken) {
    headers["Authorization"] = `Bearer ${idToken}`;
  }

  const params = {
    method: method,
    headers: headers
  };

  if (body) {
    params.body = JSON.stringify(body);
  }

  return fetch(url, params).then(response => {
    if (response.status >= 400 && response.status < 600) {
      throw new Error("Request failed");
    }
    return response.json();
  });
}

export const RestApi = {
  ListNodes: (idToken, clientId) => {
    return ApiCall(RestUrls.NODES_URL, idToken, null, "GET");
  }
};

export default RestApi;
