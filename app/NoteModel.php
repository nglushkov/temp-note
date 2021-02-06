<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class NoteModel extends Model
{
    protected string $table = 'notes';
    protected array $fillable = ['text'];
}
