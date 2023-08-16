import React from "react";
import "./App.css";
import HomePage from "./components/HomePage";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="header-title">Shopping Cart</h1>
      </header>
      <main>
        <HomePage />
      </main>
      <footer className="App-footer"></footer>
    </div>
  );
}

export default App;
