import { Server, Member, Profile } from "@prisma/client"

export type ServerWithMemebersWithProfiles = Server & {
    members: (Member & {profile: Profile})[];
};