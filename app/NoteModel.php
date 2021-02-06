<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class NoteModel extends Model
{
    protected $table = 'notes';
    protected $fillable = ['text', 'style'];
}
