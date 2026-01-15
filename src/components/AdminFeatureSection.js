import { useEffect, useState } from "react";
import axios from "axios";
import SimpleEditor from "./SimpleEditor"; // ← Add this import
import "./AdminFeatureSection.css"; 

/* ---------------- DEFAULT STATE ---------------- */
const defaultFeatureSection = {
  heading: { tag: "h2", text: "" },
  subtext: { tag: "p", text: "" },
  grid: []
};

/* ---------------- OPTIONS ---------------- */
const tagOptions = ["h1", "h2", "h3", "h4", "h5", "h6", "p"];

const iconOptions = [
  "FaIndustry",
  "FaRoad",
  "FaLeaf",
  "FaStar",
  "FaBuilding",
  "FaPlane",
  "FaSolarPanel",
  "FaProjectDiagram"
];

const AdminFeatureSection = () => {
  const [data, setData] = useState(defaultFeatureSection);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false); // Optional: for better UX

  const API = process.env.REACT_APP_APIURL;

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    axios
      .get(`${API}/api/feature-section`)
      .then(res => {
        if (res.data) setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [API]);

  if (loading) return <div>Loading...</div>;

  /* ---------------- HANDLERS ---------------- */

  const handleTextBlockChange = (block, field, value) => {
    setData(prev => ({
      ...prev,
      [block]: { ...prev[block], [field]: value }
    }));
  };

  const handleGridItemChange = (index, field, value) => {
    setData(prev => {
      const updated = [...prev.grid];
      updated[index][field] = value;
      return { ...prev, grid: updated };
    });
  };

  const handleGridItemNestedChange = (index, block, field, value) => {
    setData(prev => {
      const updated = [...prev.grid];
      updated[index][block] = { ...updated[index][block], [field]: value };
      return { ...prev, grid: updated };
    });
  };

  const handleLearnMoreChange = (index, field, value) => {
    setData(prev => {
      const updated = [...prev.grid];
      if (!updated[index].learnMore) {
        updated[index].learnMore = { text: { text: "" }, link: "" };
      }
      if (field === "link") {
        updated[index].learnMore.link = value;
      } else if (field === "text") {
        updated[index].learnMore.text = { ...updated[index].learnMore.text, text: value };
      }
      return { ...prev, grid: updated };
    });
  };

  const addGridItem = () => {
    setData(prev => ({
      ...prev,
      grid: [
        ...prev.grid,
        {
          icon: "FaIndustry",
          number: "",
          title: { tag: "h3", text: "" },
          description: { tag: "p", text: "" },
          learnMore: { text: { text: "Learn More" }, link: "" }
        }
      ]
    }));
  };

  const removeGridItem = index => {
    setData(prev => ({
      ...prev,
      grid: prev.grid.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      await axios.post(`${API}/api/feature-section`, data);
      alert("Feature Section updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update Feature Section");
    } finally {
      setSaving(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="admin-feature-section">
      <h1>Edit Feature Section</h1>

      {/* HEADING */}
      <h2>Heading</h2>
      <select
        value={data.heading.tag}
        onChange={e => handleTextBlockChange("heading", "tag", e.target.value)}
      >
        {tagOptions.map(tag => (
          <option key={tag} value={tag}>
            {tag.toUpperCase()}
          </option>
        ))}
      </select>

      <label style={{ display: "block"}}>Heading Text</label>
      <SimpleEditor
        value={data.heading.text}
        onChange={val => handleTextBlockChange("heading", "text", val)}
      />

      {/* SUBTEXT */}
      <h2>Subtext</h2>
      <select
        value={data.subtext.tag}
        onChange={e => handleTextBlockChange("subtext", "tag", e.target.value)}
      >
        {tagOptions.map(tag => (
          <option key={tag} value={tag}>
            {tag.toUpperCase()}
          </option>
        ))}
      </select>

      <label style={{ display: "block" }}>Subtext</label>
      <SimpleEditor
        value={data.subtext.text}
        onChange={val => handleTextBlockChange("subtext", "text", val)}
      />

      {/* GRID ITEMS */}
      <h2>Feature Grid Items</h2>

      {data.grid.map((item, i) => (
        <div
          key={i}
          style={{ border: "1px solid #ccc", padding: 15, marginBottom: 20 }}
        >
          <h3>Grid Item {i + 1}</h3>

          {/* Icon */}
          <label>Icon</label>
          <select
            value={item.icon}
            onChange={e => handleGridItemChange(i, "icon", e.target.value)}
          >
            {iconOptions.map(icon => (
              <option key={icon} value={icon}>
                {icon}
              </option>
            ))}
          </select>

          {/* Number */}
          <label>Number</label>
          <input
            type="text"
            placeholder="e.g. 1500+"
            value={item.number}
            onChange={e => handleGridItemChange(i, "number", e.target.value)}
          />

          {/* Title */}
          <label>Title Tag</label>
          <select
            value={item.title.tag}
            onChange={e => handleGridItemNestedChange(i, "title", "tag", e.target.value)}
          >
            {tagOptions.map(tag => (
              <option key={tag} value={tag}>
                {tag.toUpperCase()}
              </option>
            ))}
          </select>

          <label style={{ display: "block" }}>Title Text</label>
          <SimpleEditor
            value={item.title.text}
            onChange={val => handleGridItemNestedChange(i, "title", "text", val)}
          />

          {/* Description */}
          <label>Description Tag</label>
          <select
            value={item.description.tag}
            onChange={e => handleGridItemNestedChange(i, "description", "tag", e.target.value)}
          >
            {tagOptions.map(tag => (
              <option key={tag} value={tag}>
                {tag.toUpperCase()}
              </option>
            ))}
          </select>

          <label style={{ display: "block" }}>Description Text</label>
          <SimpleEditor
            value={item.description.text}
            onChange={val => handleGridItemNestedChange(i, "description", "text", val)}
          />

          {/* Learn More Button */}
          <h4>Learn More Button</h4>

          <label>Button Text</label>
          <SimpleEditor
            value={item.learnMore?.text?.text || "Learn More"}
            onChange={val => handleLearnMoreChange(i, "text", val)}
          />

          <label style={{ display: "block"}}>Button Link</label>
          <input
            type="text"
            placeholder="Link (e.g. /industrial-parks)"
            value={item.learnMore?.link || ""}
            onChange={e => handleLearnMoreChange(i, "link", e.target.value)}
          />

          <br /><br />
          <button onClick={() => removeGridItem(i)}>Remove Item</button>
        </div>
      ))}

      <button onClick={addGridItem}>Add Grid Item</button>

      <br /><br />
      <button
        onClick={handleSubmit}
        disabled={saving}
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
};

export default AdminFeatureSection;