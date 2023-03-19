import { Appbar } from "react-native-paper";

export default function MyAppbar(props) {
  return (
    <Appbar.Header style={{ backgroundColor: 'rgb(98, 0, 238)' }}>
      <Appbar.Action icon="menu" color="white" onPress={props.onPressMenu} />
      <Appbar.Content title="ChatGPT" color="white" />
      <Appbar.Action
        icon="dots-vertical"
        color="white"
        onPress={props.onPressDots} />
    </Appbar.Header>
  );
}