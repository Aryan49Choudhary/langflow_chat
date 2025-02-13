import React, {useState, useEffect} from 'react';
import { sendMessageToLangflow } from "./api";

const Dashboard = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([{ text: "Hello! 👋 Welcome to Langflow Chat. How can I assist you today?", isUser: false }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const chatContainer = document.getElementById("chatContainer");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [chatHistory]);

  const handleSendMessage = async () => {
    if (!message.trim()) return
    setIsLoading(true);
    console.log("Question: ",message);
    const userMessage = { text: message, isUser: true }
    setChatHistory((prev) => [...prev, userMessage])
    setMessage("")
    try{
        const data = await sendMessageToLangflow(message);
        console.log("Response Data:", data.outputs[0].outputs[0].results.message.text);
        // const response = data.outputs[0].outputs[0].results.message.text
        const response = data.outputs[0].outputs[0].results.message.text
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Convert **bold** to <strong>bold</strong>
        .replace(/\n/g, "<br>"); // Preserve line breaks
        const botMessage = { text: response, isUser: false}
        setChatHistory((prev) => [...prev, botMessage])
    } catch (error) {
        console.error("Error:", error);
        const errorMessage = { text: "Sorry, there was an error processing your request.", isUser: false }
        setChatHistory((prev) => [...prev, errorMessage])
    } finally {
        setIsLoading(false)
    }
};


  return (
        <div className=' h-screen flex justify-center items-center bg-pink-100'>
            <div className=' w-[600px] h-[600px] shadow-2xl bg-white rounded-md'>
                <div className=' h-[90px] flex justify-center items-center text-4xl text-bold text-black bg-blue-300 font-[Patrick Hand]'>
                    <h2>Langflow Chat</h2>
                </div>
                <div id="chatContainer" className=' h-[420px] p-3 overflow-y-auto scroll-smooth bg-white'>
                {chatHistory.map((msg, index) => (
                    <div key={index} className={`mb-4 ${msg.isUser ? "text-right" : "text-left"}`}>
                        {msg.isUser ? (
                            <span
                            className={`inline-block p-2 rounded-lg ${
                                msg.isUser ? "bg-blue-500 text-white font-[Poppins]" : "bg-gray-200 text-black"
                            }`}
                            >
                            {msg.text} {/* Render text normally for user messages */}
                            </span>
                        ) : (
                            <span
                            className={`inline-block p-2 rounded-lg bg-gray-200 text-black font-[Poppins]`}
                            dangerouslySetInnerHTML={{ __html: msg.text }} // Use dangerouslySetInnerHTML only for bot messages
                            />
                        )}
                    </div>
                ))}
                </div>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                }}>
                    <div className=' w-[95%] h-[40px] flex justify-center items-center mt-4 space-x-2 bg-white'>
                        <div className=' p-5'></div>
                        <input className=' border-black pl-2 flex-grow p-2 rounded border h-9'
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Enter message"
                        />
                        <button className=' p-2 bg-black text-white rounded h-9 items-center justify-center flex' type='submit' disabled={isLoading} >
                            {isLoading ? "Sending..." : "Send"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
  );
};

export default Dashboard;