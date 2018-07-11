import React from 'react'
import $ from 'jquery'
import host from '../jsPlug/host.js'
import '../scss/home/player.scss'
import { Slider, WingBlank, WhiteSpace } from 'antd-mobile';
import {hashHistory} from 'react-router'
import lrc from '../jsPlug/parseLyric.js'
import ReactDom from 'react-dom'

class Player extends React.Component{
    constructor(props){
        super(props)
        this.musicStop = this.musicStop.bind(this)
        this.state ={
            listid :'',
            songsDetails:{},
            singer:'',
            times:'',
            times2:'',
            time_state:0,
            a:0,
            lrcs:true,
            lrc:[]
        }
    }
    songUrl(s){//歌曲详情
        var _this = this;
        $.ajax({
            type:"get",
            url:host+'/song/detail?ids='+s,
            success:function (data) {
                _this.setState({songsDetails:data['songs'][0]})
                _this.setState({singer:data['songs'][0]['ar'][0]['name']})
                _this.zongTimes()
            }
        })
        $.ajax({
            type:"get",
            url:host+'/lyric?id='+s,
            success:function (data) {
                const lrcss = lrc(data.lrc.lyric)
                _this.setState({lrc:lrcss})
                lrcss.map(function(item,i){
                    $('.lrc_content').append(`<p key=${i}>${item[1]}</p>`)
                })
            }
        })
    }
    srcs(s){
        if(s['al']==undefined){
            return  this.state.songsDetails['al']
        }else{
            return  this.state.songsDetails['al']['picUrl']
        }
    }
    times(){
        if($('audio')[0] == undefined){
            $('.start_time').html('00:00')
        }else if(parseInt($('audio')[0].currentTime%60) >=10 && parseInt($('audio')[0].currentTime%60)< 60){
            $('.start_time').html('0'+parseInt($('audio')[0].currentTime/60)+':'+parseInt($('audio')[0].currentTime%60))
        }else{
            $('.start_time').html('0'+parseInt($('audio')[0].currentTime/60)+':'+'0'+parseInt($('audio')[0].currentTime%60))
        }
    }
    zongTimes(){
        if($('audio')[0].duration == undefined ||parseInt($('audio')[0].duration) == NaN){
            $('.zong_time').html('00:00')
        }else if(parseInt($('audio')[0].duration%60) >=10 && parseInt($('audio')[0].duration%60)< 60){
            $('.zong_time').html('0'+parseInt($('audio')[0].duration/60)+':'+parseInt($('audio')[0].duration%60))
        }else{
            $('.zong_time').html('0'+parseInt($('audio')[0].duration/60)+':'+'0'+parseInt($('audio')[0].duration%60))
        }
    }
    play(){//控制播放动画

        var _this = this;
        var time = setInterval(function () {
             _this.state.a++;
            $('.con_photo_url').css('transform', 'rotate(' +_this.state.a + 'deg)');
            _this.zongTimes()
            if(_this.state.a>360){
             _this.setState({a:0})
            }
        },20)
        var times2 = setInterval(function () {
            $('.am-slider .am-slider-track').css({'width':$('audio')[0].currentTime/$('audio')[0].duration*100+'%'})
            $('.am-slider .am-slider-handle').css({'left':$('audio')[0].currentTime/$('audio')[0].duration*100+'%'})

            //遍历所有歌词，看哪句歌词的时间与当然时间吻合
            for (var i = 0, l = _this.state.lrc.length; i < l; i++) {
                if ($('audio')[0].currentTime /*当前播放的时间*/ > _this.state.lrc[i][0]) {
                    $('.lrc_content p').eq(i).css({"color":"red"}).siblings().css({'color':'#fff'})

                    if(i>8){
                        if($('.lrc_content p').eq(i).html() == ''){
                            $('.lrc_content p').eq(i).html('^-^')
                        }
                        $('.lrc_content').css('top',-0.21*i+0.21*8+'rem')
                        $('.lrc_content p').eq(i).css({"color":"red"}).siblings().css({'color':'#fff'})
                    }

                }else if($('audio')[0].currentTime /*当前播放的时间*/== 0 || $('.start_time').html() == '00:00'){
                    $('.lrc_content').css('top',0+'px')
                }
            }
            _this.times()
        },1000)
        this.setState({times:time})
        this.setState({times2:times2})
    }
    componentDidMount(){
        var _this = this;
        var s = this.props.params.id
        this.setState({listid:s})
        this.songUrl(s)
        this.play()
        this.zongTimes()
    }
    componentWillUnmount(){
        clearInterval(this.state.times)
        clearInterval(this.state.times2)
    }
    log(s){
        var _this = this;
    }
    onAfterChange(s){
        $('.audio')[0].currentTime = s / 100 * $('.audio')[0].duration
    }
    goBack(){
        hashHistory.push('/')
    }
    musicStop(){
        if(!$('.audio')[0].paused){
            $('.fang').removeClass('icon-zanting')
            $('.fang').addClass('icon-bofang')
            $('audio')[0].pause()
            $(".musics2").animate({},function(){
                $(".musics2").css({'transform':'rotate(-30deg)','transformOrigin':'5px 5px'});
            })
            clearInterval(this.state.times)
            clearInterval(this.state.times2)
        }else{
            $('.fang').removeClass('icon-bofang')
            $('.fang').addClass('icon-zanting')
            $('audio')[0].play()
            $(".musics2").animate({},function(){
                $(".musics2").css({'transform':'rotate(0deg)','transformOrigin':'5px 5px'});
            })
            this.play()
        }
    }
    lrcs(){
        if(this.state.lrcs){
            $('.cotent_songs').css({'display':'none'})
            $('.cotent_songs2').css({'display':'block'})
            this.setState({lrcs:false})
        }else{
            $('.cotent_songs').css({'display':'block'})
            $('.cotent_songs2').css({'display':'none'})
            this.setState({lrcs:true})
        }
    }
    render(){
        var _this = this;
        var backUrl = {backgroundSize:"cover",backgroundRepeat:'no-repeat',backgroundImage:"url("+this.srcs(this.state.songsDetails) +")"}
        return(
            <div id="Player">
                <audio className="audio" src={'http://music.163.com/song/media/outer/url?id='+this.state.listid+'.mp3'} autoPlay></audio>
                <div className='head'>
                    <em className="iconfont icon-xiangzuo" onClick={this.goBack.bind(this)}></em>
                    <div className="songs_name">
                        <p>{this.state.songsDetails['name']}</p>
                        <p>{this.state.singer}</p>
                    </div>
                    <span className="iconfont icon-fenxiang"></span>
                </div>
                <div className='content_wrap' onClick={this.lrcs.bind(this)}>
                    <div className='cotent_songs'>
                        <div className='musics2'></div>
                        <div className="cotent_photo">
                            <div className="con_photo_wrap">
                                <div className="con_photo_url">
                                    <div className="con_photo_url2" style={backUrl}>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='music_like'>
                            <div className='iconfont icon-guanzhu'></div>
                            <div className='iconfont icon-xiazai'></div>
                            <div className='iconfont icon-liaotian'></div>
                            <div className='iconfont icon-dots-verticle'></div>
                        </div>
                    </div>
                    <div className="cotent_songs2">
                        <div className='lrc_wrap'>
                            <div className='lrc_content'>

                            </div>
                        </div>
                    </div>
                </div>

                        <div className='am-slider-example'>
                            <span className='start_time'>00:00</span>
                            <WhiteSpace size="lg" />
                            <WingBlank size="lg">
                                <Slider
                                    style={{ marginLeft: 30, marginRight: 30 }}
                                    defaultValue={this.state.time_state}
                                    min={0}
                                    max={100}
                                    onChange={this.log.bind(this)}
                                    onAfterChange={this.onAfterChange.bind(this)}
                                    trackStyle={{
                                        backgroundColor: '#fff',
                                        height: '2px',
                                    }}
                                    railStyle={{
                                        backgroundColor: 'red',
                                        height: '2px',
                                    }}
                                    handleStyle={{
                                        borderColor: 'red',
                                        height: '14px',
                                        width: '14px',
                                        marginLeft: '-7px',
                                        marginTop: '-4.5px',
                                        backgroundColor: '#fff',
                                    }}
                                />
                            </WingBlank>
                            <span className='zong_time'></span>
                        </div>
                        <div className="controlPanel">
                            <div className="iconfont icon-liebiaoxunhuan"></div>
                            <div className="iconfont icon-preMusic"></div>
                            <div className="iconfont icon-zanting fang" onClick={this.musicStop}></div>
                            <div className="iconfont icon-nextsong"></div>
                            <div className="iconfont icon-bofangliebiao"></div>
                        </div>
                <div className="big_zhao" style={backUrl}></div>
            </div>
        )
    }
}

export default Player;