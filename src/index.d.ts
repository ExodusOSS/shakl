import type { ComponentType } from "react";
import type {
  ViewStyle,
  ViewProps,
  TextStyle,
  TextProps,
  TouchableOpacityProps,
  ImageStyle,
  ImageProps,
} from "react-native";

type AnyStyle = ViewStyle | TextStyle | ImageStyle;
type AnyProps = ViewProps | TextProps | TouchableOpacityProps | ImageProps;

type ViewStyleFunction = (props: ViewProps) => ViewStyle;
type TextStyleFunction = (props: TextProps) => TextStyle;
type ImageStyleFunction = (props: ImageProps) => ImageStyle;
type TouchableStyleFunction = (props: TouchableOpacityProps) => ViewStyle;
type AnyStyleFunction = (props: AnyProps | any) => AnyStyle;
type StyledComponentType = (
  style: AnyStyle | AnyStyleFunction
) => ComponentType<any>;

declare module "./" {
  function View(style: ViewStyle | ViewStyleFunction): ComponentType<any>;
  function Text(style: TextStyle | TextStyleFunction): ComponentType<any>;
  function Image(style: ImageStyle | ImageStyleFunction): ComponentType<any>;
  function Touchable(
    style: ViewStyle | TouchableStyleFunction
  ): ComponentType<any>;

  function styled(Component: any, config?: any): StyledComponentType;
  styled.View = View;
  styled.Text = Text;
  styled.Image = Image;
  styled.Touchable = Touchable;

  export default styled;
}
