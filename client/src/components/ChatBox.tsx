import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import Card from "./Card";

export default function ChatBox({ onSend }: { onSend: (message: string) => Promise<string> }) {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<Array<{ role: "assistant" | "user"; text: string }>>([
    { role: "assistant", text: "Ask about cooking quantity or waste reasons." }
  ]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const next = message;
    setChat((prev) => [...prev, { role: "user", text: next }]);
    setMessage("");
    const reply = await onSend(next);
    setChat((prev) => [...prev, { role: "assistant", text: reply }]);
  };

  return (
    <Card title="AI Kitchen Assistant" className="h-[560px] flex flex-col">
      <div className="mb-3 flex-1 space-y-3 overflow-y-auto rounded-xl bg-black/5 p-3 dark:bg-white/5">
        {chat.map((m, i) => (
          <div key={i} className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${m.role === "user" ? "ml-auto bg-emerald-500 text-white" : "bg-white/70 dark:bg-slate-800"}`}>
            {m.text}
          </div>
        ))}
      </div>
      <form onSubmit={submit} className="flex gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="How much should I cook today?"
          className="flex-1 rounded-xl border border-white/20 bg-transparent px-3 py-2 outline-none"
        />
        <button className="rounded-xl bg-emerald-500 px-3 text-white" type="submit">
          <Send size={16} />
        </button>
      </form>
    </Card>
  );
}
