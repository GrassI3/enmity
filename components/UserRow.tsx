import { UserObject } from '../models/UserObject'; // Ensure this path is correct
import Image from 'next/image';
import { JSX } from 'react';

export default function UserRow({
    user,
    userChanged,
}: {
    user: UserObject;
    userChanged: (user: UserObject, checked: boolean) => void;
}): JSX.Element {
    return (
        <div className='flex items-center justify-start w-full space-x-4 my-2'>
            <input
                id={user.id}
                type='checkbox'
                name={user.id}
                className='w-4 h-4 mb-0'
                onChange={(event) => {
                    userChanged(user, event.target.checked);
                }}
            />
            <label className='w-full flex items-center space-x-6' htmlFor={user.id}>
                {user.image && (
                    <Image 
                        src={user.image}
                        width={40}
                        height={40}
                        alt={user.name}
                        className='w-8 h-8 rounded-full'
                    />
                )}
                {!user.image && (
                    <span className='w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600'>
                        {user.name.charAt(0)} {/* Fallback for users without images */}
                    </span>
                )}
                <p>
                    <span className='block text-gray-600'>
                        {user.name}
                    </span>
                    {user.lastOnline && (
                        <span className='text-sm text-gray-400'>
                            Last online: {user.lastOnline.split('T')[0]}
                        </span>
                    )}
                </p>
            </label>
        </div>
    );
}
