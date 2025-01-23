'use client';

import { EnmityServer } from "@/models/EnmityServer";
import { channel } from "diagnostics_channel";
import { createContext, useCallback, useContext, useState } from "react";
import { Channel, StreamChat, ChannelFilters } from "stream-chat";
import { DefaultStreamChatGenerics } from "stream-chat-react";
import { v4 as uuid } from 'uuid';

type EnmityState = {
    server?: EnmityServer;
    channelsByCategories: Map<string, Array<Channel<DefaultStreamChatGenerics>>>;
    changeServer: (server: EnmityServer | undefined, client: StreamChat) => void;
    createServer: (
        client: StreamChat,
        name: string,
        imageUrl: string,
        userIds: string[]
    ) => void;
    createChannel: (
        client: StreamChat,
        name: string,
        category: string,
        userIds: string[]
    ) => void;
};

const initialValue: EnmityState = {
    server: undefined,
    channelsByCategories: new Map(),
    changeServer: () => { },
    createServer: () => { },
    createChannel: () => { },
};

const EnmityContext = createContext<EnmityState>(initialValue);

export const EnmityContextProvider: any = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [myState, setMyState] = useState<EnmityState>(initialValue);

    const changeServer = useCallback(
        async (server: EnmityServer | undefined, client: StreamChat) => {
            let filters: ChannelFilters = {
                type: 'messaging',
                members: { $in: [client.userID as string] },
            };
            if (!server) {
                filters.member_count = 2;
            }

            const channels = await client.queryChannels(filters);
            const channelsByCategories = new Map<
                string,
                Array<Channel<DefaultStreamChatGenerics>>
            >();
            if (server) {
                const categories = new Set(
                    channels
                        .filter((channel) => {
                            return channel.data?.data?.server === server.name;
                        })
                        .map((channel) => {
                            return channel.data?.data?.category;
                        })
                );

                for (const category of Array.from(categories)) {
                    channelsByCategories.set(
                        category,
                        channels.filter((channel) => {
                            return (
                                channel.data?.data?.server === server.name &&
                                channel.data?.data?.category === category
                            );
                        })
                    );
                }
            } else {
                channelsByCategories.set('Direct Messages', channels);
            }
            setMyState((myState) => {
                return { ...myState, server, channelsByCategories };
            });
        },
        [setMyState]
    );

    const createServer = useCallback(
        async (
            client: StreamChat,
            name: string,
            imageUrl: string,
            userIds: string[]
        ) => {
            const serverId = uuid();
            const messagingChannel = client.channel('messaging', uuid(), {
                name: 'Welcome',
                members: userIds,
                data: {
                    image: imageUrl,
                    serverId: serverId,
                    server: name,
                    category: 'Text Channels',
                },
            });

            try {
                const response = await messagingChannel.create();
                console.log('[EnmityContext - createServer] Response: ', response);
            } catch (err) {
                console.error(err);
            }

        },
        []
    );

    const createChannel = useCallback(
        async (
            client: StreamChat,
            name: string,
            category: string,
            userIds: string[]
        ) => {
            if (client.userID) {
                const channel = client.channel('messaging', {
                    name: name,
                    members: userIds,
                    data: {
                        image: myState.server?.image,
                        serverId: myState.server?.id,
                        server: myState.server?.name,
                        category: category,
                    },
                });
                try {
                    const response = await channel.create();
                } catch (err) {
                    console.log(err);
                }
            }
        },
        [myState.server]
    );

    const store: EnmityState = {
        server: myState.server,
        channelsByCategories: myState.channelsByCategories,
        changeServer: changeServer,
        createServer: createServer,
        createChannel: createChannel,
    };

    return (
        <EnmityContext.Provider value={store}>{children}</EnmityContext.Provider>
    );
};

export const useEnmityContext = () => useContext(EnmityContext);