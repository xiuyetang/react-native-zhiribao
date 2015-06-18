'use strict';

var React = require('react-native');
var ProductList = require('./app/lists');

//var SMXTabBarIOS = require('SMXTabBarIOS');
// var SMXTabBarItemIOS = SMXTabBarIOS.Item;

var {
  AppRegistry,
  StyleSheet,
  NavigatorIOS,
  TabBarIOS,
  ActivityIndicatorIOS
} = React;

var TabBarItemIOS = TabBarIOS.Item;

var styles = React.StyleSheet.create({
  container: {
    backgroundColor: '#efefef',
    flex:1,
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
                  barTintColor={'#0379d5'}
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
  }
}


React.AppRegistry.registerComponent('值日报',
  function() { return zhiribao });
