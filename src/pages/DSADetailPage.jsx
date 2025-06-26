import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import {
  getQuestionById,
  markDSAComplete,
  getAllDSA,
  getCompletedQuestions,
} from "../services/dsaService";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { toast } from "sonner";
import { ImCross } from "react-icons/im";
import { HiMiniBarsArrowUp } from "react-icons/hi2";
import NotFoundPage from "./NotFoundPage"; // ✅ Import this

const compilers = [
  { name: "Java", id: "java", language: "java", judge0_id: 62 },
  { name: "C++", id: "cpp", language: "cpp", judge0_id: 54 },
  { name: "Python", id: "python", language: "python", judge0_id: 71 },
  {
    name: "JavaScript",
    id: "javascript",
    language: "javascript",
    judge0_id: 63,
  },
];

const defaultCodeMap = {
  java: `public class Main {
    // write your methods here
    public static void main(String[] args) {
        // call your methods here
    }
}`,
  cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, C++!" << endl;
    return 0;
}`,
  python: `print("Hello, Python!")`,
  javascript: `console.log("Hello, JavaScript!");`,
};

const DSADetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [selectedCompiler, setSelectedCompiler] = useState("java");
  const [outputText, setOutputText] = useState("");
  const [code, setCode] = useState(defaultCodeMap["java"]);
  const [isLoading, setIsLoading] = useState(false);
  const [question, setQuestion] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [inputText, setInputText] = useState("");
  const [execTime, setExecTime] = useState(null);
  const [memoryUsage, setMemoryUsage] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [showDSASidebar, setShowDSASidebar] = useState(false);
  const [dsaList, setDsaList] = useState([]);
  const [completedTitles, setCompletedTitles] = useState([]);

  const currentCompiler = compilers.find((c) => c.id === selectedCompiler);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await getQuestionById(id);
        const data = res.data;

        // ✅ Handle if question doesn't exist
        if (!data || !data.title) {
          setNotFound(true);
          return;
        }

        if (!data.examples && data.input && data.output) {
          data.examples = [{ input: data.input, output: data.output }];
        }
        setQuestion(data);
      } catch (error) {
        console.error("Error fetching question:", error);
        setNotFound(true); // ✅ On error, show not found
      }
    };

    const fetchCompleted = async () => {
      const username = localStorage.getItem("username");
      if (username) {
        const completed = await getCompletedQuestions(username);
        setCompletedTitles(completed);
      }
    };

    fetchQuestion();
    fetchCompleted();
  }, [id]);

  useEffect(() => {
    const fetchAllDSA = async () => {
      const data = await getAllDSA();
      setDsaList(data);
    };
    fetchAllDSA();
  }, []);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "basic":
        return "text-green-500";
      case "easy":
        return "text-yellow-400";
      case "medium":
        return "text-red-500";
      default:
        return "text-gray-400";
    }
  };

  const handleMarkComplete = () => {
    const username = localStorage.getItem("username");
    if (!username) return toast.warning("You must be logged in.");
    if (!question?.title) return toast.warning("Question not loaded.");
    if (!outputText) return toast.warning("Please run your code first.");

    const cleanedOutput = outputText.trim();
    const expectedOutput = (question.expected_output || "").trim();

    if (cleanedOutput === expectedOutput) {
      markDSAComplete(username, question.title)
        .then(() => {
          toast.success("Question marked as complete!");
          setIsCompleted(true);
        })
        .catch(() => toast.warning("Error marking as complete."));
    } else {
      alert(
        `Output doesn't match.\nExpected: ${expectedOutput}\nGot: ${cleanedOutput}`
      );
    }
  };

  const handleRun = async () => {
    if (!currentCompiler) return;
    setIsLoading(true);
    setOutputText("Running...");
    setExecTime(null);
    setMemoryUsage(null);

    try {
      const response = await axios.post(
        "https://judge0-ce.p.rapidapi.com/submissions",
        {
          source_code: code,
          stdin: inputText,
          language_id: currentCompiler.judge0_id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            "X-RapidAPI-Key":
              "1415aba1b1msh545546e8d959045p1c9849jsnfe4c0ac5c221",
          },
        }
      );

      const token = response.data.token;
      let attempts = 0;

      const checkResult = async () => {
        if (attempts++ >= 15) {
          setIsLoading(false);
          setOutputText("Timeout. Please try again.");
          return;
        }

        const result = await axios.get(
          `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
          {
            headers: {
              "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
              "X-RapidAPI-Key":
                "1415aba1b1msh545546e8d959045p1c9849jsnfe4c0ac5c221",
            },
          }
        );

        if (result.data.status.id <= 2) {
          setTimeout(checkResult, 1000);
        } else {
          const resData = result.data;
          setOutputText(
            resData.stdout ||
              resData.stderr ||
              resData.compile_output ||
              "No output."
          );
          setExecTime(resData.time ? `${resData.time} sec` : null);
          setMemoryUsage(
            resData.memory ? `${(resData.memory / 1024).toFixed(2)} KB` : null
          );
          setIsLoading(false);
        }
      };

      checkResult();
    } catch (error) {
      console.error("Execution error:", error);
      setOutputText("Error running code.");
      setIsLoading(false);
    }
  };
  if (notFound) {
    return (
      <>
       
        <NotFoundPage />
         
      </>
    );
  }

  const inputOutputBoxClass = `
    bg-[#1f1f23] border border-gray-600 rounded-lg p-4 font-mono text-sm text-white 
    overflow-auto max-h-48 resize-none shadow-md focus:outline-none focus:ring-2 
    focus:ring-orange-500 transition duration-200
  `;

  const labelClass =
    "flex items-center gap-2 text-orange-400 font-semibold mb-2";

  return (
    <>
      <Navbar />

      <div className="flex flex-col md:flex-row min-h-screen bg-[#0f0f0f] text-white overflow-hidden p-4 md:p-6 rounded-2xl mx-2 md:mx-10 mt-4 gap-4">
        <button
          className="md:hidden bg-orange-600 text-white px-3 py-2 rounded mb-2"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          {showSidebar ? "Hide Question" : "Show Question"}
        </button>

        {(showSidebar || window.innerWidth >= 768) && (
          <div className="w-full md:w-[40%] p-4 bg-[#1e1e22] border border-gray-700 rounded-xl overflow-y-auto">
            {question ? (
              <>
                <h1 className="text-2xl font-bold text-orange-400 mb-2">
                  {question.title}
                </h1>
                <p
                  className={`text-sm mb-4 font-semibold ${getDifficultyColor(
                    question.difficulty
                  )}`}
                >
                  Difficulty: {question.difficulty}
                </p>
                <p className="text-gray-200 whitespace-pre-line">
                  {question.explanation}
                </p>
                <h3 className="text-lg font-semibold mt-6 text-orange-300">
                  Examples:
                </h3>
                {question.examples?.map((ex, idx) => (
                  <div key={idx} className="bg-[#2a2a2d] p-3 rounded-md mt-2">
                    <p>
                      <span className="text-green-400">Input:</span> {ex.input}
                    </p>
                    <p>
                      <span className="text-blue-400">Output:</span> {ex.output}
                    </p>
                  </div>
                ))}
                {question.expected_output && (
                  <p className="mt-4 text-green-400 text-sm">
                    Expected Output: {question.expected_output}
                  </p>
                )}
                {question.solution && (
                  <>
                    <h2 className="text-lg font-semibold mt-6 text-orange-300">
                      Solution:
                    </h2>
                    <p className="text-gray-300">{question.solution}</p>
                  </>
                )}
              </>
            ) : (
              <p>Loading question...</p>
            )}
          </div>
        )}

        <div className="w-full md:w-[60%] flex flex-col gap-4">
          <div className="flex flex-wrap justify-between items-center gap-2 sticky top-0 bg-[#0f0f0f] z-10 p-2 rounded-xl border border-gray-700">
            <select
              value={selectedCompiler}
              onChange={(e) => {
                setSelectedCompiler(e.target.value);
                setCode(defaultCodeMap[e.target.value]);
              }}
              className="bg-[#2c2c2e] text-white p-1.5 rounded text-sm w-28"
            >
              {compilers.map((compiler) => (
                <option key={compiler.id} value={compiler.id}>
                  {compiler.name}
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              <button
                onClick={handleMarkComplete}
                disabled={isCompleted || !localStorage.getItem("username")}
                className={`px-3 py-1.5 rounded transition text-sm ${
                  isCompleted
                    ? "bg-green-600 cursor-not-allowed"
                    : "bg-orange-600 hover:bg-orange-700"
                }`}
              >
                {isCompleted ? "Completed" : "Submit"}
              </button>

              <button
                onClick={handleRun}
                className="bg-orange-600 hover:bg-orange-700 px-3 py-1.5 rounded transition text-sm"
              >
                {isLoading ? "Running..." : "Run"}
              </button>
            </div>
          </div>

          <div className="h-[370px] md:h-[390px] border border-gray-700 rounded-lg overflow-hidden">
            <Editor
              height="100%"
              defaultLanguage={currentCompiler.language}
              value={code}
              onChange={(val) => setCode(val || "")}
              theme="vs-dark"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col w-full sm:w-1/2">
              <label htmlFor="inputText" className={labelClass}>
                Input (stdin)
              </label>
              <textarea
                id="inputText"
                className={inputOutputBoxClass}
                placeholder="Enter input here..."
                rows={6}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
            </div>

            <div className="flex flex-col w-full sm:w-1/2">
              <label htmlFor="outputText" className={labelClass}>
                Output
              </label>
              <pre
                id="output-box"
                className={`${inputOutputBoxClass} whitespace-pre-wrap`}
                style={{ minHeight: "153px", userSelect: "text" }}
              >
                {outputText || "Your output will appear here..."}
                {(execTime || memoryUsage) && (
                  <div className="mt-20 text-green-400 text-sm flex gap-4 justify-end">
                    {execTime && <span>⏱️ Time: {execTime}</span>}
                    {memoryUsage && <span>🧠 Memory: {memoryUsage}</span>}
                  </div>
                )}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* 📚 Floating Action Button */}
      <button
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-orange-700 text-white p-4 rounded-full shadow-lg transition"
        onClick={() => setShowDSASidebar(true)}
      >
        <HiMiniBarsArrowUp size={20}/>
      </button>

      {/* Sidebar Modal */}
      {showDSASidebar && (
        <div className="fixed top-0 right-0 z-50 w-80 max-w-full h-full bg-[#1e1e22] p-4 overflow-y-auto shadow-xl border-l border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl text-orange-400 font-bold">
              All DSA Questions
            </h2>
            <button
              className="text-orange-400 hover:text-red-500 text-xl"
              onClick={() => setShowDSASidebar(false)}
            >
              <ImCross size={15} />
            </button>
          </div>

          {dsaList.length > 0 ? (
            <ul className="space-y-2">
              {dsaList.map((q) => (
                <li key={q._id}>
                  <button
                    onClick={() => {
                      setShowDSASidebar(false);
                      navigate(`/dsa/question/${q.id}`);
                    }}
                    className="block w-full text-left bg-[#2a2a2d] hover:bg-[#3a3a3d] text-white p-2 rounded"
                  >
                    <div className="flex justify-between items-center">
                      <span>{q.title}</span>
                      <span
                        className={`text-xs ${getDifficultyColor(
                          q.difficulty
                        )}`}
                      >
                        {q.difficulty}
                      </span>
                    </div>
                    {completedTitles.includes(q.title) && (
                      <span className="text-green-400 text-sm">
                        ✅ Completed
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No questions available.</p>
          )}
        </div>
      )}

      <Footer />
    </>
  );
};

export default DSADetailPage;
