const { createApp, ref } = Vue;

// var myService = createApp({
//     data() {
//         return {
//             Services: [
//                 { icon: "fa-shopping-cart", heading: "E-Commerce", text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima maxime quam architecto quo inventore harum ex magni, dicta impedit." },
//                 { icon: "fa-laptop", heading: "Responsive Design", text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima maxime quam architecto quo inventore harum ex magni, dicta impedit." },
//                 { icon: "fa-lock", heading: "Web Security", text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima maxime quam architecto quo inventore harum ex magni, dicta impedit." },
//                 { icon: "fa-lock", heading: "DFSDFSDFDSDF", text: "SDASDFGVFGDFGDF" }
//             ]
//         }
//     }
// }).mount("#services1");

// myService.Services.push({icon: "fa-lock", heading:"Web Security", text:"asdf adf adf"})

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

const app = createApp({
    data() {
        return {
            projects: [],
            selectedProject: null
        }
    },
    methods: {
        async fetchProjects() {
            try {
                const response = await fetch('/api/projects');
                this.projects = await response.json();
            } catch (error) {
                console.error('Error:', error);
            }
        },
        async showProject(id) {
            try {
                const response = await fetch(`/api/projects/${id}`);
                this.selectedProject = await response.json();
                this.$nextTick(() => {
                    new bootstrap.Carousel(document.getElementById('projectCarousel'));
                });
            } catch (error) {
                console.error('Error:', error);
            }
        }
    },
    mounted() {
        this.fetchProjects();
        
        const projectModal = document.getElementById('projectModal');
        projectModal.addEventListener('hidden.bs.modal', () => {
            this.selectedProject = null;
        });
    }
}).mount('.projects');