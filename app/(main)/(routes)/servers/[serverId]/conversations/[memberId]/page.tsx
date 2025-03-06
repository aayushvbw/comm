import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { ChatHeader } from "@/components/chat/chat-header";

import { getOrCreateConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChatInput } from "@/components/chat/chat-input";

interface MemberIdPageProps{
    params: {
        memberId: string;
        serverId: string;
    }
}

const MemberIdPage = async ({
    params
}: MemberIdPageProps) => {
    const profile = await currentProfile();

    if(!profile){
        return RedirectToSignIn;
    }

    const awaitedParam = await params;

    const currentMember = await db.member.findFirst({
        where: {
            serverId: awaitedParam.serverId,
            profileId: profile.id
        },
        include: {
            profile: true,
        }
    });

    if(!currentMember){
        return redirect("/");
    }

    const conversation = await getOrCreateConversation(currentMember.id, awaitedParam.memberId);

    if(!conversation){
        return redirect(`/servers/${awaitedParam.serverId}`);
    }

    const {memberOne,memberTwo} = conversation;

    const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne;

    return (
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            <ChatHeader
                imageUrl={otherMember.profile.imageUrl}
                name={otherMember.profile.name}
                serverId={awaitedParam.serverId}
                type="conversation"
            />
            <div className="flex-1">future messages</div>
            <ChatInput/>
        </div>
    );
}

export default MemberIdPage;