#include <Arduino.h>

#include <MinionTools.h>
#include <ComSerialBridge.h>
#include <UsbhostCDC.hpp>
    
uint8_t sendCmd[] = {1,164,0,206,0,26,0,23,0,26,0,23,0,26,0,74,0,26,0,23,0,26,0,23,0,26,0,23,0,26,0,23,0,26,0,23,0,26,0,74,0,26,0,74,0,26,0,23,0,26,0,74,0,26,0,74,0,26,0,74,0,26,0,74,0,26,0,74,0,26,0,23,0,26,0,23,0,26,0,23,0,26,0,74,0,26,0,23,0,26,0,23,0,26,0,23,0,26,0,23,0,26,0,74,0,26,0,74,0,26,0,74,0,26,0,23,0,26,0,74,0,26,0,74,0,26,0,74,0,26,0,74,0,26,7,102,1,165,0,102,0,26,17,122,1,165,0,102,0,26,17,122,1,165,0,102,0,26,255,255};
//uint8_t sendCmd[] = {1,164,0,206,0,26,0,23,0,26,0,23,0,26,0,74,0,26,0,23,0,26,0,23,0,26,0,23,0,26,0,23,0,26,0,23,0,26,0,74,0,26,0,74,0,26,0,23,0,26,0,74,0,26,0,74,255,255};

void statusCallback(bool pStatus) {
  MinionTools::addLog("***HELLO*** status: %i \n", pStatus);
    
    if(pStatus != true) return;
  
    UsbhostCDC::controlDevice(&sendCmd[0], sizeof(sendCmd));
    delay(5000);
    UsbhostCDC::controlDevice(&sendCmd[0], sizeof(sendCmd));
    delay(5000);
    UsbhostCDC::controlDevice(&sendCmd[0], sizeof(sendCmd));
    delay(5000);
    UsbhostCDC::controlDevice(&sendCmd[0], sizeof(sendCmd));
}

void setup()
{
    ComSerialBridge::open(115200);
    delay(5000);
    MinionTools::addLog("%s \n", "irDroid::setup Start");
   
    UsbhostCDC::open(&statusCallback);
}

void loop()
{
    //delay(10);
    //MinionTools::addLog("%s \n", "UsbhostInterface::refresh");
    UsbhostCDC::refresh();
}
