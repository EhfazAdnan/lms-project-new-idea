<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Outcome;

class OutcomeController extends Controller
{
    // This method will return all outcomes for a specific course
    public function index(Request $request) {
        $outcomes = Outcome::where('course_id', $request->course_id)->orderBy('sort_order', 'asc')->get();
        return response()->json([
            'status' => 200,
            'message' => 'Outcomes fetched successfully',
            'data' => $outcomes
        ], 200);
    }

    // This method will store/save a outcome in database as a draft
    public function store(Request $request) {
        $validator = Validator::make($request->all(), [
            'outcome' => 'required',
            'course_id' => 'required|exists:courses,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $outcome = new Outcome();
        $outcome->course_id = $request->course_id;
        $outcome->text = $request->outcome;
        $outcome->sort_order = 1000;
        $outcome->save();

        return response()->json([
            'status' => 200,
            'message' => 'Outcome created successfully',
            'data' => $outcome
        ], 200);
    }

    // This method will update the outcome
    public function update(Request $request, $id) {
        $validator = Validator::make($request->all(), [
            'outcome' => 'required',
            'course_id' => 'required|exists:courses,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $outcome = Outcome::find($id);

        if ($outcome === null) {
            return response()->json([
                'status' => 404,
                'message' => 'Outcome not found'
            ], 404);
        }

        $outcome->text = $request->outcome;
        $outcome->save();

        return response()->json([
            'status' => 200,
            'message' => 'Outcome updated successfully',
            'data' => $outcome
        ], 200);
    }

    // This method will delete the outcome
    public function destroy($id) {
        $outcome = Outcome::find($id);

        if ($outcome === null) {
            return response()->json([
                'status' => 404,
                'message' => 'Outcome not found'
            ], 404);
        }

        $outcome->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Outcome deleted successfully'
        ], 200);
    }

    public function sortOutcomes(Request $request) {
        if (!empty($request->outcomes)) {
            foreach ($request->outcomes as $key => $outcome) {
                Outcome::where('id', $outcome['id'])->update([
                    'sort_order' => $key
                ]);
            }
        }

        return response()->json([
            'status' => 200,
            'message' => 'Outcomes sorted successfully'
        ], 200);
    }
}
