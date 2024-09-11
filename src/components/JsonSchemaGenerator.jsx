import { useState } from "react"
import JSON5 from "json5"
import { createSchema } from "../schema-builder"
import { useJsonData } from "./JsonContext"
import { useJsonContextDispatch } from "./JsonContext";


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
            setErrorMessage("Invalid JSON! Try Again!");
        }
    };

    return (
        <section className="schema-generator">
            <div className="schema-generator__container">
                <div className="schema-generator__input">
                    <label className="schema-generator__label">JSON Input </label>
                    <textarea
                    className="schema-generator__inputfield"
                    value={jsonInput}
                    onChange={handleInputChange}
                    placeholder="Enter valid JSON to generate a schema..."
                />
                <button className="schema-generator__btn" onClick={setCreatedSchema}>
                    Generate Schema
                </button>    
                </div>
                <div className="schema-generator__output">
                    <label className="schema-generator__label">JSON Schema</label>
                    <textarea
                    className="schema-generator__outputfield"
                    value={jsonSchema}
                    readOnly
                    placeholder="Generated schema will appear here..."
                />
                {errorMessage && <div className="schema-generator__output-error">{errorMessage}</div>}
                </div>
            </div>
        </section>
    )
}
