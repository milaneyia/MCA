<template>
    <div class="home">
        <div class="left-side">
            <div class="left-side__general">
                <div class="wheel">
                    <div class="wheel__img" />

                    <div class="wheel__box" />

                    <div class="wheel__text">
                        <div class="wheel__text__voting">
                            <b>voting stage</b>
                        </div>
                        <div class="wheel__text__days">
                            days left
                        </div>
                    </div>
                </div>
            </div>

            <div class="left-side__text-box">
                <div>
                    <p>01/01/20 10PST - 01/13/20 10PST</p>

                    <p>
                        Mapper's Choice Awards is back for round 4 in 2019! This is a voting event 
                        where all mappers/modders can nominate and vote what they think is the 
                        best map/mapper for each category. 
                    </p>

                    <p>
                        Our intention is to give a new perspective on the best maps of 2019 
                        through the eyes of the mapping community!
                    </p>
                                
                    <p>
                        This year, we have separated storyboarding from the other modes to give 
                        them more emphasis, as well as going with a Google Form submission, 
                        making it as easy as possible for you to vote/nominate! 
                    </p>
                                
                    <p>
                        We hope as many participants as possible take part in this event!
                    </p>
                </div>

                <div style="width: 3px; background-color: white; margin-left: 18px" />
            </div>
        </div>

        <div class="right-side">
            <!---TODO: SETTLE ON A DESIGN AND REPLACE PLACEHOLDER--->
            <div class="headings">
                test
            </div>
                
            <div class="date">
                01/01/20 10PST - 01/13/20 10 PST
            </div>

            <!---TODO: STYLE TEXTBOX IF NEEDED--->
            <div class="desc">
                Mapper's Choice Awards is back for round 4 in 2019! This is a voting event where all mappers/modders can nominate and <br> 
                vote what they think is the best map/mapper for each category. <br><br>

                Our intention is to give a new perspective on the best maps of 2019 through the eyes of the mapping community! <br><br>

                This year, we have separated storyboarding from the other modes to give them more emphasis, as well as going with a Google Form submission, <br>
                making it as easy as possible for you to vote/nominate! <br><br>

                We hope as many participants as possible take part in this event!
            </div>
        </div>
        <!---TODO: GET IMAGE ASSETS FOR MODE ICONS--->
    </div>
</template>

<script lang="ts">
import axios from "axios";
import Vue from "vue";

export default Vue.extend({
    props: {
        user: {
            type: Object,
            default: () => {
                return {};
            },
        },
        eligible: Boolean,
    },
    data () {
        return {
            value: "0%",
            startDate: "2020-04-01",
        };
    },
    computed: {
        remainingDays (): number {
            return Math.floor((+new Date(this.startDate) - Date.now()) / (1000*60*60*24));
        },
    },
    mounted () {
        let days = 0;

        if (this.remainingDays > 31) {
            days = 32; // 31
        } else if (this.remainingDays <= 0) {
            days = 1; // 00
        } else {
            days = this.remainingDays + 1;
        }
        const wheel: HTMLElement | null = document.querySelector(".wheel__img");

        if (wheel) {
            wheel.style["transform"] = `rotate(${(360 / 32) * days}deg)`;
        }
    },
    methods: {
        async run () {
            const res = (await axios.post(`/api/user/guestDifficulty/2019`, {
                url: "https://osu.ppy.sh/beatmapsets/809748#osu/1699094",
            })).data;
            if (res.error) {
                this.value = res.error;
            } else {
                this.value = "Success!";
            }
        },
    },
});
</script>

<style>
.home {
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    flex: 1 1 auto;
}

/*TODO: MAKE FONT RESPONSIVE THIS IS JUST FOR TESTING */

.desc {
	font-family: 'Red Hat Display', sans-serif;
	font-size: 1vw;
}

.date {
	font-family: 'Red Hat Display', sans-serif;
	font-size: 1vw;
	margin-bottom: 5%;
}

.headings {
	margin-top: 5%;
	font-family: 'Lexend Peta', bold;
	font-size: 4vw;
}

.left-side {
    padding-right: 35px;
    padding-top: 7%;
    margin-bottom: 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: flex-end;
    flex: 0 0 100%;
    width: 100%;
}

.left-side__general {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    margin-bottom: 40px;
    width: 100%;
}

.left-side__text-box {
    border-radius: 0 15px 15px 0; 
    background-color: rgba(0, 0, 0, 0.66); 
    text-align: left; 
    padding: 45px 30px;
    display: flex;
}

.right-side {
    padding-left: 35px;
    flex: 0 0 100%;
    width: 100%;
}

.wheel {
    display: flex;
    width: 100%;
    position: relative;
}

.wheel__img {
    width: 950px;
    height: 950px;
    background: url("../../CorsaceAssets/img/ayim-mca/wheel.png") no-repeat center;
    background-size: cover;
    left: -730px;
    top: -400px;
    position: absolute;
    z-index: -1;
}

.wheel__box {
    box-shadow: inset 0 0 20px 0px black;
    border: 3px solid rgba(0, 0, 0, 0.3);
    border-radius: 15px;
    border-bottom: 2px solid white;
    border-right: 2px solid white;
    width: 220px;
    height: 150px;
    flex: 0 0 220px;
    margin-left: 35px;
}

.wheel__text {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    flex-wrap: nowrap;
}


.wheel__text__voting {
    font-size: 2rem;
    border-bottom: 3px solid white;
    width: 100%;
    text-align: right;
}

.wheel__text__days {
    font-family: 'Lexend Peta';
    font-size: 4.5rem;
    text-align: right;
    letter-spacing: -8.96px;
}

@media (min-width: 992px) {
    .left-side, .right-side {
        flex: 0 0 50%;
        max-width: 50%;
    }
}

</style>