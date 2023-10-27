#include "Den.h"

Den::Den(int port, bool isOn)
{
    this->port = port;
    this->isOn = isOn;
}

Den::Den()
{
    this->port = 0;

}

void Den::turnOn()
{
    this->isOn = true;
}

