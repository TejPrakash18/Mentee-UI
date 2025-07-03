
import React, { useState, useEffect, useRef } from "react";
import { jsPDF } from "jspdf";
import { FaComments } from "react-icons/fa";
import { HiOutlinePaperAirplane } from "react-icons/hi2";
import { MdOutlineRestartAlt } from "react-icons/md";
import { BiSolidDownload } from "react-icons/bi";
import { RxCross2 } from "react-icons/rx";
import api from "../services/api";

function ChatAssistant() {
  const systemPrompt = {
    role: "system",
    content:
      "You're a helpful LMS tutor. Only give hints and theory; do not give direct code.",
  };
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([systemPrompt]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messageEndRef = useRef(null);

  const sendChat = async (messages) => {
    try {
      const response = await api.post("/ai/chat", { messages });
      return response.data;
    } catch (error) {
      const errMsg = error.response?.data || error.message || "Unknown error";
      console.error("AI chat error:", errMsg);
      throw new Error(errMsg);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const assistantReply = await sendChat(newMessages);
      setMessages([
        ...newMessages,
        { role: "assistant", content: assistantReply },
      ]);
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: `Error talking to AI: ${err.message}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReset = () => {
    setMessages([systemPrompt]);
    setInput("");
  };

  const handleDownload = () => {
    const doc = new jsPDF();
    let y = 10;
    messages.slice(1).forEach((msg, i) => {
      const sender = msg.role === "user" ? "You" : "AI";
      const text = `${sender}: ${msg.content}`;
      const lines = doc.splitTextToSize(text, 180);
      doc.text(lines, 10, y);
      y += lines.length * 10;
    });
    doc.save("chat-history.pdf");
  };

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-[#1A1A1A] text-white rounded-3xl shadow-2xl w-[360px] max-h-[80vh] flex flex-col overflow-hidden">
          <div className="flex items-center justify-between bg-pink-600 text-white p-4 rounded-t-3xl">
            <div className="flex items-center gap-2">
              <div className="bg-blue-800 p-2 rounded-full">
                <FaComments className="text-white w-5 h-5" />
              </div>
              <div>
                <h2 className="text-md font-semibold leading-tight">
                  Mentee - tutor
                </h2>
                <p className="text-sm opacity-80">
                  Questions? We're here to help.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white text-2xl"
            >
              <RxCross2 />
            </button>
          </div>

          <div className="flex-1 px-4 py-3 space-y-3 overflow-y-auto bg-[#1A1A1A]">
            {messages.slice(1).map((msg, i) => (
              <div
                key={i}
                className={`px-4 py-2 rounded-xl max-w-[80%] whitespace-pre-line break-words text-sm ${
                  msg.role === "user"
                    ? "ml-auto bg-[#333333]"
                    : "mr-auto bg-[#282828] border border-cyan-500"
                }`}
              >
                {msg.content}
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>

          <div className="border-t border-[#333] bg-[#1A1A1A] p-3">
            <div className="flex items-center gap-2">
              <textarea
                className="flex-1 resize-none rounded-xl px-4 py-2 bg-[#282828] text-white text-sm focus:outline-none"
                placeholder="Ask anything..."
                rows="2"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={loading}
                className="text-blue-400 hover:text-blue-500 text-2xl"
                title="Send"
              >
                <HiOutlinePaperAirplane />
              </button>
              <button
                onClick={handleReset}
                className="text-yellow-400 hover:text-yellow-500 text-2xl"
                title="Reset"
              >
                <MdOutlineRestartAlt />
              </button>
              <button
                onClick={handleDownload}
                className="text-green-400 hover:text-green-500 text-2xl"
                title="Download Chat"
              >
                <BiSolidDownload />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 flex items-center justify-center"
          onClick={() => setIsOpen(true)}
        >
          <FaComments className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}

export default ChatAssistant;
