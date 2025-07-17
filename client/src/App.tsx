import Header from "./components/Header";

function App() {
  return <Header onClick={() => console.log("login attempted")}>Login</Header>;
}

export default App;
