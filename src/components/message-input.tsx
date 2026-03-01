import { client } from "@/lib/client";
import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";

const MessageInput = ({
	username,
	roomId,
}: {
	username: string;
	roomId: string;
}) => {
	const [input, setInput] = useState<string>("");
	const inputRef = useRef<HTMLInputElement>(null);

	const { mutate: sendMessage, isPending } = useMutation({
		mutationFn: async ({ text }: { text: string }) => {
			await client.messages.post(
				{ sender: username, text },
				{ query: { roomId } },
			);
		},
		onSuccess: () => {
			setInput("");
			inputRef.current?.focus();
		},
	});

	return (
		<div className="p-4 border-t border-zinc-800 bg-zinc-900/30">
			<div className="flex gap-4">
				<div className="flex-1 relative group">
					<span className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500 animate-pulse">
						{">"}
					</span>
					<input
						autoFocus
						ref={inputRef}
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
	);
};
export default MessageInput;
