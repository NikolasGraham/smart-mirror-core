import React, {useState, useContext, useEffect} from "react"
import {Button, Input, InputGroup, InputGroupAddon} from "reactstrap";
import {LoggingContext} from "../../context/LoggingContext";
import {VoiceCommandsContext} from "../../context/VoiceCommandsContext";

const WikipediaSearchPage = () => {

    const loggingContext = useContext(LoggingContext).logger;
    const voiceContext = useContext(VoiceCommandsContext);

    const [searchQuery, setSearchQuery] = useState("");
    const [foundResults, setFoundResults] = useState(["Hello", "Testing"]);

    const fetchResults = () => {
        //const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=${searchQuery}`;
        const endpoint = `https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=extracts|pageimages&pithumbsize=400&origin=*&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=${searchQuery}`;
        fetch(endpoint)
            .then(response => response.json())
            .then(data => {
                loggingContext.addLog(data.query.pages);
                const results = data.query.pages;
                let tempResults = [];

                // Extracting all items from query and putting them into foundResults
                Object.keys(results).map(key => {
                    loggingContext.addLog(results[key]);
                    tempResults = [...tempResults, {title: results[key].title, extract: results[key].extract}];
                });

                loggingContext.addLog(tempResults);
                setFoundResults(tempResults);
            })
            .catch((err) => loggingContext.addLog("Wikipedia fetch failed with: " + err));
    };

    // Not functioning currently?...
    const searchCommand = {
        command: ["mirror mirror search wikipedia"],
        answer: `Here are your results`,
        func: async () => fetchResults()
    };

    useEffect(() => {
        voiceContext.SpeechRecognitionHook.addCommand(searchCommand);
    }, []);

    return (
        <div>
            <h2>Search Wikipedia</h2>
            <div className="col-xs-9 col-md-7" id={"inputFieldsLogin"}>
                <InputGroup className={"inputGroupLogin"}>
                    <Input type="text" value={searchQuery} placeholder="Query..." onChange={(e) => setSearchQuery(e.target.value)}/>
                    <InputGroupAddon addonType="append"><Button onClick={() => fetchResults()}>Search</Button></InputGroupAddon>
                </InputGroup>
            </div>
            <div>
                {
                    foundResults.length > 0 ?
                        foundResults.map((item) => {
                            return <div>
                                        <hr />
                                            <h3>{item.title}</h3>
                                            {item.extract}
                                        <hr />
                                    </div>
                        })
                        :
                        <label>Nothing to search...</label>
                }
            </div>
        </div>
    )

};

export default WikipediaSearchPage;