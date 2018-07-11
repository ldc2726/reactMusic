import React from 'react'
// import ReactDom from 'react-dom'
import $ from 'jquery'
import host from '../jsPlug/host'
class My extends React.Component{
	constructor(props){
		super(props)
	}
	componentDidMount(){
		$.ajax({
			type:'get',
			url:host+'/personalized/mv',
			success:function (data) {
				console.log(data)
            }
		})
	}
	render(){
		return(
			<div id="My">
				My
			</div>
		)
	}
}

export default My;