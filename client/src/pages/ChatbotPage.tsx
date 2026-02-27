import { useEffect } from "react";
import ChatBox from "../components/ChatBox";
import { dataApi } from "../services/endpoints";
import { useAuth } from "../context/AuthContext";
import { setAuthToken } from "../services/api";

export default function ChatbotPage() {
  const { token } = useAuth();

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  const send = async (message: string) => {
    const { data } = await dataApi.chat({ message });
    return data.reply;
  };

  return (
    <div className="mx-auto max-w-3xl pb-24 md:pb-4">
      <ChatBox onSend={send} />
    </div>
  );
}
