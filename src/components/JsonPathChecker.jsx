export function JsonPathChecker() {
    return (
        <section className="path-checker">
            <div className="path-checker__container">
                <div className="path-checker__input">
                    <label className="path-checker__label">JSON Path </label>
                    <input className="path-checker__inputfield"/>
                </div>
                <div className="path-checker__output">
                    <label className="path-checker__label">Evaluation Results</label>
                    <input className="path-checker__outputfield"/>
                </div>
            </div>
        </section>
    )
}