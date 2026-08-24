<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LanguageSeeder extends Seeder
{
    /**
     * Seed programming languages used in software engineering courses.
     */
    public function run(): void
    {
        $now = now();

        foreach ([
            'PHP',
            'JavaScript',
            'Python',
            'Java',
            'C#',
        ] as $name) {
            DB::table('languages')->updateOrInsert(
                ['name' => $name],
                ['status' => 1, 'created_at' => $now, 'updated_at' => $now],
            );
        }
    }
}