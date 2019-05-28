<template>
    <div class="template-wrap">
        <div class="header">
            <nuxt-link to="/" class="header-left">
                <img class="header2018" src="/img/2018.png">
                <img class="ayimicons" src="/img/ayim-header-icons.png">
                <img class="ayim" src="/img/ayim.png">
                <img class="dividerheader" src="/img/divider.png">
            </nuxt-link>
            <div class="countdown">
                <form action="/api/login" method="get">
                    <button type="submit">loginorsmtg</button>
                </form>
                <div>2018 MAPPER'S CHOICE AWARDS</div>
                12
                <div>DAYS TO VOTE</div>
            </div>
            <div 
                class="header-right" 
                @mouseover="mcaHover=true"
                @mouseout="mcaHover=false"
                :class="{headerHover: mcaHover}"
            >
                <img :class="{mcalogoHover: mcaHover}" src="/img/mca.png">
                <img :class="{mcalogoHover: mcaHover}" src="/img/triangle.png">
            </div>
        </div>
        <div class="nav">
            <nuxt-link to="/standard" class="nav-mode standard">
                <img src="/img/standard.png">
                <div>standard</div>
            </nuxt-link>
            <nuxt-link to="/taiko" class="nav-mode taiko">
                <img src="/img/taiko.png">
                <div>taiko</div>
            </nuxt-link>
            <nuxt-link to="/fruits" class="nav-mode fruits">
                <img src="/img/fruits.png">
                <div>
                    <div>catch</div>  
                    <div>the beat</div> 
                </div>  
            </nuxt-link>
            <nuxt-link to="/mania" class="nav-mode mania">
                <img src="/img/mania.png">
                <div>mania</div>
            </nuxt-link>
            <nuxt-link to="/storyboard" class="nav-mode storyboard">
                <img src="/img/storyboard.png">
                <div>storyboard</div>
            </nuxt-link>
        </div>
        <nuxt class="nuxt"/>
        <div class="footer">
            <a href="https://corsace.io" class="footer-left">
                <img class="corsace" src="/img/corsace.png">
                <img class="corsaceText" src="/img/corsace-text.png">
            </a>
            <div class="footer-right">
                CHOOSE YOUR LANGUAGE:
            </div>
        </div>
    </div>
</template>

<script>

export default {
    data: () => ({
        mcaHover: false,
    }),
}
</script>

