'use strict';

var React = require('react-native');
var ProductList = require('./app/lists');

var {
  AppRegistry,
  StyleSheet,
  NavigatorIOS,
  TabBarIOS,
  View,
  Text,
  ActivityIndicatorIOS
} = React;

var TabBarItemIOS = TabBarIOS.Item;

var styles = React.StyleSheet.create({
  container: {
        backgroundColor: '#efefef',
        flex:1,
    },
    description: {
        marginBottom: 20,
        fontSize: 18,
        textAlign: 'center',
        color: '#656565'
      },
});

function _icon(imageUri) {
    return {
        uri: imageUri,
        isStatic: true
    };
}

class zhiribao extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedTab : 'list',
      isLoading: true,
      message: '启动中。。。',
      data : {}
    };
  }

  render() {
    return (
      <TabBarIOS selectedTab={this.state.selectedTab}>
        <TabBarItemIOS accessibilityLabel={"Latest"}
              selected={this.state.selectedTab === 'list'}
              title="列表"
              name="listTab"
              icon={_icon('recents')}
              onPress={() => {
                  this.setState({
                    selectedTab: 'list'
                  });
              }}>
              <NavigatorIOS style={styles.container}
                  tintColor={'#333344'}
                  initialRoute={{
                    title: '值日报',
                    component: ProductList
                  }}
                  itemWrapperStyle={styles.navigator} />
        </TabBarItemIOS>
        <TabBarItemIOS accessibilityLabel={"Nodes"}
              selected={this.state.selectedTab === 'nodeMap'}
              title="NodeMap"
              name="nodeMap"
              icon={_icon('bookmarks')}
              onPress={() => {
                  this.setState({
                    selectedTab: 'nodeMap'
                  });
              }}>
        </TabBarItemIOS>
      </TabBarIOS>
    );
    var spinner = this.state.isLoading ?
      ( <ActivityIndicatorIOS
          hidden='true'
          size='large'/> ) :
      ( <View/>);
    if (this.state.data.length > 0) {
        return (
          <React.NavigatorIOS
            style={styles.container}
            initialRoute={{
              title: '值日报',
              component: ProductList,
              passProps: {listings: this.state.data}
            }}/>
        );
    } else {
        return (
            <View style={styles.container}>
                <Text style={styles.description}>{this.state.message}</Text>
                {spinner}
            </View>
        );
    }
  }
}


React.AppRegistry.registerComponent('值日报',
  function() { return zhiribao });
