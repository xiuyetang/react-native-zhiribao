'use strict';

var React = require('react-native');
var Icon = require('FAKIconImage');
var ProductList = require('./app/lists');

//var SMXTabBarIOS = require('SMXTabBarIOS');
// var SMXTabBarItemIOS = SMXTabBarIOS.Item;

var {
  AppRegistry,
  StyleSheet,
  NavigatorIOS,
  TabBarIOS,
  ActivityIndicatorIOS,
  Text
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
                  }} />
        </TabBarItemIOS>

        <TabBarItemIOS accessibilityLabel={"Foreign"}
              selected={this.state.selectedTab === 'foreign'}
              title="国外"
              name="foreignList"
              icon={_icon('top-rated')}
              onPress={() => {
                  this.setState({
                    selectedTab: 'foreign'
                  });
              }}>
              <Text>fuck u</Text>
        </TabBarItemIOS>

        <TabBarItemIOS accessibilityLabel={"Search"}
              selected={this.state.selectedTab === 'search'}
              title="搜索"
              name="search"
              icon={_icon('search')}
              onPress={() => {
                  this.setState({
                    selectedTab: 'search'
                  });
              }}>
              <Text>fuck me</Text>
        </TabBarItemIOS>
      </TabBarIOS>
    );
    return (
      <NavigatorIOS style={styles.container}
                  tintColor={'#333344'}
                  barTintColor={'#0379d5'}
                  initialRoute={{
                    title: '值日报',
                    component: ProductList
                  }} />
    );
  }
}


React.AppRegistry.registerComponent('值日报',
  function() { return zhiribao });
