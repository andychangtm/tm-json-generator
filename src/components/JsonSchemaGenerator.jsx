import { useState } from "react"
import JSON5 from "json5"
import { createSchema } from "../schema-builder"
import { useJsonData } from "./JsonContext"
import { useJsonContextDispatch } from "./JsonContext";
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { EditorView } from '@codemirror/view';



export function JsonSchemaGenerator() {

    const {jsonInput} = useJsonData();
    const { handleInputChange } = useJsonContextDispatch()
    const [jsonSchema, setJsonSchema] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const setCreatedSchema = () => {
        try {
            const schema = createSchema(JSON5.parse(jsonInput));
            setJsonSchema(JSON.stringify(schema, null, 2));
            setErrorMessage("");
        } catch (error) {
            setErrorMessage(`Error: ${error.message}`);
        }
    };

    return (
        <section className="schema-generator">
            <div className="schema-generator__container">
                <div className="schema-generator__input">
                    <label className="schema-generator__label">JSON Input </label>
                    <CodeMirror
                        value={jsonInput}
                        height="500px"
                        theme={vscodeDark}
                        placeholder="Hello"
                        extensions={[json(), EditorView.lineWrapping]}
                        onChange={(value) => handleInputChange(value)}
                    />
                
                <button className="schema-generator__btn" onClick={setCreatedSchema}>
                    Generate Schema
                </button>    
                </div>
                <div className="schema-generator__output">
                    <label className="schema-generator__label">JSON Schema</label>
                    <CodeMirror
                        value={jsonSchema}
                        height="500px"
                        theme={vscodeDark}
                        extensions={[json(), EditorView.lineWrapping]}
                        readOnly
                    />
                {errorMessage && <div className="schema-generator__output-error">{errorMessage}</div>}
                </div>
            </div>
        </section>
    )
}
