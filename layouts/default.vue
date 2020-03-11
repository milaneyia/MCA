<template>
    <div>
        <headerComponent />
        <nuxt 
            :user="user" 
            :eligible="eligible"
        />
        <footerComponent />
    </div>
</template>

<script>
import axios from "axios";

import header from "../components/header";
import footer from "../components/footer";

export default {
    components: {
        "headerComponent": header,
        "footerComponent": footer,
    },
    data () {
        return {
            user: null,
            eligible: false,
        };
    },
    mounted: async function() {
        try {
            const data = (await axios.get(`/api/user`)).data;

            if (data.error) {
                alert(data.error);
            } else {
                this.user = data.user;
                for (const eligibility of this.user.mca) {
                    if (eligibility.year === (new Date).getUTCFullYear) {
                        this.eligible = true;
                    }
                }
            }
        } catch (err) {
            console.error(err);
        }
    },
};
</script>