import {
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  User,
} from '@stream-io/video-react-native-sdk';
import { useEffect, useState } from 'react';

const apiKey = 'kr9y2trtec48';
const userId = 'user111';
const token = 'authentication-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidXNlcjExMSJ9.xhYqRBeTjA2NUQuh7HOJXsWvNnksC8xOjwDC-qDUEjc';
const callId = 'caller111';
const user: User = { id: userId };

const client = new StreamVideoClient({ apiKey, user, token });
const call = client.call('default', callId);
call.join({ create: true });

export default function App() {
  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>{/* Your UI */}</StreamCall>
    </StreamVideo>
  );
}
