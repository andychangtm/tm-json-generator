import { useState } from "react";
import JSON5 from "json5";
import { createSchema } from "../schema-builder";
import { useJsonData } from "./JsonContext";
import { useJsonContextDispatch } from "./JsonContext";
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { EditorView } from '@codemirror/view';

export function JsonSchemaGenerator() {
    const { jsonInput } = useJsonData();
    const { handleInputChange } = useJsonContextDispatch();
    const [jsonSchema, setJsonSchema] = useState("");
    const [copyButtonText, setCopyButtonText] = useState("Copy Schema");

    // Parse the jsonInput to createSchema
    const setCreatedSchema = () => {
        try {
            const schema = createSchema(JSON5.parse(jsonInput));
            setJsonSchema(JSON.stringify(schema, null, 2));
        } catch (error) {
            setJsonSchema(`Error: ${error.message}`);
        }
    };

    // When schema change set the new value to state
    const handleSchemaChange = (value) => {
        setJsonSchema(value);
    };

    // Handle when on copyToClipboard
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(jsonSchema);
            setCopyButtonText("Copied ✓");
            setTimeout(() => setCopyButtonText("Copy Schema"), 2000);
        } catch (error) {
            console.error("Failed to copy schema:", error);
        }
    };

    // Handle clear the input
    const clearInput = () => {
        handleInputChange("");
        setJsonSchema("");
    };

    return (
        <section className="schema-generator">
            <div className="schema-generator__container">
                <div className="schema-generator__fields">
                    <label className="schema-generator__label">JSON Input</label>
                    <CodeMirror
                        value={jsonInput}
                        height="500px"
                        className="codemirror__editor"
                        theme={vscodeDark}
                        placeholder="Enter JSON here"
                        extensions={[json(), EditorView.lineWrapping]}
                        onChange={(value) => handleInputChange(value)}
                    />
                    <div className="tool-actions">
                        <button onClick={setCreatedSchema}>
                            Generate Schema
                        </button>
                        <button onClick={clearInput}>
                            Clear Input
                        </button>
                    </div>
                </div>

                <div className="schema-generator__fields">
                    <label className="schema-generator__label">JSON Schema</label>
                    <CodeMirror
                        value={jsonSchema}
                        height="500px"
                        className="codemirror__editor"
                        theme={vscodeDark}
                        extensions={[json(), EditorView.lineWrapping]}
                        onChange={(value) => handleSchemaChange(value)}
                    />
                    
                    <button onClick={copyToClipboard}>
                        {copyButtonText}
                    </button>
                </div>
            </div>
        </section>
    );
}
