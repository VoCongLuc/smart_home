#include <string>
#include <vector>
#include <ArduinoJson.h>

#include "src/config/config.h"
#include "src/connections/wifi.h"
#include "src/connections/mqtt.h"

using namespace std;

void setup()
{
  pinMode(D4, OUTPUT);
  Serial.begin(115200);
  // hàm thực hiện chức năng kết nối Wifi và in ra địa chỉ IP của ESP8266
  setupWifi();
  // cài đặt server là broker.mqtt-dashboard.com và lắng nghe client ở port 1883
  client.setServer(mqtt_server, 1883);
  // gọi hàm callback để thực hiện các chức năng publish/subcribe
  client.setCallback(callback);
  // gọi hàm reconnect() để thực hiện kết nối lại với server khi bị mất kết nối
  reconnect();
}

void callback(char *topic, byte *payload, unsigned int length)
{
  // in ra tên của topic và nội dung nhận được từ kênh MQTT lens đã publish
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");

  vector<char> vect;
  for (int i = 0; i < length; i++)
  {
    vect.push_back((char)payload[i]);
  }
  string str(vect.begin(), vect.end());
  Serial.print(str.c_str());

  DynamicJsonDocument doc(300);
  deserializeJson(doc, str);

  JsonObject obj = doc.as<JsonObject>();

  String action = obj["action"];

  if (action == "tat") // on
    digitalWrite(D4, LOW);
  else if (action == "bat") // off
    digitalWrite(D4, HIGH);
  Serial.println();
}

void reconnect()
{
  // lặp cho đến khi được kết nối trở lại
  while (!client.connected())
  {
    Serial.print("Attempting MQTT connection...");
    if (client.connect("ESP8266"))
    {
      Serial.println("connected");
      // đăng kí nhận gói tin tại topic ESP8266/LED_GPIO16/status
      client.subscribe("DEN");
    }
    else
    {
      // in ra màn hình trạng thái của client khi không kết nối được với MQTT broker
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // delay 5s trước khi thử lại
      delay(5000);
    }
  }
}

int measureTemperature() {
  return random(1000) % 10 + 25;
}
int i = 0;
void loop()
{
  // kiểm tra nếu ESP8266 chưa kết nối được thì sẽ thực hiện kết nối lại
  if (!client.connected())
  {
    reconnect();
  }
  client.loop();
  if (i >= 25000) {
    int temp = measureTemperature();
    DynamicJsonDocument doc(1024);

    doc["sensor"] = "temp";
    doc["data"]   = temp;
    String str;
    serializeJson(doc, str);
    client.publish("nhietdo", str.c_str());
    i = 0;
  }
  i++;
}