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
            <div class="right-side__title">
                standard | voting
            </div>

            <div class="wrap">
                <div class="right-side__general">
                    <div class="right-side__general__ranked-sets box">
                        <div>
                            <small>RANKED SETS</small>
                        </div>
                        <div style="border: 1px solid white; width: 1px; height: 100%" />
                        <div style="font-family: Scoreboard; font-size: 2.8rem">
                            000
                            | 000
                        </div>
                    </div>

                    <div class="right-side__general__vote box">
                        vote now ! <span style="margin-left: 15px">>></span>
                    </div>
                </div>

                <div class="right-side__categories-container">
                    <div
                        v-for="i in 3"
                        :key="i"
                        class="right-side__categories"
                    >
                        <div class="right-side__categories__title">
                            map categories
                        </div>
                        <div class="right-side__categories__award">
                            grand award
                        </div>
                        <div class="right-side__categories__award">
                            grand award
                        </div>
                        <div class="right-side__categories__award">
                            grand award
                        </div>
                        <div class="right-side__categories__award">
                            grand award
                        </div>
                        <div class="right-side__categories__award">
                            grand award
                        </div>
                        <div class="right-side__categories__award">
                            grand award
                        </div>
                    </div>
                </div>
                    
                <div class="right-side__organizers-container box">
                    <div class="right-side__organizers-title">
                        <small>ORGANIZED BY</small>
                    </div>
                    <div class="right-side__organizers">
                        person a, person b, person c, person d, person e
                    </div>
                </div>
            </div>
        </div>
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
    padding: 45px 30px;
    display: flex;
}

.box {
    border-radius: 15px; 
    background-color: rgba(0, 0, 0, 0.66); 
    padding: 12px;
    display: flex;
}

.right-side {
    padding-left: 35px;
    flex: 0 0 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
}

.right-side__title {
    font-family: 'Lexend Peta', bold;
    font-size: 2rem;
    text-shadow: 0 0 4px white;
    margin: 5% 25px 10px auto;
}

.right-side__general, 
.right-side__categories-container, 
.right-side__organizers-container {
    display: flex;
}

.wrap {
    border-top: 3px solid var(--red-pink);
    border-left: 3px solid var(--red-pink);
    border-bottom: 3px solid var(--red-pink);
    border-top-left-radius: 25px;
    border-bottom-left-radius: 25px;
    padding: 25px;
}

.right-side__general,
.right-side__categories-container {
    margin-bottom: 40px;
    justify-content: space-around;
}

.right-side__general__ranked-sets {
    flex: 1 1 50%;
    margin-right: 10px;
    align-items: center;
    justify-content: space-between;
}

.right-side__general__vote {
    flex: 1 1 50%;
    margin-left: 10px;
    color: var(--red-pink);
    font-style: italic;
    font-size: 1.7rem;
    justify-content: flex-end;
    align-items: center;
    text-shadow: 1px 1px 3px #222;
    font-weight: 900;
    letter-spacing: 1.2px;
    background-color: white;
    /* background: linear-gradient(135deg,black 0%, black 20%, white 20%, white 22%, black 22%, black 24%, white 24%, white 26%, var(--red-pink) 26%, var(--red-pink) 28%, white 28%); */
}

.right-side__categories__title {
    border-bottom: 2px solid #fff;
    margin-bottom: 15px;
    font-weight: bold;
    font-size: 1.5rem;
}

.right-side__categories__award {
    margin-bottom: 8px;
}

.right-side__organizers-container {
    flex-direction: column;
}

.right-side__organizers-title {
    border-bottom: 1px solid white;
}

.right-side__organizers {
    padding: 25px;
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
    box-shadow: inset 0 0 20px 0px #222;
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