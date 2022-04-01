import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import DialogHeader from '../../shared/DialogHeader';
import ParticipantsList from '../../shared/ParticipantsList';
import SpaceFooterActions from '../SpaceFooterActions';

const ParticipantsGrid = ({dominantSpeakerId}) => {
  const [localHandRaise, setLocalHandRaise] = useState(false);
  return (
    <View style={styles.container}>
      <DialogHeader />
      <ParticipantsList
        dominantSpeakerId={dominantSpeakerId}
        localHandRaise={localHandRaise}
      />
      <SpaceFooterActions setLocalHandRaise={setLocalHandRaise} />
    </View>
  );
};

export default ParticipantsGrid;

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
