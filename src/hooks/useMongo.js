import React, { useState, useEffect, useContext } from "react";
import {
    RemoteMongoClient,
    Stitch,
    UserPasswordAuthProviderClient,
    UserPasswordCredential
} from "mongodb-stitch-browser-sdk";
import {AnonymousCredential} from "mongodb-stitch-core-sdk";
import {VoiceCommandsContext} from "../context/VoiceCommandsContext";
import {useLogger} from "./useLogger";

/**
 * @description Performs Authentication and Database calls against our MongoDB Stitch Application
 * @param input
 * @returns {{isLoggedIn, login: login, register: register, logout: logout, authenticatedUser, UserCard: *}}
 */
export const useMongo = (input) => {

    const logger = useLogger();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [authenticatedUser, setAuthenticatedUser] = useState({});

    const loginGuestUser = async () => {
        let client = Stitch.defaultAppClient;
        let error;
        await client.auth.loginWithCredential(new AnonymousCredential())
            .then(guest => {
                console.log("Successfully logged in as Guest User! ("+guest.id+")");

                const db = client.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas').db('smart_mirror');
                db.collection("users").updateOne({userId: client.auth.user.id},
                    {$set: {email: "GUEST@optech.com", first_name: "Firstname", last_name: "Lastname", guest: "true"}}, {upsert:true});

                setAuthenticatedUser(guest);
                setIsLoggedIn(true);
            })
            .catch(err => {
                console.error(`login failed with error: ${err}`);
                error = err;
            });
        return error;
    };
    // Known Issues for Guest Login
    //
    // -Creates 2 users in user database (one from upsert above, and one from somewhere else unknown)
    // --This needs to be fixed hopefully so that it doesn't create any user
    // - StitchServiceError when logging in for the first time this anonymous creds has been used

    //Fixes
    // either solving what's causing the stitch service error and removing any creds from user database
    // Or perhaps have a email/pass login with empty strings that has a fixed id, that can't be modified (Super easy to do)
    // Something else...?

    const login = async (email, password) => {
        let client = Stitch.defaultAppClient;
        const credential = new UserPasswordCredential(email, password);
        let error;
        await client.auth.loginWithCredential(credential)
        // Returns a promise that resolves to the authenticated user
            .then(authedUser => {
                console.log(`successfully logged in with id: ${authedUser.id}`);
                setAuthenticatedUser(authedUser);
                setIsLoggedIn(true);
            })
            .catch(err => {
                console.error(`login failed with error: ${err}`);
                error = err;
            });
        return error;
    };

    const registerWithVoice = async () => {
        let client = Stitch.defaultAppClient;
        // Add temp user to DB
        let pincode = Math.random().toString(36).substring(2, 18).substring(0, 8);
        let email = Math.random().toString(36).substring(2, 18).substring(0, 8);
        let password = Math.random().toString(36).substring(2, 18).substring(0, 8);

        register(email, password)
            .then(() => {
                const db = client.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas').db('smart_mirror');
                db.collection("temporary_registration").updateOne({userId: client.auth.user.id},
                    {$set: {pincode: pincode, email: email, password: password}}, {upsert:true});
            });
    };

    const register = async (email, password) => {
        let client = Stitch.defaultAppClient;
        let emailPasswordClient = client.auth.getProviderClient(UserPasswordAuthProviderClient.factory);
        emailPasswordClient.registerWithEmail(email, password)
            .then(async (data) => {
                console.log("Registration data: " + JSON.stringify(data));
                const credential = new UserPasswordCredential(email, password);
                let error;
                await client.auth.loginWithCredential(credential)
                // Returns a promise that resolves to the authenticated user
                    .then(authedUser => {
                        console.log(`successfully logged in with id: ${authedUser.id} and email: ${authedUser.email}`);
                        setAuthenticatedUser(authedUser);
                        setIsLoggedIn(true);

                        // THIS IS TEMPORARY
                        // ADDING USERNAME AND PASSWORD AS PLAIN TEXT FOR FACE REC. LOGIN
                        const db = client.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas').db('smart_mirror');
                        db.collection('face_descriptors')
                            .updateOne({owner_id: authedUser.id}, {$set: {email: email, password: password}}, {upsert: true})
                            .then((data) => console.log("(TEMP) Added email and password to descriptor db: " + JSON.stringify(data)))
                    })
                    .catch(err => {
                        console.error(`login failed with error: ${err}`);
                        error = err;
                    });
                return error;
            })
            .catch(err => console.error("Error registering new user:", err));

    };

    const loginPinCode = async (pin) => {
        let client = Stitch.defaultAppClient;
        const db = client.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas').db('smart_mirror');
        await db.collection('temporary_registration')
            .findOne({pincode: pin})
            .then(user => {
               if(user){
                   login(user.email, user.password);
                   logger.addLog(`email: ${user.email}   pass: ${user.password}`)
               }
               else{
                   alert("NULL?"); //TODO
               }
            })
            .catch(err => {
                logger.addLog(`Error logging in user with pincode: ${err}`)
            });
    };


    const logout = () => {
        setAuthenticatedUser({});
        setIsLoggedIn(false);
    };

    return {
        isLoggedIn,
        loginGuestUser,
        loginPinCode,
        login,
        registerWithVoice,
        register,
        logout,
        authenticatedUser
    }
};