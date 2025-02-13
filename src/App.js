import Dashboard from "./Components/Dashboard";
// import React, { useState } from "react";
import React from "react";
import Keycloak from "keycloak-js";
import axios from 'axios';
// import { sendMessageToLangflow } from "./Components/api";
// import { LangflowClient } from "@datastax/langflow-client";
// import pkg from "../package.json" with type: "json";


const httpClient = axios.create({
   
});

let initoptions = {
  url: 'http://localhost:9090/',
  realm: 'master',
  clientId: 'react-client',
}

let kc = new Keycloak(initoptions);

kc.init({
  onLoad: 'login-required', // Supported values: 'check-sso' , 'login-required'
  checkLoginIframe: true,
  pkceMethod: 'S256'
}).then((auth) => {
  if (!auth) {
    window.location.reload();
  } else {
    /* Remove below logs if you are using this on production */
    console.info("Authenticated");
    console.log('auth', auth)
    console.log('Keycloak', kc)
    console.log('Access Token', kc.token)

    /* http client will use this header in every request it sends */
    httpClient.defaults.headers.common['Authorization'] = `Bearer ${kc.token}`;

    kc.onTokenExpired = () => {
      console.log('token expired')
    }
  }
}, () => {
  /* Notify the user if necessary */
  console.error("Authentication Failed");
});

const App = () => {
  return(
    <div>
      <Dashboard />
    </div>
  )
};

export default App;

// const App = () => {
//   const [message, setMessage] = useState("");
//   const [response, setResponse] = useState("");

//   const handleSendMessage = async () => {
//     const data = await sendMessageToLangflow(message);
//     console.log("Response Data:", data.outputs[0].outputs[0].results.message.text);
//     const fdata = data.outputs[0].outputs[0].results.message.text;

//     // Extract relevant part of the response
//     if (fdata) {
//         setResponse(JSON.stringify(fdata, null, 2)); // Convert object to a readable string
//     } else {
//         setResponse("No response from API");
//     }
// };


//   return (
//       <div>
//           <h2>Langflow Chat</h2>
//           <input
//               type="text"
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               placeholder="Enter message"
//           />
//           <button onClick={handleSendMessage}>Send</button>
//           <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>Response : {response}</pre>
//       </div>
//   );
// };

// export default App;





