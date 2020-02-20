import React, {useState, useEffect, useContext} from "react";

import awsIot from 'aws-iot-device-sdk';

//
// Replace the values of '<YourUniqueClientIdentifier>' and '<YourCustomEndpoint>'
// with a unique client identifier and custom host endpoint provided in AWS IoT.
// NOTE: client identifiers must be unique within your AWS account; if a client attempts
// to connect with a client identifier which is already in use, the existing
// connection will be terminated.
//
const device = ()=> {
    awsIot.device({
        keyPath: "../../../../public/cert/d5efb49d34-private.pem.key",
        certPath: "../../../../public/cert/d5efb49d34-public.pem.key",
        caPath: "../../../../public/cert/AmazonRootCA1.pem.txt",
        clientId: "arn:aws:iot:us-west-2:615420348778:thing/Smart_Mirror_IoT",
        host: "Smart_Mirror_IoT"
    });

    //
    // Device is an instance returned by mqtt.Client(), see mqtt.js for full
    // documentation.
    //
    device
        .on('connect', function () {
            console.log('connect');
            device.subscribe('topic_1');
            device.publish('topic_2', JSON.stringify({test_data: 1}));
        });

    device
        .on('message', function (topic, payload) {
            console.log('message', topic, payload.toString());
        });

    return(
        <div>
            <device/>
        </div>
    );

};

export default device;