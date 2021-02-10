<template>
    <div v-if="this.$store.state.currentUser.isLoggedIn">
        <modal name="note-modal" styles="padding: 10px;" height="auto" :adaptive="true">
            <p class="modal-note-text">{{ currentNote ? currentNote.text : '' }}</p>
            <div class="row">
                <div class="col">
                    <button class="btn btn-block btn-danger text-white" @click="deleteNote(currentNote.id); $modal.hide('note-modal')">DELETE</button>
                </div>
                <div class="col">
                    <button class="btn btn-block btn-secondary text-white" @click="$modal.hide('note-modal')">CLOSE</button>
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
                <p class="m-0 text-secondary">{{ note.text.length }} из 300</p>
            </div>
        </div>
        <div class="row mt-2">
            <div class="col-sm">
                <textarea maxlength="300" rows="7" class="form-control main-input" v-model="note.text"></textarea>
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
                <div v-for="(note, index) in filteredNotes" class="position-relative">
                    <p class="mb-1 small text-secondary" v-if="canShowTimeAgo(index, note)">
                        {{ note.created_at | timeAgo }}
                    </p>
                    <div class="alert p-1 note" :class="[getNoteStyle(note.priority)]" @click="selectNote(note.id)">
                        <span>{{ note.text | shortenText(85) }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import TimeAgo from 'javascript-time-ago'

    export default {
        data() {
            return {
                loading: false,
                notes: [],
                note: {
                    text: '',
                    priority: 0,
                },
                showSearchInput: false,
                searchText: '',
                currentNote: null,
                showCurrentNote: false,
                handledNote: null,
            };
        },
        filters: {
            shortenText: function (value, length) {
                if (!value) {
                    return '';
                }
                let concat = '';
                if (value.length > length) {
                    concat = '...';
                }
                return value.toString().slice(0, length).concat(concat);
            },
            timeAgo: function (value) {
                const timeAgo = new TimeAgo();
                return timeAgo.format(new Date(Date.parse(value)));
            },
        },
        computed: {
            filteredNotes: function () {
                return this.notes.filter(note => note.text.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1);
            },
        },
        created() {
            let that = this;
            this.$http.interceptors.response.use(null, function (error) {
                if (error.response.status === 401) {
                    that.$store.dispatch('currentUser/logoutUser');
                }

                return Promise.reject(error);
            });
            this.getNotes();
        },
        methods: {
            getNotes() {
                this.$http.get('/api/v1/notes')
                    .then(response => {
                        this.notes = response.data.data;
                    }).catch(error => {
                        alert('Error');
                    });
            },
            createNote() {
                this.loading = true;
                this.$http.post('/api/v1/notes', this.note)
                    .then(response => {
                        this.loading = false;
                        this.getNotes();
                        this.note.text = '';
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
                this.$http.delete('/api/v1/notes/' + id)
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
                this.$modal.show('note-modal')
            },
            canShowTimeAgo(index, note) {
                if (index === 0) {
                    return true;
                }
                const timeAgo = new TimeAgo();
                let previousNoteTimeAgo = timeAgo.format(new Date(Date.parse(this.notes[index - 1].created_at)))
                let noteTimeAgo = timeAgo.format(new Date(Date.parse(note.created_at)))

                return previousNoteTimeAgo !== noteTimeAgo;
            },
        },
    }
</script>
<style lang="scss">
    .add-button, .priority-button {
        font-size: 1.5rem;
        font-weight: bold;
    }
    .priority-button {
        height: 50px;
    }
    .main-input, .search-input {
        font-size: 1.1rem;
    }
    .note {
        cursor: pointer;
    }
    .modal-note-text {
        white-space: pre-line;
    }
</style>
