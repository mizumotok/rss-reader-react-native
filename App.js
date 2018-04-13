// @flow

import React, { Component } from 'react';
import {
  FlatList,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import xml2js from 'react-native-xml2js';

const FEED_URL = 'https://news.yahoo.co.jp/pickup/rss.xml';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingTop: 20,
  },
  row: {
    flex: 1,
    height: 50,
    padding: 10,
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
    marginLeft: 10,
  },
});

type Props = {};

type FeedItem = {
  link: Array<string>,
  title: Array<string>,
};

type State = {
  feedItems: Array<FeedItem>,
};

const renderItem = (params: { item: FeedItem }) => (
  <TouchableOpacity onPress={() => Linking.openURL(params.item.link[0])}>
    <View style={styles.row}>
      <Text>{params.item.title[0]}</Text>
    </View>
  </TouchableOpacity>
);

export default class App extends Component<Props, State> {
  state = {
    feedItems: [],
  }

  componentDidMount() {
    fetch(FEED_URL)
      .then(res => res.text())
      .then((xml) => {
        const parser = xml2js.Parser();
        parser.parseString(xml, (err, result) => {
          this.setState({ feedItems: result.rss.channel[0].item });
        });
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          data={this.state.feedItems}
          renderItem={renderItem}
          keyExtractor={item => item.link[0]}
        />
      </View>
    );
  }
}
