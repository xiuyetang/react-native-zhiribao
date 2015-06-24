'use strict';
var React = require('react-native');
var RefreshableListView = require('react-native-refreshable-listview')

var TimerMixin = require('react-timer-mixin');
var Detail = require('./detail');
var Api = require('./api');
var Helper = require('./helper');
var {
  ActivityIndicatorIOS,
  StyleSheet,
  Image, 
  View,
  TouchableHighlight,
  ListView,
  Text,
  ScrollView,
  Component,
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
    flex:1
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
    color: '#666',
    height:60
  },
  subView: {
    flexDirection: 'row'
  },
  cell: {
    flex: 1,
  },
  subtitle: {
    fontSize: 14,
    color: '#656565',
    textAlign:'left',
  },
  mall: {
    color: '#5db95b',
    textAlign: 'right',
    marginRight:20
  },
  rowContainer: {
    flexDirection: 'row',
    padding: 10
  }
});

var indicatorStylesheet = StyleSheet.create({
  wrapper: {
    backgroundColor: 'red',
    height: 60,
    marginTop: 10,
  },
  content: {
    backgroundColor: 'blue',
    marginTop: 10,
    height: 60,
  },
})

var ds = new ListView.DataSource(
      {rowHasChanged: (r1, r2) => r1.id !== r2.id});

var listsForeign = React.createClass({
  mixins: [TimerMixin],
  resultData: [],
  cacheDataPid: [],

  getInitialState: function() {
    
    return {
      isLoading: true,
      isLoadingTail: false,
      message : 'loading...',
      dataSource: ds,
      queryPage: 1,
      offset: 10,
      cacheDataLength: 0,
      headerLoding: false
    };

    
  },
  componentDidMount: function() {
    var query = Api.getProductList({page: this.state.queryPage, offset: this.state.offset, foreign: this.props.foreign});
    this._executeQuery(query);
  },

  _handleResponse: function(response, pop) {
    
    this.setState({ isLoading: false });
    if (response.status === 'ok') {
      if (pop) {
        // 倒序排列
        response.data = response.data.reverse();
      }
      // var dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});
      for (var i in response.data) {
        // 去重复
        // resultData.push(response.data[i]);
        var exists = false;
        for (var j=0; j< this.cacheDataPid.length; j++) {
          if (response.data[i].id == this.cacheDataPid[j]) {
            exists = true;
            break;
          }
        } 

        if (exists) {
          continue;
        }
        if (pop) {
          this.resultData.unshift(response.data[i]);
        } else {
          this.resultData.push(response.data[i]);
        }
        // resultData.push(response.data[i]);
        this.cacheDataPid.push(response.data[i].id);
      }

      this.setState({
        dataSource : ds.cloneWithRows(this.resultData), //response.data,
        isLoading:false,
        isLoadingTail: false,
        cacheDataLength: response.data.length
      });
    } else {
      this.setState({ message: 'no result found'});
    }
  },
  _executeQuery: function(query, pop) {
    console.log(query);
    fetch(query)
      .then(response => response.json())
      .then(json => this._handleResponse(json, pop))
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
      passProps: {
        data: data,
        onExternalZrbRequested: (zrbView) => {
          this.props.onExternalZrbRequested(zrbView);
        } 
      }
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

    var query = Api.getProductList({page: page, offset: this.state.offset, foreign: this.props.foreign});
    this._executeQuery(query);
    return;
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
            <Image style={styles.thumb} defaultSource={{uri: 'nophoto'}} source={{ uri: Api.getImage(rowData.image) }} />
            <View  style={styles.textContainer}>
              <Text style={styles.title} numberOfLines={3}>{title}</Text>

              <View style={styles.subView}>
              <View style={styles.cell}>
              <Text style={styles.subtitle} 
                    numberOfLines={1}>由 {rowData.source} 发布
                    
                  </Text>
                  </View>
                  <View style={styles.cell}>
                  <Text style={styles.mall} numberOfLines={1}>{rowData.name}</Text></View>
              </View>
              
            </View>
          </View>
          <View style={styles.separator}/>
        </View>
      </TouchableHighlight>
    );
  },

  renderHeaderWrapper: function() {
    return this.state.headerLoding ? (
      <View>
      <Text>{'加载中'}</Text>
      <ActivityIndicatorIOS style={styles.scrollSpinner} />
      </View>
    ) : (<View/>)
  },
  reloadList: function() {
    var query = Api.getProductList({page: 1, offset: this.state.offset, foreign: this.props.foreign});
    this._executeQuery(query, true);
  },

  render: function() {
    if(this.state.isLoading){
      return this.renderLoading();
    }
    return (

        <RefreshableListView
          ref="listview"
          dataSource={this.state.dataSource}
          renderFooter={this.renderFooter}

          loadData={this.reloadList}
          refreshDescription="获取新数据"
          refreshingIndictatorComponent={
            <ActivityIndicatorIOS style={styles.scrollSpinner} />
            
          }
          /*renderHeaderWrapper={this.renderHeaderWrapper}*/

          renderRow={this.renderRow}
          onEndReachedThreshold={0}
          onEndReached={this.onEndReached}
          automaticallyAdjustContentInsets={true}
          keyboardShouldPersistTaps={false}
          showsVerticalScrollIndicator={true}/>
    );
  }
})

module.exports = listsForeign;