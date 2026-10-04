import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { ChevronDown, Plus } from "lucide-react";
import { useState } from "react";
import { chatModes } from "../data";
import type { Conversation } from "../types";

type ChatHistorySidebarProps = {
  conversations: Conversation[];
  activeChatId: string | null;
  onNewChat: () => void;
  onSelectChat: (conversation: Conversation) => void;
};

const pageSize = 20;

export function ChatHistorySidebar({
  conversations,
  activeChatId,
  onNewChat,
  onSelectChat,
}: ChatHistorySidebarProps) {
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [search, setSearch] = useState("");
  const filteredConversations = conversations.filter((conversation) =>
    conversation.title.toLowerCase().includes(search.toLowerCase()),
  );
  const visibleChats = filteredConversations.slice(0, visibleCount);

  function startNewChat() {
    setVisibleCount(pageSize);
    setSearch("");
    onNewChat();
  }

  return (
    <Sidebar collapsible="offcanvas" className="border-r border-[#e3e9e3]">
      <SidebarHeader className="h-[68px] flex-row items-center border-b border-[#e8ece8] px-5 py-0">
        <a
          className="flex items-center gap-2.5 text-[17px] font-bold text-[#26352e] no-underline"
          href="#chat"
          aria-label="OpenMedik home"
        >
          <span className="grid size-8 place-items-center rounded-[9px] bg-[#34796b] text-xl font-medium leading-none text-white">
            +
          </span>
          <span>
            openmedik<span className="text-[#5c9c8d">.</span>
          </span>
        </a>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="gap-3 px-3 pb-2 pt-4">
          <Button
            className="w-full justify-start bg-[#34796b] text-white hover:bg-[#285f54]"
            onClick={startNewChat}
          >
            <Plus data-icon="inline-start" />
            New chat
          </Button>
          <Input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.currentTarget.value);
              setVisibleCount(pageSize);
            }}
            placeholder="Search chats"
            aria-label="Search chats"
          />
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup className="min-h-0 px-2 pt-2">
          <SidebarGroupLabel className="px-2 text-[11px] font-semibold uppercase tracking-[0.8px] text-[#849087]">
            Your chats
            <span className="ml-auto font-normal normal-case tracking-normal text-[#9aa49d]">
              {filteredConversations.length}
            </span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleChats.length ? (
                visibleChats.map((conversation) => (
                  <SidebarMenuItem key={conversation.id}>
                    <SidebarMenuButton
                      isActive={activeChatId === conversation.id}
                      onClick={() => onSelectChat(conversation)}
                      className="h-auto min-h-14 flex-col items-start justify-center gap-1 px-3 py-2 text-left text-xs data-[active=true]:bg-[#eaf3ef] data-[active=true]:text-[#2d6e5f]"
                    >
                      <span className="w-full truncate font-medium">
                        {conversation.title}
                      </span>
                      <span className="text-[10px] font-normal text-[#89958d]">
                        {
                          chatModes.find(
                            (item) => item.value === conversation.mode,
                          )?.label
                        }
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              ) : (
                <p className="px-3 py-4 text-xs leading-5 text-[#929d95]">
                  {search
                    ? "No chats match your search."
                    : "Your conversations will appear here."}
                </p>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {visibleChats.length < filteredConversations.length && (
        <SidebarFooter className="border-t border-[#e8ece8] p-2">
          <Button
            variant="ghost"
            className="w-full justify-center gap-2 text-xs text-[#58665d]"
            onClick={() => setVisibleCount((count) => count + pageSize)}
          >
            Show more <ChevronDown />
          </Button>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
