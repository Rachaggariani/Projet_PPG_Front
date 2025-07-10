import { User } from "./user";

export interface Message {
  id?: number;
  content: string;
  sender: User;
  receiver: User;
  timestamp?: Date;
}