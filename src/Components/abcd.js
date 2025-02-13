"use client"

import { useState, useEffect } from "react"
import { sendMessageToLangflow } from "../api"

const Dashboard = () => {
  const [message, setMessage] = useState("")
  const [chatHistory, setChatHistory] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight)
  }, [chatHistory])

  const handleSendMessage = async () => {
    if (!message.trim()) return

    setIsLoading(true)
    const userMessage = { text: message, isUser: true }
    setChatHistory((prev) => [...prev, userMessage])
    setMessage("")

    try {
      const data = await sendMessageToLangflow(message)
      const response = data.outputs[0].outputs[0].results.message.text
      const botMessage = { text: response, isUser: false }
      setChatHistory((prev) => [...prev, botMessage])
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage = { text: "Sorry, there was an error processing your request.", isUser: false }
      setChatHistory((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 p-4 border rounded shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4">Langflow Chat</h2>
      <div className="h-[400px] overflow-y-auto border p-2 bg-gray-100">
        {chatHistory.map((msg, index) => (
          <div key={index} className={`mb-4 ${msg.isUser ? "text-right" : "text-left"}`}>
            <span
              className={`inline-block p-2 rounded-lg ${
                msg.isUser ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
              }`}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSendMessage()
        }}
        className="flex w-full space-x-2 mt-4"
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow p-2 border rounded"
        />
        <button type="submit" disabled={isLoading} className="p-2 bg-blue-500 text-white rounded">
          {isLoading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  )
}

export default Dashboard
