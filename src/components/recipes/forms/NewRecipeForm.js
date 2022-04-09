import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { API } from "../../../Api";
import { useNavigate } from "react-router-dom";
import { Tags } from "../../Tags";

import styles from "./NewRecipeForm.module.css";
import { Rating } from "react-simple-star-rating";

export default function NewRecipeForm() {
  const nav = useNavigate();
  const titleRef = useRef();
  const [image, setImage] = useState();
  const [ingredientFields, setIngredientFields] = useState([
    { ingredient: "" },
  ]);
  const [stepFields, setStepFields] = useState([{ step: "" }]);
  const [tagFields, setTagFields] = useState([]);
  const [message, setMessage] = useState("");
  const [difficulty, setDifficulty] = useState(1);

  const diffChange = (diff) => {
    setDifficulty(diff/20);
    console.log(`Difficulty is: ${difficulty}`);
  };

  function imageChange(e) {
    setImage(e.target.files[0]);
  }

  function tagChange(index, e) {
    const data = [...tagFields];
    data[index][e.target.name] = e.target.value;
    setTagFields(data);
  }

  function addTag(e) {
    e.preventDefault();
    setTagFields([...tagFields, { tag: "" }]);
  }

  function removeTag(e) {
    e.preventDefault();
    setTagFields(tagFields.slice(0, tagFields.length - 1));
  }

  function ingredientChange(index, e) {
    const data = [...ingredientFields];
    data[index][e.target.name] = e.target.value;
    setIngredientFields(data);
  }

  function addIngredient(e) {
    e.preventDefault();
    setIngredientFields([...ingredientFields, { ingredient: "" }]);
  }

  function removeIngredient(e) {
    e.preventDefault();
    setIngredientFields(ingredientFields.slice(0, ingredientFields.length - 1));
  }

  function stepChange(e, index) {
    const data = [...stepFields];
    data[index][e.target.name] = e.target.value;
    setStepFields(data);
  }

  function addStep(e) {
    e.preventDefault();
    setStepFields([...stepFields, { step: "" }]);
  }

  function removeStep(e) {
    e.preventDefault();
    setStepFields(stepFields.slice(0, stepFields.length - 1));
  }

  function postForm(data) {
    axios({
      url: `${API}/recipes/add`,
      method: "post",
      data: data,
      headers: { "Content-type": "multipart/form-data" },
    })
      .then((res) => {
        const id = res.data._id;
        console.log(res);
        nav(`/admin/${id}`);
      })
      .catch(() => setMessage("Invalid file type"));
  }

  function submitForm(e) {
    e.preventDefault();
    const ingredients = ingredientFields.map((field) => field.ingredient);
    const steps = stepFields.map((field) => field.step);
    const tags = tagFields.map((field) => field.tag);
    const title = titleRef.current.value;
    let errorOccured = false;

    // creates form and fills it with fields
    let formData = new FormData();

    if (title) {
      formData.append("title", title);
    } else {
      errorOccured = true;
    }

    ingredients.forEach((ingredient) => {
      if (ingredient) {
        formData.append("ingredients", ingredient);
      } else {
        errorOccured = true;
      }
    });

    steps.forEach((step) => {
      if (step) {
        formData.append("steps", step);
      } else {
        errorOccured = true;
      }
    });

    if (image) {
      formData.append("image", image);
    } else {
      errorOccured = true;
    }

    tags.forEach((tag) => {
      if (tag) {
        formData.append("tags", tag);
      } else {
        errorOccured = true;
      }
    });

    formData.append('difficulty', difficulty);

    if (!errorOccured) {
      postForm(formData);
    } else {
      setMessage("Some fields are still empty");
    }
  }

  useEffect(() => {
    setMessage("");
  }, []);

  return (
    <>
      <form method="post" className={styles.recipeform}>
        <h1>New Recipe</h1>
        <label htmlFor="title">Title</label>
        <input type="text" name="title" ref={titleRef} />

        <label htmlFor="ingredient">Ingredients</label>
        <div className={styles.ingredients}>
          {ingredientFields &&
            ingredientFields.map((input, index) => (
              <>
                <input
                  type="text"
                  name="ingredient"
                  key={index}
                  onChange={(e) => ingredientChange(index, e)}
                />
              </>
            ))}
        </div>
        <div>
          <button onClick={addIngredient} className={styles.addbtn}>
            +
          </button>
          {ingredientFields[1] && (
            <button onClick={removeIngredient} className={styles.removebtn}>
              -
            </button>
          )}
        </div>

        <label htmlFor="step">Steps</label>
        <div className={styles.steps}>
          {stepFields &&
            stepFields.map((input, index) => (
              <>
                <textarea
                  name="step"
                  key={index}
                  onChange={(e) => stepChange(e, index)}
                />
              </>
            ))}
        </div>
        <div>
          <button onClick={addStep} className={styles.addbtn}>
            +
          </button>
          {stepFields[1] && (
            <button onClick={removeStep} className={styles.removebtn}>
              -
            </button>
          )}
        </div>

        <label htmlFor="image">Image</label>
        <input
          type="file"
          name="image"
          className={styles.imageinput}
          onChange={imageChange}
        />
        <br />
        <label htmlFor="difficulty">Difficulty</label>
        <Rating
          name="difficulty"
          onClick={diffChange}
          initialValue={1}
        />

        <label htmlFor="tags">Tags (optional)</label>
        <div className={styles.tags}>
          {tagFields &&
            tagFields.map((input, index) => (
              <>
                <select
                  list="tags"
                  name="tag"
                  onChange={(e) => tagChange(index, e)}
                >
                  <option></option>
                  {Tags.map((tag) => (
                    <option>{tag}</option>
                  ))}
                </select>
              </>
            ))}
        </div>
        <div>
          <button onClick={addTag} className={styles.addbtn}>
            +
          </button>
          {tagFields[0] && (
            <button onClick={removeTag} className={styles.removebtn}>
              -
            </button>
          )}
        </div>

        <button onClick={submitForm} className={styles.submitbtn}>
          Submit
        </button>
      </form>
      {message && <div className={styles.message}>{message}</div>}
    </>
  );
}
