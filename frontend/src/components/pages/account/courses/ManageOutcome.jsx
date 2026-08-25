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
import UpdateOutcome from "./UpdateOutcome";
import { Link } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const ManageOutcome = () => {
  const [loading, setLoading] = useState(false);
  const [outcomes, setOutcomes] = useState([]);
  const [outcomeData, setOutcomeData] = useState({});
  const {
    register,
    handleSubmit,
    formState: { errors, setError },
    reset,
  } = useForm();
  const params = useParams();

  const [showOutcome, setShowOutcome] = useState(false);
  const handleCloseOutcome = () => setShowOutcome(false);
  const handleShowOutcome = (outcome) => {
    setShowOutcome(true);
    setOutcomeData(outcome);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const reorderedItems = Array.from(outcomes);
    const [movedItem] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, movedItem);

    setOutcomes(reorderedItems);
    saveOrder(reorderedItems);
  };

  const saveOrder = async (updatedOutcomes) => {
    await fetch(`${apiUrl}/sort-outcomes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ outcomes: updatedOutcomes }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          toast.success("Outcomes sorted successfully");
        } else {
          toast.error("Failed to sort outcomes");
        }
      });
    
  };

  const onSubmit = async (data) => {
    setLoading(true);

    const formData = { ...data, course_id: params.id };

    await fetch(`${apiUrl}/outcomes`, {
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
          setOutcomes([...outcomes, data.data]);
          setLoading(false);
          reset();
          toast.success("Outcome added successfully");
        } else {
          setError("outcome", { message: data.message });
          setLoading(false);
        }
      });
  };

  const fetchOutcomes = async () => {
    await fetch(`${apiUrl}/outcomes?course_id=${params.id}`, {
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
          setOutcomes(data.data);
        } else {
          toast.error("Failed to load outcomes");
        }
      });
  };

  useEffect(() => {
    fetchOutcomes();
  }, []);

  const handleDeleteOutcome = (id) => {
    // confirmation dialog
    if (confirm("Are you sure you want to delete this outcome?")) {
      deleteOutcome(id);
    }
  };

  const deleteOutcome = async (id) => {
    fetch(`${apiUrl}/outcomes/${id}`, {
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
          setOutcomes(outcomes.filter((outcome) => outcome.id !== id));
          toast.success("Outcome deleted successfully");
        } else {
          toast.error("Failed to delete outcome");
        }
      });
  };

  return (
    <>
      <div className="card border-0 shadow-lg">
        <div className="card-body p-4">
          <div className="d-flex">
            <h4 className="h5 mb-3">Outcome</h4>
          </div>
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
                  {outcomes.map((outcome, index) => (
                    <Draggable
                      key={outcome.id}
                      draggableId={`${outcome.id}`}
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
                              <div>{outcome.text}</div>
                              <div className="d-flex">
                                <Link
                                  onClick={() => handleShowOutcome(outcome)}
                                >
                                  <BsPencilSquare className="text-primary me-2" />
                                </Link>
                                <Link
                                  onClick={() =>
                                    handleDeleteOutcome(outcome.id)
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
      <UpdateOutcome
        outcomeData={outcomeData}
        showOutcome={showOutcome}
        handleCloseOutcome={handleCloseOutcome}
        outcomes={outcomes}
        setOutcomes={setOutcomes}
      />
    </>
  );
};

export default ManageOutcome;
