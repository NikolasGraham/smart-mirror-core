import React, {useState, useEffect, useContext, useRef, useCallback} from "react";
import {VoiceCommandsContext} from "../../context/VoiceCommandsContext";
import {Input, Label, Button, Row, Col} from 'reactstrap';
import useSpeechSynthesis from "../../hooks/useSpeechSynthesis";
import {useModal} from "../../hooks/useModal";
import Search from "../../hooks/useImageSearch";
import Webcam from "react-webcam";
import soundfile from './camera-shutter-click-01.mp3';

const PhotoBooth = (props) => {

    const {SpeechRecognitionHook} = useContext(VoiceCommandsContext);
    const [flash, setFlash] = useState(false);

    const takePictureVoiceCommand = {
        command: ["mirror mirror take picture"],
        answer: "",
        func: () => {
            take4Pics();
        }
    };
    ////take picture section  //////////////

    const [imageArray, setImageArray] = useState([]);

    const videoConstraints = {
        width: 1280,
        height: 720,
        facingMode: "user"
    };

    const webcamRef = useRef(null);
    const capture = useCallback(
        () => {
            let audio = new Audio(soundfile);
            audio.play();
            const imageSrc = webcamRef.current.getScreenshot();
            setImageArray(imageArray => [...imageArray, imageSrc]);
            // alert("image captured");
        },
        [webcamRef]
    );

    const WebcamCapture = () => {

            return (
                <>
                    <Webcam
                        audio={false}
                        height={720 / 6}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        width={1280 / 6}
                        videoConstraints={videoConstraints}
                    />
                    <button onClick={capture}>Capture photo</button>
                    {/* <img src={imageArray[0]}/>  */}
                </>
            );
        };

        ////end of section ///////////////

    const CameraFlash = () => {

        if(flash) {
            return (
                <Col lg={3} style={{background: "white"}}>
                    <h1>Flash - Left</h1>
                </Col>
            );
        }
        else{
            return (
            <Col lg={3} style={{background: "black"}}>
                <h1>Flash - Left</h1>
            </Col>
            );
        }
 };

    const take4Pics = () => {
        const secondsBetweenPics = 4000;

        for (var i = 0; i < 4; i++){
            setTimeout( () => {
                setFlash(true);
            }, i * secondsBetweenPics + 1000);

            setTimeout(() =>
                {
                    setFlash(false);
                    capture();
                }, i * secondsBetweenPics + 4000);

        }
    };


    useEffect(() => {
        SpeechRecognitionHook.addCommand(takePictureVoiceCommand);
    }, []);

        return (
            <div style={{height: "100%", background: "black", padding: "2vw", color: "white"}}>
                {/* */} <WebcamCapture/>

                <Row style={{border: "solid blue 1px"}}>
                    <Col>
                        <div>
                            <h1>Photo Booth</h1>
                            <label style={{
                                position: "absolute",
                                left: "50%",
                                "-webkit-transform": "translateX(-50%)",
                                transform: "translateX(-50%)",
                                color: "white",
                            }}
                            >Photo Booth</label>
                        </div>
                    </Col>
                </Row>
                <Row style={{height: "80%", border: "solid green 1px"}}>
                    <CameraFlash/>
                    <Col lg={6}>
                        <Row>
                            <Col style={{height: "20vh", border: "solid yellow 1px"}}>
                                {imageArray[0] ?
                                    <img src={imageArray[0]}/>
                                    : null
                                }
                            </Col>

                        </Row>
                        <Row>
                            <Col style={{height: "20vh", border: "solid red 1px"}}>
                                <img src={imageArray[1]}/>
                            </Col>
                        </Row>
                        <Row>
                            <Col style={{height: "20vh", border: "solid brown 1px"}}>
                                <img src={imageArray[2]}/>
                            </Col>
                        </Row>
                        <Row>
                            <Col style={{height: "20vh"}}>
                                <img src={imageArray[3]}/>
                            </Col>
                        </Row>
                    </Col>
                    <Col lg={3} style={{ background: "white"}}>
                        <h1>Flash - Right</h1>
                    </Col>
                </Row>
            </div>
            // <WebcamCapture/>


        );
    };

    export default PhotoBooth;