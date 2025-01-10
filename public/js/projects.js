const app = Vue.createApp({
    data() {
        return {
            projects: [],
            selectedProject: null
        }
    },
    methods: {
        async showProject(id) {
            try {
                const response = await fetch(`/api/projects/${id}`);
                this.selectedProject = await response.json();
            } catch (error) {
                console.error('⚠︎ 抓取失敗: ', error);
            }
        }
    },
    async mounted() {
        try {
            const response = await fetch('/api/projects');
            this.projects = await response.json();
        } catch (error) {
            console.error('⚠︎ 抓取失敗: ', error);
        }
    }
}).mount('.projects');