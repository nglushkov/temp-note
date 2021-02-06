<template>
    <div class="container">
        <div class="row">
            <div class="col-sm">
                <h1 class="font-weight-bold mt-2 mb-0">TempNote</h1>
            </div>
        </div>
        <div class="row mt-2">
            <div class="col-4 pr-1">
                <button class="btn btn-block btn-secondary text-white p-3 color-button" @click="note.style = 0"></button>
            </div>
            <div class="col-4 pl-1 pr-1">
                <button class="btn btn-block btn-info text-white p-3 color-button" @click="note.style = 1"></button>
            </div>
            <div class="col-4 pl-1">
                <button class="btn btn-block btn-danger text-white p-3 color-button" @click="note.style = 2"></button>
            </div>
        </div>
        <div class="row mt-2">
            <div class="col-sm">
                <textarea rows="7" class="form-control main-input" v-model="note.text" ref="text"></textarea>
            </div>
        </div>
        <div class="row">
            <div class="col-sm">
                <button class="btn btn-block mt-2 p-3 add-button" :class="[getButtonStyle()]" :disabled="loading || !note.text" @click="createNote">ADD</button>
            </div>
        </div>
        <div class="row">
            <div class="col-sm mt-2">
                <div class="alert p-1" :class="[getNoteStyle(note.style)]" v-for="note in notes">
                    <span>{{ note.text }}</span>
                    <button type="button" class="close" @click="deleteNote(note.id)">
                        <span>&times;</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                loading: false,
                notes: [],
                note: {
                    text: null,
                    style: null,
                }
            };
        },
        mounted() {
            this.focusText();
        },
        created() {
            this.getNotes();
        },
        methods: {
            focusText() {
                this.$refs.text.focus();
            },
            getNotes() {
                axios.get('/notes')
                    .then(response => {
                        this.notes = response.data.data;

                    }).catch(error => {
                        alert('Error');
                    });
            },
            createNote() {
                this.loading = true;
                axios.post('/notes', this.note)
                    .then(response => {
                        this.loading = false;
                        this.getNotes();
                        this.note.text = '';
                        this.focusText();
                    }).catch(error => {
                        alert('Error');
                        this.loading = false;
                    });
            },
            deleteNote(id) {
                if (this.loading) {
                    return;
                }
                this.loading = true;
                axios.delete('/notes/' + id)
                    .then(response => {
                        this.loading = false;
                        this.notes = this.notes.filter(note => note.id !== id);
                        // this.getNotes();
                    }).catch(error => {
                        alert('Error');
                        this.loading = false;
                    });
            },
            getButtonStyle() {
                switch (this.note.style) {
                    case null:
                        return 'btn-secondary';
                    case 0:
                        return 'btn-secondary';
                    case 1:
                        return 'btn-info';
                    case 2:
                        return 'btn-danger';
                }
            },
            getNoteStyle(style) {
                switch (style) {
                    case null:
                        return 'alert-secondary';
                    case 0:
                        return 'alert-secondary';
                    case 1:
                        return 'alert-info';
                    case 2:
                        return 'alert-danger';
                }
            },
        },
    }
</script>
<style lang="scss">
    .add-button, .color-button {
        font-size: 1.5rem;
        font-weight: bold;
    }
    .main-input {
        font-size: 1.1rem;
    }
</style>
