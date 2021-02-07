<?php

namespace App\Http\Controllers;

use App\Http\Resources\Note;
use App\Http\Resources\NoteCollection;
use App\NoteModel;
use Illuminate\Http\Request;

class NoteController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $query = NoteModel::orderByDesc('created_at');
        if ($request->get('search')) {
            $query->where('text', 'LIKE', '%' . $request->get('search') . '%');
        }
        return new NoteCollection($query->get());
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    public function store(Request $request)
    {
        $note = NoteModel::create($request->all());
        return new Note($note);
    }

    public function show(NoteModel $note)
    {
        return new Note($note);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\NoteModel  $note
     * @return \Illuminate\Http\Response
     */
    public function edit(NoteModel $note)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\NoteModel  $note
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, NoteModel $note)
    {
        //
    }

    public function destroy(NoteModel $note)
    {
        $note->delete();
    }
}
