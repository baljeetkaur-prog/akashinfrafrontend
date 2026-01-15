import { useRef, useEffect } from "react";

const SimpleEditor = ({ value, onChange }) => {
  const editorRef = useRef(null);
  const lastValue = useRef(value);

  // Set text only when value comes from outside (page load)
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
    lastValue.current = value;
  }, [value]);

  const handleInput = () => {
    lastValue.current = editorRef.current.innerHTML;
  };

  // 🔥 IMPORTANT: update parent ONLY when cursor leaves editor
  const handleBlur = () => {
    if (lastValue.current !== value) {
      onChange(lastValue.current);
    }
  };

  return (
    <div
      ref={editorRef}
      contentEditable
      suppressContentEditableWarning
      onInput={handleInput}
      onBlur={handleBlur}
      style={{
        border: "1px solid #ccc",
        minHeight: "80px",
        padding: "8px",
        borderRadius: "4px",
      }}
    />
  );
};

export default SimpleEditor;
