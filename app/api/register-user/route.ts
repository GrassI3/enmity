import { clerkClient } from '@clerk/nextjs/server';

export async function POST(request: Request) {
  const apiKey = process.env.STREAM_API_KEY;
  if (!apiKey) {
    return new Response('Missing Stream API key', { status: 500 });
  }

  const body = await request.json();
  console.log('[/api/register-user] Body:', body);

  const userId = body?.userId;
  const mail = body?.email;

  if (!userId || !mail) {
    return new Response('Missing userId or email', { status: 400 });
  }

  const params = {
    publicMetadata: {
      streamRegistered: true,
    },
  };

  const updatedUser = await (await clerkClient()).users.updateUser(userId, params);

  console.log('[/api/register-user] User:', updatedUser);
  const response = {
    userId: userId,
    userName: mail,
  };

  return new Response(JSON.stringify(response), { status: 200 });
}
