<template>
    <div class="footer">
        <div class="corsace">
            <div class="logo">
                <img src="../../CorsaceAssets/img/ayim-mca/site/corsace logo.png">
            </div>
            <div class="logo_text">
                <img src="../../CorsaceAssets/img/ayim-mca/site/corsace text.png">
            </div>
        </div>

        <div class="dot_seperator">
            <div class="dot">
                <img src="../../CorsaceAssets/img/ayim-mca/site/d.png">
            </div>
        </div>

        <div class="socials">
            <a href="https://twitter.com/vinxis1"> <img src="../../CorsaceAssets/img/ayim-mca/site/twitter.png"> </a>
            <a href="https://open.corsace.io/discord.94b52bb5.png"><img src="../../CorsaceAssets/img/ayim-mca/site/discord.png"></a>
            <a href="https://open.corsace.io/twitch.6a390bfe.png"><img src="../../CorsaceAssets/img/ayim-mca/site/ttv.png"></a>
        </div>
    </div>
</template>

<script>
export default {
    
};
</script>

<style>
.footer {
  overflow: hidden;
  background-color: #000;
  border-top-style: solid;
  border-top-color: #FFF;
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 9%;
}
.corsace {
  margin-left: 1%;
  position: relative;
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
}

.logo {
  float: left;
  display: block;
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);;
}

.logo img {
	height: 90px;
}

.logo_text {
  float: left;
  display: block;
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
}

.logo_text img {
	height: 40px;
}

.dot_seperator {
  position: relative;
  top: 45%;
  -ms-transform: translateY(-45%);
  transform: translateY(-45%);
}

.dot{
	margin-left: 2%;
  float: left;
  display: block;
  top: 45%;
  -ms-transform: translateY(-45%);
  transform: translateY(-45%);
}

.dot img {
	height: 5px;
}

.socials {
  margin-left: 10%;
  position: relative;
  left: 2%;
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
}

.socials img {
	height: 70px;
}
</style>