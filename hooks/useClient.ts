import { useEffect, useState } from "react";
import { StreamChat, TokenOrProvider, TokenProvider, User } from "stream-chat";

export type UseClientOptions = {
    apiKey: string;
    user: User;
    tokenOrProvider: TokenOrProvider;
};