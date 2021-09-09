import React, { useEffect, useState } from "react";
import logo from './logo.svg';
import "./App.css";

import Main from './Main'

function App() {
  const [apiResponse, setApiResponse] = useState('')

  // useEffect(() => {
  //   callAPI();
  // });

  const callAPI = () => {
    fetch("http://localhost:9000/testAPI")
      .then(res => res.text())
      .then(res => setApiResponse(res))
      .catch(err => err);
  }

  const testExec = () => {
    fetch("http://localhost:9000/execGeth")
      .then(res => res.text())
      .then(res => setApiResponse(res))
      .catch(err => err);
  }
  const runNode1 = () => {
    fetch("http://localhost:9000/runNode1")
      .then(res => res.text())
      .then(res => setApiResponse(res))
      .catch(err => err);
  }
  const runNode2 = () => {
    fetch("http://localhost:9000/runNode2")
      .then(res => res.text())
      .then(res => setApiResponse(res))
      .catch(err => err);
  }
  const runNode3 = () => {
    fetch("http://localhost:9000/runNode3")
      .then(res => res.text())
      .then(res => setApiResponse(res))
      .catch(err => err);
  }

  return (
    <div className="App">
      <header className="App-header">
          {/* <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Blcokchain Logging Framework Pipeline</h1> */}
      </header>
      <Main/>
  </div>
  );
}

export default App;
