'use strict';

var React = require('react-native');
var HTMLView = require('react-native-htmlview')
var Api = require('./api');
var Helper = require('./helper');
var Webview = require('./webview');
var {
  StyleSheet,
  Image, 
  View,
  TouchableOpacity,
  Text,
  Component,
  PixelRatio,
  ScrollView,
  Navigator,
  TouchableHighlight
} = React;

var styles = StyleSheet.create({
  a: {
    fontWeight: '300',
    color: '#FF3366', // pink links
  },
  contentContainer: {
    padding: 10,
  },
  container: {
    flex: 1,
  },
  heading: {
    backgroundColor: '#F8F8F8',
  },
  separator: {
    height: 1,
    backgroundColor: '#DDDDDD'
  },
  imageBox: {
    alignItems: 'center',
    justifyContent: 'center',
    flex:1
  },
  image: {
    width: 400,
    height: 300,
  },
  title: {
    fontSize: 20,
    margin: 5,
    fontWeight: 'bold',
    color: '#656565'
  },
  description: {
    fontSize: 14,
    margin: 5,
    color: '#656565'
  },
  buttonGroup: {
    flex: 1,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyBox: {
    alignItems: 'center',
    width: Helper.width/1.3,
    height: 40,
    backgroundColor: '#0379d5',
    borderRadius: 5,
  },
  buyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#fff',
  },
});

class NavButton extends React.Component {
  render() {
    return (
      <TouchableHighlight
        style={styles.button}
        underlayColor="#B5B5B5"
        onPress={this.props.onPress}>
        <Text style={styles.buttonText}>{this.props.text}</Text>
      </TouchableHighlight>
    );
  }
}

var NavigationBarRouteMapper = {

  LeftButton: function(route, navigator, index, navState) {
    if (index === 0) {
      return null;
    }

    var previousRoute = navState.routeStack[index - 1];
    return (
      <TouchableOpacity
        onPress={() => navigator.pop()}>
        <View style={styles.navBarLeftButton}>
          <Text style={[styles.navBarText, styles.navBarButtonText]}>
            {previousRoute.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  },

  RightButton: function(route, navigator, index, navState) {
    return (
      <TouchableOpacity
        onPress={() => navigator.push(newRandomRoute())}>
        <View style={styles.navBarRightButton}>
          <Text style={[styles.navBarText, styles.navBarButtonText]}>
            Next
          </Text>
        </View>
      </TouchableOpacity>
    );
  },

  Title: function(route, navigator, index, navState) {
    return (
      <Text style={[styles.navBarText, styles.navBarTitleText]}>
        {route.title} [{index}]
      </Text>
    );
  },

};

class ProductDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      buyUrl : false,
    };
  }
  goBuy(url) {
    // this.setState({ buyUrl: url });
    var ZrbWebview = <Navigator
        debugOverlay={false}
        style={styles.appContainer}
        initialRoute={{title: 'TEST'}}
        navigationBarHidden={false}
        configureScene={(route) => {
          return Navigator.SceneConfigs.FloatFromBottom;
        }}
        renderScene={(route, navigator) => (
            this.renderContent()
        )}
        navigationBar={
          <Navigator.NavigationBar
            routeMapper={NavigationBarRouteMapper}
            style={styles.navBar}
          />
        }
      />;
    this.props.navigator.navigationBarHidden = true;
    this.props.navigator.push({
      title: '购买',
      message: 'Swipe down to dismiss',
      component: Webview,
      navigationBarHidden: true,
      passProps: {url: url}
    });
  }

  renderContent() {
    var data = this.props.data;
    return (
      <ScrollView contentContainerStyle={styles.contentContainer}>
      <View style={styles.container}>
        <Image style={styles.image}
            resizeMode={'contain'} 
            source={{uri: Api.getImage(data.image)}} />
        <View style={styles.heading}>
          <Text style={styles.title}>{data.title}</Text>
          <View style={styles.separator}/>
        </View>
        <View>
        <Text style={styles.description}>发布人： {data.source}</Text>
        <HTMLView
          stylesheet={styles}
          value={data.content}/>
        </View>
        <View style={styles.buttonGroup}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => this.goBuy(data.source_link)}>
            <View style={styles.buyBox}>
              <Text style={styles.buyText}>{'去购买>>'}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
    )
  }

  render() {
    var data = this.props.data;
    return (
      <ScrollView contentContainerStyle={styles.contentContainer}>
      <View style={styles.container}>
        <View style={styles.imageBox}>
        <Image style={styles.image}
            resizeMode={'contain'} 
            source={{uri: Api.getImage(data.image)}} />
            </View>
        <View style={styles.heading}>
          <Text style={styles.title}>{data.title}</Text>
          <View style={styles.separator}/>
        </View>
        <View>
        <Text style={styles.description}>发布人：{data.source}</Text>
        <HTMLView
          stylesheet={styles}
          value={data.content}/>
        </View>
        <View style={styles.buttonGroup}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => this.goBuy(data.source_link)}>
            <View style={styles.buyBox}>
              <Text style={styles.buyText}>{'去购买>>'}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
    );
  }
};

module.exports = ProductDetail;