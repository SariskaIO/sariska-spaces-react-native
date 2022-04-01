import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {clearAllReducers} from '../../../store/actions/conference';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import {colors} from '../../../assets/styles/_colors';
import {SIZES} from '../../../assets/styles/font';

const DialogHeader = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const spaceTitle = useSelector(state => state.profile?.spaceTitle);

  const leaveConference = () => {
    navigation.navigate('Leave', {spaceId: spaceTitle});
    dispatch(clearAllReducers());
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>{spaceTitle}</Text>
      </View>
      <View>
        <Ionicon
          name="ios-close-circle-outline"
          onPress={leaveConference}
          color={colors.redIcon}
          style={styles.icon}
        />
      </View>
    </View>
  );
};

export default DialogHeader;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  title: {
    color: colors.secondaryText,
    fontSize: SIZES.h2,
    fontWeight: '700',
  },
  icon: {
    fontSize: SIZES.iconX3L,
  },
});
