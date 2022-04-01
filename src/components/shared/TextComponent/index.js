import React from 'react';
import {StyleSheet, Text} from 'react-native';

const TextComponent = ({children}) => {
  return <Text style={styles.text}>{children}</Text>;
};

export default TextComponent;

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
  },
});
