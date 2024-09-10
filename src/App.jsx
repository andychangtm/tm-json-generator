import {  Header, JsonPathChecker, JsonSchemaGenerator, Footer, JsonProvider} from './components'

function App() {

  return (
    <>
      <JsonProvider>
        <Header />
        <JsonSchemaGenerator />
        <JsonPathChecker />
        <Footer/>
      </JsonProvider>
      
    </>
  );
}

export default App
