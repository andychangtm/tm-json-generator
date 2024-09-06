export function JsonPathChecker() {
    return (
        <section className="json-path-checker">
            <div className="path">
                <label className="path_label">JSON Path </label>
                <input className="path_input"/>
            </div>
            <div className="results">
                <label className="results_label">Evaluation Results</label>
                <input className="results_output"/>
            </div>
        </section>
    )
}