export function JsonSchemaGenerator() {
    return (
        <section className="schema-generator">
            <div className="schema-generator__container">
                <div className="schema-generator__input">
                    <label className="schema-generator__label">JSON Input </label>
                    <input className="schema-generator__inputfield"/>
                    <button className="gschema-generator__btn">Generate Schema</button>
                </div>
                <div className="schema-generator__output">
                    <label className="schema-generator__label">JSON Schema</label>
                    <input className="schema-generator__outputfield"/>
                    <div className="schema-generator__output-error">Error message</div>
                </div>
            </div>
        </section>
    )
}