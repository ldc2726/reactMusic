import React from 'react';
import ReactDom from 'react-dom';
import { Router, Route, Link, Redirect,hashHistory,IndexRoute,IndexRedirect} from 'react-router'
import FindSong from './components/findSong.js'
import Video from './components/video.js'
import My from './components/my.js'
import Player from './components/player.js'
import './jsPlug/rem.js'
import Friend from './components/friend.js'
import Account from './components/account.js'
import 'antd-mobile/dist/antd-mobile.css';
import './scss/main.scss'

class App extends React.Component{
	render(){
		const ACTIVE = { color:' #f00'}
		return(
			<div className='app'>
				<header></header>
				<section>
					{this.props.children}
				</section>
				<footer>
					<ul>
				 		<li>
					 		<Link to={'/findSong'} activeStyle={ACTIVE}>
					 			<p className="iconfont icon-wangyiyunyinle"></p>
					 			<p>发现</p>
					 		</Link>
				 		</li>
				 		<li>
					 		<Link to={'/video'} activeStyle={ACTIVE}>
					 			<p className="iconfont icon-iconzhenghe47"></p>
					 			<p>视频</p>
					 		</Link>
				 		</li>
				 		<li>
					 		<Link to={'/my'} activeStyle={ACTIVE}>
					 			<p className="iconfont icon-yinyue"></p>
					 			<p>我的</p>
					 		</Link>
					 	</li>
				 		<li>
					 		<Link to={'/friend'} activeStyle={ACTIVE}>
					 			<p className="iconfont icon-pengyou"></p>
					 			<p>朋友</p>
					 		</Link>
					 	</li>
				 		<li>
					 		<Link to={'/account'} activeStyle={ACTIVE}>
					 			<p className="iconfont icon-zhanghao"></p>
					 			<p>账号</p>
					 		</Link>
					 	</li>
				 	</ul>
				</footer>
			 	
			</div>
		)
	}	
}
ReactDom.render(
<Router history={hashHistory}>
	<Route path='/' component={App}>
	<IndexRedirect to='/findSong'/>
		<Route path = '/findSong' component={FindSong}></Route>
		<Route path = '/video' component={Video}></Route> 
		<Route path = '/my' component={My}></Route>
		<Route path = '/friend' component={Friend}></Route>
		<Route path = '/account' component={Account}></Route> 
	</Route>
	<Route path = '/player/:id' component={Player}></Route>
</Router>,document.getElementById('out'))
