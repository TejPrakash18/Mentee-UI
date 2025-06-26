// src/components/MarkdownRenderer.jsx
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

const MarkdownRenderer = ({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <SyntaxHighlighter
              style={dracula}
              language={match[1]}
              PreTag="div"
              {...props}
              wrapLines
              customStyle={{
                borderRadius: "0.5rem",
                fontSize: "0.875rem",
                padding: "1rem",
              }}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code
              className="bg-gray-200 dark:bg-gray-800 px-1 rounded text-sm"
              {...props}
            >
              {children}
            </code>
          );
        },
        table({ children }) {
          return (
            <div className="overflow-x-auto">
              <table className="table-auto border-collapse w-full border border-gray-300 dark:border-gray-600">
                {children}
              </table>
            </div>
          );
        },
        th(props) {
          return <th className="border px-4 py-2 bg-gray-100 dark:bg-gray-700">{props.children}</th>;
        },
        td(props) {
          return <td className="border px-4 py-2">{props.children}</td>;
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
