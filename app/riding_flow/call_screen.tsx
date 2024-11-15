
import {Call, StreamCall} from '@stream-io/video-react-native-sdk';
import {View, Text} from "react-native"

import { Button } from 'react-native-ui-lib';
import React, {useEffect} from 'react';
import {
  useStreamVideoClient,
  useCallStateHooks,
  CallingState,
  CallContent
} from '@stream-io/video-react-native-sdk';

export const CallScreen = ({goToHomeScreen, callId}) => {
  const [call, setCall] = React.useState<Call | null>(null);
  const client = useStreamVideoClient();

  useEffect(() => {
    const _call = client?.call('default', callId);
    _call?.join({ create: true })
      .then(() => setCall(_call));
  }, [client, callId]);

  useEffect(() => {
    return () => {
      // cleanup the call on unmount if the call was not left already
      if (call?.state.callingState !== CallingState.LEFT) {
        call?.leave();
      }
    };
  }, [call]);

  if (!call) {
    return (
      <View>
        <Text >Joining call...</Text>
      </View>
    );
  }

  return (
    <StreamCall call={call}>
      <View>
        <Text >Here we will add Video Calling UI</Text>
        <Button label="Go back" onPress={goToHomeScreen} />
        <ParticipantCountText />
      </View>
    </StreamCall>
  );
};

const ParticipantCountText = () => {
  const {useParticipantCount} = useCallStateHooks();
  const participantCount = useParticipantCount();
  return (
    <Text >Call has {participantCount} participants</Text>
  );
};