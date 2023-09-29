#include <ArduinoModbus.h>
#include <ArduinoRS485.h>
#include <WiFi.h>
#include <ArduinoJson.h>
#include <ArduinoJson.hpp>

constexpr auto baudrate { 115200 };
constexpr auto btime { 1.0f / baudrate };
constexpr auto predl { btime * 9.6f * 3.5f * 1e6 };
constexpr auto postdl { btime * 9.6f * 3.5f * 1e6 };

//const char* ssid                       = "PLANTA_CFP123";                  // WIFI
const char* ssid                       = "drogaeobraya";                  // WIFI
//const char* password                   = "WiFiSen@i123";                  // SENHA WIFI
const char* password                   = "drogaeobraya";                  // SENHA WIFI
const char* server                     = "medidor-finder.onrender.com";            // ROTA DO SERVIDOR
 
WiFiClient client;

int machine_id = 1;
float POTENCIA_ATIVA_TOTAL;
float POTENCIA_REATIVA_TOTAL;
float POTENCIA_APARENTE_TOTAL;
float FATOR_POTENCIA;
float FREQUENCIA;
float U1;
float U2;
float U3;
float I1;
float I2;
float I3;

void setup() 
{
  Serial.begin(115200);
  delay(2000);
  pinMode(LED_D3, OUTPUT);

  wifiConnect();
  ModbusConnect();
}

void loop() 
{
  wifiConnect();
  ler_Modbus();

  digitalWrite(LED_D3, HIGH);
  delay(500);
  digitalWrite(LED_D3, LOW);
  delay(500);
}



void wifiConnect()
{
  if (WiFi.status() != WL_CONNECTED)
  {
    WiFi.begin(ssid, password);
    Serial.println("Connecting");

    while (WiFi.status() != WL_CONNECTED)
    {
      Serial.print(".");
      delay (1000);
    }
    Serial.println("");
    Serial.print("Connected to WiFi network with IP Address: ");
    Serial.println(WiFi.localIP());
    delay(1000);
  }
}

void ModbusConnect()
{
  RS485.setDelays(predl, postdl);
  if (!ModbusRTUClient.begin(baudrate, SERIAL_8N2 ) )
  {
    Serial.println("ERRO MODBUS");
    while (1);
  }
}





void ler_Modbus()
{
  Serial.println("Lendo MODBUS");
  //0x09BA - POTÊNCIA ATIVA TOTAL 32490-32491
  POTENCIA_ATIVA_TOTAL = readdata(0x21, 0X9BA);
  
  //0x09BC - POTÊNCIA REATIVA TOTAL 32492-32493
  POTENCIA_REATIVA_TOTAL = readdata(0x21, 0X9BC);
  
  //0x09BE - POTÊNCIA APARENTE TOTAL 32494-32495
  POTENCIA_APARENTE_TOTAL = readdata(0x21, 0X9BE);

  //0x09C0 - FATOR_POTENCIA 32496-32497
  FATOR_POTENCIA = readdata(0x21, 0X9C0);

  //0x09C2 - FREQUENCIA 32498-32499
  FREQUENCIA = readdata(0x21, 0X9C2);

  //0x09C4 - TENSÃO U1 32500-32501
  U1 = readdata(0x21, 0X9C4);

  //0x09C4 - TENSÃO U2 32502-32503
  U2 = readdata(0x21, 0X9C6);
  
  //0x09C8 - TENSÃO U3 32504-32505
  U3 = readdata(0x21, 0X9C8);

  // 0x9D4 - CORRENTE I1 32516-32517
  I1 = readdata(0x21, 0X9D4);

  // 0x9D6 - CORRENTE I2 32518-32519
  I2 = readdata(0x21, 0X9D6);
  
  // 0x9D8 - CORRENTE I3 32520-32521
  I3 = readdata(0x21, 0X9D8);
  
  enviarPost();
  
  delay(3000);
}

float readdata(int addr, int reg) {
  float res = 0.0;
  if (!ModbusRTUClient.requestFrom(addr, INPUT_REGISTERS, reg, 2)) {
    Serial.println("ERRO COMUNICACAO MODBUS");
    Serial.println(ModbusRTUClient.lastError());
  } else {
    uint16_t word1 = ModbusRTUClient.read();
    uint16_t word2 = ModbusRTUClient.read();
    uint32_t parz = word1 << 16 | word2;
    res = *(float *)&parz;
  }
  return res;
}


void enviarPost() 
{
  Serial.print("Try Post");
  //String dataToSend = "{\"machine_id\":\"" + String(machine_id) + "\",\"Pt\":\"" + String(POTENCIA_ATIVA_TOTAL) + "\",\"Qt\":\"" + String(POTENCIA_REATIVA_TOTAL) + "\",\"St\":\"" + String(POTENCIA_APARENTE_TOTAL) + "\",\"PFt\":\"" + String(FATOR_POTENCIA) + "\",\"Frequency\":\"" + String(FREQUENCIA) + "\",\"U1\":\"" + String(U1) + "\",\"U2\":\"" + String(U2) + "\",\"U3\":\"" + String(U3) + "\",\"I1\":\"" + String(I1) + "\",\"I2\":\"" + String(I2) + "\",\"I3\":\"" + String(I3) + "\"}";
  //String dataToSend = "{" + "\"machine_id\":\"" + String(machine_id) + "\",\"Pt\":\"" + String(POTENCIA_ATIVA_TOTAL) + "\",\"Qt\":\"" + String(POTENCIA_REATIVA_TOTAL) + "\",\"St\":\"" + String(POTENCIA_APARENTE_TOTAL) + "\",\"PFt\":\"" + String(FATOR_POTENCIA) + "\",\"Frequency\":\"" + String(FREQUENCIA) + "\",\"U1\":\"" + String(U1) + "\",\"U2\":\"" + String(U2) + "\",\"U3\":\"" + String(U3) + "\",\"I1\":\"" + String(I1) + "\",\"I2\":\"" + String(I2) + "\",\"I3\":\"" + String(I3) + "\"}";

  String dataToSend = String("{") + 
                   "\"machine_id\":\"" + String(machine_id) + "\"," +
                   "\"Pt\":\"" + String(POTENCIA_ATIVA_TOTAL) + "\"," +
                   "\"Qt\":\"" + String(POTENCIA_REATIVA_TOTAL) + "\"," +
                   "\"St\":\"" + String(POTENCIA_APARENTE_TOTAL) + "\"," +
                   "\"PFt\":\"" + String(FATOR_POTENCIA) + "\"," +
                   "\"Frequency\":\"" + String(FREQUENCIA) + "\"," +
                   "\"U1\":\"" + String(U1) + "\"," +
                   "\"U2\":\"" + String(U2) + "\"," +
                   "\"U3\":\"" + String(U3) + "\"," +
                   "\"I1\":\"" + String(I1) + "\"," +
                   "\"I2\":\"" + String(I2) + "\"," +
                   "\"I3\":\"" + String(I3) + "\"}";


  if (client.connect(server,443)) {
    Serial.println("Connected to server");
    client.println  ("POST /data HTTP/1.1");
    client.print("Host: ");
    client.println(server);
    client.println("Content-Type: application/json");
    client.println("Connection: close");
    client.print("Content-Length: ");
    client.println(dataToSend.length());
    client.println();
    client.println(dataToSend);
    client.println();

    String resposta = "";
    while (client.connected()) {
      if (client.available()) {
        char c = client.read();
        Serial.print(c);
        resposta += c;
      }
    }
    client.stop();
    client.flush();

    Serial.print("\n!\n");
    Serial.print(resposta);
    Serial.println("\n!\n");

    if (resposta.indexOf("HTTP/1.1 200 OK") >= 0) {
      Serial.println("DEU TUDO CERTO!");
    }
  } else {
    Serial.println("Connection to server failed");
  }
}
