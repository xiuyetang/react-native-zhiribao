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
  Component
} = React;

var styles = StyleSheet.create({
  a: {
    fontWeight: '300',
    color: '#FF3366', // pink links
  },
  container: {
    marginTop: 65
  },
  heading: {
    backgroundColor: '#F8F8F8',
  },
  separator: {
    height: 1,
    backgroundColor: '#DDDDDD'
  },
  image: {
    width: 400,
    height: 300
  },
  title: {
    fontSize: 20,
    margin: 5,
    fontWeight: 'bold',
    color: '#656565'
  },
  description: {
    fontSize: 18,
    margin: 5,
    color: '#656565'
  },
  buttonGroup: {
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buyBox: {
    alignItems: 'center',
    width: Helper.width/1.3,
    height: 40,
    backgroundColor: '#0379d5',
    // borderRadius: 5,
  },
  buyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#fff',
  },
});

class ProductDetail extends Component {

  constructor(props) {
    super(props); 
  }
  goBuy(url) {
    this.props.navigator.navigationBarHidden = true;
    this.props.navigator.push({
      title: 'to buy',
      component: Webview,
      navigationBarHidden: true,
      passProps: {url: url}
    });
    <React.NavigatorIOS
      navigationBarHidden={true}
      initialRoute={{
        title: '值日报',
        component: Webview,
      }}/>
  }
  render() {
    var data = this.props.data;
    return (
      <View style={styles.container}>
        <Image style={styles.image}
            resizeMode={'contain'} 
            source={{uri: Api.getImage(data.image)}} />
        <View style={styles.heading}>
          <Text style={styles.title}>{data.title}</Text>
          <View style={styles.separator}/>
        </View>
        <View>
        <Text style={styles.description}>form {data.source}</Text>
        <HTMLView
          value={data.content}
          stylesheet={styles}/>
        </View>
        <View style={styles.buttonGroup}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => this.goBuy(data.source_link)}>
            <View style={styles.buyBox}>
              <Text style={styles.buyText}>{'去购买>>'}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
};

module.exports = ProductDetail;