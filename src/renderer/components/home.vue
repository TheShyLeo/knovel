<template>
	<div class="lv-main">
		<Aside />
		<section class="lv-right" :style="{ height: mainHeight }">
			<Header :NowPlay="NowPlay" :full="showFull" />
			<section class="lv-right-main" :class="fullPage ? 'full-page' : ''">
				<transition name="fade" mode="out-in">
					<keep-alive>
						<router-view v-if="routerKey" :key="routerKey" />
						<router-view v-else />
					</keep-alive>
				</transition>
			</section>
		</section>
	</div>
</template>

<script>
import Aside from './home/Aside.vue';
import Header from './home/Header.vue';

export default {
	name: 'home',
	components: { Aside, Header },
	data() {
		return {
			isCollapse: true,
			PlayList: [],
			NowPlay: {
				picture: ''
			},
			playState: 'sf-icon-play',
			showFull: false,
			analyser: {},
			login: false,
			fullPage: false
		};
	},
	created() {},
	methods: {},
	computed: {
		mainHeight() {
			return this.PlayList.length ? 'calc(100% - 60px)' : '100%';
		},
		routerKey() {
			return true
		}
	}
};
</script>

<style>
.lv-main {
	background: #fff;
}
.lv-right-main {
	float: left;
	width: 100%;
	height: 100%;
	border-top: 1px solid #eee;
	background: #fff;
	-o-transition: all 350ms;
	-moz-transition: all 350ms;
	-webkit-transition: all 350ms;
	position: relative;
}
.full-page {
	position: absolute;
	left: 0;
	top: 60px;
}
</style>
