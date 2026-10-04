import { ArrowUp, FileText, Globe, Image as ImageIcon, Plus, Search, X } from 'lucide-react';

import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Textarea } from '@/components/ui/textarea';

import { chatModes, starterPrompts } from '../data';
import type { ChatMode, Conversation, Message } from '../types';
import { ChatHistorySidebar } from './ChatHistorySidebar';

type ChatWorkspaceProps = {
  conversations: Conversation[];
  activeChatId: string | null;
  messages: Message[];
  mode: ChatMode;
  draft: string;
  onDraftChange: (draft: string) => void;
  onSendMessage: (text?: string, attachments?: File[], webSearch?: boolean) => void;
  onNewChat: () => void;
  onSelectChat: (conversation: Conversation) => void;
  onModeChange: (mode: ChatMode) => void;
};

function FileAttachment({ file, onRemove }: { file: File; onRemove?: () => void }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div className="flex max-w-[220px] items-center gap-2 rounded-lg border border-border bg-card p-1.5 pr-2">
      {imageUrl ? (
        <img className="size-10 shrink-0 rounded-md object-cover" src={imageUrl} alt={file.name} />
      ) : (
        <span className="grid size-10 shrink-0 place-items-center rounded-md bg-secondary text-secondary-foreground">
          {file.type.startsWith('image/') ? <ImageIcon className="size-4" /> : <FileText className="size-4" />}
        </span>
      )}
      <span className="min-w-0 flex-1 truncate text-[11px] text-muted-foreground" title={file.name}>
        {file.name}
      </span>
      {onRemove && (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="shrink-0 text-muted-foreground hover:text-foreground"
          aria-label={`Remove ${file.name}`}
          onClick={onRemove}>
          <X />
        </Button>
      )}
    </div>
  );
}

export function ChatWorkspace({
  conversations,
  activeChatId,
  messages,
  mode,
  draft,
  onDraftChange,
  onSendMessage,
  onNewChat,
  onSelectChat,
  onModeChange,
}: ChatWorkspaceProps) {
  const [attachments, setAttachments] = useState<File[]>([]);
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isNewChat = messages.length === 0;
  const activeConversation = conversations.find((conversation) => conversation.id === activeChatId);

  function sendMessage(text?: string) {
    if (!text?.trim() && attachments.length === 0 && !draft.trim()) return;
    onSendMessage(text, attachments, webSearchEnabled);
    setAttachments([]);
    setWebSearchEnabled(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (imageInputRef.current) imageInputRef.current.value = '';
  }

  function startNewChat() {
    onNewChat();
    setAttachments([]);
    setWebSearchEnabled(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (imageInputRef.current) imageInputRef.current.value = '';
  }

  function selectChat(conversation: Conversation) {
    onSelectChat(conversation);
    setAttachments([]);
    setWebSearchEnabled(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (imageInputRef.current) imageInputRef.current.value = '';
  }

  return (
    <SidebarProvider defaultOpen className="min-h-screen w-full bg-background text-foreground">
      <ChatHistorySidebar
        conversations={conversations}
        activeChatId={activeChatId}
        onNewChat={startNewChat}
        onSelectChat={selectChat}
      />

      <SidebarInset className="min-h-screen min-w-0 bg-background">
        <header className="flex h-[68px] shrink-0 items-center justify-between border-b border-border bg-card px-4 sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <SidebarTrigger className="text-muted-foreground" />
            <span className="truncate text-sm font-semibold text-foreground">
              {activeConversation?.title ?? 'New chat'}
            </span>
          </div>
        </header>

        <section
          className="mx-auto flex min-h-0 w-full max-w-[940px] flex-1 flex-col px-4 sm:px-8"
          id="chat"
          aria-label="AI chat">
          {isNewChat ? (
            <div className="flex flex-1 flex-col justify-center pb-8 sm:pb-16">
              <div className="mb-8 max-w-[620px]">
                <div className="mb-4 flex size-11 items-center justify-center rounded-[13px] bg-secondary text-[22px] text-primary">
                  ✳
                </div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[1.2px] text-primary">
                  OpenMedik assistant
                </p>
                <h1 className="mb-3 text-[30px] font-semibold leading-tight text-foreground sm:text-[38px]">
                  What would you like to explore?
                </h1>
                <p className="max-w-[520px] text-sm leading-6 text-muted-foreground">
                  Ask a question, work through an idea, or draft something useful. Start with a prompt or write your
                  own.
                </p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {starterPrompts.map((item) => (
                  <Button
                    key={item.title}
                    variant="outline"
                    className="group h-auto min-h-[74px] justify-between gap-4 rounded-lg border-border bg-card px-4 py-3 text-left whitespace-normal transition-colors hover:border-primary/50 hover:bg-accent"
                    onClick={() => sendMessage(item.prompt)}>
                    <span className="flex flex-col gap-1">
                      <strong className="text-[13px] font-semibold text-card-foreground">{item.title}</strong>
                      <span className="text-[11px] leading-4 text-muted-foreground">{item.prompt}</span>
                    </span>
                    <span className="shrink-0 text-lg text-muted-foreground transition-transform group-hover:translate-x-0.5">
                      ↗
                    </span>
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex min-h-0 flex-1 flex-col gap-7 overflow-y-auto py-8" aria-live="polite">
              {messages.map((message, index) => (
                <article
                  key={`${index}-${message.role}`}
                  className={`flex gap-3 sm:gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.role === 'assistant' && (
                    <span className="grid size-8 shrink-0 place-items-center rounded-[9px] bg-secondary text-base text-primary">
                      ✳
                    </span>
                  )}
                  <div
                    className={`max-w-[min(85%,680px)] whitespace-pre-wrap rounded-xl px-4 py-3 text-[13px] leading-6 sm:px-5 ${message.role === 'user' ? 'bg-secondary text-secondary-foreground' : 'bg-card text-card-foreground shadow-sm ring-1 ring-border'}`}>
                    {message.text && <p className="m-0">{message.text}</p>}
                    {message.webSearch && (
                      <div className="mb-2 flex items-center gap-1 text-[10px] font-medium text-primary">
                        <Search className="size-3" />
                        Web search requested
                      </div>
                    )}
                    {message.attachments?.length ? (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {message.attachments.map((file, fileIndex) => (
                          <FileAttachment key={`${file.name}-${file.lastModified}-${fileIndex}`} file={file} />
                        ))}
                      </div>
                    ) : null}
                  </div>
                  {message.role === 'user' && (
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-muted text-[10px] font-bold text-muted-foreground">
                      YOU
                    </span>
                  )}
                </article>
              ))}
            </div>
          )}

          <form
            className="sticky bottom-0 mb-3 rounded-[24px] border border-border bg-card px-3 pb-3 pt-4 shadow-sm transition-colors focus-within:border-primary/50 sm:mb-4 sm:px-4"
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage();
            }}>
            {attachments.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {attachments.map((file, index) => (
                  <FileAttachment
                    key={`${file.name}-${file.lastModified}-${index}`}
                    file={file}
                    onRemove={() => setAttachments((current) => current.filter((_, fileIndex) => fileIndex !== index))}
                  />
                ))}
              </div>
            )}
            <Textarea
              className="block max-h-48 min-h-16 resize-y border-0 bg-transparent px-1 text-sm leading-6 text-foreground shadow-none outline-none placeholder:text-muted-foreground focus-visible:border-transparent focus-visible:ring-0"
              value={draft}
              onChange={(event) => onDraftChange(event.currentTarget.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Message OpenMedik..."
              rows={2}
            />

            <Input
              ref={imageInputRef}
              className="sr-only"
              type="file"
              multiple
              accept="image/*"
              aria-label="Attach image"
              onChange={(event) => {
                const selectedFiles = Array.from(event.currentTarget.files ?? []);
                setAttachments((current) => [...current, ...selectedFiles]);
                event.currentTarget.value = '';
              }}
            />

            <Input
              ref={fileInputRef}
              className="sr-only"
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt,.csv,.xls,.xlsx"
              aria-label="Attach files"
              onChange={(event) => {
                const selectedFiles = Array.from(event.currentTarget.files ?? []);
                setAttachments((current) => [...current, ...selectedFiles]);
                event.currentTarget.value = '';
              }}
            />

            <div className="flex items-center justify-between gap-2 pt-3">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    className="rounded-full border-border text-muted-foreground hover:text-foreground"
                    aria-label="Add attachment or search option"
                    title="Add attachment or search option">
                    <Plus />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48 text-[12px]">
                  <DropdownMenuItem
                    className="flex cursor-pointer items-center gap-2"
                    onClick={() => imageInputRef.current?.click()}>
                    <ImageIcon className="size-4 text-muted-foreground" />
                    <span>Upload Image</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex cursor-pointer items-center gap-2"
                    onClick={() => fileInputRef.current?.click()}>
                    <FileText className="size-4 text-muted-foreground" />
                    <span>Upload File</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex cursor-pointer items-center gap-2"
                    onClick={() => setWebSearchEnabled((prev) => !prev)}>
                    <Globe className="size-4 text-muted-foreground" />
                    <span>{webSearchEnabled ? 'Disable Web Search' : 'Web Search'}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
                <Select value={mode} onValueChange={(value) => value && onModeChange(value as ChatMode)}>
                  <SelectTrigger
                    aria-label="Chat type"
                    className="h-8 w-[125px] border-border bg-card text-[11px] font-medium text-foreground sm:w-[155px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align="start">
                    {chatModes.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant={webSearchEnabled ? 'secondary' : 'outline'}
                  size="sm"
                  className={`gap-1.5 border-border px-2 text-[11px] ${
                    webSearchEnabled
                      ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                      : 'text-muted-foreground'
                  }`}
                  aria-label={webSearchEnabled ? 'Turn web search off' : 'Turn web search on'}
                  aria-pressed={webSearchEnabled}
                  title="Web search"
                  onClick={() => setWebSearchEnabled((enabled) => !enabled)}>
                  <Search />
                  <span className="hidden sm:inline">Web search</span>
                </Button>
                <Button
                  size="icon-lg"
                  variant="default"
                  type="submit"
                  aria-label="Send message"
                  disabled={!draft.trim() && attachments.length === 0}>
                  <ArrowUp />
                </Button>
              </div>
            </div>
          </form>
          <p className="mb-3 text-center text-[10px] text-muted-foreground">
            AI-generated information can be inaccurate. Verify medical guidance with trusted sources.
          </p>
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
}
