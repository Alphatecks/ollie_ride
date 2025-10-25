import { TouchableOpacity } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { Platform } from 'react-native';

export function ExternalLink(
  props: Omit<React.ComponentProps<typeof TouchableOpacity>, 'onPress'> & { href: string }
) {
  return (
    <TouchableOpacity
      {...props}
      onPress={() => WebBrowser.openBrowserAsync(props.href)}
    />
  );
}
