#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <EEPROM.h>
#include <DNSServer.h>

struct UserData {
  char wifiSsid[30] = "";
  char wifiPass[30] = "";
  char userToken[30] = "";
  int checksum = 0;
};

DNSServer dnsServer;
ESP8266WebServer server(80);

const uint dataAddr = 0;
struct UserData userData;

const String pointNameWithMac = "node_" + WiFi.softAPmacAddress();
const IPAddress apIP(192, 168, 1, 1);

const String ssid = pointNameWithMac.substring(0, 7);
const String password = "admin_password";

boolean needSetup = false;
String ssidList;

void setup() {
  delay(1000);
  Serial.begin(9600);
  EEPROM.begin(512);

  EEPROM.get(dataAddr, userData);

  if (!isNeedSetup() && connectToWifi() && checkConnection()) {
    needSetup = false;
  } else {
    needSetup = true;
    setupMode();
  }

  startWebServer();
}

bool isNeedSetup() {
  const String wifiSsid(userData.wifiSsid);
  const String wifiPassword(userData.wifiPass);
  const String userToken(userData.userToken);

  if (userData.checksum == (wifiSsid.length() + wifiPassword.length() + userToken.length())) {
    Serial.println();
    Serial.println("Correct data!");
    return false;
  } else {
    Serial.println();
    Serial.println("Incorrect data!");
    return true;
  }
}

bool connectToWifi() {
  const String wifiSsid(userData.wifiSsid);
  const String wifiPassword(userData.wifiPass);

  Serial.print("\nTry connect to ");
  Serial.println(wifiSsid);
  Serial.print("With pass: ");
  Serial.print(wifiPassword);

  return WiFi.begin(wifiSsid.c_str(), wifiPassword.c_str()) ? true : false;
}

boolean checkConnection() {
  int count = 0;
  Serial.print("\n\nWaiting for Wi-Fi connection");
  while ( count < 30 ) {
    if (WiFi.status() == WL_CONNECTED) {
      Serial.println();
      Serial.print("Connected to ");
      Serial.println(ssid);
      Serial.print("IP address: ");
      Serial.println(WiFi.localIP());

      sendInitMessage();

      return true;
    }
    delay(500);
    Serial.print(".");
    count++;
  }
  Serial.println("Timed out.");
  return false;
}

void saveSettings(String ssid, String pass, String userToken) {
  ssid.toCharArray(userData.wifiSsid, 30);
  pass.toCharArray(userData.wifiPass, 30);
  userToken.toCharArray(userData.userToken, 30);

  userData.checksum = ssid.length() + pass.length() + userToken.length();

  EEPROM.put(dataAddr, userData);
  EEPROM.commit();
}

void setupMode() {
  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  delay(100);

  const int n = WiFi.scanNetworks();
  delay(100);
  Serial.println("");

  for (int i = 0; i < n; ++i) {
    ssidList += "<option value=\"";
    ssidList += WiFi.SSID(i);
    ssidList += "\">";
    ssidList += WiFi.SSID(i);
    ssidList += "</option>";
  }

  delay(100);
  WiFi.mode(WIFI_AP);
  WiFi.softAPConfig(apIP, apIP, IPAddress(255, 255, 255, 0));
  WiFi.softAP(ssid.c_str(), password.c_str());
  dnsServer.start(53, "*", apIP);

  Serial.print("Starting Access Point at \"");
  Serial.print(ssid.c_str());
  Serial.println("\"");
}

void startWebServer() {
  if (needSetup) {
    Serial.print("Starting Web Server at ");
    Serial.println(WiFi.softAPIP());
    server.on("/settings", []() {
      String s = "<h1>Wi-Fi Settings</h1><p>Please enter your password by selecting the SSID.</p>";
      s += "<form method=\"get\" action=\"setap\"><label>SSID: </label><select name=\"ssid\">";
      s += ssidList;
      s += "</select><br>Password: <input name=\"pass\" length=64 type=\"password\"><br>User token: <input name=\"user_token\" length=64 type=\"text\"><input type=\"submit\"></form>";
      server.send(200, "text/html", makePage("Wi-Fi Settings", s));
    });
    server.on("/setap", []() {
      const String ssid = urlDecode(server.arg("ssid"));
      Serial.print("SSID: ");
      Serial.println(ssid);

      const String pass = urlDecode(server.arg("pass"));
      Serial.print("Password: ");
      Serial.println(pass);

      const String userToken = urlDecode(server.arg("user_token"));
      Serial.print("User tokoen: ");
      Serial.println(userToken);

      Serial.println("Writing ssid and pass to EEPROM...");
      saveSettings(ssid, pass, userToken);

      Serial.println("Write EEPROM done!");
      String s = "<h1>Setup complete.</h1><p>device will be connected to \"";
      s += ssid;
      s += "\" after the restart.";
      server.send(200, "text/html", makePage("Wi-Fi Settings", s));
      ESP.restart();
    });

    server.onNotFound([]() {
      String s = "<h1>Init mode</h1><p><a href=\"/settings\">Wi-Fi Settings</a></p>";
      server.send(200, "text/html", makePage("AP mode", s));
    });
  }
  else {
    WiFi.softAPdisconnect (true);
    Serial.print("Starting Web Server at ");
    Serial.println(WiFi.localIP());
    server.on("/", []() {
      String s = "<h1>Node Settings</h1><p><a href=\"/reset\">Reset Wi-Fi Settings</a></p>";
      server.send(200, "text/html", makePage("Node settings", s));
    });
    server.on("/reset", []() {
      saveSettings("reset", "reset", "reset");
      String s = "<h1>Wi-Fi settings was reset.</h1><p>Device will be reset in few seconds.</p>";
      server.send(200, "text/html", makePage("Reset Wi-Fi Settings", s));
      delay(1000);
      ESP.restart();
    });
  }
  server.begin();
}

String makePage(String title, String contents) {
  String s = "<!DOCTYPE html><html><head>";
  s += "<meta name=\"viewport\" content=\"width=device-width,user-scalable=0\">";
  s += "<title>";
  s += title;
  s += "</title></head><body>";
  s += contents;
  s += "</body></html>";
  return s;
}

String urlDecode(String input) {
  String s = input;
  s.replace("%20", " ");
  s.replace("+", " ");
  s.replace("%21", "!");
  s.replace("%22", "\"");
  s.replace("%23", "#");
  s.replace("%24", "$");
  s.replace("%25", "%");
  s.replace("%26", "&");
  s.replace("%27", "\'");
  s.replace("%28", "(");
  s.replace("%29", ")");
  s.replace("%30", "*");
  s.replace("%31", "+");
  s.replace("%2C", ",");
  s.replace("%2E", ".");
  s.replace("%2F", "/");
  s.replace("%2C", ",");
  s.replace("%3A", ":");
  s.replace("%3A", ";");
  s.replace("%3C", "<");
  s.replace("%3D", "=");
  s.replace("%3E", ">");
  s.replace("%3F", "?");
  s.replace("%40", "@");
  s.replace("%5B", "[");
  s.replace("%5C", "\\");
  s.replace("%5D", "]");
  s.replace("%5E", "^");
  s.replace("%5F", "-");
  s.replace("%60", "`");
  return s;
}

void sendInitMessage() {
  Serial.println("Sending init message");
}

void loop() {
  server.handleClient();
}
