<template>
	<section class="lv-left">
		<div class="lv-left-head">
			<div class="logo-text"></div>
			<p>knovel</p>
		</div>
		<div class="lv-left-menu">
			<div class="lv-left-menu-container" v-for="(item, index) in MenuData" :key="index">
				<p>{{ item.name }}</p>
				<ul>
					<li v-for="(menu, m_index) in item.children" :key="m_index" ripple="" :class="menu.active" @click="change(menu.data)">
						<span class="sf-icon-play-1" v-if="index > 1 && menu.icon === 'sf-icon-bars'" />
						<i :class="menu.icon" />{{ menu.name }}
						<div v-show="menu.count > 0">
							{{ menu.count }}
						</div>
					</li>
				</ul>
			</div>
		</div>
	</section>
</template>

<script>
export default {
	name: 'Aside',
	components: {},
	data() {
		return {
			MenuData: [
				{
					name: '直播平台',
					children: [
						{
							name: '斗鱼',
							icon: 'sf-icon-tv',
							data: 'douyu',
							active: 'active'
						},
						{
							name: '虎牙',
							icon: 'sf-icon-headphones',
							data: 'huya',
							active: ''
						},
						{
							name: 'B站',
							icon: 'sf-icon-clock',
							data: 'bilibili',
							active: ''
						},
						{
							name: '企鹅',
							icon: 'sf-icon-star-o',
							data: 'egame',
							active: ''
						}
					]
				},
				{
					name: '直播分类',
					children: [
						{
							name: '英雄联盟',
							icon: 'sf-icon-globe',
							data: 'lol',
							active: ''
						},
						{
							name: '英雄联盟手游',
							icon: 'sf-icon-globe',
							data: 'lolm',
							active: ''
						},
						{
							name: '颜值',
							icon: ' sf-icon-scrubber',
							data: 'yz',
							active: ''
						},
						{
							name: '舞蹈',
							icon: ' sf-icon-scrubber',
							data: 'wudao',
							active: ''
						}
					]
				},
				{
					name: '我的',
					children: [
						{
							name: '我关注的主播',
							icon: 'sf-icon-heart-o',
							data: 'like',
							active: ''
						},
						{
							name: '我看过的主播',
							icon: 'sf-icon-heart-o',
							data: 'history',
							active: ''
						}
					]
				}
			]
		};
	},
	created() {},
	methods: {
		change(data) {
			for (let item of this.MenuData) {
				if (item.children.length > 0) {
					for (let child of item.children) {
						if (child.data === data) {
							child.active = 'active';
						} else {
							child.active = '';
						}
					}
				}
			}
			Bus.$emit('changeSelected', data);
		}
	}
};
</script>

<style>
/*左侧头部*/
.lv-left {
	float: left;
	width: 200px;
	height: 700px;
	color: #4d515a;
	background: #f5f6fa;
}
.full-page {
	background: #fff !important;
	position: relative !important;
	top: 0 !important;
}
.lv-left-head {
	width: 100%;
	padding: 10px 0 30px 20px;
	height: 60px;
	position: relative;
	z-index: 4;
}
.lv-left-head * {
	float: left;
}
.lv-left-head .logo {
	width: 40px;
	height: 40px;
	box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.1);
	border-radius: 100%;
	margin-right: 4px;
}
.lv-left-head p {
	position: absolute;
	left: 64px;
	top: 33px;
	font-size: 10px;
	text-indent: 4px;
}
.lv-left-head .logo-text {
	width: 110px;
	margin-top: -3px;
	height: 26px;
	/* background: url('../../../build/icons/256x256.png'); */
	background-size: contain !important;
	background-repeat: no-repeat !important;
}
.full .logo-text {
	width: 120px;
	margin-top: -2px;
	margin-left: -3px;
	/* background: url('../../../build/icons/256x256.png'); */
}
.full p {
	color: #fff;
}
/*左侧菜单*/
.lv-left-menu {
	width: 100%;
	height: 100%;
	overflow: auto;
	position: relative;
}
.lv-left-menu::-webkit-scrollbar-thumb {
	display: none;
}
.lv-left-menu li {
	width: 100%;
	height: 35px;
	line-height: 35px;
	cursor: pointer;
	font-size: 12.5px;
	margin-top: 5px;
	color: #39585a;
	position: relative;
	border-left: 4px solid rgba(0, 0, 0, 0);
	text-overflow: ellipsis;
	white-space: nowrap;
	padding-left: 10px;
}
.lv-left-menu li:hover,
.lv-left-menu .active {
	color: #e56464 !important;
	border-left: 4px solid #e56464;
}
.lv-left-menu li span {
	position: absolute;
	width: 12px;
	font-size: 10px;
	left: 26px;
	top: 14px;
	background: #f5f6fa;
	padding: 2px;
}
.lv-left-menu i {
	float: left;
	width: 35px;
	height: 35px;
	display: block;
	text-align: center;
	line-height: 35px;
	font-size: 14px;
	margin-right: 2px;
}
.lv-left-menu .sf-icon-bars {
	font-size: 12px;
	text-indent: -5px;
}
.lv-left-menu li div {
	float: right;
	padding: 0 6px;
}
.lv-left-menu-container p {
	font-size: 13px;
	color: #b3b3b3;
	font-weight: normal;
	text-indent: 22px;
	line-height: 25px;
	padding-top: 5px;
}
</style>
