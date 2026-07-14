import styled from './index'
import type {
  ImageProps,
  ImageStyle,
  TextInputProps,
  TextProps,
  TextStyle,
  TouchableOpacityProps,
  ViewProps,
  ViewStyle,
} from 'react-native'
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native'

export { ThemeContext, ThemeProvider, useTheme } from './index'
export type { ThemeProviderProps } from './index'

const extended = Object.assign(styled, {
  View: styled<ViewProps, ViewStyle>(View, { name: 'styled(View)' }),
  Text: styled<TextProps, TextStyle>(Text, { name: 'styled(Text)' }),
  Image: styled<ImageProps, ImageStyle>(Image, { name: 'styled(Image)' }),
  Touchable: styled<TouchableOpacityProps, ViewStyle>(TouchableOpacity, {
    name: 'styled(Touchable)',
  }),
  TextInput: styled<TextInputProps, TextStyle>(TextInput, { name: 'styled(TextInput)' }),
})

export default extended
