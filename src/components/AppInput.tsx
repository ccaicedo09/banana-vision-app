import React, { forwardRef } from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";
import styles from "./AppInput.styles";
import { theme } from "../constants/theme";

type Props = TextInputProps & {
  label: string;
};

const AppInput = forwardRef<TextInput, Props>(({ label, ...props }, ref) => {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        ref={ref}
        placeholderTextColor={theme.colors.textSoft}
        style={styles.input}
        {...props}
      />
    </View>
  );
});

AppInput.displayName = "AppInput";

export default AppInput;