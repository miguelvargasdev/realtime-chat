"use client";

import ChatHeader from "@/components/chat-header";
import { useUsername } from "@/hooks/use-username";
import { client } from "@/lib/client";
import { useRealtime } from "@/lib/realtime-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useParams } from "next/dist/client/components/navigation";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

const Page = () => {
	const params = useParams();
	const roomId = params.roomId as string;

	const router = useRouter();

	const { username } = useUsername();

	const [input, setInput] = useState<string>("");
	const inputRef = useRef<HTMLInputElement>(null);

	const { data: messages, refetch } = useQuery({
		queryKey: ["messages", roomId],
		queryFn: async () => {
			const res = await client.messages.get({ query: { roomId } });
			return res.data;
		},
	});

	const { mutate: sendMessage, isPending } = useMutation({
		mutationFn: async ({ text }: { text: string }) => {
			await client.messages.post(
				{ sender: username, text },
				{ query: { roomId } },
			);
			setInput("");
		},
	});

	useRealtime({
		channels: [roomId],
		events: ["chat.message", "chat.destroy"],
		onData: ({ event }) => {
			if (event === "chat.message") {
				refetch();
			}
			if (event === "chat.destroy") {
				router.push("/?destroyed=true");
			}
		},
	});

	return (
		<main className="flex flex-col h-screen max-h-screen overflow-hidden">
			<ChatHeader roomId={roomId} router={router} />

			<div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
				{messages?.messages.length === 0 && (
					<div className="flex item-center justify-center h-full">
						<p className="text-zinc-600 text-sm font-mono">
							Start the conversation
						</p>
					</div>
				)}

				{messages?.messages.map((message) => (
					<div key={message.id} className="flex flex-col items-start">
						<div className="max-w-[80%] group">
							<div className="flex items-baseline gap-3 mb-1">
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

			<div className="p-4 border-t border-zinc-800 bg-zinc-900/30">
				<div className="flex gap-4">
					<div className="flex-1 relative group">
						<span className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500 animate-pulse">
							{">"}
						</span>
						<input
							autoFocus
							type="text"
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyDown={(e) => {
								if (e.key == "Enter" && input.trim()) {
									sendMessage({ text: input });
									inputRef.current?.focus();
								}
							}}
							placeholder="Type message..."
							className="w-full bg-black border border-zinc-800 focus:border-zinc-700 focus:outline-none transition-colors text-zinc-100 placeholder:text-zinc-700 py-3 pl-8 pr-4 text-sm"
						></input>
					</div>
					<button
						onClick={() => {
							sendMessage({ text: input });
							inputRef.current?.focus();
						}}
						disabled={!input.trim() || isPending}
						className="bg-zinc-800 text-zinc-400 px-6 text-sm font-bold hover:text-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
					>
						SEND
					</button>
				</div>
			</div>
		</main>
	);
};

export default Page;
