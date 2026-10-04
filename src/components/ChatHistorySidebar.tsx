import { ChevronDown, Plus } from 'lucide-react';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
} from '@/components/ui/sidebar';

import { chatModes } from '../data';
import type { Conversation } from '../types';

type ChatHistorySidebarProps = {
  conversations: Conversation[];
  activeChatId: string | null;
  onNewChat: () => void;
  onSelectChat: (conversation: Conversation) => void;
};

const pageSize = 20;

export function ChatHistorySidebar({ conversations, activeChatId, onNewChat, onSelectChat }: ChatHistorySidebarProps) {
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [search, setSearch] = useState('');
  const filteredConversations = conversations.filter((conversation) =>
    conversation.title.toLowerCase().includes(search.toLowerCase()),
  );
  const visibleChats = filteredConversations.slice(0, visibleCount);

  function startNewChat() {
    setVisibleCount(pageSize);
    setSearch('');
    onNewChat();
  }

  return (
    <Sidebar collapsible="offcanvas" className="border-r border-sidebar-border">
      <SidebarHeader className="h-[68px] flex-row items-center border-b border-sidebar-border px-5 py-0">
        <a
          className="flex items-center gap-2.5 text-[17px] font-bold text-sidebar-foreground no-underline"
          href="#chat"
          aria-label="OpenMedik home">
          <span className="grid size-8 place-items-center rounded-[9px] bg-primary text-xl font-medium leading-none text-primary-foreground">
            +
          </span>
          <span>
            openmedik<span className="text-primary">.</span>
          </span>
        </a>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="gap-3 px-3 pb-2 pt-4">
          <Button variant="default" className="w-full justify-start" onClick={startNewChat}>
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
          <SidebarGroupLabel className="px-2 text-[11px] font-semibold uppercase tracking-[0.8px] text-muted-foreground">
            Your chats
            <span className="ml-auto font-normal normal-case tracking-normal text-muted-foreground/80">
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
                      className="h-auto min-h-14 flex-col items-start justify-center gap-1 px-3 py-2 text-left text-xs data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground">
                      <span className="w-full truncate font-medium">{conversation.title}</span>
                      <span className="text-[10px] font-normal text-muted-foreground">
                        {chatModes.find((item) => item.value === conversation.mode)?.label}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              ) : (
                <p className="px-3 py-4 text-xs leading-5 text-muted-foreground">
                  {search ? 'No chats match your search.' : 'Your conversations will appear here.'}
                </p>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {visibleChats.length < filteredConversations.length && (
        <SidebarFooter className="border-t border-sidebar-border p-2">
          <Button
            variant="ghost"
            className="w-full justify-center gap-2 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => setVisibleCount((count) => count + pageSize)}>
            Show more <ChevronDown />
          </Button>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
