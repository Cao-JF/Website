const { createApp, ref } = Vue;

var vueNews = createApp({
    data() {
        return{
            News:[]
        }
    }
}).mount(".news-section")

$.ajax({
    url:"/news",
    method: "get",
    dataType: "json",
    success: results=>{
        vueNews.News = results;
    }

})

