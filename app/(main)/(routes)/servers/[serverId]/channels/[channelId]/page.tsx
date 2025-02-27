import { ChatHeader } from "@/components/chat/chat-header";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface ChannelIdPageProps {
    params: {
        serverId: string;
        channelId: string; 
    }
}

const ChannelIdPage = async ({params}:ChannelIdPageProps) => {
    const profile = await currentProfile();

    if(!profile){
        return RedirectToSignIn;
    }

    const awaitedParam = await params;

    const channel = await db.channel.findUnique({
        where: {
            id: awaitedParam.channelId,
        }
    })

    const member = await db.member.findFirst({
        where: {
            serverId: awaitedParam.serverId,
            profileId: profile.id,
        }
    })

    if(!channel || !member){
        redirect("/");
    }

    return (
        <div className="bg-white dark:bg-[#313338] flex felx-col h-full">
            <ChatHeader 
                name={channel.name}
                serverId={channel.serverId}
                type="channel"
            />
        </div>
    );
}

export default ChannelIdPage;