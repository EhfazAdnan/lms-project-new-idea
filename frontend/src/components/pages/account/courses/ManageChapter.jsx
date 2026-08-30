import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { apiUrl, token } from "../../common/Config";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect } from "react";
import Accordion from "react-bootstrap/Accordion";
import { useReducer } from "react";
import UpdateChapter from "./UpdateChapter";
import CreateLesson from "./CreateLesson";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { BsPencilSquare } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";

const ManageChapter = ({ course, params }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, setError },
    reset,
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [chapterData, setChapterData] = useState(null);

  // update chapter modal
  const [showChapter, setShowChapter] = useState(false);
  const handleCloseChapter = () => setShowChapter(false);
  const handleShowChapter = (chapter) => {
    setShowChapter(true);
    setChapterData(chapter);
  };

  // create lesson modal
  const [showLessonModel, setShowLessonModel] = useState(false);
  const handleCloseLessonModel = () => setShowLessonModel(false);
  const handleShowLessonModel = () => {
    setShowLessonModel(true);
  };

  const chaptersReducer = (state, action) => {
    switch (action.type) {
      case "SET_CHAPTERS":
        return action.payload;
      case "ADD_CHAPTER":
        return [...state, action.payload];
      case "UPDATE_CHAPTER":
        return state.map((chapter) =>
          chapter.id === action.payload.id ? action.payload : chapter,
        );
      case "DELETE_CHAPTER":
        return state.filter((chapter) => chapter.id !== action.payload);
      default:
        return state;
    }
  };
  const [chapters, setChapters] = useReducer(chaptersReducer, []);

  const onSubmit = async (data) => {
    setLoading(true);

    const formData = { ...data, course_id: params.id };

    await fetch(`${apiUrl}/chapters`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          setChapters({ type: "ADD_CHAPTER", payload: data.data });
          toast.success("Chapter added successfully");
          setLoading(false);
          reset();
        } else {
          setError("chapter", { message: data.message });
          setLoading(false);
        }
      });
  };

  const onDeleteChapter = async (id) => {
    if (!window.confirm("Are you sure you want to delete this chapter?")) {
      return;
    }
    setLoading(true);

    await fetch(`${apiUrl}/chapters/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          setChapters({ type: "DELETE_CHAPTER", payload: id });
          toast.success("Chapter deleted successfully");
          setLoading(false);
        } else {
          setError("chapter", { message: data.message });
          setLoading(false);
        }
      });
  };

  useEffect(() => {
    if (course.chapters) {
      setChapters({ type: "SET_CHAPTERS", payload: course.chapters });
    }
  }, [course]);

  return (
    <>
      <div className="card border-0 shadow-lg mt-4">
        <div className="card-body p-4">
          <div className="d-flex">
            <div className="d-flex justify-content-between w-100">
              <h4 className="h5 mb-3">Chapters</h4>
              <Link onClick={handleShowLessonModel}>
                <FaPlus size={12} /> Add Lesson
              </Link>
            </div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <input
                {...register("chapter", { required: "Chapter is required" })}
                type="text"
                className={`form-control ${errors.chapter && "is-invalid"}`}
                placeholder="Enter chapter"
              />
              {errors.chapter && (
                <p className="invalid-feedback">Chapter is required</p>
              )}
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Loading..." : "Add"}
            </button>
          </form>

          <Accordion className="mt-3">
            {chapters.map((chapter, index) => (
              <Accordion.Item eventKey={index} key={index}>
                <Accordion.Header>{chapter.title}</Accordion.Header>
                <Accordion.Body>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="d-flex justify-content-between">
                        <h4 className="h5 mb-3">Lessons</h4>
                        <a className="h6" href="" data-discover="true">
                          <strong>Reorder Lessons</strong>
                        </a>
                      </div>
                      {chapter.lessons &&
                        chapter.lessons.map((lesson, index) => {
                          return <div className="card shadow-sm px-3 py-2 mb-2">
                            <div className="row">
                              <div className="col-md-7">
                                {lesson.title}
                              </div>
                              <div className="col-md-5 text-end">
                                {
                                  lesson.duration && <small className="fw-bold text-muted me-2">20 Mins</small>
                                }
                                {
                                  lesson.is_free_preview == "yes" && <span className="badge bg-success">Preview</span>
                                }
                                <Link className="ms-2"><BsPencilSquare size={12} /></Link>
                                <Link className="ms-2 text-danger"><FaTrashAlt size={12} /></Link>
                              </div>
                            </div>
                          </div>
                        })}
                    </div>
                    <div className="col-md-12 mt-2">
                      <div className="d-flex">
                        <button
                          onClick={() => onDeleteChapter(chapter.id)}
                          className="btn btn-danger btn-sm"
                        >
                          Delete Chapter
                        </button>
                        <button
                          onClick={() => handleShowChapter(chapter)}
                          className="btn btn-primary btn-sm ms-2"
                        >
                          Update Chapter
                        </button>
                      </div>
                    </div>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </div>
      </div>
      <UpdateChapter
        chapterData={chapterData}
        showChapter={showChapter}
        handleCloseChapter={handleCloseChapter}
        setChapters={setChapters}
      />

      <CreateLesson
        showLessonModel={showLessonModel}
        handleCloseLessonModel={handleCloseLessonModel}
        course={course}
      />
    </>
  );
};

export default ManageChapter;
