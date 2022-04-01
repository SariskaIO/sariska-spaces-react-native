import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {Divider} from 'react-native-elements';
import {useSelector} from 'react-redux';
import {SIZES} from '../assets/styles/font';
import {colors} from '../assets/styles/_colors';
import BodyView from '../components/shared/BodyView';
import {Lists} from '../components/shared/Lists';
import ParticipantsRoleWiseList from '../components/shared/ParticipantsRoleWiseList';
import StyledView from '../components/shared/StyledView';
import TextComponent from '../components/shared/TextComponent';

const Summary = () => {
  const profile = useSelector(state => state.profile);
  const participants = useSelector(state => state.participant);
  const [openCohostList, setOpenCohostList] = useState(false);
  const [openSpeakerList, setOpenSpeakerList] = useState(false);
  const [openListenerList, setOpenListenerList] = useState(false);

  const handleClickParticipantList = (e, text) => {
    console.log('cliek', text);
    if (text === 'cohost') {
      setOpenCohostList(!openCohostList);
    }
    if (text === 'speaker') {
      setOpenSpeakerList(!openSpeakerList);
    }
    if (text === 'listener') {
      setOpenListenerList(!openListenerList);
    }
  };
  return (
    <ScrollView style={styles.scroll}>
      <BodyView>
        <StyledView>
          <View style={styles.body}>
            <View>
              <Text style={styles.title}>Host</Text>
              <Lists
                list={[
                  {
                    title: profile.name?.slice(0, 1).toUpperCase(),
                    primary: profile.name,
                    secondary: '@' + profile.name,
                  },
                ]}
              />
            </View>
            <Divider />
            <View style={styles.viewContainer}>
              <Text style={styles.title}>Co-hosts</Text>
              <View style={styles.subtitleContainer}>
                <TextComponent>
                  <Text
                    onPress={e => handleClickParticipantList(e, 'cohost')}
                    style={styles.subtitle}>
                    {participants.filter(
                      participant =>
                        participant._properties.subRole === 'cohost',
                    ).length > 0 ? (
                      <Text
                        style={{
                          textDecorationLine: 'underline',
                        }}>
                        {
                          participants.filter(
                            participant =>
                              participant._properties.subRole === 'cohost',
                          ).length
                        }
                      </Text>
                    ) : (
                      0
                    )}{' '}
                    Co-hosts
                  </Text>
                </TextComponent>
                <Text style={styles.dot}>.</Text>
                <TextComponent>
                  <Text style={styles.openSpots}>
                    {2 -
                      participants.filter(
                        participant =>
                          participant._properties.subRole === 'cohost',
                      ).length}{' '}
                    open spots
                  </Text>
                </TextComponent>
              </View>
              {openCohostList && (
                <ParticipantsRoleWiseList
                  handleClose={e => handleClickParticipantList(e, 'cohost')}
                  type="cohost"
                />
              )}
            </View>
            <Divider />
            <View style={styles.viewContainer}>
              <Text style={styles.title}>Speakers</Text>
              <View style={styles.subtitleContainer}>
                <TextComponent>
                  <Text
                    onPress={e => handleClickParticipantList(e, 'speaker')}
                    style={styles.subtitle}>
                    {participants.filter(
                      participant =>
                        participant._properties.subRole === 'speaker',
                    ).length > 0 ? (
                      <Text
                        style={{
                          cursor: 'pointer',
                          textDecorationLine: 'underline',
                        }}>
                        {
                          participants.filter(
                            participant =>
                              participant._properties.subRole === 'speaker',
                          ).length
                        }
                      </Text>
                    ) : (
                      0
                    )}{' '}
                    Speakers
                  </Text>
                </TextComponent>
                <Text style={styles.dot}>.</Text>
                <TextComponent>
                  <Text style={styles.openSpots}>
                    {10 -
                      participants.filter(
                        participant =>
                          participant._properties.subRole === 'speaker',
                      ).length}{' '}
                    open spots
                  </Text>
                </TextComponent>
              </View>
              {openSpeakerList && (
                <ParticipantsRoleWiseList
                  handleClose={e => handleClickParticipantList(e, 'speaker')}
                  type="speaker"
                />
              )}
            </View>
            <Divider />
            <View style={styles.viewContainer}>
              <Text style={styles.title}>Requests to Speak</Text>
              <View style={styles.subtitleContainer}>
                <TextComponent>
                  <Text style={styles.subtitle}>0 requests</Text>
                </TextComponent>
              </View>
            </View>
            <Divider />
            <View style={styles.viewContainer}>
              <Text style={styles.title}>Listeners</Text>
              <View style={styles.subtitleContainer}>
                <TextComponent>
                  <Text
                    onPress={e => handleClickParticipantList(e, 'listener')}
                    style={styles.subtitle}>
                    {participants.filter(
                      participant =>
                        participant._properties.subRole === 'listener',
                    ).length > 0 ? (
                      <Text
                        style={{
                          cursor: 'pointer',
                          textDecorationLine: 'underline',
                        }}>
                        {
                          participants.filter(
                            participant =>
                              participant._properties.subRole === 'listener',
                          ).length
                        }
                      </Text>
                    ) : (
                      0
                    )}{' '}
                    people are listening
                  </Text>
                </TextComponent>
              </View>
              {openListenerList && (
                <ParticipantsRoleWiseList
                  handleClose={e => handleClickParticipantList(e, 'listener')}
                  type="listener"
                />
              )}
            </View>
          </View>
        </StyledView>
      </BodyView>
    </ScrollView>
  );
};

export default Summary;

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: colors.whiteBackground,
  },
  body: {
    justifyContent: 'flex-start',
    width: '100%',
    height: '100%',
  },
  viewContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    fontWeight: '700',
    color: colors.secondaryText,
    fontSize: SIZES.h4,
  },
  subtitleContainer: {
    flexDirection: 'row',
  },
  subtitle: {
    color: colors.secondaryText,
    fontSize: SIZES.p2,
  },
  dot: {
    color: colors.secondaryDarkText,
    marginLeft: 16,
    marginRight: 16,
    fontSize: 34,
    marginTop: -17,
    position: 'relative',
  },
  openSpots: {
    fontSize: SIZES.p2,
    color: colors.secondaryText,
  },
});
