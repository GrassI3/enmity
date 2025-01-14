import { useEffect, useRef, useState } from 'react';
import { JSX } from 'react';
import Link from 'next/link';
import CloseIcon from '../Icons';
import { useSearchParams } from 'next/navigation';
import { UserObject } from '@/models/UserObject';

type FormState = {
    serverName: string;
    serverImage: string;
    users: UserObject[];
};

export default function CreateServerForm(): JSX.Element {
    const params = useSearchParams();
    const showCreateServerForm = params.get('createServer');
    const dialogRef = useRef<HTMLDialogElement>(null);

    const initialState: FormState = {
        serverName: '',
        serverImage: '',
        users: [],
    };
    const [formData, setFormData] = useState<FormState>(initialState);

    useEffect(() => {
        if (showCreateServerForm && dialogRef.current) {
            dialogRef.current.showModal();
        } else {
            dialogRef.current?.close();
        }
    }, [showCreateServerForm]);

    return (
        <dialog className='absolute z-10 space-y-2 rounded-xl' ref={dialogRef}>
            <div className='w-full flex items-center justify-between py-8 px-6'>
                <h2 className='text-3xl font-semibold text-gray-600'>
                    Create new server
                </h2>
                <Link href='/'>
                <CloseIcon />
                </Link>
            </div>
            <form method='dialog' className='flex flex-col space-y-2 px-6'>
                <label className='labelTitle' htmlFor='serverName'>
                    Server Name
                </label>
                <div className='flex items-center bg-gray-100'>
                    <span className='text-2xl p-2 text-gray-500'>#</span>
                    <input 
                    type='text'
                    id='serverName'
                    name='serverName'
                    value={formData.serverName}
                    onChange={(e) =>
                        setFormData({ ...formData, serverName: e.target.value })
                    }
                    required
                    />
                </div>
            </form>
        </dialog>
    );
}