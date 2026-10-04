import { useState } from "react";
import { ChatWorkspace } from "./components/ChatWorkspace";
import type { ChatMode, Conversation, Message } from "./types";

function App() {
  const [draft, setDraft] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [mode, setMode] = useState<ChatMode>("diagnosis");
  const activeConversation = conversations.find(
    (conversation) => conversation.id === activeChatId,
  );
  const messages = activeConversation?.messages ?? [];

  function sendMessage(
    text = draft,
    attachments: File[] = [],
    webSearch = false,
  ) {
    const message = text.trim();
    if (!message && attachments.length === 0) return;

    const chatId = activeChatId ?? crypto.randomUUID();
    const currentConversation = conversations.find(
      (conversation) => conversation.id === chatId,
    );
    const reply: Message = {
      role: "assistant",
      text: `Demo mode: the language model${webSearch ? " and web search" : ""} isn't connected. ${attachments.length ? `${attachments.length} attachment${attachments.length === 1 ? " was" : "s were"} added locally to this chat.` : "Connect a language model to get a response."}`,
    };
    const updatedConversation: Conversation = {
      id: chatId,
      title:
        currentConversation?.title ??
        (message || attachments[0]?.name || "New conversation").slice(0, 38),
      mode,
      messages: [
        ...(currentConversation?.messages ?? []),
        { role: "user", text: message, attachments, webSearch },
        reply,
      ],
    };

    setConversations((current) =>
      currentConversation
        ? current.map((conversation) =>
            conversation.id === chatId ? updatedConversation : conversation,
          )
        : [updatedConversation, ...current],
    );
    setActiveChatId(chatId);
    setDraft("");
  }

  function startNewChat() {
    setActiveChatId(null);
    setMode("diagnosis");
    setDraft("");
  }

  function selectChat(conversation: Conversation) {
    setActiveChatId(conversation.id);
    setMode(conversation.mode);
    setDraft("");
  }

  function changeMode(nextMode: ChatMode) {
    setMode(nextMode);
    if (activeChatId) {
      setConversations((current) =>
        current.map((conversation) =>
          conversation.id === activeChatId
            ? { ...conversation, mode: nextMode }
            : conversation,
        ),
      );
    }
  }

  return (
    <ChatWorkspace
      conversations={conversations}
      activeChatId={activeChatId}
      messages={messages}
      mode={mode}
      draft={draft}
      onDraftChange={setDraft}
      onSendMessage={sendMessage}
      onNewChat={startNewChat}
      onSelectChat={selectChat}
      onModeChange={changeMode}
    />
  );
}

export default App;
