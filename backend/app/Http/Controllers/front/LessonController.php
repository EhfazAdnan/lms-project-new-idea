<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Lesson;

class LessonController extends Controller
{
    // This method will store/save a lesson
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'chapter' => 'required|exists:chapters,id',
            'lesson' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        // Assuming you have a Lesson model
        $lesson = new Lesson();
        $lesson->chapter_id = $request->input('chapter');
        $lesson->title = $request->input('lesson');
        $lesson->sort_order = 1000;
        $lesson->status = $request->input('status');
        $lesson->save();

        return response()->json([
            'status' => 200,
            'message' => 'Lesson saved successfully',
            'data' => $lesson
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $lesson = Lesson::find($id);

        if ($lesson === null) {
            return response()->json([
                'status' => 404,
                'message' => 'Lesson not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'lesson' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $lesson->title = $request->input('lesson');
        $lesson->chapter_id = $request->input('chapter');
        $lesson->is_free_preview = ($request->input('free_preview') == false) ? 'no' : 'yes';
        $lesson->duration = $request->input('duration');
        $lesson->description = $request->input('description');
        $lesson->status = $request->input('status');
        $lesson->save();

        return response()->json([
            'status' => 200,
            'message' => 'Lesson updated successfully',
            'data' => $lesson
        ], 200);
    }

    public function destroy($id)
    {
        $lesson = Lesson::find($id);

        if ($lesson === null) {
            return response()->json([
                'status' => 404,
                'message' => 'Lesson not found'
            ], 404);
        }

        $lesson->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Lesson deleted successfully'
        ], 200);
    }
}
