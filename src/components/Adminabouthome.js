import { useState, useEffect } from "react";
import axios from "axios";
import SimpleEditor from "./SimpleEditor"; // ← Make sure this path is correct
import "./AdminAboutHomeSection.css"; 

const defaultAbout = {
  leftImages: [],

  rightContent: {
    subtitle: { tag: "p", text: "" },
    heading: { tag: "h2", text: "" },
    description: { tag: "p", text: "" }
  },

  points: [],

  highlightBox: {
    heading: { tag: "h3", text: "" },
    description: { tag: "p", text: "" }
  },

  bottomSection: {
    logoImage: null,
    logoText: { tag: "p", text: "" },
    button: {
      text: { tag: "p", text: "" },
      link: ""
    }
  }
};

const Adminabouthome = () => {
  const API = process.env.REACT_APP_APIURL;
  const [about, setAbout] = useState(defaultAbout);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [pendingLeftImages, setPendingLeftImages] = useState([]);
  const [pendingLogoImage, setPendingLogoImage] = useState(null);

  /* ================= FETCH ================= */
  useEffect(() => {
    axios.get(`${API}/api/about-section`)
      .then(res => {
        if (res.data) {
          setAbout(res.data);

          setPendingLeftImages(
            (res.data.leftImages || []).map(img => ({
              ...img,
              id: Math.random().toString(36),
              isNew: false,
              markedForDeletion: false,
              alt: img.alt || ""
            }))
          );

          if (res.data.bottomSection?.logoImage) {
            setPendingLogoImage({
              ...res.data.bottomSection.logoImage,
              id: Math.random().toString(36),
              isNew: false,
              markedForDeletion: false,
              alt: res.data.bottomSection.logoImage.alt || ""
            });
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [API]);

  if (loading) return <p>Loading...</p>;

  /* ================= IMAGE HELPERS ================= */
  const createPreview = (file) => URL.createObjectURL(file);

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await axios.post(`${API}/api/upload`, formData);
    return { url: res.data.url, publicId: res.data.publicId };
  };

  const deleteImageFromCloudinary = async (publicId) => {
    if (publicId) await axios.post(`${API}/api/delete-image`, { publicId });
  };

  /* ================= IMAGE HANDLERS ================= */
  const handleAddLeftImages = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newImages = files.map(file => ({
      id: Math.random().toString(36),
      url: createPreview(file),
      file,
      alt: "",
      isNew: true,
      markedForDeletion: false
    }));

    setPendingLeftImages(prev => [...prev, ...newImages].slice(0, 3));
  };

  const handleReplaceLeftImage = (index, file) => {
    const previewUrl = createPreview(file);
    setPendingLeftImages(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], url: previewUrl, file, isNew: true };
      return updated;
    });
  };

  const handleDeleteLeftImage = (index) => {
    setPendingLeftImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleLogoImageChange = (file) => {
    if (!file) return;
    const previewUrl = createPreview(file);
    setPendingLogoImage({
      id: Math.random().toString(36),
      url: previewUrl,
      file,
      alt: "",
      isNew: true
    });
  };

  const handleDeleteLogo = () => setPendingLogoImage(null);

  /* ================= TEXT & TAG HANDLER ================= */
  const updateTextBlock = (path, field, value) => {
    setAbout(prev => {
      const updated = { ...prev };
      let current = updated;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      current[path[path.length - 1]][field] = value;
      return updated;
    });
  };

  const addPoint = () => setAbout(p => ({ ...p, points: [...p.points, ""] }));
  const removePoint = i => setAbout(p => ({ ...p, points: p.points.filter((_, idx) => idx !== i) }));
  const updatePoint = (i, value) => {
    setAbout(p => {
      const points = [...p.points];
      points[i] = value;
      return { ...p, points };
    });
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    try {
      setSaving(true);

      const finalLeftImages = [];
      const toDeletePublicIds = [];

      for (const img of pendingLeftImages) {
        if (img.markedForDeletion && img.publicId && !img.isNew) {
          toDeletePublicIds.push(img.publicId);
        }
        if (img.isNew && img.file) {
          const uploaded = await uploadImage(img.file);
          finalLeftImages.push({ ...uploaded, alt: img.alt || "" });
        } else if (!img.isNew && img.publicId) {
          finalLeftImages.push({ url: img.url, publicId: img.publicId, alt: img.alt || "" });
        }
      }

      let finalLogoImage = null;
      if (pendingLogoImage) {
        if (pendingLogoImage.isNew && pendingLogoImage.file) {
          const uploaded = await uploadImage(pendingLogoImage.file);
          finalLogoImage = { ...uploaded, alt: pendingLogoImage.alt || "" };
        } else if (!pendingLogoImage.isNew && pendingLogoImage.publicId) {
          finalLogoImage = { url: pendingLogoImage.url, publicId: pendingLogoImage.publicId, alt: pendingLogoImage.alt || "" };
        }
      }

      if (about.bottomSection.logoImage?.publicId && (!pendingLogoImage || pendingLogoImage.isNew)) {
        toDeletePublicIds.push(about.bottomSection.logoImage.publicId);
      }

      await Promise.all(toDeletePublicIds.map(id => deleteImageFromCloudinary(id)));

      const payload = {
        ...about,
        leftImages: finalLeftImages,
        bottomSection: {
          ...about.bottomSection,
          logoImage: finalLogoImage
        }
      };

      await axios.post(`${API}/api/about-section`, payload);
      alert("About section updated successfully!");
      setAbout(payload);
    } catch (err) {
      console.error(err);
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const tagOptions = ["h1", "h2", "h3", "h4", "h5", "h6", "p"];

  /* ================= UI ================= */
  return (
    <div className="adminabout-home-section">
      <h1>Edit About Section</h1>

      {/* LEFT IMAGES */}
      <h2>Left Images (Max 3)</h2>
      <input type="file" multiple accept="image/*" onChange={handleAddLeftImages} disabled={pendingLeftImages.length >= 3} />

      <div>
        {pendingLeftImages.map((img, i) => (
          <div key={img.id} >
            <img src={img.url} alt={img.alt || `left-${i}`} width="120" style={{ borderRadius: "8px", objectFit: "cover" }} />
            <input
              type="text"
              placeholder="Alt text"
              value={img.alt}
              onChange={(e) => {
                setPendingLeftImages(prev => {
                  const updated = [...prev];
                  updated[i].alt = e.target.value;
                  return updated;
                });
              }}
              style={{ width: "120px" }}
            />
            <div style={{ marginTop: 8 }}>
              <button style={{ fontSize: "12px", marginRight: 8 }} onClick={() => document.getElementById(`replace-left-${i}`).click()}>
                Replace
              </button>
              <button style={{ fontSize: "12px", color: "red" }} onClick={() => handleDeleteLeftImage(i)}>
                Delete
              </button>
            </div>
            <input id={`replace-left-${i}`} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => e.target.files[0] && handleReplaceLeftImage(i, e.target.files[0])} />
          </div>
        ))}
      </div>

      {/* RIGHT CONTENT */}
      <h2>Right Content</h2>
      {["subtitle", "heading", "description"].map((key) => (
        <div key={key}>
          <label style={{ textTransform: "capitalize", fontWeight: "bold" }}>{key}</label>
          <select
            value={about.rightContent[key].tag}
            onChange={(e) => updateTextBlock(["rightContent", key], "tag", e.target.value)}
          
          >
            {tagOptions.map(tag => <option key={tag} value={tag}>{tag.toUpperCase()}</option>)}
          </select>

          {key === "description" ? (
            <>
              <label style={{ display: "block"}}>Content (Rich Text)</label>
              <SimpleEditor
                value={about.rightContent.description.text}
                onChange={(val) => updateTextBlock(["rightContent", "description"], "text", val)}
              />
            </>
          ) : (
            <input
              type="text"
              style={{ width: "100%", marginTop: 8, padding: "8px" }}
              value={about.rightContent[key].text}
              onChange={(e) => updateTextBlock(["rightContent", key], "text", e.target.value)}
              placeholder={`${key} text`}
            />
          )}
        </div>
      ))}

      {/* POINTS */}
      <h2>Points</h2>
      {about.points.map((point, i) => (
        <div key={i} style={{ marginBottom: 8, display: "flex", gap: 8 }}>
          <input
            value={point}
            onChange={(e) => updatePoint(i, e.target.value)}
            style={{ flex: 1, padding: "8px" }}
          />
          <button onClick={() => removePoint(i)}>Remove</button>
        </div>
      ))}
      <button onClick={addPoint}>Add Point</button><br/>

      {/* HIGHLIGHT BOX */}
      <h2>Highlight Box</h2>
      {["heading", "description"].map((key) => (
        <div key={key} >
          <label style={{ textTransform: "capitalize", fontWeight: "bold" }}>{key}</label>
          <select
            value={about.highlightBox[key].tag}
            onChange={(e) => updateTextBlock(["highlightBox", key], "tag", e.target.value)}
        
          >
            {tagOptions.map(tag => <option key={tag} value={tag}>{tag.toUpperCase()}</option>)}
          </select>

          {key === "description" ? (
            <>
              <label >Content (Rich Text)</label>
              <SimpleEditor
                value={about.highlightBox.description.text}
                onChange={(val) => updateTextBlock(["highlightBox", "description"], "text", val)}
              />
            </>
          ) : (
            <input
              type="text"
              style={{ width: "100%", marginTop: 8, padding: "8px" }}
              value={about.highlightBox[key].text}
              onChange={(e) => updateTextBlock(["highlightBox", key], "text", e.target.value)}
              placeholder={`${key} text`}
            />
          )}
        </div>
      ))}

      {/* BOTTOM SECTION */}
      <h2>Bottom Section</h2>

      {/* Logo Image */}
      <h3>Logo Image</h3>
      <input type="file" accept="image/*" onChange={(e) => e.target.files[0] && handleLogoImageChange(e.target.files[0])} />
      {pendingLogoImage && (
        <div style={{ marginTop: 15, textAlign: "center" }}>
          <img src={pendingLogoImage.url} alt={pendingLogoImage.alt || "logo"} width="150" style={{ borderRadius: "8px" }} />
          <input
            type="text"
            placeholder="Alt text"
            value={pendingLogoImage.alt}
            onChange={(e) => setPendingLogoImage(prev => ({ ...prev, alt: e.target.value }))}
            style={{ marginTop: 8 }}
          />
          <div style={{ marginTop: 8 }}>
            <button style={{ marginRight: 8 }} onClick={() => document.getElementById("replace-logo").click()}>Replace</button>
            <button style={{ color: "red" }} onClick={handleDeleteLogo}>Delete</button>
          </div>
          <input id="replace-logo" type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => e.target.files[0] && handleLogoImageChange(e.target.files[0])} />
        </div>
      )}

      {/* Logo Text */}
      <div>
        <label>Logo Text</label>
        <select
          value={about.bottomSection.logoText.tag}
          onChange={(e) => updateTextBlock(["bottomSection", "logoText"], "tag", e.target.value)}
        
        >
          {tagOptions.map(tag => <option key={tag} value={tag}>{tag.toUpperCase()}</option>)}
        </select>
        <input
          type="text"
          style={{ width: "100%", marginTop: 8 }}
          value={about.bottomSection.logoText.text}
          onChange={(e) => updateTextBlock(["bottomSection", "logoText"], "text", e.target.value)}
          placeholder="e.g. Trusted by 1000+ clients"
        />
      </div>

      {/* Button */}
      <div>
        <label>Button Text</label>
        <select
          value={about.bottomSection.button.text.tag}
          onChange={(e) => updateTextBlock(["bottomSection", "button", "text"], "tag", e.target.value)}
         
        >
          {tagOptions.map(tag => <option key={tag} value={tag}>{tag.toUpperCase()}</option>)}
        </select>
        <input
          type="text"
          style={{ width: "100%", marginTop: 8 }}
          value={about.bottomSection.button.text.text}
          onChange={(e) => updateTextBlock(["bottomSection", "button", "text"], "text", e.target.value)}
          placeholder="Button text"
        />
        <input
          type="text"
          style={{ width: "100%", marginTop: 8 }}
          value={about.bottomSection.button.link}
          onChange={(e) => setAbout(prev => ({
            ...prev,
            bottomSection: { ...prev.bottomSection, button: { ...prev.bottomSection.button, link: e.target.value } }
          }))}
          placeholder="Button link (e.g. /contact)"
        />
      </div>

      <br />
      <button
        onClick={handleSave}
        disabled={saving}
       
      >
        {saving ? "Saving..." : "Save About Section"}
      </button>
    </div>
  );
};

export default Adminabouthome;