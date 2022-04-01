import React from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import {Lists} from '../Lists';

const ParticipantsRoleWiseList = ({type}) => {
  const participants = useSelector(state => state.participant);
  let participantsList = participants
    .filter(participant => participant._properties?.subRole == type)
    ?.map(participant => ({
      title: participant._identity?.user?.name?.slice(0, 1).toUpperCase(),
      secondary: '@' + participant._identity?.user?.name,
    }));

  return (
    <View>
      <Lists list={participantsList} />
    </View>
  );
};

export default ParticipantsRoleWiseList;
