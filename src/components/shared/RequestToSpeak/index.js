import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Button} from 'react-native-elements';
import {SIZES} from '../../../assets/styles/font';
import {colors} from '../../../assets/styles/_colors';
import {DialogBox} from '../DialogBox';

export const RequestToSpeak = ({allow, deny, requestToSpeak}) => {
  return (
    <DialogBox>
      <Text style={styles.heading}>
        {requestToSpeak.participantName} wants to speak
      </Text>
      <View style={styles.controls}>
        <Button
          onPress={deny}
          title="Deny"
          type="clear"
          titleStyle={{textTransform: 'uppercase'}}
        />
        <Button
          onPress={allow}
          title="Allow"
          type="clear"
          titleStyle={{textTransform: 'uppercase'}}
        />
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
