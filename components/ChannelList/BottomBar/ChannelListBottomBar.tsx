import Image from "next/image";
import { useClerk } from "@clerk/nextjs";
import { JSX, useState } from "react";
import { useChatContext } from "stream-chat-react";

export default function ChannelListBottomBar(): JSX.Element {
    const { client } = useChatContext();
    const [micActive, setMicActive] = useState(false);
    const [audioActive, setAudioActive] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const { signOut } = useClerk();

    return(
        <div className='mt-auto p-2 bg-light-gray w-full flex items-center space-x-3 relative'>
            <button
            className='flex flex-1 items-center space-x-2 p-1 pr-2 rounded-md hover:bg-hover-gray'
            onClick={() => setMenuOpen((currentValue) => !currentValue)}
            >
                {client.user?.image && (
                    <div
                    className={`relative ${client.user?.online ? 'online-icon' : ''}`}
                    >
                        <Image 
                        src={client.user?.image ?? 'https://thispersondoesnotexist.com/'}
                        alt='User image'
                        width={36}
                        height={36}
                        className='rounded-full'
                        />
                    </div>
                )}
                <p className='flex flex-col items-start space-y-1'></p>
            </button>
        </div>
    );
}