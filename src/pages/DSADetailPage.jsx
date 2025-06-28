import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import {
  getQuestionById,
  markDSAComplete,
  getAllDSA,
  getCompletedQuestions,
} from "../services/dsaService";
import { logUserActivity } from "../services/userActivityService";
import Navbar from "../components/Navbar";
import Stopwatch from "../components/Stopwatch";
import { toast } from "sonner";
import { ImCross } from "react-icons/im";
import { FiPlay } from "react-icons/fi";
import { FiUploadCloud } from "react-icons/fi";
import {
  HiMiniBarsArrowUp,
  HiOutlineArrowLeft,
  HiOutlineArrowRight,
} from "react-icons/hi2";
import NotFoundPage from "./NotFoundPage";
import { AlignRight } from "lucide-react";

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
  const [notFound, setNotFound] = useState(false);
  const [showDSASidebar, setShowDSASidebar] = useState(false);
  const [dsaList, setDsaList] = useState([]);
  const [completedTitles, setCompletedTitles] = useState([]);
  const [outputTab, setOutputTab] = useState("output"); // "output" | "expected" | "diff"

  const currentCompiler = compilers.find((c) => c.id === selectedCompiler);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await getQuestionById(id);
        const data = res.data;
        if (!data || !data.title) {
          setNotFound(true);
          return;
        }
        if (!data.examples && data.input && data.output) {
          data.examples = [{ input: data.input, output: data.output }];
        }
        setQuestion(data);
      } catch {
        setNotFound(true);
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

  const handleMarkComplete = async () => {
    const username = localStorage.getItem("username");
    if (!username) return toast.warning("You must be logged in.");
    if (!question?.title) return toast.warning("Question not loaded.");
    if (!outputText) return toast.warning("Please run your code first.");

    const cleanedOutput = outputText.trim();
    const expectedOutput = (question.expected_output || "").trim();

    if (cleanedOutput === expectedOutput) {
      try {
        await markDSAComplete(username, question.title);
        alert("Question marked as complete!");
        setIsCompleted(true);
        await logUserActivity(username);
      } catch {
        toast.warning("Error marking as complete.");
      }
    } else {
      setOutputText(
        `Wrong Answer \n\nYour Output:\n${cleanedOutput}\n\nExpected Output:\n${expectedOutput}`
      );
    }
  };

  const handleRun = async () => {
    if (!currentCompiler) return;
    setIsLoading(true);
    setOutputTab("output");
    setOutputText("Running...");
    setExecTime(null);
    setMemoryUsage(null);

    try {
      const res = await axios.post(
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

      const token = res.data.token;
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
    } catch {
      setOutputText("Error running code.");
      setIsLoading(false);
    }
  };

  if (notFound) return <NotFoundPage />;

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row min-h-screen bg-[#0f0f0f] text-white p-4 md:p-6 mx-2 md:mx-10 mt-4 gap-4 rounded-xl">
        {/* Sidebar */}
        <div className="w-full md:w-[40%] p-4 bg-[#1e1e22] border border-gray-700 rounded-xl overflow-y-auto">
          {question ? (
            <>
              {/* Title + Prev/Next */}
              {/* Navigation buttons above title */}
              <div className="flex justify-between items-center mb-2">
                <button
                  onClick={() => {
                    const index = dsaList.findIndex(
                      (q) => q.id?.toString() === id?.toString()
                    );
                    if (index > 0)
                      navigate(`/dsa/question/${dsaList[index - 1].id}`);
                    else toast.warning("No previous question.");
                  }}
                  className="p-2 bg-[#2c2c2e] hover:bg-[#3c3c3e] rounded-full"
                  title="Previous"
                >
                  <HiOutlineArrowLeft />
                </button>

                <button
                  onClick={() => {
                    const index = dsaList.findIndex(
                      (q) => q.id?.toString() === id?.toString()
                    );
                    if (index < dsaList.length - 1)
                      navigate(`/dsa/question/${dsaList[index + 1].id}`);
                    else toast.warning("No next question.");
                  }}
                  className="p-2 bg-[#2c2c2e] hover:bg-[#3c3c3e] rounded-full"
                  title="Next"
                >
                  <HiOutlineArrowRight />
                </button>
              </div>

              {/* Question Title Centered Below Navigation */}
              <h1 className="text-xl font-bold text-orange-400 mb-5 mt-10 capitalize ">
                {question.title}
              </h1>

              <p
                className={`text-sm mb-4 font-semibold  capitalize ${getDifficultyColor(
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
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>

        {/* Editor Panel */}
        <div className="w-full md:w-[60%] flex flex-col gap-4">
          {/* Controls */}
          <div className="flex justify-between items-center gap-2 px-3 py-2 border border-gray-700 rounded-xl bg-[#1e1e22]">
            <select
              value={selectedCompiler}
              onChange={(e) => {
                const lang = e.target.value;
                setSelectedCompiler(lang);
                setCode(defaultCodeMap[lang]);
              }}
              className="bg-[#2c2c2e] text-white p-1.5 rounded-lg text-sm"
            >
              {compilers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-2">
              {/* Stopwatch Component */}
              <Stopwatch />

              {/* Run Button */}
              <button
                onClick={handleRun}
                className="flex items-center gap-2 bg-[#2d2d2d] hover:bg-[#3d3d3d] text-white px-3 py-1.5 rounded-md text-sm transition"
              >
                <FiPlay className="text-gray-300" size={14} />
                {isLoading ? "Running..." : "Run"}
              </button>

              {/* Submit Button */}
              <button
                onClick={handleMarkComplete}
                disabled={isCompleted}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition ${
                  isCompleted
                    ? "bg-[#2d2d2d] text-green-500 cursor-not-allowed"
                    : "bg-[#2d2d2d] hover:bg-[#3d3d3d] text-green-500"
                }`}
              >
                <FiUploadCloud size={16} />
                {isCompleted ? "Completed" : "Submit"}
              </button>
            </div>
          </div>

          {/* Code Editor */}
          <div className="h-[390px] border border-gray-700 rounded-lg overflow-hidden">
            <Editor
              height="100%"
              language={currentCompiler.language}
              value={code}
              onChange={(val) => setCode(val || "")}
              theme="vs-dark"
            />
          </div>

          {/* Input / Output */}
          <div className="flex flex-col gap-4">
            <div className="w-full">
              {/* Header with Tabs */}
              <div className="flex justify-between items-center mb-2">
                <label className="text-orange-400 font-semibold text-base">
                  Terminal
                </label>

                {/* Green text tab links */}
                <div className="flex space-x-4 text-sm font-semibold">
                  {["input", "output"].map((tab) => (
                    <span
                      key={tab}
                      onClick={() => setOutputTab(tab)}
                      className={`cursor-pointer ${
                        outputTab === tab
                          ? "text-green-400 underline underline-offset-4"
                          : "text-gray-400 hover:text-green-300"
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Output Display Area */}
              <div className="bg-[#1f1f23] text-white rounded-lg p-3 text-sm min-h-[180px] max-h-[300px] overflow-y-auto whitespace-pre-wrap">
                {/* Input Tab */}
                {outputTab === "input" && (
                  <textarea
                    className="w-full bg-[#1f1f23] text-white rounded-lg p-3 text-sm resize-none outline-none"
                    rows="6"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter input for your code..."
                  />
                )}

                {/* Output Tab */}
                {outputTab === "output" && (
                  <>
                    {outputText.includes("Wrong Answer") ? (
                      <div className="space-y-2">
                        <p className="text-red-6  00 font-bold">Wrong Answer</p>
                        <pre className="whitespace-pre-wrap text-white">
                          {outputText.replace("Wrong Answer", "").trim()}
                        </pre>
                      </div>
                    ) : (
                      <>{outputText || "Your output will appear here..."}</>
                    )}
                    {(execTime || memoryUsage) && (
                      <div className="mt-4 text-green-400 text-xs flex justify-end gap-4">
                        {execTime && <span>⏱ {execTime}</span>}
                        {memoryUsage && <span>🧠 {memoryUsage}</span>}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Button */}
      <button
        className="fixed bottom-6 right-6 z-50  bg-[#2c2c2e] hover:bg-[#3c3c3e] text-white p-4 rounded-full shadow-lg"
        onClick={() => setShowDSASidebar(true)}
      >
        <HiMiniBarsArrowUp size={20} />
      </button>

      {/* DSA Sidebar */}
      {showDSASidebar && (
        <div className="fixed top-0 right-0 z-50 w-80 max-w-full h-full bg-[#1e1e22] p-4 overflow-y-auto shadow-xl border-l border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl text-orange-400 font">All DSA Questions</h2>
            <button
              onClick={() => setShowDSASidebar(false)}
              className="text-orange-400 hover:text-red-500 text-xl"
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
                    <div className="flex justify-between items-center capitalize">
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
                      <span className="text-green-400 text-sm">Completed</span>
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
    </>
  );
};

export default DSADetailPage;
