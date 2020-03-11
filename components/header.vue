<template>
    <div class="header">
        <img src="../../CorsaceAssets/img/ayim-mca/site/2019.png">
        <a
            class="mca_active"
            href="#MCA"
        >MAPPERS'S <br> CHOICE <br> AWARDS</a>
        <a class="seperator"><img src="../../CorsaceAssets/img/ayim-mca/site/l.png"></a>
        <a
            class="ayim"
            href="ayim.html"
        >A YEAR <br> IN <br> MAPPING</a>
        <a
            class="login"
            href="#login"
        >LOG IN</a>
    </div>
</template>

<script>
export default {
    
};
</script>

<style>
.header {
  display: flex;
  overflow: hidden;
  background-color: #000;
  border-bottom-style: solid;
  border-bottom-color: #FFF;
  align-items: center;
  top: 0;
  width: 100%;
}

.header a {
  float: left;
  text-decoration: none;
  font-family: 'Red Hat Display', sans-serif;
  position: relative;
}

.seperator {
	margin-left: 20px;
}


.mca_active {
  font-size: 25px;
  line-height: 0.86;
  letter-spacing: 10px;
  color: #fff;
  margin-left: 3%;

}

.mca {
  font-size: 25px;
  line-height: 0.86;
  letter-spacing: 10px;
  color: #4c4c4c;
  margin-left: 3%;
}

.ayim_active {
  font-size: 25px;
  line-height: 0.86;
  letter-spacing: 10px;
  color: #fff;
  margin-left: 3%;

}

.ayim {
  font-size: 25px;
  line-height: 0.86;
  letter-spacing: 10px;
  color: #4c4c4c;
  margin-left: 3%;
}

.login {
  line-height: 1.19;
  letter-spacing: 1.89px;
  color: #d8d8d8;
  margin-left: 40%;
}
</style>