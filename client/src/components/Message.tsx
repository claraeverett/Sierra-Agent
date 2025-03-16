/**
 * Message component to display a single message
 * @param text - The text of the message
 * @param sender - The sender of the message
 * @param timestamp - The timestamp of the message
 * @param intent - The intent of the message
 * @param parameters - The parameters of the message
 */

export interface MessageProps {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  intent?: string;
  parameters?: Record<string, any>;
}

// Message component to display a single message
function Message({ text, sender, timestamp, intent, parameters }: MessageProps) {
  return (
    <div
      className={`flex ${
        sender === 'user' ? 'justify-end' : 'justify-start'
      }`}
    >
      <div
        className={`max-w-[70%] rounded-lg p-3 ${
          sender === 'user'
            ? 'bg-sierra-blue text-white'
            : 'bg-gray-100 text-gray-800'
        }`}
      >
        <p className="whitespace-pre-wrap">{text}</p>
        {intent && (
          <p className="text-xs mt-1 opacity-70">
            Intent: {intent}
          </p>
        )}
        {parameters && (
          <div className="mt-2 text-xs">
            <p className="font-semibold">Parameters:</p>
            <ul className="list-disc pl-4">
              {Object.entries(parameters).map(([key, value]) => (
                <li key={key}>
                  {key}: {JSON.stringify(value)}
                </li>
              ))}
            </ul>
          </div>
        )}
        <p className="text-xs mt-1 opacity-70">
          {timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </div>
  );
}

export default Message; 