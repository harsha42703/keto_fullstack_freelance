import { Message } from "@/types";

interface MessageListProps {
  messages: Message[];
  onMessageClick: (message: Message) => void;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  onMessageClick,
}) => (
  <div className="space-y-4">
    {messages.map((message) => (
      <div
        key={message.id}
        onClick={() => onMessageClick(message)}
        className={`p-4 rounded-lg cursor-pointer transition-colors ${
          message.read ? "bg-gray-50" : "bg-blue-50"
        }`}
      >
        <div className="flex justify-between items-start mb-2">
          <span className="font-medium">{message.senderId}</span>
          <span className="text-sm text-gray-500">
            {new Date(message.timestamp).toLocaleDateString()}
          </span>
        </div>
        <p className="text-gray-600 line-clamp-2">{message.content}</p>
      </div>
    ))}
  </div>
);
