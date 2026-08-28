import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { apiUrl, token } from "../../common/Config";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect } from "react";

const ManageChapter = ( { course, params } ) => {
  const {
    register,
    handleSubmit,
    formState: { errors, setError },
    reset,
  } = useForm();
  const [loading, setLoading] = useState(false);

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
          toast.success("Chapter added successfully");
          setLoading(false);
          reset();
        } else {
          setError("chapter", { message: data.message });
          setLoading(false);
        }
      });
  };

  return (
    <>
      <div className="card border-0 shadow-lg mt-4">
        <div className="card-body p-4">
          <div className="d-flex">
            <h4 className="h5 mb-3">Chapters</h4>
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
        </div>
      </div>
    </>
  );
};

export default ManageChapter;
