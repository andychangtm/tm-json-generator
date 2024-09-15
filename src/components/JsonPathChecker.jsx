import { useState, useEffect } from "react";
import JSON5 from "json5";
import jsonpath from "jsonpath";
import { useJsonData } from "./JsonContext";
import CodeMirror from '@uiw/react-codemirror';
import { EditorView, keymap } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { autocompletion } from '@codemirror/autocomplete';
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { json } from '@codemirror/lang-json';

export function JsonPathChecker() {
    const { jsonInput } = useJsonData();
    const [jsonPath, setJsonPath] = useState("$");
    const [jsonPathResult, setJsonPathResult] = useState("");
    const [copyButtonText, setCopyButtonText] = useState("Copy Path");
    const [allJsonPaths, setAllJsonPaths] = useState([]);

    // Extract all JSON paths whenever jsonInput changes
    useEffect(() => {
        try {
            const parsedJson = JSON5.parse(jsonInput);
            const paths = getAllJsonPaths(parsedJson);
            setAllJsonPaths(paths);
        } catch (error) {
            console.error("Failed to parse JSON input:", error);
        }
    }, [jsonInput]);

    // Utility function to recursively extract all paths
    const getAllJsonPaths = (obj, currentPath = '$', paths = []) => {
        if (typeof obj === 'object' && obj !== null) {
            for (let key in obj) {
                const newPath = `${currentPath}.${key}`;
                paths.push(newPath);
                getAllJsonPaths(obj[key], newPath, paths);
            }
        }
        return paths;
    };

    // JSON path evaluation use jsonpath 
    const evaluateJsonPath = (path) => {
        try {
            const parsedJson = JSON5.parse(jsonInput);
            const result = jsonpath.query(parsedJson, path);
            setJsonPathResult(JSON.stringify(result, null, 2));
        } catch (error) {
            setJsonPathResult("No Match");
        }
    };

    // JSON path auto complete
    const jsonPathAutocomplete = (context) => {
        const word = context.matchBefore(/[\w$.]*$/);
        if (word === null) return null;
        
        const options = allJsonPaths
            .filter(path => path.startsWith(word.text))
            .map(path => ({
                label: path,
                type: 'property',
            }));
        
        return {
            from: word.from,
            options,
            validFor: /^[\w$.]*$/,
        };
    };

    // This extension is for the auto complete function
    const extensions = [
        autocompletion({
            override: [jsonPathAutocomplete],
        }),
        EditorView.lineWrapping,
        keymap.of([
            {
                key: "Tab",
                run: (view) => {
                    const completion = autocompletion();
                    return completion(view);
                },
            },
        ]),
    ];

    // Copy to the clipboard
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(jsonPath);
            setCopyButtonText("Copied ✓");
            setTimeout(() => setCopyButtonText("Copy Path"), 2000);
        } catch (error) {
            console.error("Failed to copy schema:", error);
        }
    };

    // Clear path
    const clearPath = () => {
        setJsonPath("$");
        setJsonPathResult("");
    };

    return (
        <section className="path-checker">
            <div className="path-checker__container">
                <div className="path-checker__fields">
                    <label className="path-checker__label">JSON Path </label>
                    <CodeMirror
                        value={jsonPath}
                        height="auto"
                        className="codemirror__input"
                        theme={vscodeDark}
                        extensions={extensions}
                        onChange={(value) => {
                            setJsonPath(value);
                            evaluateJsonPath(value);
                        }}
                        basicSetup={{
                            lineNumbers: false,
                            highlightActiveLine: false,
                        }}
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
