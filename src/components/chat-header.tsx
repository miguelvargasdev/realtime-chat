import { useEffect, useState } from "react";
import { client } from "@/lib/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const ChatHeader = ({
	roomId,
	router,
}: {
	roomId: string;
	router: AppRouterInstance;
}) => {
	const [copyStatus, setCopyStatus] = useState("COPY");
	const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

	const { data: ttlData } = useQuery({
		queryKey: ["ttl", roomId],
		queryFn: async () => {
			const res = await client.room.ttl.get({ query: { roomId } });
			return res.data;
		},
	});
	useEffect(() => {
		if (timeRemaining === null || timeRemaining < 0) return;

		if (timeRemaining === 0) {
			router.push("/?destroyed=true");
			return;
		}

		const interval = setInterval(() => {
			setTimeRemaining((prev) => {
				if (prev === null || prev <= 1) {
					clearInterval(interval);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);
		return () => clearInterval(interval);
	}, [timeRemaining, router]);

	useEffect(() => {
		if (ttlData?.ttl !== undefined) {
			setTimeRemaining(ttlData.ttl);
		}
	}, [ttlData?.ttl]);
	const formatTimeRemaining = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};
	const copyLink = () => {
		const url = window.location.href;
		navigator.clipboard.writeText(url);
		setCopyStatus("COPIED");
		setTimeout(() => setCopyStatus("COPY"), 2000);
	};

	const { mutate: destroyRoom } = useMutation({
		mutationFn: async () => {
			await client.room.delete(null, { query: { roomId } });
		},
	});
	return (
		<header className="border-b border-zinc-800 p-4 flex items-center justify-between bg-zinc-900/30">
			<div className="flex items-center gap-4">
				<div className="flex flex-col">
					<span className="text-xs text-zinc-500 uppercase">room id</span>
					<div className="flex items-center gap-2">
						<span className="font-bold text-green-500">{roomId}</span>
						<button
							onClick={() => copyLink()}
							className="text-[10px] bg-zinc-800 hover:bg-zinc-700 px-2 py-0.5 rounded text-zinc-400 hover:text-zinc-200 transition-colors"
						>
							{copyStatus}
						</button>
					</div>
				</div>

				<div className="h-8 w-px bg-zinc-800" />
				<div className="flex flex-col">
					<span className="text-xs text-zinc-500 uppercase">Self-Destruct</span>
					<span
						className={`text-sm font-bold flex items-center gap-2 ${timeRemaining !== null && timeRemaining < 60 ? "text-red-500" : "text-amber-500"}`}
					>
						{timeRemaining !== null
							? formatTimeRemaining(timeRemaining)
							: "--:--"}
					</span>
				</div>
			</div>
			<button
				onClick={() => destroyRoom()}
				className="text-xs bg-zinc-800 hover:bg-red-600 px-3 py-1.5 rounded text-zinc-400 hover:text-white font-bold transition-all group flex items-center gap-2 disabled:opacity-50"
			>
				<span className="group-hover:animate-pulse">X</span>DESTROY NOW
			</button>
		</header>
	);
};
export default ChatHeader;
