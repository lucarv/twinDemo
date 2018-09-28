'use strict';
require('dotenv').config()

var Client = require('azure-iot-device').Client;
var Twin;
var Protocol = require('azure-iot-device-mqtt').Mqtt;

var connectionString = process.env.CS;
const myBearer = {
  bearer: {
    type: 'gsm',
    provider: 'tele2'
  }
}

var client = Client.fromConnectionString(connectionString, Protocol);
var express = require('express');
var router = express.Router();
const bearers = ['gsm', 'wifi', 'lora']
const providers = ['a1', 'tele2', 't-mobile', 'loriot']

/* GET home page. */
router.get('/', function (req, res, next) {
  client.open(function (err) {
    if (err) {
      console.error('could not open IotHub client');
    } else {
      console.log('client opened');

      client.getTwin(function (err, twin) {
        if (err) {
          console.error('could not get twin');
        } else {
          Twin = twin;
          twin.on('properties.desired', function (dsc) {
            if (dsc.hasOwnProperty('bearer')) {
              if (dsc.bearer.provider !== myBearer.bearer.provider) {
                myBearer.bearer.type = dsc.bearer.type;
                myBearer.bearer.provider = dsc.bearer.provider;

                res.render('new', {
                  bearers: bearers,
                  providers: providers,
                  db: myBearer.bearer.type,
                  dp: myBearer.bearer.provider
                });
              }
            } else {
              res.render('new', {
                bearers: bearers,
                providers: providers,
                db: myBearer.bearer.type,
                dp: myBearer.bearer.provider
              });
            }
          });
        }
      });
    }
  });

});

router.post('/', function (req, res, next) {
  console.log(req.body)

  if (bearers[req.body.bidx] == 'gsm') {
    // call the function to choose a different GSM provider, once done successfully report the action
    myBearer.bearer.provider = providers[req.body.pidx];
    Twin.properties.reported.update(myBearer, function (err) {
      if (err) {
        console.error('could not update twin');
      } else {
        console.log('twin state reported');
      }
    });
  }
  res.render('new', {
    bearers: bearers,
    providers: providers,
    db: myBearer.bearer.type,
    dp: myBearer.bearer.provider
  });
});

module.exports = router;