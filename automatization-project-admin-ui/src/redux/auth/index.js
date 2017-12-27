import auth0 from "auth0-js";
import { AUTH_CONFIG } from "./auth0-variables";

export default class Auth {
  auth0 = new auth0.WebAuth({
    domain: AUTH_CONFIG.domain,
    clientID: AUTH_CONFIG.clientId,
    redirectUri: AUTH_CONFIG.callbackUrl,
    audience: `https://${AUTH_CONFIG.domain}/userinfo`,
    responseType: "token id_token",
    scope: "openid email resource_server"
  });

  constructor() {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.parseHash = this.parseHash.bind(this);
    this.getSessionData = this.getSessionData.bind(this);
    // this.scheduleRenewal = this.scheduleRenewal.bind(this);
  }

  handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
      } else if (err) {
        console.log(err);
        alert(`Error: ${err.error}. Check the console for further details.`);
      }
    });
  }

  login() {
    this.auth0.authorize();
  }

  parseHash(callback) {
    this.auth0.parseHash(callback);
  }

  setSession(authResult) {
    // Set the time that the access token will expire at
    const expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    );
    localStorage.setItem("access_token", authResult.accessToken);
    localStorage.setItem("id_token", authResult.idToken);
    localStorage.setItem("expires_at", expiresAt);
    localStorage.setItem("email", authResult.idTokenPayload.email);
    // navigate to the home route
    // this.scheduleRenewal();
  }

  logout() {
    // Clear access token and ID token from local storage
    localStorage.removeItem("access_token");
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
    // navigate to the home route
  }

  isAuthenticated() {
    let expiresAt = JSON.parse(localStorage.getItem("expires_at"));
    return new Date().getTime() < expiresAt;
  }

  getSessionData() {
    if (this.isAuthenticated()) {
      return {
        access_token: localStorage.getItem("access_token"),
        id_token: localStorage.getItem("id_token"),
        expires_at: localStorage.getItem("expires_at"),
        email: localStorage.getItem("email")
      };
    } else {
      return undefined;
    }
  }

  // renewToken() {
  //   this.auth0.checkSession({}, (err, result) => {
  //     if (err) {
  //       alert(
  //         `Could not get a new token (${err.error}: ${err.error_description}).`
  //       );
  //     } else {
  //       this.setSession(result);
  //       alert(`Successfully renewed auth!`);
  //     }
  //   });
  // }

  // scheduleRenewal() {
  //   const expiresAt = JSON.parse(localStorage.getItem("expires_at"));
  //   const delay = expiresAt - Date.now();
  //   if (delay > 0) {
  //     this.tokenRenewalTimeout = setTimeout(() => {
  //       this.renewToken();
  //     }, delay);
  //   }
  // }
}
