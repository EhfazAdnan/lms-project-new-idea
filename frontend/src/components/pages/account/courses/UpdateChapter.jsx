import React from "react";
import Modal from "react-bootstrap/Modal";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { apiUrl, token } from "../../common/Config";

const UpdateChapter = ({ chapterData, showChapter, handleCloseChapter, setChapters }) => {
    const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, setError },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);

    const formData = { ...data, course_id: chapterData.id };

    await fetch(`${apiUrl}/chapters/${chapterData.id}`, {
      method: "PUT",
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
          setChapters({ type: "UPDATE_CHAPTER", payload: data.data });
          toast.success("Chapter updated successfully");
          setLoading(false);
          handleCloseChapter();
        } else {
          setError("chapter", { message: data.message });
          setLoading(false);
        }
      });
  };

  useEffect(() => {
    if (chapterData) {
      reset({
        chapter: chapterData.title,
      });
    }
  }, [chapterData]);

  return (
    <>
      <Modal show={showChapter} onHide={handleCloseChapter}>
        <Modal.Header closeButton>
          <Modal.Title>Update Chapter</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
              {loading ? "Loading..." : "Update"}
            </button>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default UpdateChapter;
