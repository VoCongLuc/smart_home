#ifndef WIFI_H
#define WIFI_H

#include <ESP8266WiFi.h>
#include "../config/config.h"


extern WiFiClient espClient;

void setupWifi();

#endif