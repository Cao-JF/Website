const { createApp, ref } = Vue;

const vueNews = createApp({
    data() {
        return {
            News: []
        }
    },
    mounted() {
        this.getNews();
    },
    methods: {
        getNews() {
            $.ajax({
                url: "/api/news",
                method: "get",
                dataType: "json",
                success: results => {
                    this.News = results;
                },
                error: error => {
                    console.error('⚠︎ 未讀取到最新資訊:', error);
                }
            });
        }
    }
}).mount(".news-section");