import React, {useContext, useEffect, useState} from "react";
import {VoiceCommandsContext} from "../../context/VoiceCommandsContext";
import {Row, Col, Button} from "reactstrap"

const RussianDemoPage = () => {

    const [commandsText, setCommandsText] = useState("Commandes");
    const [getAJokeText, setGetAJokeText] = useState("Obtenez une blague");
    const [jokeQuestion, setJokeQuestion] = useState("");
    const [jokeAnswer, setJokeAnswer] = useState("");

    const {SpeechRecognitionHook} = useContext(VoiceCommandsContext);

    const speakFrench = {
        command: ["mirror mirror speak in French"],
        answer: "Oui, je parle français",
        func: () => {
            setCommandsText("Commandes");
            setGetAJokeText("Obtenez une blague");
            SpeechRecognitionHook.changeLanguage('fr-FR');
            SpeechRecognitionHook.setLangVoice('fr-FR');
        }
    };

    const speakingFrench = {
        command: ["miroir miroir est-ce que tu parles français"],
        answer: "Nous parlons maintenant, n'est-ce pas?",
        func: () => {
        }
    };

    const speakEnglish = {
        command: ["miroir miroir parlez-vous anglais"],
        answer: "Yes, I speak English",
        func: () => {
            setCommandsText("Commands");
            setGetAJokeText("Get a Joke");
            SpeechRecognitionHook.changeLanguage('en-AU');
            SpeechRecognitionHook.setLangVoice('en-US');
        }
    };

    const tellMeAJokeInFrench = {
        command: ["miroir miroir raconte-moi une blague"],
        answer: "Oui",
        func: () => {
            getFrenchJoke();
        }
    };

    useEffect(() => {
        SpeechRecognitionHook.changeLanguage('fr-FR');
        SpeechRecognitionHook.setLangVoice('fr-FR');

        SpeechRecognitionHook.addCommand(speakEnglish);
        SpeechRecognitionHook.addCommand(speakFrench);
        SpeechRecognitionHook.addCommand(tellMeAJokeInFrench);
        SpeechRecognitionHook.addCommand(speakingFrench);

        return () => {
            SpeechRecognitionHook.removeCommand(speakEnglish);
            SpeechRecognitionHook.removeCommand(speakFrench);
            SpeechRecognitionHook.removeCommand(tellMeAJokeInFrench);
            SpeechRecognitionHook.removeCommand(speakingFrench);
        }

    }, []);

    // Currently not in use, saving for later
    const getJoke = () => {
        fetch('https://sv443.net/jokeapi/v2/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist')
            .then((response) => {
                return response.json();
            })
            .then((myJson) => {

                console.log(myJson);
            });
    };

    const getFrenchJoke = () => {
        const proxyurl = "https://cors-anywhere.herokuapp.com/";
        const url = 'https://blague.xyz/api/joke/random';

        fetch(proxyurl + url, {
            headers: {
                'Authorization': 'oG6tKHDZMT_99C-vWDti.S6F_euYPnrd4nwtSWOza00mkZCoFZhHXp8g_ijMooTv'
            }
        })
            .then((resp) => resp.json())
            .then((data) => {
                console.log(data);
                setJokeQuestion(data.joke.question);
                setJokeAnswer(data.joke.answer);
            })
            .catch(err => console.log("Error getting french joke: " + err));
    };

    return (
        <>
            <Row>
                <Col>
                    <Button color="primary" onClick={() => getFrenchJoke()}>{getAJokeText}</Button>
                </Col>
                <Col>
                    <h2>parles tu français?</h2>
                    <br/>
                    <br/>
                    <h4>Blagues</h4>
                    <hr/>
                    <h5 style={{color: "blue"}}>{jokeQuestion}</h5>
                    <h5 style={{color: "#8E1600"}}>{jokeAnswer}</h5>
                </Col>
                <Col>
                    <h2>{commandsText}</h2>
                    <h5>Mirror Mirror Speak in French</h5>
                    <h5>Miroir miroir parlez-vous anglais?</h5>
                    <h5>Miroir miroir raconte moi une blague</h5>
                    <h5>miroir miroir est-ce que tu parles français</h5>
                </Col>
            </Row>
        </>
    );
};

export default RussianDemoPage;