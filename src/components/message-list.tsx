import { Message } from "@/lib/realtime";
import { format } from "date-fns";

const MessageList = ({
	messages,
	username,
}: {
	messages?: Message[];
	username?: string;
}) => {
	return (
		<div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
			{messages?.length === 0 && (
				<div className="flex item-center justify-center h-full">
					<p className="text-zinc-600 text-sm font-mono">
						Start the conversation
					</p>
				</div>
			)}

			{messages?.map((message) => (
				<div key={message.id} className="flex flex-col items-start">
					<div className="max-w-[80%] group">
						<div className="flex align gap-3 mb-1">
							<span
								className={`text-xs font-bold ${message.sender === username ? "text-green-500" : "text-blue-500"}`}
							>
								{message.sender === username ? "YOU" : message.sender}
							</span>
							<span className="text-[10px] text-zinc-600">
								{format(message.timestamp, "hh:mm a")}
							</span>
						</div>
						<p className="text-sm text-zinc-300 leading-relaxed break-all">
							{message.text}
						</p>
					</div>
				</div>
			))}
		</div>
	);
};
export default MessageList;
