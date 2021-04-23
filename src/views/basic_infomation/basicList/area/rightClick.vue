<template>
	<div class="rightClick">
		<div id="menu">
			<div id="maskT" class="mask">
				<div class="cat"></div>
			</div>
			<div id="maskB" class="mask">
				<div class="cat"></div>
			</div>
			<div id="maskL" class="mask">
				<div class="cat"></div>
			</div>
			<div id="maskR" class="mask">
				<div class="cat"></div>
			</div>

			<ul class="up">
				<li><a href="#">
						<div class="icon"></div>
						<p>后退看看</p>
					</a></li>
				<li><a href="#">
						<div class="icon"></div>
						<p>往前一页</p>
					</a></li>
				<li><a href="#">
						<div class="icon"></div>
						<p>洗脸啦</p>
					</a></li>
			</ul>
			<div class="line"></div>
			<ul class="down">
				<li><a href="#">
						<div class="icon"></div>
						<p>不懂求助</p>
					</a></li>
				<li><a href="#">
						<div class="icon"></div>
						<p>打印狂魔</p>
					</a></li>
				<li><a href="#">
						<div class="icon"></div>
						<p>图片另存为</p>
					</a></li>
			</ul>

		</div>
	</div>
</template>

<script>
	export default {
		name: 'rightClick',
		components: {},
		data() {
			return {}
		},
		created() {},
		methods: {}
	}
</script>
<style scoped>
	* {
		margin: 0;
		padding: 0;
	}

	a {
		text-decoration: none;
	}

	ul {
		list-style: none;
	}

	html,
	body {
		background: #5e7ba3;
	}

	#menu {
		position: absolute;
		width: 200px;
		height: 277px;
		border: 3px solid #ff88e2;
		border-radius: 5px;
		display: block;
		backface-visibility: hidden;
	}

	#menu ul li {
		position: relative;
		height: 45px;
		transition: 0.5s
	}

	#menu ul.up li:nth-child(1) div.icon {
		background-position: 0 0;
		transition: 0.3s
	}

	#menu ul.up li:nth-child(2) div.icon {
		background-position: -40px 0;
		transition: 0.3s
	}

	#menu ul.up li:nth-child(3) div.icon {
		background-position: -80px 0;
		transition: 0.3s
	}

	#menu ul.down li:nth-child(1) div.icon {
		background-position: -120px 0;
		transition: 0.3s
	}

	#menu ul.down li:nth-child(2) div.icon {
		background-position: -160px 0;
		transition: 0.3s
	}

	#menu ul.down li:nth-child(3) div.icon {
		background-position: -200px 0;
		transition: 0.3s
	}

	#menu ul li p {
		position: absolute;
		left: 60px;
		width: 50%;
		font-size: 18px;
		color: rgba(255, 255, 255, 0.8);
		line-height: 45px;
		text-align: center;
		transition: 0.8s
	}

	#menu div.line {
		height: 1px;
		width: 90%;
		background: #ff88e2;
		margin: 3px 10px;
	}

	#menu ul li:hover {
		background: rgba(199, 154, 255, .2);
	}

	#menu ul li:hover p {
		color: #ff88e2;
		text-shadow: #4e063a 2px 1px 2px;
	}

	#menu ul.up li:nth-child(1):hover div.icon {
		background-position: 0 -35px;
	}

	#menu ul.up li:nth-child(2):hover div.icon {
		background-position: -40px -35px;
	}

	#menu ul.up li:nth-child(3):hover div.icon {
		background-position: -80px -35px;
	}

	#menu ul.down li:nth-child(1):hover div.icon {
		background-position: -120px -35px;
	}

	#menu ul.down li:nth-child(2):hover div.icon {
		background-position: -160px -35px;
	}

	#menu ul.down li:nth-child(3):hover div.icon {
		background-position: -200px -35px;
	}


	#menu div.mask {
		width: 150px;
		height: 150px;
		position: absolute;
		overflow: hidden;
	}

	

	#menu div#maskT {
		top: -153px;
		margin-left: 25px;
	}

	#menu #maskT>.cat {
		bottom: -153px;
		transform: rotate(270deg);
	}

	#menu div#maskB {
		bottom: -153px;
		margin-left: 25px;
	}

	#menu #maskB>.cat {
		top: -153px;
		transform: rotate(-270deg);
	}

	#menu div#maskL {
		left: -153px;
	}

	#menu #maskL>.cat {
		right: -153px;
		transform: rotateY(180deg);
	}

	#menu div#maskR {
		left: 203px;
	}

	#menu #maskR>.cat {
		left: -153px;
	}

	#menu:hover div#maskT div.cat {
		animation: move1 4s 8s forwards;
	}

	#menu:hover div#maskB div.cat {
		animation: move2 4s 12s forwards;
	}

	#menu:hover div#maskL div.cat {
		animation: move3 4s forwards;
	}

	#menu:hover div#maskR div.cat {
		animation: move4 4s 4s forwards;
	}

	@keyframes move1 {
		0% {
			transform: translate(0px, 0px) rotate(270deg);
		}

		40% {
			transform: translate(0px, -153px) rotate(270deg);
		}

		60% {
			transform: translate(0px, -153px) rotate(270deg);
		}

		100% {
			transform: translate(0px, 0) rotate(270deg);
		}
	}

	@keyframes move2 {
		0% {
			transform: translate(0px, 0px) rotate(-270deg);
		}

		40% {
			transform: translate(0px, 153px) rotate(-270deg);
		}

		60% {
			transform: translate(0px, 153px) rotate(-270deg);
		}

		100% {
			transform: translate(0px, 0) rotate(-270deg);
		}
	}

	@keyframes move3 {
		0% {
			transform: translate(0px, 0px) rotateY(180deg);
		}

		40% {
			transform: translate(-153px, 0) rotateY(180deg);
		}

		60% {
			transform: translate(-153px, 0) rotateY(180deg);
		}

		100% {
			transform: translate(0px, 0) rotateY(180deg);
		}
	}

	@keyframes move4 {
		0% {
			transform: translate(0px, 0px);
		}

		40% {
			transform: translate(153px, 0);
		}

		60% {
			transform: translate(153px, 0);
		}

		100% {
			transform: translate(0px, 0);
		}
	}

	h1 {
		width: 300px;
		margin: 50px auto;
		color: white;
	}
</style>
