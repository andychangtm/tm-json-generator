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
    const [copyButtonText, setCopyButtonText] = useState("Copy Path");

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

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(jsonPath);
            setCopyButtonText("Copied ✓");
            setTimeout(() => setCopyButtonText("Copy Path"), 2000);
        } catch (error) {
            console.error("Failed to copy schema:", error);
        }
    };

    const clearPath = () => {
        setJsonPath("");
        setJsonPathResult("");
    };

    return (
        <section className="path-checker">
            <div className="path-checker__container">
                <div className="path-checker__fields">
                    <label className="path-checker__label">JSON Path </label>
                    <input
                        type="text"
                        className="path-checker__input"
                        value={jsonPath}
                        onChange={handleJsonPathChange}
                        placeholder="Enter JSON path... Start with $."
                    />
                    <div className="tool-actions">    
                    <button onClick={clearPath}>
                        Clear Path
                    </button>
                    <button onClick={copyToClipboard}>
                        {copyButtonText}
                    </button>
                    </div>
                </div>
            </div>
            <div className="path-checker__fields">
                <label className="path-checker__label">Evaluation Results</label>
                    <CodeMirror
                        value={jsonPathResult}
                        height="500px"
                        className="codemirror__editor"
                        theme={vscodeDark}
                        extensions={[json(), EditorView.lineWrapping]}
                        readOnly
                    />
            </div>
        </section>
    );
}
