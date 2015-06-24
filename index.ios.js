'use strict';

var React = require('react-native');
var Icon = require('FAKIconImage');
var TimerMixin = require('react-timer-mixin');
var ProductList = require('./app/lists');

//var SMXTabBarIOS = require('SMXTabBarIOS');
// var SMXTabBarItemIOS = SMXTabBarIOS.Item;

var {
  AppRegistry,
  StyleSheet,
  NavigatorIOS,
  TabBarIOS,
  ActivityIndicatorIOS,
  AsyncStorage,
  Text,
  NetInfo
} = React;

var TabBarItemIOS = TabBarIOS.Item;

var styles = React.StyleSheet.create({
  container: {
    backgroundColor: '#efefef',
    flex:1,
  },
  centerText: {
    alignItems: 'center',
  },
});

function _icon(imageUri) {
  return {
    uri: imageUri,
    isStatic: true
  };
}

class zhiribao extends React.Component {
  mixins: [TimerMixin];

  constructor(props) {
    super(props);
    this.state = {
      selectedTab : 'list',
      reachability: null,
      openZrbExternal: (null: ?React.Component),
    };
  }
  componentDidMount() {
    return;
    NetInfo.addEventListener(
      'change',
      this._handleReachabilityChange
    );
    NetInfo.fetch().done(
      (reachability) => { this.setState({reachability}); }
    );
  }


  componentWillUnmount() {
    NetInfo.removeEventListener(
      'change',
      this._handleReachabilityChange
    );
  }

  _handleReachabilityChange(reachability) {
    this.setState({
      reachability,
    });
  }

  render() { 
    if (this.state.reachability == 'None' || this.state.reachability == 'Unknown') {
      return (
        <View style={styles.container}><Text>请检查网络设置</Text></View>
      );
    }
    if (this.state.openZrbExternal) {
      var ZrbView = this.state.openZrbExternal;
      return (
        <ZrbView/>
      );
    }
    return (
      <TabBarIOS selectedTab={this.state.selectedTab}>
        <TabBarItemIOS accessibilityLabel={"Latest"}
              selected={this.state.selectedTab === 'list'}
              title="全部"
              name="listTab"
              icon={require('image!home')}
              /*systemIcon="recents"*/
              badge={2 > 0 ? 2 : undefined}
              onPress={() => {
                  this.setState({
                    selectedTab: 'list'
                  });
              }}>
              <NavigatorIOS style={styles.container}
                  tintColor={'#333344'}
                  barTintColor={'#0379d5'}
                  /*navigationBarHidden={true}*/
                  initialRoute={{
                    title: '值日报',
                    component: ProductList,
                    passProps: {
                      onExternalZrbRequested: (zrbView) => {
                        this.setState({ openZrbExternal: zrbView, });
                      }
                    }
                  }} />
        </TabBarItemIOS>

        <TabBarItemIOS accessibilityLabel={"Foreign"}
              selected={this.state.selectedTab === 'foreign'}
              title="海淘"
              name="foreignList"
              icon={require('image!foreign')}
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
              icon={require('image!search')}
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
