'use strict';
var React = require('react-native');
var Detail = require('./detail');
var Api = require('./api');
var {
  StyleSheet,
  Image, 
  View,
  TouchableHighlight,
  ListView,
  Text,
  Component
} = React;

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#efefef',
    flex:1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    fontSize: 25,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    color: '#666E74',
    flex:1
  },
  loading: {
    backgroundColor:'#efefef',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  loadingInfo: {
    fontSize: 14,
    color: '#888888'
  },
  thumb: {
    width: 80,
    height: 80,
    marginRight: 10
  },
  textContainer: {
    flex: 1
  },
  separator: {
    height: 1,
    backgroundColor: '#dddddd'
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d37777'
  },
  subtitle: {
    fontSize: 14,
    color: '#656565'
  },
  mall: {
    alignItems: 'flex-end',
    backgroundColor:'pink',
    color: '#5db95b'
  },
  rowContainer: {
    flexDirection: 'row',
    padding: 10
  }
});

class SearchResults extends Component {

  constructor(props) {
    super(props);
    var dataSource = new ListView.DataSource(
      {rowHasChanged: (r1, r2) => r1.id !== r2.id});
    this.state = {
      isLoading: true,
      message : 'loading...',
      dataSource: dataSource
    };

    var query = Api.getProductList({page: 1});
    this._executeQuery(query);
  }

  _handleResponse(response) {
    
    this.setState({ isLoading: false });
    if (response.status === 'ok') {
      // var dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});

      this.setState({
        dataSource : this.state.dataSource.cloneWithRows(response.data), //response.data,
        isLoading:false
      });
    } else {
      this.setState({ message: 'no result found'});
    }
  }
  _executeQuery(query) {
    fetch(query)
      .then(response => response.json())
      .then(json => this._handleResponse(json))
      .catch(error => {
        this.setState({
          isLoading: false,
          message: 'Something bad happened ' + error
        });
      });
  }

  getImage(source) {
    //return 'http://www.zhiribao.com/upload/' + source + "!"+ 80 * 2 + "_"+ 80 * 2 +".jpg";
    return 'http://www.zhiribao.com/upload/' + source;
  }

  rowPressed(data) {

    this.props.navigator.push({
      title: data.title,
      component: Detail,
      passProps: {data: data}
    });
  }

  renderLoading(){
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>
          {'加载中...'}
        </Text>
      </View>
    );
  }

  renderRow(rowData, sectionID, rowID) {
    var title = rowData.title;
    return (
      <TouchableHighlight onPress={() => this.rowPressed(rowData)}
          underlayColor='#dddddd'>
        <View>
          <View style={styles.rowContainer}>
            <Image style={styles.thumb} source={{ uri: this.getImage(rowData.image) }} />
            <View  style={styles.textContainer}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subtitle} 
                    numberOfLines={1}>由 {rowData.source} 发布
                    <Text style={styles.mall} 
                    numberOfLines={1}>{rowData.name}</Text>
                  </Text>
              
            </View>
          </View>
          <View style={styles.separator}/>
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    if(this.state.isLoading){
      return this.renderLoading();
    }
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderRow.bind(this)}/>
    );
  }
}


module.exports = SearchResults;