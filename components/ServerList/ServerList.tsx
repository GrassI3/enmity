'use client';

import { EnmityServer } from '@/models/EnmityServer';
import { JSX, useCallback, useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import Image from 'next/image';
import Link from 'next/link';
import CreateServerForm from './CreateServerForm';
import { useChatContext } from 'stream-chat-react';
import { Channel } from 'stream-chat';
import { useEnmityContext } from '@/contexts/EnmityContext';

interface ChannelData {
  id?: string;
  server?: string;
  image?: string;
}

export default function ServerList(): JSX.Element {
  const { client } = useChatContext();
  const { server: activeServer, changeServer } = useEnmityContext();
  
  const [serverList, setServerList] = useState<EnmityServer[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadServerList = useCallback(async (): Promise<void> => {
    if (!client?.userID) {
      setError("User ID is not available.");
      return;
    }

    try {
      const channels = await client.queryChannels({
        type: 'messaging',
        members: { $in: [client.userID as string] },
      });

      const servers = channels.map((channel: Channel) => {
        const channelData = channel.data?.data as ChannelData || {}; // Cast to ChannelData

        return {
          id: channelData.id || channel.cid || uuid(),
          name: channelData.server || 'Unnamed',
          image: channelData.image || '',
          server: channelData.server,
        };
      }).filter(server => server.name && server.name !== 'Unnamed');

      const uniqueServers = Array.from(new Set(servers.map(server => server.name)))
        .map(name => servers.find(server => server.name === name));

      setServerList(uniqueServers.filter(Boolean) as EnmityServer[]);

      if (uniqueServers.length > 0 && !activeServer) {
        changeServer(uniqueServers[0], client);
      }
    } catch (error) {
      console.error("Error loading server list:", error);
      setError("Failed to load server list.");
    }
  }, [client, changeServer, activeServer]);

  useEffect(() => {
    loadServerList();
  }, [loadServerList]);

  return (
    <div className='bg-dark-gray h-full flex flex-col items-center'>
      {error && <div className="text-red-500">{error}</div>}
      
      <button
        className={`block p-3 aspect-square sidebar-icon border-t-2 border-t-gray-300 ${activeServer === undefined ? 'selected-icon' : ''}`}
        onClick={() => changeServer(undefined, client)}
      >
        <div className='rounded-icon enmity-icon'></div>
      </button>

      {serverList.map((server) => (
        <button
          key={server.id}
          className={`p-4 sidebar-icon ${server.id === activeServer?.id ? 'selected-icon' : ''}`}
          onClick={() => changeServer(server, client)}
        >
          {server.image && checkIfUrl(server.image) ? (
            <Image
              className='rounded-icon'
              src={server.image}
              width={50}
              height={50}
              alt='Server Icon'
            />
          ) : (
            <span className='rounded-icon bg-gray-600 w-[50px] flex items-center justify-center text-sm text-white'>
              {server.name.charAt(0)}
            </span>
          )}
        </button>
      ))}

      <Link
        href={'/?createServer=true'}
        className='flex items-center justify-center rounded-icon bg-white text-green-500 hover:bg-green-500 hover:text-white hover:rounded-xl transition-all duration-200 p-2 my-2 text-2xl font-light h-12 w-12'
      >
        <span className='inline-block'>+</span>
      </Link>
      
      <CreateServerForm />
    </div>
  );

  function checkIfUrl(path: string): boolean {
    try {
      new URL(path);
      return true;
    } catch {
      return false;
    }
  }
}
