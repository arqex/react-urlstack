import React from 'react'
import { View, Text, Button } from 'react-native'
import { Container, Header, Title, Content, Left, Icon} from 'native-base'

export default function WelcomeScreen( props ){
  return (
    <View>
      <Container>
        <Header>
          <Left>
            <Icon name="menu" />
          </Left>
          <Title>Welcome</Title>
        </Header>
        <Content>
          <Text>This is the first screen of the react-urlstack app. Swipe from the left to open the drawer.</Text>
        </Content>
      </Container>
      <Text>Welcome to the playground</Text>
      <Button onPress={ () => props.drawer.open() } title="Open drawer" />
    </View>
  )
}