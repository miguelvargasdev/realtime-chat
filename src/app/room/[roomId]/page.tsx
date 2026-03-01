"use client";

import ChatHeader from "@/components/chat-header";
import MessageInput from "@/components/message-input";
import MessageList from "@/components/message-list";
import { useUsername } from "@/hooks/use-username";
import { client } from "@/lib/client";
import { useRealtime } from "@/lib/realtime-client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/dist/client/components/navigation";
import { useRouter } from "next/navigation";

const Page = () => {
	const params = useParams();
	const router = useRouter();
	const { username } = useUsername();

	const roomId = params.roomId as string;

	const { data, refetch } = useQuery({
		queryKey: ["messages", roomId],
		queryFn: async () => {
			const res = await client.messages.get({ query: { roomId } });
			return res.data;
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
			<MessageList messages={data?.messages} username={username} />
			<MessageInput roomId={roomId} username={username} />
		</main>
	);
};

export default Page;
