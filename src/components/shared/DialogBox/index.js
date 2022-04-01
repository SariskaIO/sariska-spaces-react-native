import React from 'react';
import {StyleSheet, View} from 'react-native';
import {colors} from '../../../assets/styles/_colors';

export const DialogBox = ({children}) => {
  return <View style={styles.permissionContainer}>{children}</View>;
};

const styles = StyleSheet.create({
  permissionContainer: {
    position: 'absolute',
    top: 20,
    width: 300,
    left: 20,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: colors.whiteBackground,
    borderWidth: 1,
    borderColor: colors.gray1Background,
    borderRadius: 15,
    margin: 'auto',
  },
});
