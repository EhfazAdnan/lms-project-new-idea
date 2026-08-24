<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LevelSeeder extends Seeder
{
    /**
     * Seed progression levels for software engineering courses.
     */
    public function run(): void
    {
        $now = now();

        foreach ([
            'Beginner',
            'Intermediate',
            'Advanced',
            'Professional',
            'Expert',
        ] as $name) {
            DB::table('levels')->updateOrInsert(
                ['name' => $name],
                ['status' => 1, 'created_at' => $now, 'updated_at' => $now],
            );
        }
    }
}