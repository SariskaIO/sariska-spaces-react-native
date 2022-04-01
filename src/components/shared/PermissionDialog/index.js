import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Button} from 'react-native-elements';
import {SIZES} from '../../../assets/styles/font';
import {colors} from '../../../assets/styles/_colors';
import { DialogBox } from '../DialogBox';

export const PermissionDialog = ({
  displayName,
  allowLobbyAccess,
  denyLobbyAccess,
}) => {
  return (
    <DialogBox>
      <View>
        <Text style={styles.heading}>{displayName} wants to join </Text>
        <View style={styles.controls}>
          <Button
            onPress={denyLobbyAccess}
            title="Deny"
            type="clear"
            titleStyle={{textTransform: 'uppercase'}}
          />
          <Button
            onPress={allowLobbyAccess}
            title="Allow"
            type="clear"
            titleStyle={{textTransform: 'uppercase'}}
          />
        </View>
      </View>
    </DialogBox>
  );
};
const styles = StyleSheet.create({
  heading: {
    color: colors.secondaryText,
    fontSize: SIZES.h4,
  },
  controls: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'flex-end',
  },
});
