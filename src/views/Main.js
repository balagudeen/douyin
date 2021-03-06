import React, {Component} from 'react';
import {
  Animated,
  Text,
  View,
  StyleSheet,
  StatusBar,
  Image,
} from "react-native";


import {
  ParallaxSwiper,
  ParallaxSwiperPage
} from "../util/react-native-parallax-swiper";
import SplashScreen from 'react-native-splash-screen'
import ExtraDimensions from 'react-native-extra-dimensions-android';
import {getPx, deviceWidth, borderWidth, deviceHeight} from "../util/Screen";
import Video from 'react-native-video';
import { Iconfont } from "../static/font/iconfont";
import { NavigationEvents } from 'react-navigation';


export default class App extends Component<Props> {

  constructor(props) {
    super(props);
    this.myCustomAnimatedValue = new Animated.Value(0);

    this.config = {
      feedUrl: 'https://gitee.com/millent/json/raw/master/douyin/like.json'
    }

    this.localConfig = {
      nowIndex: 0
    }

    this.state = {
      feedList: [], // 请求获取到的播放列表
      swiperIndex: 0,
      playerList: [] // 播放器存储列表
    }
  }


  getTokTikFeed(){
    return new Promise((resolve)=>{
      fetch(this.config.feedUrl, {
        method: 'GET',
      }).then((response) => response.json())
        .then((responseJson) => {
          resolve({
            code: 200,
            body: responseJson
          })
        })
        .catch((error) => {
          resolve({
            code: 500,
            body: null,
            err: error
          })
        });
    })
  }

  async initMainPage(){
    let data = await this.getTokTikFeed()

    if(data.code === 200) {

      let aweme_list = data.body.aweme_list

      let arr = []

      // 由于返回数据都是固定的，这里随机一下视频顺序
      aweme_list.sort(function() {
        return .5 - Math.random();
      });

      aweme_list.forEach((val, index)=>{

        val.index = index
        arr.push({
          videoObject: null,
          canPlay: false
        })

      })



      this.setState({
        playerList: arr,
        feedList: aweme_list
      })

    }
  }

  componentDidMount(){
    SplashScreen.hide(); // 隐藏开机图
    this.initMainPage()
  }

  scrollChange(index){

    if(index !== this.localConfig.nowIndex) {

      this.localConfig.nowIndex = index

      this.state.playerList.forEach(val=>{
        val.canPlay = false
        val.fadeAnim = new Animated.Value(1)
      })
      this.setState({
        playerList: [...this.state.playerList],
        swiperIndex: index
      })
    }

  }


  render() {
    return (

      <View style={[MainPage.wrap]}>
        <StatusBar translucent backgroundColor="rgba(255, 255, 255, 0)" />

        <NavigationEvents
          onWillFocus={payload => console.log('will focus',payload)}
          onDidFocus={payload => console.log('did focus',payload)}
          onWillBlur={payload => console.log('will blur',payload)}
          onDidBlur={payload => console.log('did blur',payload)}
        />

        <View style={MainPage.header}>
          <View style={MainPage.headerLeft}>
            <Iconfont name="icon-camera_icon" size={getPx(40)} color="#C0C0C0"></Iconfont>
            <Text style={[MainPage.headerLeftText, MainPage.f1]}>随拍</Text>
          </View>
          <View style={MainPage.headerCenter}>
            <Text style={[MainPage.f2]}>推荐</Text>
            <Text style={MainPage.f3}>|</Text>
            <Text style={[MainPage.f1]}>郑州</Text>
          </View>
          <View style={MainPage.headerLeft}>
            <View style={MainPage.searchWrap}>
              <Iconfont name="icon-sousuo-copy" size={getPx(40)} color="#C0C0C0"></Iconfont>
              <View style={MainPage.searchTip}></View>
            </View>
          </View>
        </View>


        <ParallaxSwiper
          speed={0.5}
          animatedValue={this.myCustomAnimatedValue}
          dividerWidth={8}
          dividerColor="black"
          backgroundColor="#000"
          onMomentumScrollEnd={activePageIndex => {
            this.scrollChange(activePageIndex)
          }}
          vertical={true}
        >

          {
            this.state.feedList.map((item, index)=>{
              return (
                <ParallaxSwiperPage
                  key={index}
                  BackgroundComponent={
                    <View style={[
                      MainPage.backgroundBox,
                      {
                        backgroundColor: '#000'
                      }
                    ]}>
                    </View>
                  }
                  ForegroundComponent={
                    <View style={DouYinStyle.wrap}>
                      <View style={DouYinStyle.descriptionBox}>
                        <Text style={DouYinStyle.userName}>
                          @jon-millent
                        </Text>

                        <Text style={DouYinStyle.desText}>
                          {item.share_info.share_desc}
                        </Text>

                        <View style={DouYinStyle.musicForm}>

                          <Image
                            source={require('../static/icon/lmu.png')}
                            style={{
                              width: getPx(21),
                              height: getPx(24)
                            }}
                          />

                          <View style={DouYinStyle.musicGo}>
                            <Text style={DouYinStyle.musicGoText}>jon-millent的原声音</Text>
                          </View>
                        </View>
                      </View>
                      <View style={DouYinStyle.rightMenu}>
                        <View style={DouYinStyle.userFaceBox}>
                          <View style={DouYinStyle.userFaceBoxBtn}>
                            <Iconfont name="icon-jia" size={getPx(40)} color="#fff" style={DouYinStyle.userFaceBoxIcon}></Iconfont>
                          </View>
                        </View>

                        <View style={DouYinStyle.publicIconBox}>
                          <View style={DouYinStyle.publicIconBoxIcon}>
                            <Iconfont name="icon-bqxin" size={getPx(68)} color="#fff" style={DouYinStyle.publicIconBoxIconTarget}></Iconfont>
                          </View>
                          <View style={DouYinStyle.publicIconBoxText}>
                            <Text style={DouYinStyle.publicIconBoxTextTarget}>{item.statistics.digg_count}</Text>
                          </View>
                        </View>


                        <View style={DouYinStyle.publicIconBox}>
                          <View style={DouYinStyle.publicIconBoxIcon}>
                            <Iconfont name="icon-pinglun" size={getPx(68)} color="#fff" style={DouYinStyle.publicIconBoxIconTarget}></Iconfont>
                          </View>
                          <View style={DouYinStyle.publicIconBoxText}>
                            <Text style={DouYinStyle.publicIconBoxTextTarget}>9.6w</Text>
                          </View>
                        </View>

                        <View style={DouYinStyle.publicIconBox}>
                          <View style={DouYinStyle.publicIconBoxIcon}>
                            <Iconfont name="icon-tiaoguofenxiang" size={getPx(68)} color="#fff" style={DouYinStyle.publicIconBoxIconTarget}></Iconfont>
                          </View>
                          <View style={DouYinStyle.publicIconBoxText}>
                            <Text style={DouYinStyle.publicIconBoxTextTarget}>分享</Text>
                          </View>
                        </View>


                        <View style={DouYinStyle.player}>
                          <View style={DouYinStyle.playerCover}></View>
                        </View>
                      </View>

                      <View style={DouYinStyle.videoBox}>
                        {
                          this.state.swiperIndex === index ? (
                            <Video source={{uri: item.video.play_addr.url_list[0]}}   // Can be a URL or a local file.
                               ref={(ref) => {
                                 // set ref object

                                 if(!this.state.playerList[index].videoObject) {
                                   this.state.playerList[index].videoObject = ref
                                   this.setState({
                                     playerList: [...this.state.playerList]
                                   })
                                 }

                               }}                                      // Store reference
                               repeat={true}
                               resizeMode={'cover'}
                               pause={true}
                               onLoad={() => {
                                 // ready to play
                                 this.state.playerList[index].canPlay = true
                                 this.setState({
                                   playerList: [...this.state.playerList]
                                 })
                               }}
                               style={DouYinStyle.videoBoxTarget}/>
                          ) : (
                            <View></View>
                          )

                        }
                        {
                          this.state.playerList[index].canPlay ? (
                            <View>
                            </View>
                          ) : (
                            <Image
                              source={{uri: item.video.cover.url_list[0]}}
                              style={DouYinStyle.videoBoxCover}
                            />
                          )
                        }
                      </View>

                    </View>
                  }
                />
              )
            })
          }

        </ParallaxSwiper>


      </View>

    );
  }
}


const Values = {
  STATUS_BAR_HEIGHT: ExtraDimensions.get('STATUS_BAR_HEIGHT'),
  REAL_WINDOW_HEIGHT: ExtraDimensions.get('REAL_WINDOW_HEIGHT'),
  SOFT_MENU_BAR_HEIGHT: ExtraDimensions.get('SOFT_MENU_BAR_HEIGHT'),
}

console.log(Values)

const $Tool = {
  // 获取理想底部的高度
  getIWantMenuBarHeight(){
    return getPx(Math.min(Values.SOFT_MENU_BAR_HEIGHT, 48))
  },
  getRawHeight(){
    return Values.STATUS_BAR_HEIGHT + Values.REAL_WINDOW_HEIGHT
  }
}

// 主页面样式
const MainPage = StyleSheet.create({
  wrap: {
    backgroundColor: '#000',
    flex: 1,
    position: 'relative'
  },
  backgroundBox: {
    width: deviceWidth,
    height: Values.REAL_WINDOW_HEIGHT + Values.STATUS_BAR_HEIGHT
  },
  header: {
    position: 'absolute',
    zIndex: 1000,
    top: getPx(20) + Values.STATUS_BAR_HEIGHT,
    left: 0,
    right: 0,
    height: getPx(50),
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: getPx(34)
  },
  headerLeft: {
    flexDirection: 'row',
    height: getPx(50),
    alignItems: 'center'
  },
  headerLeftText: {
    paddingLeft: getPx(10),
  },
  headerCenter: {
    flexDirection: 'row',
    height: getPx(50),
    alignItems: 'center'
  },
  headerRight: {

  },
  f1: {
    color: '#C0C0C0',
    fontSize: getPx(30),
    fontWeight: 'bold'
  },
  f2: {
    color: '#fff',
    fontSize: getPx(30),
    fontWeight: 'bold'
  },
  f3: {
    color: '#C0C0C0',
    fontSize: getPx(26),
    paddingHorizontal: getPx(28),
    fontWeight: 'bold'
  },
  searchWrap: {
    position: 'relative'
  },
  searchTip: {
    position: 'absolute',
    width: getPx(14),
    height: getPx(14),
    borderRadius: getPx(7),
    backgroundColor: '#face15',
    right: getPx(-14),
    top: getPx(-6)
  }
})

// 视频样式
const DouYinStyle = StyleSheet.create({

  innerWrap: {
    position: 'relative',
    flex: 1
  },

  wrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: deviceWidth,
    height: $Tool.getRawHeight(),
    backgroundColor: '#000'
  },
  rightMenu: {
    position: 'absolute',
    right: getPx(12),
    bottom: getPx(200) + $Tool.getIWantMenuBarHeight(),
    justifyContent: 'center',
    zIndex: 1000
  },
  userFaceBox: {
    width: getPx(94),
    height: getPx(94),
    borderRadius: getPx(47),
    position: 'relative',
    backgroundColor: '#fff',
    marginBottom: getPx(70)
  },
  userFaceBoxBtn: {
    position: 'absolute',
    width: getPx(36),
    height: getPx(36),
    borderRadius: getPx(18),
    backgroundColor: '#ff2b54',
    left: getPx(94 / 2 - 36 / 2),
    bottom: getPx(-20),
  },
  userFaceBoxIcon: {
    textAlign: 'center',
    lineHeight: getPx(38),
  },
  publicIconBox: {
    marginBottom: getPx(40)
  },
  publicIconBoxIcon: {
    width: getPx(92)
  },
  publicIconBoxIconTarget: {
    textAlign: 'center'
  },
  publicIconBoxText: {
    marginTop: getPx(15)
  },
  publicIconBoxTextTarget: {
    textAlign: 'center',
    color: '#fff',
    fontSize: getPx(24)
  },
  player: {
    width: getPx(94),
    height: getPx(94),
    backgroundColor: '#373737',
    borderRadius: getPx(47),
    position: 'relative',
    marginTop: getPx(40)
  },
  playerCover: {
    width: getPx(52),
    height: getPx(52),
    borderWidth: borderWidth,
    borderColor: '#000',
    borderStyle: 'solid',
    position: 'absolute',
    left: getPx(94 / 2 - 52 / 2),
    top: getPx(94 / 2 - 52 / 2),
    borderRadius: getPx(27),
    backgroundColor: '#ffffff',
  },
  descriptionBox: {
    position: 'absolute',
    bottom: getPx(200) + $Tool.getIWantMenuBarHeight(),
    left: getPx(20),
    zIndex: 1000
  },
  userName: {
    color: '#fff',
    fontSize: getPx(30),
    paddingBottom: getPx(22),
    fontWeight: 'bold'
  },
  desText: {
    color: '#fff',
    fontSize: getPx(30),
    width: getPx(500)
  },
  musicForm: {
    width: getPx(500),
    flexDirection: 'row',
    marginTop: getPx(30),
    alignItems: 'center'
  },
  musicGo: {
    width: getPx(300),
    paddingLeft: getPx(15)
  },
  musicGoText: {
    color: '#fff',
    fontSize: getPx(28),
  },
  videoBox: {
    flex: 1,
    position: 'relative',
    zIndex: 200
  },
  videoBoxTarget: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  videoBoxCover: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  }
})
