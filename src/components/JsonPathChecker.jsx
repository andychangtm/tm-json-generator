import { useState, useEffect } from "react";
import jsonpath from "jsonpath";
import { useJsonData } from "./JsonContext";

export function JsonPathChecker() {
    const {jsonInput} = useJsonData();
    const [jsonPath, setJsonPath] = useState("");
    const [jsonPathResult, setJsonPathResult] = useState("");

    const evaluateJsonPath = (path) => {
        try {
            const parsedJson = JSON.parse(jsonInput);
            const result = jsonpath.query(parsedJson, path);
            setJsonPathResult(JSON.stringify(result, null, 2));
        } catch (error) {
            setJsonPathResult("No Match");
        }
    };

    const handleJsonPathChange = (e) => {
        const newPath = e.target.value;
        setJsonPath(newPath);
        evaluateJsonPath(newPath);
    };

    return (
        <section className="path-checker">
            <div className="path-checker__container">
                <div className="path-checker__input">
                    <label className="path-checker__label">JSON Path </label>
                    <input
                        type="text"
                        className="path-checker__inputfield"
                        value={jsonPath}
                        onChange={handleJsonPathChange}
                        placeholder="Enter JSON path... Start with $."
                    />
                </div>
            </div>
            <div className="path-checker__output">
                <label className="path-checker__label">Evaluation Results</label>
                <textarea
                    className="path-checker__outputfield"
                    value={jsonPathResult}
                    readOnly
                    placeholder="JSON Path result will appear here..."
                />
            </div>
        </section>
    );
}
