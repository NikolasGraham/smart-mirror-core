import React, {useEffect, useState, useContext} from "react"
import {AppContext} from "../context/AppContext";
import {VoiceCommandsContext} from "../context/VoiceCommandsContext";

export const useGreetingMessage = () => {

    let appContext = useContext(AppContext);
    let mongoHook = appContext.mongoHook;
    const voiceContext = useContext(VoiceCommandsContext);

    const [style, setStyle] = useState(0);

    const setName = (newName) => {

    };

    const greetingStyles = [
        // 0 Standard Greeting
        `Hello ${mongoHook.name}, welcome back!`,

        // 1 - English Greeting
        `Ello govenor ${mongoHook.name}, welcome back`

        // 2 - Norwegian Greeting

        // 3 - Scottish Greeting

        // n - .......
    ];

    // const greetingMessage = () => {
    //     //     setTimeout(() => {
    //     //         voiceContext.SpeechRecognitionHook.speak(greetingStyles[style]);
    //     //         console.log("MongoDB Name: " + mongoHook.name)
    //     //     }, 1500)
    // };

    useEffect(() => {
        // databaseHook.findOne("users", mongoHook.authenticatedUser.id);
        setStyle(Math.floor(Math.random() * Math.floor(2)));
        if(mongoHook.isLoggedIn === true){
            setTimeout(() => voiceContext.SpeechRecognitionHook.speak(greetingStyles[style]), 2000);
        }
    }, [mongoHook.isLoggedIn]);

    return{
        style,
        setStyle,
        //greetingMessage,
        greetingStyles,
        setName,
    }

};