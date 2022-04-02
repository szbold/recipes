import { useContext, useState } from "react";
import { Tags } from "../Tags";
import { TagsContext } from "../TagsContext";
import styles from "./TagSelect.module.css";
import { motion } from "framer-motion";

export default function TagSelect() {
  const { tagsApplied, setTagsApplied } = useContext(TagsContext);
  const [tags, setTags] = useState(
    tagsApplied[0] ? tagsApplied.map((tag) => ({ tag: tag })) : [{ tag: "" }]
  );

  function addTag(e) {
    e.preventDefault();
    setTags([...tags, { tag: "" }]);
    console.log(tags);
  }

  function removeTag(e) {
    e.preventDefault();
    setTags(tags.slice(0, tags.length - 1));
  }

  function changeTag(index, e) {
    const data = [...tags];
    data[index][e.target.name] = e.target.value;
    setTags(data);
  }

  function submitTags(e) {
    e.preventDefault();
    setTagsApplied(
      tags
        .filter(function (tag) {
          return tag.tag;
        })
        .map((tag) => tag.tag)
    );
  }

  const variants = {
    hidden: { opacity: 0, x: 400 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 400 },
  };

  const inputVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.5 }}
      variants={variants}
      className={styles.wrapper}
    >
      <p>Select tags</p>
      <form className={styles.tagsform}>
        {tags.map((tag, index) => (
          <motion.div
            key={index}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5 }}
            variants={inputVariants}
          >
            <input
              list="taglist"
              onChange={(e) => changeTag(index, e)}
              name="tag"
              defaultValue={tag.tag}
            />
            <datalist id="taglist">
              {Tags.map((tag) => (
                <option value={tag} key={tag}>
                  {tag}
                </option>
              ))}
            </datalist>
          </motion.div>
        ))}
        <button className={styles.addbtn} onClick={addTag}>
          +
        </button>
        {tags[1] && (
          <button className={styles.rmbtn} onClick={removeTag}>
            -
          </button>
        )}
        <button className={styles.submitbtn} onClick={submitTags}>
          Apply
        </button>
      </form>
    </motion.div>
  );
}
