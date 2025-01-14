import { EnmityServer } from '@/models/EnmityServer';
import { JSX, useState } from 'react';
import { v4 as uuid } from 'uuid';
import Image from 'next/image';

export default function ServerList(): JSX.Element {
  const [activeServer, setActiveServer] = useState<EnmityServer| undefined>();
    const servers: EnmityServer[] = [
      {
        id: '1',
        name: 'Test Server 1',
        image: 'https://images.unsplash.com/photo-1735263759278-ed793ef6f1e7?q=80&w=1036&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      },
      {
        id: '2',
        name: 'Test Server 2',
        image: 'https://images.unsplash.com/photo-1735327854928-6111ac6105c8?q=80&w=928&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      },
      {
        id: '3',
        name: 'Test Server 3',
        image: 'https://images.unsplash.com/photo-1735192395661-9358e7d8cb75?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      },
    ];
  return <div className='bg-dark-gray h-full flex flex-col items-center'>
    {servers.map((server) => (
      <button 
      key={server.id}
      className={`p-4 sidebar-icon ${
        server.id === activeServer?.id ? 'selected-icon' : ''
      }`}
      onClick={() => setActiveServer(server)}
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
  </div>;
};

function checkIfUrl(path: string): Boolean {
  try {
    const _ = new URL(path);
    return true;
  } catch (_) {
    return false;
  }
}
