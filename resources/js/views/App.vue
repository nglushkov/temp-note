<template>
    <div class="container">
        <modal name="my-first-modal" styles="padding: 10px;" height="auto" :adaptive="true">
            <p>{{ currentNote ? currentNote.text : '' }}</p>
            <div class="row">
                <div class="col">
                    <button class="btn btn-block btn-danger text-white" @click="deleteNote(currentNote.id); $modal.hide('my-first-modal')">DELETE</button>
                </div>
                <div class="col">
                    <button class="btn btn-block btn-secondary text-white" @click="$modal.hide('my-first-modal')">CLOSE</button>
                </div>
            </div>
        </modal>

        <div class="row">
            <div class="col-sm">
                <h1 class="font-weight-bold mt-2 mb-0">TempNote</h1>
            </div>
        </div>
        <div class="row mt-2">
            <div class="col-4 pr-1">
                <button class="btn btn-block btn-secondary text-white p-3 priority-button" @click="note.priority = 0"></button>
            </div>
            <div class="col-4 pl-1 pr-1">
                <button class="btn btn-block btn-info text-white p-3 priority-button" @click="note.priority = 1"></button>
            </div>
            <div class="col-4 pl-1">
                <button class="btn btn-block btn-danger text-white p-3 priority-button" @click="note.priority = 2"></button>
            </div>
        </div>
        <div class="row mt-2">
            <div class="col-sm">
                <textarea maxlength="300" rows="7" class="form-control main-input" v-model="note.text" ref="text"></textarea>
            </div>
        </div>
        <div class="row">
            <div class="col-4 pr-0">
                <button class="btn btn-block mt-2 p-3 add-button btn-secondary" @click="toggleSearch()">FIND</button>
            </div>
            <div class="col-8">
                <button class="btn btn-block mt-2 p-3 add-button" :class="[getButtonStyle()]" :disabled="loading || !note.text" @click="createNote">ADD</button>
            </div>
        </div>
        <div class="row mt-2">
            <div class="col">
                <input type="search" class="form-control search-input" ref="search" :hidden="!showSearchInput" v-model="searchText">
            </div>
        </div>
        <div class="row">
            <div class="col-sm mt-2">
                <div v-for="note in filteredNotes" class="position-relative">
                    <div class="alert p-1" :class="[getNoteStyle(note.priority)]" @click="selectNote(note.id)">
                        <span>{{ note.text | cut }}</span>
                    </div>
                    <button type="button" class="close delete-note" @click="deleteNote(note.id)">
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
                    priority: 0,
                },
                showSearchInput: false,
                searchText: '',
                currentNote: null,
                showCurrentNote: false,
            };
        },
        filters: {
            cut: function (value) {
                if (!value) {
                    return '';
                }
                const length = 35;
                let concat = '';
                if (value.length > length) {
                    concat = '...';
                }
                return value.toString().slice(0, length).concat(concat);
            }
        },
        computed: {
            filteredNotes: function () {
                return this.notes.filter(note => note.text.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1);
            },
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
                    }).catch(error => {
                        alert('Error');
                        this.loading = false;
                    });
            },
            getButtonStyle() {
                switch (this.note.priority) {
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
            getNoteStyle(priority) {
                switch (priority) {
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
            toggleSearch() {
                this.showSearchInput = !this.showSearchInput;
                this.searchText = '';
                if (this.showSearchInput) {
                    window.scrollTo(70, document.body.scrollHeight);
                }
                setTimeout(() => {
                    this.$refs.search.focus();
                });
            },
            selectNote(id) {
                this.currentNote = this.notes.filter(note => note.id === id)[0];
                this.$modal.show('my-first-modal')
            },
        },
    }
</script>
<style lang="scss">
    .add-button, .priority-button {
        font-size: 1.5rem;
        font-weight: bold;
    }
    .delete-note {
        position: absolute;
        right: 5px;
        padding: 5px !important;
        top: 0;
    }
    .main-input, .search-input {
        font-size: 1.1rem;
    }
</style>
