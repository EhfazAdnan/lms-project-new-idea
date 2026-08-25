import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { apiUrl, token } from "../../common/Config";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { MdDragIndicator } from "react-icons/md";
import { BsPencilSquare } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import UpdateRequirement from "./UpdateRequirement";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const ManageRequirement = () => {
  const [loading, setLoading] = useState(false);
  const [requirements, setRequirements] = useState([]);
  const [requirementData, setRequirementData] = useState({});
  const {
    register,
    handleSubmit,
    formState: { errors, setError },
    reset,
  } = useForm();
  const params = useParams();

  const [showRequirement, setShowRequirement] = useState(false);
  const handleCloseRequirement = () => setShowRequirement(false);
  const handleShowRequirement = (requirement) => {
    setShowRequirement(true);
    setRequirementData(requirement);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const reorderedItems = Array.from(requirements);
    const [movedItem] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, movedItem);

    setRequirements(reorderedItems);
    saveOrder(reorderedItems);
  };

  const saveOrder = async (updatedRequirements) => {
    await fetch(`${apiUrl}/sort-requirements`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ requirements: updatedRequirements }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          toast.success("Requirements sorted successfully");
        } else {
          toast.error("Failed to sort requirements");
        }
      });
  };

  const onSubmit = async (data) => {
    setLoading(true);

    const formData = { ...data, course_id: params.id };

    await fetch(`${apiUrl}/requirements`, {
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
          setRequirements([...requirements, data.data]);
          setLoading(false);
          reset();
          toast.success("Requirement added successfully");
        } else {
          setError("requirement", { message: data.message });
          setLoading(false);
        }
      });
  };

  const fetchRequirements = async () => {
    await fetch(`${apiUrl}/requirements?course_id=${params.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          setRequirements(data.data);
        } else {
          toast.error("Failed to load requirements");
        }
      });
  };

  useEffect(() => {
    fetchRequirements();
  }, []);
  
  const handleDeleteRequirement = (id) => {
    // confirmation dialog
    if (confirm("Are you sure you want to delete this requirement?")) {
      deleteRequirement(id);
    }
  };

  const deleteRequirement = async (id) => {
    fetch(`${apiUrl}/requirements/${id}`, {
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
          setRequirements(requirements.filter((requirement) => requirement.id !== id));
          toast.success("Requirement deleted successfully");
        } else {
          toast.error("Failed to delete requirement");
        }
      });
  }

  return (
    <>
      <div className="card border-0 shadow-lg mt-4">
        <div className="card-body p-4">
          <div className="d-flex">
            <h4 className="h5 mb-3">Requirement</h4>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <input
                {...register("requirement", {
                  required: "Requirement is required",
                })}
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
              {loading ? "Loading..." : "Add"}
            </button>
          </form>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="list">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  {requirements.map((requirement, index) => (
                    <Draggable
                      key={requirement.id}
                      draggableId={`${requirement.id}`}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="mt-2 border px-3 py-2 bg-white shadow-lg  rounded"
                        >
                          <div className="card-body p-2 d-flex">
                            <div>
                              <MdDragIndicator className="text-primary" />
                            </div>
                            <div className="d-flex justify-content-between w-100">
                              <div>{requirement.text}</div>
                              <div className="d-flex">
                                <Link
                                  onClick={() => handleShowRequirement(requirement)}
                                >
                                  <BsPencilSquare className="text-primary me-2" />
                                </Link>
                                <Link
                                  onClick={() =>
                                    handleDeleteRequirement(requirement.id)
                                  }
                                >
                                  <FaTrashAlt className="text-danger" />
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>

      {/* Modal */}
      <UpdateRequirement
        showRequirement={showRequirement}
        requirementData={requirementData}
        handleCloseRequirement={handleCloseRequirement}
        requirements={requirements}
        setRequirements={setRequirements}
      />
    </>
  );
};

export default ManageRequirement;
