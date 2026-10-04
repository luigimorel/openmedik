export type Message = {
  role: 'assistant' | 'user';
  text: string;
  attachments?: File[];
  webSearch?: boolean;
};

export type ChatMode = 'diagnosis' | 'procedure' | 'medication';

export type Conversation = {
  id: string;
  title: string;
  mode: ChatMode;
  messages: Message[];
};
