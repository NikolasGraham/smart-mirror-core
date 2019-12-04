import React, { useState, useEffect } from "react";
import {
    RemoteMongoClient,
    Stitch,
    UserPasswordAuthProviderClient,
    UserPasswordCredential
} from "mongodb-stitch-browser-sdk";

/**
 * @description Performs Authentication and Database calls against our MongoDB Stitch Application
 * @param input
 * @returns {{isLoggedIn, login: login, register: register, logout: logout, authenticatedUser, UserCard: *}}
 */
export const useMongo = (input) => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [authenticatedUser, setAuthenticatedUser] = useState({});

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

    const logout = () => {
        setAuthenticatedUser({});
        setIsLoggedIn(false);
    };

    return {
        isLoggedIn,
        login,
        register,
        logout,
        authenticatedUser
    }
};