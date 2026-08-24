<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Course;
use App\Models\Category;
use App\Models\Level;
use App\Models\Language;

class CourseController extends Controller
{
    // This method will return all course for a specific user
    public function index() {}

    // This method will store/save a course in database as a draft
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        // Assuming you have a Course model
        $course = new Course();
        $course->title = $request->input('title');
        $course->status = 0; // Set status to draft
        $course->user_id = $request->user()->id;
        $course->save();

        return response()->json([
            'status' => 200,
            'message' => 'Course saved as draft successfully',
            'data' => $course
        ], 200);
    }

    public function show($id)
    {
        $course = Course::find($id);

        if ($course === null) {
            return response()->json([
                'status' => 404,
                'message' => 'Course not found'
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'message' => 'Course fetched successfully',
            'data' => $course
        ], 200);
    }

    // This methd will return categories/levels/languages
    public function metaData()
    {
        $categories = Category::all();
        $levels = Level::all();
        $languages = Language::all();

        return response()->json([
            'status' => 200,
            'message' => 'Meta data fetched successfully',
            'data' => [
                'categories' => $categories,
                'levels' => $levels,
                'languages' => $languages
            ]
        ], 200);
    }

    // This method will update the course
    public function update(Request $request, $id)
    {
        $course = Course::find($id);

        if ($course === null) {
            return response()->json([
                'status' => 404,
                'message' => 'Course not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'category' => 'required|exists:categories,id',
            'level' => 'required|exists:levels,id',
            'language' => 'required|exists:languages,id',
            'description' => 'required|string|max:255',
            'sell_price' => 'required|numeric',
            'cross_price' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $course->title = $request->input('title');
        $course->category_id = $request->input('category');
        $course->level_id = $request->input('level');
        $course->language_id = $request->input('language');
        $course->description = $request->input('description');
        $course->price = $request->input('sell_price');
        $course->cross_price = $request->input('cross_price');
        $course->save();

        return response()->json([
            'status' => 200,
            'message' => 'Course updated successfully',
            'data' => $course
        ], 200);
    }

}
