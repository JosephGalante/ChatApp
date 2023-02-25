import React from "react";
import ReactDOM from "react-dom";

function ExampleComponent() {
  return (
    <div>
      <h1>This is our app</h1>
      <p>The sky is blue</p>
    </div>
  )
}


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<ExampleComponent />);