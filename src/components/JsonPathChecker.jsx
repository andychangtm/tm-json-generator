export function JsonPathChecker() {
    return (
        <section className="path-checker">
            <div className="path-checker__container">
                <div className="path">
                    <label className="path_label">JSON Path </label>
                    <input className="path_input"/>
                </div>
                <div className="results">
                    <label className="results_label">Evaluation Results</label>
                    <input className="results_output"/>
                </div>
            </div>
        </section>
    )
}