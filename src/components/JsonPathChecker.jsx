import { useState, useEffect } from "react";
import JSON5 from "json5"
import jsonpath from "jsonpath";
import { useJsonData } from "./JsonContext";
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { EditorView } from '@codemirror/view';


export function JsonPathChecker() {
    const {jsonInput} = useJsonData();
    const [jsonPath, setJsonPath] = useState("");
    const [jsonPathResult, setJsonPathResult] = useState("");

    const evaluateJsonPath = (path) => {
        try {
            const parsedJson = JSON5.parse(jsonInput);
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
                    <CodeMirror
                        value={jsonPathResult}
                        height="500px"
                        theme={vscodeDark}
                        extensions={[json(), EditorView.lineWrapping]}
                        readOnly
                    />
            </div>
        </section>
    );
}
