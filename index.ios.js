'use strict';

var React = require('react-native');
var Icon = require('FAKIconImage');
var TimerMixin = require('react-timer-mixin');
var ProductList = require('./app/lists');
var ProductListForeign = require('./app/listsForeign');

var Api = require('./app/api');

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
  StatusBarIOS,
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

var zhiribao = React.createClass( {
  mixins: [TimerMixin],

  getInitialState: function() {
    return {
      selectedTab : 'list',
      reachability: null,
      allNotice:0,
      foreignNotice:0,
      openZrbExternal: (null: ?React.Component),
    };
  },
  componentDidMount:function() {
    var LastPid = 0;
    var LastForeignPid = 0;
    var self = this;
    // AsyncStorage.removeItem(Api.LastPid);
    AsyncStorage.multiRemove([Api.LastPid, Api.LastForeignPid]);
    
    this.setInterval(() => {

      AsyncStorage.getItem(Api.LastPid).then((value) => {
        if (value !== null){
          LastPid = value;
        }
      });

      AsyncStorage.getItem(Api.LastForeignPid).then((value) => {
        if (value !== null){
          LastForeignPid = value;
        }
      });
      if (LastPid == 0 && LastForeignPid == 0) {
        return;
      }
      var query = Api.getUpdate({LastPid:LastPid, LastForeignPid: LastForeignPid});
      console.log(query)
      fetch(query)
        .then(response => response.json())
        .then((json) => {
          self.setState({
            allNotice:json.data.lastCount,
            foreignNotice:json.data.lastForeignCount
          });
        })
        .catch(error => {}).done();
    }, 10000);
    /*
    NetInfo.addEventListener(
      'change',
      this._handleReachabilityChange
    );
    NetInfo.fetch().done(
      (reachability) => { this.setState({reachability}); }
    );*/
  },

  componentWillUnmount: function() {
    return;
    NetInfo.removeEventListener(
      'change',
      this._handleReachabilityChange
    );
  },

  _handleReachabilityChange: function(reachability) {
    this.setState({
      reachability,
    });
  }, 

  render: function() { 
    StatusBarIOS.setStyle('light-content');
    // StatusBarIOS.setHidden(true, 'none');
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
              badge={this.state.allNotice > 0 ? this.state.allNotice : undefined}
              onPress={() => {
                  this.setState({
                    selectedTab: 'list'
                  });
              }}>
              <NavigatorIOS style={styles.container}
                  tintColor="#FFFFFF"
                  titleTextColor={'white'}

                  barTintColor={'#0379d5'}
                  /*navigationBarHidden={true}*/
                  initialRoute={{
                    title: '值日报',
                    component: ProductList,
                    passProps: {
                      onExternalZrbRequested: (zrbView) => {
                        this.setState({ openZrbExternal: zrbView, });
                      },
                      onHandleTabBarItemChange: () => {
                        this.setState({allNotice: 0});
                      }
                    }
                  }} />
        </TabBarItemIOS>

        <TabBarItemIOS accessibilityLabel={"Foreign"}
              selected={this.state.selectedTab === 'foreign'}
              title="海淘"
              name="foreignList"
              icon={require('image!foreign')}
              badge={this.state.foreignNotice > 0 ? this.state.foreignNotice : undefined}
              onPress={() => {
                  this.setState({
                    selectedTab: 'foreign'
                  });
              }}>
              <NavigatorIOS style={styles.container}
                  tintColor="#FFFFFF"
                  titleTextColor={'white'}

                  barTintColor={'#0379d5'}
                  /*navigationBarHidden={true}*/
                  initialRoute={{
                    title: '海淘-值日报',
                    component: ProductListForeign,
                    passProps: {
                      foreign:'us',
                      onExternalZrbRequested: (zrbView) => {
                        this.setState({ openZrbExternal: zrbView, });
                      },
                      onHandleTabBarItemChange: () => {
                        this.setState({foreignNotice: 0});
                      }
                    }
                  }} />
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
});

React.AppRegistry.registerComponent('值日报',
  function() { return zhiribao });
