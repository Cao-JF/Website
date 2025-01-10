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
                console.error('Error fetching project:', error);
            }
        }
    },
    async mounted() {
        try {
            const response = await fetch('/api/projects');
            this.projects = await response.json();
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    }
}).mount('.projects');