import { EnmityServer } from '@/models/EnmityServer';
import { JSX } from 'react';
import { v4 as uuid } from 'uuid';
import Image from 'next/image';

export default function ServerList(): JSX.Element {
    const servers: EnmityServer[] = [
      {
        id: uuid(),
        name: 'Test Server 1',
        image: ''
      },
      {
        id: uuid(),
        name: 'Test Server 2',
        image: ''
      },
      {
        id: uuid(),
        name: 'Test Server 3',
        image: ''
      },
    ];
  return <div className="bg-green-400">
    {servers.map((server) => (
      <button 
      key={server.id} 
      onClick={() => console.log(server.name)}>
        {server.image && checkIfUrl(server.image) ? (
          <Image
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
