import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useForm } from "react-hook-form";
import { apiUrl, token } from "../../common/Config";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useState } from "react";
import { useEffect } from "react";

const UpdateRequirement = ( { showRequirement, requirementData, handleCloseRequirement, requirements, setRequirements } ) => {

    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors, setError }, reset } = useForm();

    const onSubmit = async (data) => {
        setLoading(true);

        const formData = { ...data, course_id: requirementData.course_id };

        await fetch(`${apiUrl}/requirements/${requirementData.id}`, {
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
                    const updatedRequirements = requirements.map((requirement) => {
                        if (requirement.id === requirementData.id) {
                            return data.data;
                        } else {
                            return requirement;
                        }
                    });

                    setRequirements(updatedRequirements);
                    handleCloseRequirement();

                    toast.success("Requirement added successfully");
                    setLoading(false);
                } else {
                    setError("requirement", { message: data.message });
                    setLoading(false);
                }
            });
    };

    useEffect(() => {
        if (requirementData) {
            reset({
                requirement: requirementData.text,
            });
        }
    }, [requirementData]);

  return (
    <>
      <Modal show={showRequirement} onHide={handleCloseRequirement}>
        <Modal.Header closeButton>
          <Modal.Title>Update Requirement</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <input
                {...register("requirement", { required: "Requirement is required" })}
                type="text"
                className={`form-control ${errors.requirement && "is-invalid"}`}
                placeholder="Enter requirement"
              />
              {errors.requirement && (
                <p className="invalid-feedback">Requirement is required</p>
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

export default UpdateRequirement;
