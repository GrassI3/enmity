import { useCallback, useState } from "react";
import { User } from "stream-chat";
import { LoadingIndicator } from "stream-chat-react";
import { useUser } from "@clerk/clerk-react";  // Changed to useUser

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
      const response = await fetch('api/register-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, email: mail }),
      });
      
      const responseBody = await response.json();
      return responseBody;
    }
  }, [clerkUser]);

  if (!homeState) {
    return <LoadingIndicator />;
  }

  return <div>Welcome to Enmity</div>;
}