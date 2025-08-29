import { useEffect, useRef, useState } from "react";
import { Button, Spinner, Textarea } from "flowbite-react";
import { FaArrowCircleUp } from "react-icons/fa";
import { ComplianceResult } from "./types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface PayloadData {
  state: string;
  mode?: string;
  employees: string;
  fte?: string;
  naics?: string;
  revenue?: string;
  consumers?: string;
  revenuePctFromDataSales?: string;
  isHealthcare?: string;
  isBA?: string;
  acceptsCard?: string;
  isNewBusiness?: string;
  sellsData?: string;
  city?: string;
  isEmployer?: string;
}
interface ChatTabProps {
  resultData: ComplianceResult | null;
  payload: PayloadData | null;
}

type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

const ChatTab = ({ resultData, payload }: ChatTabProps) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Track the last inputs we greeted for, to avoid duplicates & handle races.
  const lastInputsKeyRef = useRef<string | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  const extractReplyText = (data: unknown): string => {
    if (!data) return "Sorry, I got an empty response.";
    if (typeof data === "string") return data;
    if (typeof data === "object" && data !== null) {
      const obj = data as Record<string, unknown>;
      return (
        (typeof obj.answer === "string" && obj.answer) ||
        (typeof obj.response === "string" && obj.response) ||
        (typeof obj.message === "string" && obj.message) ||
        (typeof obj.content === "string" && obj.content) ||
        JSON.stringify(data)
      );
    }
    return JSON.stringify(data);
  };

  // Auto-greet once the inputs are available.
  useEffect(() => {
    const inputsReady = !!payload && !!resultData;
    if (!inputsReady) return;

    const inputsKey = JSON.stringify({ payload, resultData });
    if (lastInputsKeyRef.current === inputsKey) return; // already greeted these inputs
    lastInputsKeyRef.current = inputsKey;

    // Unique key for this specific fetch to avoid stale updates.
    const myKey = inputsKey;

    (async () => {
      try {
        setError(null);
        setLoading(true);

        const initialUserIntent =
          "Please greet the user briefly and summarize the most relevant compliance considerations for their situation. Use bullets, be concise, and end by inviting follow-up questions.";

        const query = `For your context our previous messages are ${JSON.stringify(
          messages
        )}. My business details are ${JSON.stringify(
          payload
        )} and my compliance results are ${JSON.stringify(
          resultData
        )}. Based on that, ${initialUserIntent}`;

        // Show a temporary placeholder greeting while we fetch.
        setMessages([{ role: "assistant", content: "Analyzing your inputs…" }]);

        const res = await fetch(`${backendUrl}/api/ask`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        });

        const ct = res.headers.get("Content-Type") || "";
        const reply =
          ct.includes("application/json")
            ? extractReplyText(await res.json())
            : (await res.text()) || "Received empty response.";

        if (!res.ok) {
          throw new Error(reply || `Request failed with status ${res.status}`);
        }

        // Only apply if nothing newer started meanwhile.
        if (lastInputsKeyRef.current === myKey) {
          setMessages([{ role: "assistant", content: reply }]);
        }
      } catch (err: unknown) {
        const msg =
          typeof err === "object" &&
          err !== null &&
          "message" in err &&
          typeof (err as { message?: unknown }).message === "string"
            ? (err as { message: string }).message
            : "Something went wrong. Please try again.";
        setError(msg);
        // Replace the placeholder with a graceful fallback.
        setMessages([
          {
            role: "assistant",
            content:
              "I couldn’t fetch your tailored greeting just now. You can still ask a question below.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    })();
  }, [payload, resultData, messages]);

  const sendMessage = async () => {
    const userMessage = input.trim();
    if (!userMessage || loading) return;

    const query = `My business details are ${JSON.stringify(
      payload
    )} and my compliance results are ${JSON.stringify(
      resultData
    )}. Based on that answer ${userMessage}`;

    setError(null);
    setLoading(true);
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");

    try {
      const res = await fetch(`${backendUrl}/api/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const ct = res.headers.get("Content-Type") || "";
      const reply =
        ct.includes("application/json")
          ? extractReplyText(await res.json())
          : (await res.text()) || "Received empty response.";

      if (!res.ok) throw new Error(reply || "Request failed.");

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err: unknown) {
      const msg =
        typeof err === "object" &&
        err !== null &&
        "message" in err &&
        typeof (err as { message?: unknown }).message === "string"
          ? (err as { message: string }).message
          : "Something went wrong. Please try again.";
      setError(msg);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Hmm, I couldn't fetch a reply from the server just now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex h-screen min-h-0 flex-col">
      <div
        id="chat-container"
        className="min-h-0 flex-1 space-y-4 overflow-y-auto rounded-xl bg-white px-4 py-6 dark:bg-gray-900"
      >
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`prose max-w-[85%] rounded-lg px-4 py-2 text-sm break-words ${
                m.role === "user"
                  ? "bg-blue-600 text-white prose-invert"
                  : m.role === "system"
                  ? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
                  : "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100"
              }`}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {m.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-gray-500">
            <Spinner size="sm" />
            <span>Thinking…</span>
          </div>
        )}

        {error && (
          <div className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-700/40 dark:bg-red-900/30 dark:text-red-200">
            {error}
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      <div className="fixed right-15 bottom-0 z-20 flex w-3/5 items-center gap-2">
        <Textarea
          className="w-11/12"
          placeholder="Type your message here…"
          value={input}
          rows={2}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={loading}
        />
        <Button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="1/12 flex gap-2"
        >
          {loading ? (
            <>
              <Spinner size="sm" />
              Sending
            </>
          ) : (
            <>
              Ask <FaArrowCircleUp />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ChatTab;
