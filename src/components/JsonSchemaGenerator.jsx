export function JsonSchemaGenerator() {
    return (
        <section className="schema-generator">
            <div className="schema-generator__container">
                <div className="json_input_box">
                    <label className="json_label">JSON Input </label>
                    <input className="json_input"/>
                    <button className="generate_btn">Generate Schema</button>
                </div>
                <div className="json_schema">
                    <label className="schema_label">JSON Schema</label>
                    <input className="schema_output"/>
                    <div className="error-box">Error message</div>
                </div>
            </div>
        </section>
    )
}