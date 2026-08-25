import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useForm } from "react-hook-form";
import { apiUrl, token } from "../../common/Config";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useState } from "react";
import { useEffect } from "react";

const UpdateOutcome = ({
  outcomeData,
  showOutcome,
  handleCloseOutcome,
  outcomes,
  setOutcomes,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, setError },
    reset,
  } = useForm();

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);

    const formData = { ...data, course_id: outcomeData.course_id };

    await fetch(`${apiUrl}/outcomes/${outcomeData.id}`, {
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
          const updatedOutcomes = outcomes.map((outcome) => {
            if (outcome.id === outcomeData.id) {
              return data.data;
            } else {
              return outcome;
            }
          });

          setOutcomes(updatedOutcomes);
          handleCloseOutcome();

          toast.success("Outcome added successfully");
          setLoading(false);
        } else {
          setError("outcome", { message: data.message });
          setLoading(false);
        }
      });
  };

  useEffect(() => {
    if (outcomeData) {
      reset({
        outcome: outcomeData.text,
      });
    }
  }, [outcomeData]);

  return (
    <>
      <Modal show={showOutcome} onHide={handleCloseOutcome}>
        <Modal.Header closeButton>
          <Modal.Title>Update Outcome</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <input
                {...register("outcome", { required: "Outcome is required" })}
                type="text"
                className={`form-control ${errors.outcome && "is-invalid"}`}
                placeholder="Enter outcome"
              />
              {errors.outcome && (
                <p className="invalid-feedback">Outcome is required</p>
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

export default UpdateOutcome;
