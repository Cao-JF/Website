const { createApp } = Vue;

createApp({
    data() {
        return {
            items: [],
            editingItem: null,
            showUploadForm: false,
            uploadForm: {
                title: '',
                credits: '',
                content: '',
                images: null
            }
        }
    },
    mounted() {
        this.loadItems();
    },
    methods: {
        async loadItems() {
            const response = await fetch('/api/content');
            this.items = await response.json();
        },
        handleUploadImage(event) {
            this.uploadForm.images = event.target.files;
        },
        async submitUpload() {
            const formData = new FormData();
            formData.append('title', this.uploadForm.title);
            formData.append('credits', this.uploadForm.credits);
            formData.append('content', this.uploadForm.content);

            if (this.uploadForm.images) {
                for (let file of this.uploadForm.images) {
                    formData.append('images', file);
                }
            }

            try {
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();
                if (result.success) {
                    alert('上傳成功！');
                    this.cancelUpload();
                    this.loadItems();
                } else {
                    alert('上傳失敗：' + result.error);
                }
            } catch (err) {
                alert('上傳錯誤');
            }
        },
        cancelUpload() {
            this.showUploadForm = false;
            this.uploadForm = {
                title: '',
                credits: '',
                content: '',
                images: null
            };
        },
        editItem(item) {
            this.editingItem = { ...item };
        },
        async saveEdit() {
            const formData = new FormData();
            formData.append('_id', this.editingItem._id);
            formData.append('title', this.editingItem.title);
            formData.append('credits', this.editingItem.credits);
            formData.append('content', this.editingItem.content);

            if (this.editingItem.newImages) {
                for (let file of this.editingItem.newImages) {
                    formData.append('images', file);
                }
            }

            await fetch('/api/update', {
                method: 'POST',
                body: formData
            });

            this.loadItems();
            this.cancelEdit();
        },
        async removeItem(id) {
            if (confirm('確定要刪除嗎？')) {
                await fetch(`/api/delete/${id}`, { method: 'DELETE' });
                this.loadItems();
            }
        },
        cancelEdit() {
            this.editingItem = null;
        },
        handleImageUpdate(event) {
            this.editingItem.newImages = event.target.files;
        }
    }
}).mount('#app');