# twinDemo


**a simple example to demonstrate device twin pattern in azure iot**  

1. clone this repo 
2. npm install
3. create a device in IoT Hub
4. set the desired properties for the device as: _{"properties": { "desired": {  bearer: { type: 'gsm', provider: 't-mobile'}}}}_
5. copy the connection string and edit the .env file
6. npm start
7. change the current bearer provider in the GUI
8. verify the twin document in the azure portal


