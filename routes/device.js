'use strict';
require('dotenv').config()

var Client = require('azure-iot-device').Client;
var Protocol = require('azure-iot-device-mqtt').Mqtt;

var connectionString = process.env.CS;
const myBearer = {
    bearer: {
        type: 'gsm',
        provider: 'tele2'
    }
}

var client = Client.fromConnectionString(connectionString, Protocol);

client.open(function (err) {
    if (err) {
        console.error('could not open IotHub client');
    } else {
        console.log('client opened');

        client.getTwin(function (err, twin) {
            if (err) {
                console.error('could not get twin');
            } else {
                /*

                */
               twin.on('properties.desired', function (dsc) {
                if (dsc.hasOwnProperty('bearer')) {
                    if (dsc.bearer.provider !== myBearer.bearer.provider) {
                        console.log(`desired bearer ${dsc.bearer.provider} differs from current ${myBearer.bearer.provider}, changing...`)

                        // call the function to choose a different GSM provider, once done successfully report the action
                        myBearer.bearer.provider = dsc.bearer.provider;
                        twin.properties.reported.update(myBearer, function (err) {
                            if (err) {
                                console.error('could not update twin');
                            } else {
                                console.log('twin state reported');
                            }
                        });
                    }
                    else {
                        console.log(`desired bearer ${dsc.bearer.provider} is the same as current ${myBearer.bearer.provider}, ignoring...`)
                    }
                }
               });
            }
        })
    }
});
