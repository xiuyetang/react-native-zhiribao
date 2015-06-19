'use strict';
var React = require('react-native');
var TimerMixin = require('react-timer-mixin');
var Detail = require('./detail');
var Api = require('./api');
var {
  ActivityIndicatorIOS,
  StyleSheet,
  Image, 
  View,
  TouchableHighlight,
  ListView,
  Text,
  ScrollView,
  Component
} = React;

var styles = StyleSheet.create({

  centerText: {
    alignItems: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#eeeeee',
  },
  spinner: {
    width: 30,
  },
  scrollSpinner: {
    marginVertical: 20,
  },
  rowSeparator: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: 1,
    marginLeft: 4,
  },
  rowSeparatorHide: {
    opacity: 0.0,
  },

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

var resultData = [];

var SearchResults = React.createClass({
  mixins: [TimerMixin],

  getInitialState: function() {
    var dataSource = new ListView.DataSource(
      {rowHasChanged: (r1, r2) => r1.id !== r2.id});
    return {
      isLoading: true,
      isLoadingTail: false,
      message : 'loading...',
      dataSource: dataSource,
      queryPage: 1,
      offset: 20,
      cacheDataLength: 0
    };

    
  },
  componentDidMount: function() {
    var query = Api.getProductList({page: this.state.queryPage, offset: this.state.offset});
    this._executeQuery(query);
  },

  _handleResponse: function(response) {
    
    this.setState({ isLoading: false });
    if (response.status === 'ok') {
      // var dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});
      for (var i in response.data) {
        resultData.push(response.data[i]);
      }
      this.setState({
        dataSource : this.state.dataSource.cloneWithRows(resultData), //response.data,
        isLoading:false,
        isLoadingTail: false,
        cacheDataLength: response.data.length
      });
    } else {
      this.setState({ message: 'no result found'});
    }
  },
  _executeQuery: function(query) {
    console.log('test');
    fetch(query)
      .then(response => response.json())
      .then(json => this._handleResponse(json))
      .catch(error => {
        this.setState({
          isLoading: false,
          isLoadingTail: false,
          message: 'Something bad happened ' + error
        });
      }).done();
  },

  rowPressed: function(data) {

    this.props.navigator.push({
      title: data.title,
      component: Detail,
      passProps: {data: data}
    });
  },
  hasMore: function() {
    return (
      this.state.offset >= this.state.cacheDataLength
    );
  },
  renderFooter: function() {
    if (!this.hasMore() || !this.state.isLoadingTail) {
      return <View style={styles.scrollSpinner} />;
    }
    return <ActivityIndicatorIOS style={styles.scrollSpinner} />;
  },
  onEndReached: function() {
    if (!this.hasMore() || this.state.isLoadingTail) {
      // We're already fetching or have all the elements so noop
      return;
    }
    var page = this.state.queryPage + 1;
    this.setState({
      isLoadingTail: true,
      queryPage: page
    });
    console.log(page);
    var query = Api.getProductList({page: page, offset: this.state.offset});
    console.log(query);
    this._executeQuery(query);
    return;

    

    var page = resultsCache.nextPageNumberForQuery[query];
    this._executeQuery(query);
    fetch(this._urlForQueryAndPage(query, page))
      .then((response) => response.json())
      .catch((error) => {
        console.error(error);
        LOADING[query] = false;
        this.setState({
          isLoadingTail: false,
        });
      })
      .then((responseData) => {
        var moviesForQuery = resultsCache.dataForQuery[query].slice();

        LOADING[query] = false;
        // We reached the end of the list before the expected number of results
        if (!responseData.movies) {
          resultsCache.totalForQuery[query] = moviesForQuery.length;
        } else {
          for (var i in responseData.movies) {
            moviesForQuery.push(responseData.movies[i]);
          }
          resultsCache.dataForQuery[query] = moviesForQuery;
          resultsCache.nextPageNumberForQuery[query] += 1;
        }

        if (this.state.filter !== query) {
          // do not update state if the query is stale
          return;
        }

        this.setState({
          isLoadingTail: false,
          dataSource: this.getDataSource(resultsCache.dataForQuery[query]),
        });
      })
      .done();
  },

  renderLoading: function(){
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>
          {'加载中...'}
        </Text>
      </View>
    );
  },

  renderRow: function(rowData, sectionID, rowID) {
    var title = rowData.title;
    return (
      <TouchableHighlight onPress={() => this.rowPressed(rowData)}
          underlayColor='#dddddd'>
        <View>
          <View style={styles.rowContainer}>
            <Image style={styles.thumb} source={{ uri: Api.getImage(rowData.image) }} />
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
  },

  render: function() {
    if(this.state.isLoading){
      return this.renderLoading();
    }
    return (

        <ListView
          ref="listview"
          dataSource={this.state.dataSource}
          renderFooter={this.renderFooter}
          renderRow={this.renderRow}
          onEndReached={this.onEndReached}
          automaticallyAdjustContentInsets={true}
          keyboardShouldPersistTaps={false}
          showsVerticalScrollIndicator={true}/>
    );
  }
})

class SearchResultsC extends Component {

  constructor(props) {
    super(props);
    var dataSource = new ListView.DataSource(
      {rowHasChanged: (r1, r2) => r1.id !== r2.id});
    this.state = {
      isLoading: true,
      isLoadingTail: false,
      message : 'loading...',
      dataSource: dataSource,
      queryNumber: 1
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

  rowPressed(data) {

    this.props.navigator.push({
      title: data.title,
      component: Detail,
      passProps: {data: data}
    });
  }
  hasMore() {
    var query = this.state.filter;
    if (!resultsCache.dataForQuery[query]) {
      return true;
    }
    return (
      resultsCache.totalForQuery[query] !==
      resultsCache.dataForQuery[query].length
    );
  }
  renderFooter() {
    if (!this.hasMore() || !this.state.isLoadingTail) {
      return <View style={styles.scrollSpinner} />;
    }
    return <ActivityIndicatorIOS style={styles.scrollSpinner} />;
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
            <Image style={styles.thumb} source={{ uri: Api.getImage(rowData.image) }} />
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
        ref="listview"
        dataSource={this.state.dataSource}
        renderRow={this.renderRow.bind(this)}/>
    );
  }
}


module.exports = SearchResults;