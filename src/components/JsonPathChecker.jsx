import { useState } from "react";
import jsonpath from "jsonpath";
import { useJsonData } from "./JsonContext"

export function JsonPathChecker() {

    const {jsonInput} = useJsonData();
    const [jsonPath, setJsonPath] = useState(""); 
    const [jsonPathResult, setJsonPathResult] = useState("");

    const handleJsonPathChange = (e) => {
        setJsonPath(e.target.value);
    };

    const evaluateJsonPath = () => {
        try {
            const parsedJson = JSON.parse(jsonInput);
            const result = jsonpath.query(parsedJson, jsonPath);
            setJsonPathResult(JSON.stringify(result, null, 2));
        } catch (error) {
            setJsonPathResult("Invalid Path")
        }
    };

    return (
        <section className="json-path-checker">
            <div className="path">
                <label className="path_label">JSON Path </label>
                <input
                    type="text"
                    className="path_input"
                    value={jsonPath}
                    onChange={handleJsonPathChange}
                    placeholder="Enter JSON Path query... Start with $."
                />
                <button className="path_evaluate_btn" onClick={evaluateJsonPath}>
                    Evaluate JSON Path
                </button>
            </div>
            <div className="results">
                <label className="results_label">Evaluation Results</label>
                <textarea
                    className="results_output"
                    value={jsonPathResult}
                    readOnly
                    placeholder="JSON Path result will appear here..."
                />
            </div>
        </section>
    )
}