const { createApp, ref } = Vue;

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