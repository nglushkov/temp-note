<template>
    <div class="container">
        <div class="row">
            <div class="col-sm">Colors</div>
        </div>
        <div class="row">
            <div class="col-sm">
                <textarea rows="10" class="form-control" v-model="note.text" ref="text"></textarea>
            </div>
        </div>
        <div class="row">
            <div class="col-sm">
                <button class="btn btn-block btn-success mt-2 p-3 add-button" :disabled="loading || !note.text" @click="createNote">ADD</button>
            </div>
        </div>
        <div class="row">
            <div class="col-sm mt-2">
                <div class="alert alert-secondary p-1" v-for="note in notes">
                    <strong>{{ note.id }}</strong>&nbsp;<span>{{ note.text }}</span>
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
                        alert('Erasror');
                        this.loading = false;
                    });
            },
        },
    }
</script>
