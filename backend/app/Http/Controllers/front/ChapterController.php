<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Chapter;
use Illuminate\Support\Facades\Validator;

class ChapterController extends Controller
{
    // This method will return all chapters for a specific course
    public function index(Request $request)
    {
        $chapters = Chapter::where('course_id', $request->course_id)->orderBy('sort_order', 'asc')->get();
        return response()->json([
            'status' => 200,
            'data' => $chapters,
        ]);
    }

    // This method will store/save a chapter
    public function store(Request $request){
        $validator = Validator::make($request->all(), [
            'chapter' => 'required|string|max:255',
            'course_id' => 'required|exists:courses,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $chapter = new Chapter();
        $chapter->title = $request->input('chapter');
        $chapter->course_id = $request->input('course_id');
        $chapter->sort_order = 1000;
        $chapter->save();

        return response()->json([
            'status' => 200,
            'message' => 'Chapter saved successfully',
            'data' => $chapter
        ], 200);
    }

    // This method will update a chapter
    public function update(Request $request, $id)
    {
        $chapter = Chapter::find($id);

        if ($chapter === null) {
            return response()->json([
                'status' => 404,
                'message' => 'Chapter not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'chapter' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $chapter->title = $request->input('chapter');
        $chapter->save();

        return response()->json([
            'status' => 200,
            'message' => 'Chapter updated successfully',
            'data' => $chapter
        ], 200);
    }

    // This method will delete a chapter
    public function destroy($id)
    {
        $chapter = Chapter::find($id);

        if ($chapter === null) {
            return response()->json([
                'status' => 404,
                'message' => 'Chapter not found'
            ], 404);
        }

        $chapter->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Chapter deleted successfully'
        ], 200);
    }

    // This method will sort chapters
    public function sortChapters(Request $request) {
        if (!empty($request->chapters)) {
            foreach ($request->chapters as $key => $chapter) {
                Chapter::where('id', $chapter['id'])->update(['sort_order' => $key]);
            }
        }

        return response()->json([
            'status' => 200,
            'message' => 'Chapters sorted successfully'
        ], 200);
    }
}
