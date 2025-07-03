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
import { FiPlay, FiUploadCloud } from "react-icons/fi";
import { LuCircleCheckBig } from "react-icons/lu";
import {
  HiMiniBarsArrowUp,
  HiOutlineArrowLeft,
  HiOutlineArrowRight,
} from "react-icons/hi2";
import NotFoundPage from "./NotFoundPage";

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

const normalizeOutput = (output) => output.replace(/\r/g, "").trim();

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
  const [dsaList, setDsaList] = useState([]);
  const [completedTitles, setCompletedTitles] = useState([]);
  const [outputTab, setOutputTab] = useState("output");
  const [hasRun, setHasRun] = useState(false);
  const [showDSASidebar, setShowDSASidebar] = useState(false);
  const [lastSubmittedCode, setLastSubmittedCode] = useState("");
  const [lastSubmittedOutput, setLastSubmittedOutput] = useState("");
  const [lastRunOutput, setLastRunOutput] = useState("");
  const [submissionStatus, setSubmissionStatus] = useState(null);

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
          const newOutput =
            resData.stdout ||
            resData.stderr ||
            resData.compile_output ||
            "No output.";
          setOutputText(newOutput);
          setLastRunOutput(newOutput);
          setExecTime(resData.time ? `${resData.time} sec` : null);
          setMemoryUsage(
            resData.memory ? `${(resData.memory / 1024).toFixed(2)} KB` : null
          );
          setIsLoading(false);
          setHasRun(true);
        }
      };

      checkResult();
    } catch {
      setOutputText("Error running code.");
      setIsLoading(false);
    }
  };

  const handleMarkComplete = async () => {
    const username = localStorage.getItem("username");
    if (!username) return toast.warning("You must be logged in.");
    if (!question?.title) return toast.warning("Question not loaded.");
    if (!hasRun)
      return toast.warning("Please run your code before submitting.");

    const cleanedOutput = normalizeOutput(outputText);
    const expectedOutput = normalizeOutput(question.expected_output || "");

    if (normalizeOutput(lastRunOutput) !== cleanedOutput) {
      return toast.warning("Please run your latest code before submitting.");
    }

    if (cleanedOutput === expectedOutput) {
      if (lastSubmittedCode === code && lastSubmittedOutput === cleanedOutput) {
        return toast.warning(
          "You've already submitted this exact solution. Modify or re-run before submitting again."
        );
      }
      try {
        await markDSAComplete(username, question.title);
        setOutputText(
          `Correct Answer \n\nYour Output:\n${cleanedOutput}\n\nExpected Output:\n${expectedOutput}`
        );
        setTimeout(() => {
          alert("Question submitted successfully!");
        }, 1000);
        setIsCompleted(true);
        setLastSubmittedCode(code);
        setLastSubmittedOutput(cleanedOutput);
        await logUserActivity(username);
        setHasRun(false);
        setSubmissionStatus("success"); // ✅ SET SUCCESS
      } catch {
        toast.warning("Error marking as complete.");
      }
    } else {
      setOutputText(
        `Wrong Answer \n\nYour Output:\n${cleanedOutput}\n\nExpected Output:\n${expectedOutput}`
      );
      setSubmissionStatus(null); // reset on failure
    }
  };

  if (notFound) return <NotFoundPage />;

  return (
    <>
      <Navbar />
      <div className="min-h-[99vh] bg-[#1A1A1A] text-white rounded mt-3 mx-4 lg:mx-20 flex flex-col shadow-lg overflow-hidden">
        {/* Top Header with Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 py-2 px-4 border-b border-[#383838] bg-[#282828]">
          {/* Prev / Next */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const index = dsaList.findIndex(
                  (q) => q.id?.toString() === id?.toString()
                );
                if (index > 0)
                  navigate(`/dsa/question/${dsaList[index - 1].id}`);
                else toast.warning("No previous question.");
              }}
              className="p-2 bg-[#1A1A1A] hover:bg-[#383838] rounded-full"
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
              className="p-2 bg-[#1A1A1A] hover:bg-[#383838] rounded-full"
              title="Next"
            >
              <HiOutlineArrowRight />
            </button>
          </div>

          {/* Language Selector, Stopwatch, Run, Submit */}
          <div className="flex items-center gap-2">
            <select
              value={selectedCompiler}
              onChange={(e) => {
                const lang = e.target.value;
                setSelectedCompiler(lang);
                setCode(defaultCodeMap[lang]);
              }}
              className="bg-[#1A1A1A] text-white p-1.5 rounded-lg text-sm border border-[#383838]"
            >
              {compilers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <Stopwatch />

            <button
              onClick={handleRun}
              className="flex items-center gap-2 bg-[#1A1A1A] hover:bg-[#383838] text-white px-3 py-1.5 rounded-md text-sm"
            >
              <FiPlay className="text-gray-300" size={14} />
              {isLoading ? "Running..." : "Run"}
            </button>

            <button
              onClick={handleMarkComplete}
              disabled={
                !hasRun ||
                normalizeOutput(outputText) !==
                  normalizeOutput(lastRunOutput) ||
                isCompleted
              }
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition ${
                isCompleted ||
                normalizeOutput(outputText) !== normalizeOutput(lastRunOutput)
                  ? "bg-[#1A1A1A] text-gray-500 cursor-not-allowed"
                  : "bg-[#1A1A1A] hover:bg-[#383838] text-green-500"
              }`}
            >
              {submissionStatus === "success" ? (
                <LuCircleCheckBig size={16} />
              ) : (
                <FiUploadCloud size={16} />
              )}
              {isCompleted ? "Completed" : "Submit"}
            </button>
          </div>
        </div>

        {/* Main Layout */}
        <div className="flex flex-col md:flex-row flex-grow gap-4 p-4 overflow-hidden">
          {/* Sidebar - Question Info */}
          <div className="w-full md:w-[40%] bg-[#282828] p-4 border border-[#383838] rounded-xl overflow-y-auto">
            {question ? (
              <>
                <h1 className="text-xl font-bold text-white mb-3 capitalize">
                  {question.title}
                </h1>

                <p
                  className={`text-sm font-semibold capitalize ${getDifficultyColor(
                    question.difficulty
                  )}`}
                >
                  Difficulty: {question.difficulty}
                </p>

                <p className="text-gray-200 mt-4 whitespace-pre-line">
                  {question.explanation}
                </p>

                <h3 className="text-lg font-semibold mt-6 text-orange-300">
                  Examples:
                </h3>
                {question.examples?.map((ex, idx) => (
                  <div key={idx} className="bg-[#1A1A1A] p-3 rounded-md mt-2">
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

          {/* Editor Section */}
          <div className="w-full md:w-[60%] flex flex-col gap-4">
            {/* Code Editor */}
            <div className="h-[440px] border border-[#383838] rounded-lg overflow-hidden">
              <Editor
                height="100%"
                language={currentCompiler.language}
                value={code}
                onChange={(val) => setCode(val || "")}
                theme="vs-dark"
              />
            </div>

            {/* Terminal */}
            <div className="w-full">
              <div className="flex justify-between items-center mb-2">
                <label className="text-green-400 font-semibold text-base">
                  Terminal
                </label>
                <div className="flex space-x-4 text-sm font-semibold">
                  {["input", "output"].map((tab) => (
                    <span
                      key={tab}
                      onClick={() => setOutputTab(tab)}
                      className={`cursor-pointer ${
                        outputTab === tab
                          ? "text-yellow-400 underline underline-offset-4"
                          : "text-gray-400 hover:text-yellow-300"
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-[#1A1A1A] text-white rounded-lg p-3 text-sm min-h-[120px] max-h-[240px] overflow-y-auto whitespace-pre-wrap border border-[#383838]">
                {outputTab === "input" ? (
                  <textarea
                    className="w-full bg-transparent text-white resize-none outline-none"
                    rows="5"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter input for your code..."
                  />
                ) : (
                  <>
                    {/* Output Row with status + metrics */}
                    {outputText.includes("Wrong Answer") ||
                    outputText.includes("Correct Answer") ? (
                      <div className="flex justify-between items-start gap-4">
                        {/* Output Label and Result */}
                        <div className="space-y-1">
                          <p
                            className={`font-semibold ${
                              outputText.includes("Wrong Answer")
                                ? "text-red-500"
                                : "text-green-500"
                            }`}
                          >
                            {outputText.includes("Wrong Answer")
                              ? "Wrong Answer"
                              : "Correct Answer"}
                          </p>
                          <pre>
                            {outputText
                              .replace(/(Wrong Answer|Correct Answer)/, "")
                              .trim()}
                          </pre>
                        </div>

                        {/* Metrics */}
                        {(execTime || memoryUsage) && (
                          <div className="text-green-400 text-xs flex flex-col items-end gap-1 whitespace-nowrap pt-1">
                            {execTime && <span>⏱ {execTime}</span>}
                            {memoryUsage && <span>🧠 {memoryUsage}</span>}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-400">
                        {outputText || "Your output will appear here..."}
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Floating Button */}
        <button
          className="fixed bottom-6 right-6 z-50 bg-[#282828] hover:bg-[#383838] text-white p-4 rounded-full shadow-lg"
          onClick={() => setShowDSASidebar(true)}
        >
          <HiMiniBarsArrowUp size={20} />
        </button>

        {/* DSA Sidebar */}
        {showDSASidebar && (
          <div className="fixed top-0 right-0 z-50 w-80 max-w-full h-full bg-[#282828] shadow-xl border-l border-[#383838] flex flex-col">
            <div className="sticky top-0 flex justify-between items-center px-5 py-3 border-b border-[#383838] bg-[#282828] z-10 shadow-md">
              <h2 className="text-lg text-orange-400 font-semibold tracking-wide">
                All DSA Questions
              </h2>
              <button
                onClick={() => setShowDSASidebar(false)}
                className="p-2 hover:bg-red-500/20 rounded-md transition"
              >
                <ImCross
                  className="text-red-400 hover:text-red-500"
                  size={14}
                />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
              {dsaList.length > 0 ? (
                <ul className="space-y-2">
                  {dsaList.map((q) => (
                    <li key={q._id}>
                      <button
                        onClick={() => {
                          setShowDSASidebar(false);
                          navigate(`/dsa/question/${q.id}`);
                        }}
                        className="w-full text-left bg-[#1A1A1A] hover:bg-[#383838] text-white p-3 rounded-md"
                      >
                        <div className="flex justify-between items-center capitalize">
                          <span className="truncate">{q.title}</span>
                          <span
                            className={`text-xs font-medium ${getDifficultyColor(
                              q.difficulty
                            )}`}
                          >
                            {q.difficulty}
                          </span>
                        </div>
                        {completedTitles.includes(q.title) && (
                          <span className="text-green-400 text-xs">
                            ✓ Completed
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 text-sm">No questions available.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DSADetailPage;
