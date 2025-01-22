import { JSX } from "react";
import { UserObject } from '@/models/UserObject';
import { useEnmityContext } from '@/contexts/EnmityContext';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useChatContext } from 'stream-chat-react';
import Link from 'next/link';
import { CloseIcon, Speaker } from '@/components/Icons';
//import UserRow from './UserRow';
//import { useStreamVideoClient } from '@stream-io/video-react-sdk';

type FormState = {
    channelType: 'text' | 'voice';
    channelName: string;
    category: string;
    users: UserObject[];
};

export default function CreateChannelForm(): JSX.Element {
    const params = useSearchParams();
    const showCreateChannelForm = params.get('createChannel');
    const category = params.get('category');

    const dialogRef = useRef<HTMLDialogElement>(null);
    const router = useRouter();

    const { client } = useChatContext();
    //const videoClient = useStreamVideoClient();
    //const { server, createChannel, createCall } = useEnmityContext();
    const initialState: FormState = {
        channelType: 'text',
        channelName: '',
        category: category ?? '',
        users: [],
    };
    const [formData, setFormData] = useState<FormState>(initialState);
    const [users, setUsers] = useState<UserObject[]>([]);

    const loadUsers = useCallback(async () => {
        const response = await client.queryUsers({});
        const users: UserObject[] = response.users
            .filter((user) => user.role !== 'admin')
            .map((user) => {
                return {
                    id: user.id,
                    name: user.name ?? user.id,
                    image: user.image as string,
                    online: user.online,
                    lastOnline: user.last_active,
                };
            });
        if (users) setUsers(users);
    }, [client]);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    useEffect(() => {
        const category = params.get('category');
        const isVoice = params.get('isVoice');
        setFormData({
            channelType: isVoice ? 'voice' : 'text',
            channelName: '',
            category: category ?? '',
            users: [],
        });
    }, [setFormData, params]);

    useEffect(() => {
        if (showCreateChannelForm && dialogRef.current) {
            dialogRef.current.showModal();
        } else {
            dialogRef.current?.close();
        }
    }, [showCreateChannelForm]);

    return (
        <dialog className='absolute z-10 space-y-2 rounded-xl' ref={dialogRef}>
            <div className='w-full flex items-center justify-between py-8 px-6'>
                <h2 className='text-3xl font-semibold text-gray-600'>Create Channel</h2>
                <Link href='/'>
                    <CloseIcon className='w-10 h-10 text-gray-400' />
                </Link>
            </div>
        </dialog>
    );
}
