<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Requirement;

class RequirementController extends Controller
{
    // This method will return all requirements for a specific course
    public function index(Request $request) {
        $requirements = Requirement::where('course_id', $request->course_id)->get();
        return response()->json([
            'status' => 200,
            'message' => 'Requirements fetched successfully',
            'data' => $requirements
        ], 200);
    }

    // This method will store/save a requirement
    public function store(Request $request) {
        $validator = Validator::make($request->all(), [
            'requirement' => 'required',
            'course_id' => 'required|exists:courses,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $requirement = new Requirement();
        $requirement->course_id = $request->course_id;
        $requirement->text = $request->requirement;
        $requirement->sort_order = 1000;
        $requirement->save();

        return response()->json([
            'status' => 200,
            'message' => 'Requirement created successfully',
            'data' => $requirement
        ], 200);
    }

    // This method will update the requirement
    public function update(Request $request, $id) {
        $validator = Validator::make($request->all(), [
            'requirement' => 'required',
            'course_id' => 'required|exists:courses,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $requirement = Requirement::find($id);

        if ($requirement === null) {
            return response()->json([
                'status' => 404,
                'message' => 'Requirement not found'
            ], 404);
        }

        $requirement->text = $request->requirement;
        $requirement->save();

        return response()->json([
            'status' => 200,
            'message' => 'Requirement updated successfully',
            'data' => $requirement
        ], 200);
    }

    // This method will delete the requirement
    public function destroy($id) {
        $requirement = Requirement::find($id);

        if ($requirement === null) {
            return response()->json([
                'status' => 404,
                'message' => 'Requirement not found'
            ], 404);
        }

        $requirement->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Requirement deleted successfully'
        ], 200);
    }
}
