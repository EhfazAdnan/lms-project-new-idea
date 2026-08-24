<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    /**
     * Seed software engineering course categories.
     */
    public function run(): void
    {
        $now = now();

        foreach ([
            'Web Development',
            'Mobile App Development',
            'Data Science',
            'DevOps and Cloud Engineering',
            'Cybersecurity',
        ] as $name) {
            DB::table('categories')->updateOrInsert(
                ['name' => $name],
                ['status' => 1, 'created_at' => $now, 'updated_at' => $now],
            );
        }
    }
}