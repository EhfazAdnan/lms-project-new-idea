<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Course;
use App\Models\Category;
use App\Models\Level;
use App\Models\Language;
use Illuminate\Support\Facades\File;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

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

    public function saveCourseImage(Request $request, $id){
        $course = Course::find($id);

        if ($course === null) {
            return response()->json([
                'status' => 404,
                'message' => 'Course not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'image' => 'required|mimes:jpg,jpeg,png,gif,svg|max:1024',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        if ($course->image !== "") {
            if (File::exists(public_path('uploads/courses/'.$course->image))) {
                File::delete(public_path('uploads/courses/'.$course->image));
            }
            if (File::exists(public_path('uploads/courses/small/'.$course->image))) {
                File::delete(public_path('uploads/courses/small/'.$course->image));
            }

        }

        $image = $request->image;
        $ext = $image->getClientOriginalExtension();
        $imageName = strtotime('now').'-'.$id.'.'.$ext;
        $image->move(public_path('uploads/courses'), $imageName);

        // Create small thubmnail
        $manager = new ImageManager(Driver::class);
        $img = $manager->read(public_path('uploads/courses/'.$imageName));

        // Crop the image
        $img->cover(750, 450);
        $img->save(public_path('uploads/courses/small/'.$imageName));

        $course->image = $imageName;
        $course->save();

        return response()->json([
            'status' => 200,
            'message' => 'Course image updated successfully',
            'data' => $course
        ], 200);
    }

}

// Product & Category Management
// Order Management
// Stock / Inventory Management
// Customer Management
// Courier API Integration
// Payment Gateway Integration
// Invoice & Label Printing
// Facebook/Meta Pixel & Conversion API
// Admin Dashboard & Reporting
// Website Speed & Database Optimization
