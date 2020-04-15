<template>
    <div class="header">
        <img src="../../CorsaceAssets/img/ayim-mca/site/2019.png">
        <a
            class="header__title--active"
            href="#MCA"
        >MAPPERS'S <br> CHOICE <br> AWARDS</a>
        <a class="header__seperator"><img src="../../CorsaceAssets/img/ayim-mca/site/l.png"></a>
        <a
            class="header__title"
            href="ayim.html"
        >A YEAR <br> IN <br> MAPPING</a>
        <a
            class="header__login"
            href="#login"
        >LOG IN</a>
    </div>
</template>

<style lang="scss">
.header {
	display: flex;
	overflow: hidden;
	background-color: #000;
	border-bottom-style: solid;
	border-bottom-color: #FFF;
	align-items: center;
	top: 0;
    width: 100%;
    flex: 0 0 auto;

	a {
		float: left;
		text-decoration: none;
		position: relative;
	}
}

.header__seperator {
	margin-left: 20px;
}

.header__title {
	font-size: 25px;
	line-height: 0.86;
	letter-spacing: 10px;
	color: #4c4c4c;
	margin-left: 3%;
}

.header__title--active {
	font-size: 25px;
	line-height: 0.86;
	letter-spacing: 10px;
	color: #fff;
	margin-left: 3%;
}

.header__login {
	line-height: 1.19;
	letter-spacing: 1.89px;
	color: #d8d8d8;
	margin-left: 40%;
}
</style>