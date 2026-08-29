import React from "react";
import Modal from "react-bootstrap/Modal";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { apiUrl, token } from "../../common/Config";

const CreateLesson = ( { showLessonModel, handleCloseLessonModel, course } ) => {
    const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, setError },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);

    const formData = { ...data, course_id: course.id };

    await fetch(`${apiUrl}/lessons`, {
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
          toast.success("Lesson added successfully");
          setLoading(false);
          handleCloseLessonModel();
        } else {
          setError("Lesson", { message: data.message });
          setLoading(false);
        }
      });
  };

  return (
    <>
      <Modal show={showLessonModel} onHide={handleCloseLessonModel}>
        <Modal.Header closeButton>
          <Modal.Title>Create Lesson</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label htmlFor="chapter" className="form-label">Chapter</label>
              <select
              {
                ...register("chapter", { required: "Chapter is required" })
              }
              className={`form-select ${errors.chapter && "is-invalid"}`}>
                <option value="">Select Chapter</option>
                {course.chapters.map((chapter) => (
                  <option key={chapter.id} value={chapter.id}>
                    {chapter.title}
                  </option>
                ))}
              </select>
              {errors.chapter && (
                <p className="invalid-feedback">Chapter is required</p>
              )}
            </div>
            <div className="mb-3">
                <label htmlFor="lesson" className="form-label">Lesson</label>
              <input
                {...register("lesson", { required: "Lesson is required" })}
                type="text"
                className={`form-control ${errors.lesson && "is-invalid"}`}
                placeholder="Enter lesson"
              />
              {errors.lesson && (
                <p className="invalid-feedback">Lesson is required</p>
              )}
            </div>
            <div className="mb-3">
                <label htmlFor="status" className="form-label">Status</label>
                <select 
                {
                    ...register("status", { required: "Status is required" })
                  }
                  className={`form-select ${errors.status && "is-invalid"}`}>
                  <option value="">Select Status</option>
                  <option value="1" selected>Active</option>
                  <option value="0">Block</option>
                </select>
                {errors.status && (
                  <p className="invalid-feedback">Status is required</p>
                )}
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Loading..." : "Update"}
            </button>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CreateLesson;
