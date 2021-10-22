<template>
	<div :class="'lv-right-head ' + (full ? 'full' : '')">
		<!-- <div class="lv-right-round">
			<button class="sf-icon-angle-left" @click="navBack" />
			<button class="sf-icon-angle-right" @click="$router.forward()" />
		</div> -->
		<div class="lv-right-search-main">
			<i class="sf-icon-search" />
			<input type="text" v-model="RoomId" placeholder="搜索内容." @keydown.enter="SearchSuggest = false" @keyup.enter="startSearch" />
		</div>
		<ul class="window-actions">
			<!-- <li class="sf-icon-cog" @click="setting" /> -->
			<li class="sf-icon-minus" style="font-size: 13px" @click="mini" />
			<li class="sf-icon-times" style="font-size: 14px" @click="close" />
		</ul>
	</div>
</template>

<script>
let a = null;
export default {
	name: 'DiskHeader',
	components: {},
	props: {
		NowPlay: {
			type: Object
		},
		count: {
			type: Number
		},
		full: Boolean
	},
	data() {
		return {
			UserState: true,
			QuitFlag: false, //是否允许退出
			MusicWindow: false,
			RoomId: '',
			SearchSuggest: false,
			LastCommand: '',
			SearchSuggestResult: {}
		};
	},
	mounted() {
	},
	methods: {
		setting() {
			this.$router.push({
				path: '/setting'
			});
		},
		mini() {
			this.MusicWindow.minimize();
		},
		close() {
			this.MusicWindow.hide();
		},
		SearchInput() {
		},
		playSearch(item) {
			this.SearchSuggest = false;
		},
		startSearch() {

		},
		navBack() {
		}
	}
};
</script>

<style scoped>
.lv-right-head {
	float: left;
	width: 100%;
	height: 60px;
	color: #4d515a;
	-webkit-app-region: drag;
	position: relative;
	z-index: 5;
	overflow: unset;
	display: flex;
	align-items: center;
	justify-content: center;
}
/*搜索*/
.lv-right-round {
	width: 120px;
	-webkit-app-region: no-drag;
}
.lv-right-round button {
	background: #eaeaea;
	height: 25px;
	line-height: 25px;
	font-size: 16px;
	padding: 0 12px;
	color: #8e8e8e;
}
.lv-right-round button:hover {
	color: #333;
}
.lv-right-round button:first-child {
	border-radius: 5px 0 0 5px;
}
.lv-right-round button:last-child {
	border-radius: 0 5px 5px 0;
}
.lv-right-search-main {
	width: 280px;
	margin-right: 320px;
	position: relative;
	-webkit-app-region: no-drag;
}
.lv-right-search-main input {
	width: 100%;
	height: 30px;
	border-radius: 5px;
	background: #eaeaea;
	color: #333;
	line-height: 30px;
	padding-left: 10px;
	padding-right: 32px;
}
.lv-right-search-main input::-webkit-input-placeholder {
	color: #a09d9d;
}
.lv-right-search-main i {
	position: absolute;
	right: 0;
	color: #a09d9d;
	font-size: 16px;
	top: 0;
	width: 40px;
	height: 30px;
	line-height: 30px;
	text-align: center;
	background: none !important;
}
.full button,
.full i,
.full input {
	background: rgba(255, 255, 255, 0.1);
	color: #fff;
}
.full input::-webkit-input-placeholder {
	color: #e3e8ee;
}
.full .window-actions li,
.full .user-actions {
	color: #fff;
}
.lv-right-search-bubble {
	width: 280px;
	height: 370px;
	border-radius: 0 0 5px 5px;
	position: absolute;
	left: 173px;
	top: 60px;
	overflow: unset;
	box-shadow: 0 2px 9px -1px rgba(0, 0, 0, 0.5);
	background: rgba(255, 255, 255, 0.5);
	-o-transition: all 350ms;
	-moz-transition: all 350ms;
	-webkit-transition: all 350ms;
}
.lv-right-search-blur {
	position: absolute;
	z-index: 0;
	width: 100%;
	height: 100%;
	border-radius: 0 0 5px 5px;
	opacity: 0.5;
}
.lv-right-search-bubble-content {
	width: 100%;
	height: 100%;
	position: absolute;
	z-index: 1;
	border-radius: 0 0 5px 5px;
	color: #fff;
}
.lv-right-search-bubble-content .artist {
	width: 100%;
	background: #e564645c;
	height: 60px;
	position: relative;
}
.lv-right-search-bubble-content p {
	padding: 10px;
	font-size: 14px;
}
.lv-right-search-bubble-content .artist .key {
	color: rgba(255, 255, 255, 0.5);
	position: absolute;
	font-weight: bold;
	font-size: 50px;
	bottom: -5px;
	right: 10px;
}
.lv-right-search-bubble-content .artist span {
	line-height: 40px;
	float: left;
	font-size: 20px;
	padding-left: 10px;
	position: absolute;
	height: 40px;
	width: 56%;
	text-overflow: ellipsis;
	white-space: nowrap;
	z-index: 0;
}
.lv-right-search-bubble-content .artist ul {
	float: right;
	margin-top: -5px;
	width: 56%;
}
.lv-right-search-bubble-content .artist li {
	display: inline-block;
	position: relative;
	width: 50px;
	height: 50px;
	cursor: pointer;
}
.lv-right-search-bubble-content .artist img {
	width: 100%;
	height: 100%;
	border-radius: 100%;
	border: 2px solid #fff;
}
.lv-right-search-bubble-content .songs {
	width: 100%;
	background: #e56464bf;
	height: 140px;
	border-top: 1px solid rgba(255, 146, 146, 0.5);
}
.lv-right-search-bubble-content .songs ul {
	width: 100%;
	height: calc(100% - 40px);
	overflow: auto;
}
.lv-right-search-bubble-content .songs li {
	width: 100%;
	height: 30px;
	line-height: 30px;
	padding-left: 10px;
	cursor: pointer;
}
.lv-right-search-bubble-content .songs li:hover {
	background: #e56464;
}
.lv-right-search-bubble-content .album {
	width: 100%;
	height: 130px;
	background: #e56464;
	position: relative;
	border-top: 1px solid rgba(255, 146, 146, 0.5);
}
.lv-right-search-bubble-content .album ul {
	padding: 0 10px;
	overflow: auto;
	height: 89px;
}
.lv-right-search-bubble-content .album li {
	display: inline-block;
	width: 55px;
	height: 80px;
	text-align: center;
	margin-right: 5px;
	cursor: pointer;
}
.lv-right-search-bubble-content .album li img {
	width: 100%;
	height: 55px;
	border-radius: 5px;
}
.lv-right-search-bubble-content .album li span {
	overflow: hidden;
	height: 20px;
	text-overflow: ellipsis;
}
/*用户*/
.user-actions {
	position: absolute;
	right: 170px;
	top: 15px;
	height: 30px;
	line-height: 30px;
	-webkit-app-region: no-drag;
	overflow: unset;
	color: #333;
}
.user-actions * {
	-webkit-app-region: no-drag;
}
.user-actions .item {
	max-width: 200px;
	text-overflow: ellipsis;
	cursor: pointer;
}
.user-actions .item * {
	height: 100%;
}
.user-actions .item img {
	display: inline-block;
	border-radius: 100%;
	width: 30px;
	height: 30px;
}
.user-actions .item span {
	font: 1.2em caption;
	color: #141414;
	padding-left: 10px;
	max-width: 150px;
	text-overflow: ellipsis;
}
.ivu-dropdown-item img {
	float: left;
	width: 30px;
	height: 30px;
	border-radius: 100%;
}
.ivu-dropdown-item span {
	margin-left: 10px;
	font-size: 14px;
	width: unset !important;
	background: none;
	line-height: 30px;
}
/*窗体操作*/
.window-actions {
	float: right !important;
	text-align: center;
	padding: 0 5px;
	position: absolute;
	top: 5px;
	right: 0;
	color: #333;
}
.window-actions li {
	float: left;
	width: 30px;
	height: 30px;
	margin-left: 5px;
	line-height: 30px;
	font-size: 12px;
	-webkit-app-region: no-drag;
	cursor: pointer;
	border-radius: 5px;
	-webkit-transition: all 0.35s;
	-moz-transition: all 0.35s;
	-o-transition: all 0.35s;
}
.window-actions li:hover,
.window-actions li:active {
	background: rgba(0, 0, 0, 0.1);
	-webkit-transition: all 0.35s;
	-moz-transition: all 0.35s;
	-o-transition: all 0.35s;
}
.window-actions li:active {
	border-radius: 100%;
}
</style>
