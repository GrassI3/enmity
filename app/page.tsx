'use client';

import { useCallback, useEffect, useState } from "react";
import { User } from "stream-chat";
import { LoadingIndicator } from "stream-chat-react";
import { useUser } from "@clerk/clerk-react";  // Changed to useUser
import MyChat from '@/components/MyChat';

type HomeState = {
  apiKey: string;
  user: User;
  token: string;
};

export default function Home() {
  const [homeState, setHomeState] = useState<HomeState | undefined>();
  const { user: clerkUser } = useUser();  // Using useUser instead of useClerk

  const registerUser = useCallback(async () => {
    const userId = clerkUser?.id;
    const mail = clerkUser?.primaryEmailAddress?.emailAddress;

    if (userId && mail) {
      try {
        const response = await fetch('/api/register-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, email: mail }),
        });

        if (!response.ok) {
          throw new Error('Failed to register user');
        }

        const responseBody = await response.json();
        return responseBody;
      } catch (error) {
        console.error('Error registering user:', error);
      }
    }
  }, [clerkUser]);

  const getUserToken = useCallback(async (userId: string, userName: string) => {
    try {
      const response = await fetch('/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch token');
      }

      const responseBody = await response.json();
      const token = responseBody.token;

      if (!token) {
        console.error('No token found');
        return;
      }

      const user: User = {
        id: userId,
        name: userName,
        image: `https://getstream.io/random_png/?id=${userId}&name=${userName}`,  // Fixed string interpolation
      };

      const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
      if (apiKey) {
        setHomeState({ apiKey, user, token });
      }
    } catch (error) {
      console.error('Error fetching token:', error);
    }
  }, []);

  useEffect(() => {
    if (clerkUser?.id && clerkUser?.primaryEmailAddress?.emailAddress) {
      if (!clerkUser.publicMetadata.streamRegistered) {
        registerUser().then(() => getUserToken(clerkUser.id, clerkUser.primaryEmailAddress?.emailAddress ?? ''));
      } else {
        getUserToken(clerkUser.id, clerkUser.primaryEmailAddress.emailAddress);
      }
    }
  }, [registerUser, clerkUser, getUserToken]);

  if (!homeState) {
    return <LoadingIndicator />;
  }

  return <MyChat {...homeState} />;
}
