import { useState, useEffect } from "react";
import axios from "axios";
import SimpleEditor from "./SimpleEditor";
import "./AdminProcessSection.css";

/* ================= DEFAULT ================= */
const defaultProcess = {
  heading: { tag: "h2", text: "" },
  subtext: { tag: "p", text: "" },
  cards: []
};

const tagOptions = ["h1", "h2", "h3", "h4", "h5", "h6", "p"];

const AdminProcessSection = () => {
  const API = process.env.REACT_APP_APIURL;

  const [section, setSection] = useState(defaultProcess);
  const [pendingCards, setPendingCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* ================= HELPERS ================= */
  const createPreview = (file) => URL.createObjectURL(file);

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await axios.post(`${API}/api/upload`, formData);
    return res.data;
  };

  /* ================= FETCH ================= */
  useEffect(() => {
    axios
      .get(`${API}/api/process-section`)
      .then((res) => {
        if (res.data) {
          const data = res.data;

          const cards = (data.cards || []).map((card) => ({
            _id: card._id,
            title:
              typeof card.title === "string"
                ? { tag: "h3", text: card.title }
                : card.title || { tag: "h3", text: "" },
            para:
              typeof card.para === "string"
                ? { tag: "p", text: card.para }
                : card.para || { tag: "p", text: "" },
            image: card.image || {},
            file: null
          }));

          setSection({
            heading:
              typeof data.heading === "string"
                ? { tag: "h2", text: data.heading }
                : data.heading,
            subtext:
              typeof data.subtext === "string"
                ? { tag: "p", text: data.subtext }
                : data.subtext
          });

          setPendingCards(cards);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [API]);

  if (loading) return <div>Loading...</div>;

  /* ================= TEXT ================= */
  const handleTextBlockChange = (key, field, value) => {
    setSection((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value }
    }));
  };

  const handleCardFieldChange = (index, field, key, value) => {
    setPendingCards((prev) => {
      const updated = [...prev];
      updated[index][field][key] = value;
      return updated;
    });
  };

  /* ================= CARDS ================= */
  const addCard = () => {
    setPendingCards((prev) => [
      ...prev,
      {
        _id: null,
        title: { tag: "h3", text: "" },
        para: { tag: "p", text: "" },
        image: {},
        file: null
      }
    ]);
  };

  const removeCard = (id) => {
    setPendingCards((prev) => prev.filter((c) => c._id !== id));
  };

  /* ================= SAVE ================= */
  const handleSubmit = async () => {
    try {
      setSaving(true);

      const finalCards = [];

      for (const card of pendingCards) {
        let image = card.image;
        if (card.file) image = await uploadImage(card.file);

        finalCards.push({
          _id: card._id,
          title: card.title,
          para: card.para,
          image
        });
      }

      await axios.post(`${API}/api/process-section`, {
        ...section,
        cards: finalCards
      });

      alert("Process section updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="admin-process">
      <h1>Edit Process Section</h1>

      {/* HEADING */}
      <input
        type="text"
        placeholder="Heading"
        value={section.heading.text}
        onChange={(e) =>
          handleTextBlockChange("heading", "text", e.target.value)
        }
      />
      <select
        value={section.heading.tag}
        onChange={(e) =>
          handleTextBlockChange("heading", "tag", e.target.value)
        }
      >
        {tagOptions.map((t) => (
          <option key={t} value={t}>
            {t.toUpperCase()}
          </option>
        ))}
      </select>

      {/* SUBTEXT */}
      <select
        value={section.subtext.tag}
        onChange={(e) =>
          handleTextBlockChange("subtext", "tag", e.target.value)
        }
      >
        {tagOptions.map((t) => (
          <option key={t} value={t}>
            {t.toUpperCase()}
          </option>
        ))}
      </select>
      <SimpleEditor
        value={section.subtext.text}
        onChange={(val) =>
          handleTextBlockChange("subtext", "text", val)
        }
      />

      <h2>Process Cards</h2>

      {pendingCards.map((card, i) => (
        <div key={card._id || i} className="process-card">
          {/* IMAGE PREVIEW */}
          {card.image?.url && (
            <div className="image-preview">
              <img src={card.image.url} alt={`card-${i}`} />
              <div className="image-actions">
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById(`replace-card-${i}`).click()
                  }
                >
                  Replace
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const updated = [...pendingCards];
                    updated[i].image = {};
                    updated[i].file = null;
                    setPendingCards(updated);
                  }}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
              <input
                id={`replace-card-${i}`}
                type="file"
                style={{ display: "none" }}
                onChange={(e) => {
                  if (e.target.files[0]) {
                    const updated = [...pendingCards];
                    updated[i].image = { url: createPreview(e.target.files[0]) };
                    updated[i].file = e.target.files[0];
                    setPendingCards(updated);
                  }
                }}
              />
            </div>
          )}

          {/* UPLOAD IF NO IMAGE */}
          {!card.image?.url && (
            <input
              type="file"
              onChange={(e) => {
                if (e.target.files[0]) {
                  const updated = [...pendingCards];
                  updated[i].image = { url: createPreview(e.target.files[0]) };
                  updated[i].file = e.target.files[0];
                  setPendingCards(updated);
                }
              }}
            />
          )}

          {/* TITLE */}
          <select
            value={card.title.tag}
            onChange={(e) =>
              handleCardFieldChange(i, "title", "tag", e.target.value)
            }
          >
            {tagOptions.map((t) => (
              <option key={t} value={t}>
                {t.toUpperCase()}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Card title"
            value={card.title.text}
            onChange={(e) =>
              handleCardFieldChange(i, "title", "text", e.target.value)
            }
          />

          {/* PARAGRAPH */}
          <select
            value={card.para.tag}
            onChange={(e) =>
              handleCardFieldChange(i, "para", "tag", e.target.value)
            }
          >
            {tagOptions.map((t) => (
              <option key={t} value={t}>
                {t.toUpperCase()}
              </option>
            ))}
          </select>
          <SimpleEditor
            value={card.para.text}
            onChange={(val) =>
              handleCardFieldChange(i, "para", "text", val)
            }
          />

          {/* DELETE CARD */}
          <button
            type="button"
            className="delete-card-btn"
            onClick={() => removeCard(card._id)}
          >
            Delete Card
          </button>
        </div>
      ))}

      <button type="button" className="add-card-btn" onClick={addCard}>
        Add Card
      </button><br/><br/>

      <button
        type="button"
        className={`save-btn ${saving ? "saving" : ""}`}
        onClick={handleSubmit}
        disabled={saving}
      >
        {saving ? "Saving..." : "Save"}
      </button>
    </div>
  );
};

export default AdminProcessSection;
