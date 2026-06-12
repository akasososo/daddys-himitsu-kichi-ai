export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface Story {
  id: string;
  title: string;
  short: string;
  content: string;
  date: string;
  category: string;
  prompt: string;
}

export interface DialogueCard {
  id: string;
  title: string;
  challenge: string;
  advice: string;
  sukeAdvice: string;
}
