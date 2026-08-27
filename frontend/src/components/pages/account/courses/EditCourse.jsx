import React, { useEffect, useState } from "react";
import Layout from "../../common/Layout";
import { Link, useNavigate, useParams } from "react-router-dom";
import UserSidebar from "../../common/UserSidebar";
import { useForm } from "react-hook-form";
import { apiUrl, token } from "../../common/Config";
import { toast } from "react-hot-toast";
import ManageOutcome from "./ManageOutcome";
import ManageRequirement from "./ManageRequirement";
import EditCover from "./EditCover";

const EditCourse = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [categories, setCategories] = useState([]);
  const [levels, setLevels] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState([]);

  // useForm
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm();

  useEffect(() => {
    const fetchCourseAndMetaData = async () => {
      try {
        // 1. Fetch meta data and course data
        const [metaRes, courseRes] = await Promise.all([
          fetch(`${apiUrl}/courses/meta-data`, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${apiUrl}/courses/${id}`, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        const metaData = await metaRes.json();
        const courseData = await courseRes.json();

        // 2. Set categories, levels and languages
        if (metaData.status === 200) {
          setCategories(metaData.data.categories);
          setLevels(metaData.data.levels);
          setLanguages(metaData.data.languages);
        }

        // 3. Set form data
        if (courseData.status === 200) {
          reset({
            title: courseData.data.title,
            category: courseData.data.category_id,
            level: courseData.data.level_id,
            language: courseData.data.language_id,
            description: courseData.data.description,
            sell_price: courseData.data.price,
            cross_price: courseData.data.cross_price,
          });
          setCourse(courseData.data);
        } else {
          toast.error("Course not found");
        }
      } catch (error) {
        toast.error("Failed to load course data");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndMetaData();
  }, [id, reset]);

  const onSubmit = async (data) => {
    try {
      const response = await fetch(`${apiUrl}/courses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const resData = await response.json();

      if (resData.status === 200) {
        toast.success("Course updated successfully");
        navigate("/account/courses/edit/" + id);
      } else {
        toast.error("Validation failed");
        const errors = resData.errors;
        Object.keys(errors).forEach((key) => {
          setError(key, { message: errors[key][0] });
        });
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-5">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="section-4">
        <div className="container pb-5 pt-3">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/account">Account</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Dashboard
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-md-12 mt-5 mb-3">
              <div className="d-flex justify-content-between">
                <h2 className="h4 mb-0 pb-0">Edit Course</h2>
              </div>
            </div>
            <div className="col-lg-3 account-sidebar">
              <UserSidebar />
            </div>
            <div className="col-lg-9">
              <div className="row">
                <div className="col-md-7">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="card border-0 shadow-lg">
                      <div className="card-body p-4">
                        <div className="mb-3">
                          <label htmlFor="name" className="form-label">
                            Title
                          </label>
                          <input
                            type="text"
                            {...register("title", {
                              required: "Title is required",
                            })}
                            className={`form-control ${
                              errors.title ? "is-invalid" : ""
                            }`}
                            placeholder="Enter title"
                          />
                          {errors.title && (
                            <div className="invalid-feedback">
                              {errors.title.message}
                            </div>
                          )}
                        </div>

                        <div className="mb-3">
                          <label htmlFor="category" className="form-label">
                            Category{" "}
                          </label>
                          <select
                            className={`form-select ${errors.category ? "is-invalid" : ""}`}
                            id="category"
                            {...register("category", {
                              required: "Category is required",
                            })}
                          >
                            <option value="">Select a Category</option>
                            {categories &&
                              categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                  {category.name}
                                </option>
                              ))}
                          </select>
                          {errors.category && (
                            <div className="invalid-feedback">
                              {errors.category.message}
                            </div>
                          )}
                        </div>

                        <div className="mb-3">
                          <label htmlFor="level" className="form-label">
                            Level
                          </label>
                          <select
                            className={`form-select ${errors.level ? "is-invalid" : ""}`}
                            id="level"
                            {...register("level", {
                              required: "Level is required",
                            })}
                          >
                            <option value="">Select a Level</option>
                            {levels &&
                              levels.map((level) => (
                                <option key={level.id} value={level.id}>
                                  {level.name}
                                </option>
                              ))}
                          </select>
                          {errors.level && (
                            <div className="invalid-feedback">
                              {errors.level.message}
                            </div>
                          )}
                        </div>

                        <div className="mb-3">
                          <label htmlFor="language" className="form-label">
                            Language
                          </label>
                          <select
                            className={`form-select ${errors.language ? "is-invalid" : ""}`}
                            id="language"
                            {...register("language", {
                              required: "Language is required",
                            })}
                          >
                            <option value="">Select a Language</option>
                            {languages &&
                              languages.map((language) => (
                                <option key={language.id} value={language.id}>
                                  {language.name}
                                </option>
                              ))}
                          </select>
                          {errors.language && (
                            <div className="invalid-feedback">
                              {errors.language.message}
                            </div>
                          )}
                        </div>

                        <div className="mb-3">
                          <label htmlFor="description" className="form-label">
                            Description
                          </label>
                          <textarea
                            id="description"
                            className={`form-control ${errors.description ? "is-invalid" : ""}`}
                            rows="5"
                            placeholder="Enter description"
                            {...register("description", {
                              required: "Description is required",
                            })}
                          ></textarea>
                          {errors.description && (
                            <div className="invalid-feedback">
                              {errors.description.message}
                            </div>
                          )}
                        </div>

                        <h4 className="h5 border-bottom pb-3 mb-3">Pricing</h4>

                        <div className="mb-3">
                          <label htmlFor="sell-price" className="form-label">
                            Sell Price
                          </label>
                          <input
                            type="number"
                            className={`form-control ${errors.sell_price ? "is-invalid" : ""}`}
                            placeholder="Enter sell price"
                            {...register("sell_price", {
                              required: "Sell price is required",
                            })}
                          />
                          {errors.sell_price && (
                            <div className="invalid-feedback">
                              {errors.sell_price.message}
                            </div>
                          )}
                        </div>

                        <div className="mb-3">
                          <label htmlFor="cross-price" className="form-label">
                            Cross Price
                          </label>
                          <input
                            type="number"
                            className={`form-control ${errors.cross_price ? "is-invalid" : ""}`}
                            placeholder="Enter cross price"
                            {...register("cross_price", {
                              required: "Cross price is required",
                            })}
                          />
                          {errors.cross_price && (
                            <div className="invalid-feedback">
                              {errors.cross_price.message}
                            </div>
                          )}
                        </div>

                        <button type="submit" className="btn btn-primary">
                          Update
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="col-md-5">
                  <ManageOutcome />
                  <ManageRequirement />
                  <EditCover course={course} setCourse={setCourse} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default EditCourse;
