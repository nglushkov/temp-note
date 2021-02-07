<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\NoteModel;
use Faker\Generator as Faker;

$factory->define(NoteModel::class, function (Faker $faker) {
    return [
        'text' => $faker->text(50),
        'priority' => 0,
        'created_at' => $faker->dateTimeBetween('-2 month'),
    ];
});
