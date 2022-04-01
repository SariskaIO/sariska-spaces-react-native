import React from 'react';
import {Input} from 'react-native-elements';

const InputField = ({
  label,
  value,
  onChangeText,
  styles,
  selectionColor,
  inputStyle,
  labelStyle,
}) => {
  return (
    <Input
      label={label}
      value={value}
      onChangeText={onChangeText}
      style={styles}
      selectionColor={selectionColor}
      inputStyle={inputStyle}
      underlineColorAndroid="rgba(0,0,0,0)"
      labelStyle={labelStyle}
    />
  );
};

export default InputField;
