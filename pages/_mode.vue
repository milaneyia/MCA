<template>
    <div class="home">
        <div class="left-side">
            <div class="voting-date">
                <div class="voting-date__wheel-container">
                    <div class="voting-date__wheel-img" />

                    <div class="voting-date__wheel-box" />

                    <div class="voting-date__content">
                        <div class="voting-date__title">
                            <b>voting stage</b>
                        </div>
                        <div class="voting-date__subtitle">
                            days left
                        </div>
                    </div>
                </div>
            </div>

            <div class="general-info">
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
        </div>

        <div class="right-side">
            <div class="mode-title">
                standard | voting
            </div>

            <div
                class="mode-container"
                :class="`mode-container--${selectedMode}`"
            >
                <div class="mode-container__general">
                    <div class="ranked-sets">
                        <small>RANKED SETS</small>
                        <div class="ranked-sets__divider" />
                        <div class="ranked-sets__content">
                            0000000
                        </div>
                    </div>

                    <div
                        class="vote-now"
                        :class="`vote-now--${selectedMode}`"
                    >
                        vote now ! <span>>></span>
                    </div>
                </div>

                <div class="categories">
                    <div
                        v-for="i in 3"
                        :key="i"
                        class="categories__list"
                    >
                        <div class="categories__category-title">
                            map categories
                        </div>
                        <div class="categories__category-award">
                            grand award
                        </div>
                        <div class="categories__category-award">
                            grand award
                        </div>
                        <div class="categories__category-award">
                            grand award
                        </div>
                        <div class="categories__category-award">
                            grand award
                        </div>
                        <div class="categories__category-award">
                            grand award
                        </div>
                        <div class="categories__category-award">
                            grand award
                        </div>
                    </div>
                </div>
                    
                <div class="organizers">
                    <div class="organizers__title">
                        <small>ORGANIZED BY</small>
                    </div>
                    <div class="organizers__content">
                        person a, person b, person c, person d, person e
                    </div>
                </div>

                <div
                    class="mode-selection" 
                    :class="`mode-selection--${selectedMode}`"
                >
                    <nuxt-link
                        v-for="mode in modes"
                        :key="mode"                        
                        :to="`/${mode}`"
                        class="mode-selection__mode"
                        :class="[`mode-selection__mode--${mode}`, (selectedMode == mode) ? `mode-selection__mode--${mode}-selected` : '']"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import axios from "axios";
import Vue from "vue";

export default Vue.extend({
    validate ({ params }) {
        return !params.mode || /^(standard|taiko|fruits|mania|storyboard)$/.test(params.mode);
    },
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
            startDate: new Date("2020-05-01"),
            selectedMode: "",
            modes: ["standard", "taiko", "fruits", "mania", "storyboard"],
        };
    },
    computed: {
        remainingDays (): number {
            return Math.floor((+this.startDate - Date.now()) / (1000*60*60*24));
        },
    },
    mounted () {
        this.selectedMode = this.$route.params.mode || "standard";
        let days = 0;

        if (this.remainingDays > 31) {
            days = 32; // 31
        } else if (this.remainingDays <= 0) {
            days = 1; // 00
        } else {
            days = this.remainingDays + 1;
        }
        const wheel: HTMLElement | null = document.querySelector(".voting-date__wheel-img");

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

<style lang="scss">
$modes: "storyboard", "mania" , "fruits", "taiko", "standard";

.home {
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    flex: 1 1 auto;
    margin-bottom: 9%;
        
    @media (min-width: 1200px) {
        margin-bottom: 0px;
    }
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

.voting-date {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    margin-bottom: 40px;
    width: 100%;

    &__wheel-container {
        display: flex;
        width: 100%;
        position: relative;
    }

    &__wheel-img {
        width: 950px;
        height: 950px;
        background: url("../../CorsaceAssets/img/ayim-mca/wheel.png") no-repeat center;
        background-size: cover;
        left: -730px;
        top: -400px;
        position: absolute;
        z-index: -1;
    }

    &__wheel-box {
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

    &__content {
        display: flex;
        flex-direction: column;
        flex: 1 1 auto;
        flex-wrap: nowrap;
    }

    &__title {
        font-size: 2rem;
        border-bottom: 3px solid white;
        width: 100%;
        text-align: right;
    }

    &__subtitle {
        font-family: 'Lexend Peta';
        font-size: 4.5rem;
        text-align: right;
        letter-spacing: -8.96px;
    }
}

.general-info {
    border-radius: 0 15px 15px 0; 
    background-color: rgba(0, 0, 0, 0.8); 
    padding: 45px 30px;
}

.right-side {
    padding-left: 20px;
    flex: 0 0 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
}

.mode-title {
    font-family: 'Lexend Peta';
    font-size: 2rem;
    text-shadow: 0 0 4px white;
    margin: 5% 25px 10px auto;
}

@mixin mode-container {
    @each $mode in $modes {
        &--#{$mode} {
            border-top: 3px solid var(--#{$mode});

            &::before {
                border-left: 3px solid var(--#{$mode});
            }
        }
    }
}

%spaced-container {
    margin-bottom: 40px;
    display: flex;
    justify-content: space-around;
}

.mode-container {
    @include mode-container;

    border-top-left-radius: 25px;
    padding: 25px;
    position: relative;

    &::before {
        content: "";
        position: absolute;
        top: -2px;
        left: -3px;
        border-bottom-left-radius: 25px;
        border-top-left-radius: 25px;
        width: 100%;
        height: calc(100% - 45px);
        z-index: -1;
    }

    &__general {
        @extend %spaced-container;
        flex-wrap: wrap;

        @media (min-width: 1200px) {
            flex-wrap: nowrap;
        }
    }
}

.categories {
    @extend %spaced-container;

    &__category-title {
        border-bottom: 2px solid #fff;
        margin-bottom: 15px;
        font-weight: bold;
        font-size: 1.5rem;
    }

    &__category-award {
        margin-bottom: 8px;
    }
}

%half-box {
    border-radius: 15px; 
    background-color: rgba(0, 0, 0, 0.7); 
    padding: 5px 20px;
    display: flex;
    flex: 1 1 100%;
    
    @media (min-width: 1200px) {
        flex-wrap: nowrap;
        flex: 1 1 50%;
    }
}

.ranked-sets {
    @extend %half-box;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;

    &__divider {
        border-left: 0.7px solid white;
        width: 1px;
        height: 80%;
        margin-left: 10px;
        margin-right: 10px;
    }

    &__content {
        font-family: Scoreboard;
        font-size: 2.6rem
    }

    @media (min-width: 1200px) {
        margin-right: 10px;
        margin-bottom: 0px;
    }
}

@mixin mode-vote-color {
    @each $mode in $modes {
        &--#{$mode} {
            color: var(--#{$mode});
            background: linear-gradient(135deg,#222 0%, #222 20%, white 20%, white 22%, #222 22%, #222 24%, white 24%, white 26%, var(--#{$mode}) 26%, var(--#{$mode}) 28%, white 28%);
        }
    }
}

.vote-now {
    @extend %half-box;
    font-style: italic;
    font-size: 1.7rem;
    justify-content: flex-end;
    align-items: center;
    text-shadow: 1px 1px 3px #222;
    font-weight: 900;
    letter-spacing: 1.2px;
    background-color: white;

    span {
        margin-left: 15px
    }

    @include mode-vote-color;
    
    @media (min-width: 1200px) {
        margin-left: 10px;
    }
}

.organizers {
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;
    border-radius: 15px;
    background-color: rgba(0, 0, 0, 0.66); 
    padding: 8px;

    &__title {
        border-bottom: 1px solid white;
    }

    &__content {
        padding: 25px;
    }
}

@mixin mode-selection-border {
    @each $mode in $modes {
        $i: index($modes, $mode);

        &--#{$mode} {
            &::before {
                border-bottom: 3px solid var(--#{$mode});
                // - icon size + border margin - icon margin
                width: calc(100% - 45px * #{$i} + 28px - 15px * #{$i - 1});
            }
        }

        &__mode {
            &--#{$mode} {
                background-image: url("../../CorsaceAssets/img/ayim-mca/#{$mode}.png");

                &::before {
                    border-bottom: 3px solid var(--#{$mode});
                }
            }

            &--#{$mode}-selected {
                background-color: var(--#{$mode});
            }
        }
    }
}

.mode-selection {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    position: relative;
    @include mode-selection-border;

    &__mode {
        width: 45px;
        height: 45px;
        background-repeat: no-repeat;
        background-size: cover;
        border-radius: 100%;
        margin-left: 15px;
    }

    &::before {
        content: "";
        position: absolute;
        bottom: 50%;
        left: -28px;
        z-index: -1;
        border-bottom-left-radius: 25px;
        height: 100%;
    }

}

@media (min-width: 992px) {    
    .left-side, .right-side {
        flex: 0 0 50%;
        max-width: 50%;
    }
}

</style>