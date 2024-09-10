import { useState } from "react"
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
            const schema = createSchema(JSON.parse(jsonInput));
            setJsonSchema(JSON.stringify(schema, null, 2));
            setErrorMessage("");
        } catch (error) {
            setErrorMessage("Invalid JSON! Try Again!");
        }
    };

    return (
        <section className="schema-generator">
            <div className="json_input_box">
                <label className="json_label">JSON Input </label>
                <textarea
                    className="json_input"
                    value={jsonInput}
                    onChange={handleInputChange}
                    placeholder="Enter JSON here..."
                />
                <button className="generate_btn" onClick={setCreatedSchema}>
                    Generate Schema
                </button>            
            </div>
            <div className="json_schema">
                <label className="schema_label">JSON Schema</label>
                <textarea
                    className="schema_output"
                    value={jsonSchema}
                    readOnly
                    placeholder="Generated schema will appear here..."
                />
                {errorMessage && <div className="error-box">{errorMessage}</div>}
            </div>
        </section>
    )
}
