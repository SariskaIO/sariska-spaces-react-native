import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import {colors} from '../../../assets/styles/_colors';

export const ContextMenu = ({
  contextMenu,
  handleContextMenu,
  handleClose,
  list,
  participantId,
  children,
}) => {
  console.log('party', participantId, list, contextMenu);
  return (
    <View style={{width: '33%'}}>
      <Menu
        opened={contextMenu !== false}
        onBackdropPress={handleContextMenu}
        rendererProps={{anchorStyle: styles.anchorStyle}}>
        <MenuTrigger customStyles={triggerStyles}>{children}</MenuTrigger>
        <MenuOptions customStyles={optionsStyles}>
          {list?.length > 0 &&
            list.map((item, index) => (
              <MenuOption
                value={item.title}
                text={item.title}
                onSelect={() => handleClose(item.title, participantId)}
                key={index}
                customStyles={optionStyles}
              />
            ))}
        </MenuOptions>
      </Menu>
    </View>
  );
};
const triggerStyles = {
  triggerTouchable: {
    activeOpacity: 0,
  },
};

const optionsStyles = {
  optionsContainer: {
    width: 130,
    marginLeft: 10,
  },
  optionsWrapper: {
    backgroundColor: colors.gray1Background,
  },
  optionWrapper: {
    backgroundColor: colors.primaryBackground,
  },
  optionTouchable: {
    underlayColor: 'gold',
    activeOpacity: 70,
  },
  optionText: {
    color: colors.whiteText,
  },
};

const optionStyles = {
  optionTouchable: {
    underlayColor: 'red',
    activeOpacity: 40,
  },
  optionWrapper: {
    backgroundColor: colors.primaryBackground,
    marginTop: 1,
    marginLeft: 2,
    marginRight: 2,
    marginBottom: 1,
  },
  optionText: {
    color: colors.whiteText,
    fontWeight: '700',
  },
};

const styles = StyleSheet.create({
  anchorStyle: {
    backgroundColor: 'red',
    width: 100,
  },
});
