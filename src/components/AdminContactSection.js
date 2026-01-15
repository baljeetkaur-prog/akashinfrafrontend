import { useState, useEffect } from "react";
import axios from "axios";
import "./AdminContact.css"; 
const defaultContact = {
  backgroundImage: "",
  backgroundImagePublicId: null,
  heading: { tag: "h2", text: "" },
  description: { tag: "p", text: "" },
  contactDetails: [
    {
      icon: "email",
      label: { tag: "p", text: "Email Address:" },
      value: { tag: "p", text: "" }
    }
  ]
};

const AdminContactSection = () => {
  const [contact, setContact] = useState(defaultContact);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // For background image management (like carousel)
  const [pendingBackground, setPendingBackground] = useState(null);
  // possible states: null | { url, publicId?, file?, isNew, markedForDeletion, oldPublicIdToDelete? }

  const API = process.env.REACT_APP_APIURL;

  // Fetch
  useEffect(() => {
    axios
      .get(`${API}/api/contact-section`)
      .then((res) => {
        if (res.data) {
          setContact(res.data);

          // Initialize pending background
          if (res.data.backgroundImage) {
            setPendingBackground({
              url: res.data.backgroundImage,
              publicId: res.data.backgroundImagePublicId || null,
              isNew: false,
              markedForDeletion: false
            });
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [API]);

  if (loading) return <div>Loading...</div>;

  // Helpers — Text
  const handleTextChange = (key, field, value) => {
    setContact((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value
      }
    }));
  };

  const handleContactDetailChange = (index, field, subField, value) => {
    setContact((prev) => {
      const updated = [...prev.contactDetails];
      updated[index] = {
        ...updated[index],
        [field]: {
          ...updated[index][field],
          [subField]: value
        }
      };
      return { ...prev, contactDetails: updated };
    });
  };

  const handleIconChange = (index, value) => {
    setContact((prev) => {
      const updated = [...prev.contactDetails];
      updated[index].icon = value;
      return { ...prev, contactDetails: updated };
    });
  };

  const addContactDetail = () => {
    setContact((prev) => ({
      ...prev,
      contactDetails: [
        ...prev.contactDetails,
        {
          icon: "",
          label: { tag: "p", text: "" },
          value: { tag: "p", text: "" }
        }
      ]
    }));
  };

  const removeContactDetail = (index) => {
    setContact((prev) => ({
      ...prev,
      contactDetails: prev.contactDetails.filter((_, i) => i !== index)
    }));
  };

  // ── Background Image Handlers ─────────────────────────────────────

  const createPreview = (file) => URL.createObjectURL(file);

  const handleBackgroundChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const preview = createPreview(file);

    setPendingBackground({
      url: preview,
      file,
      isNew: true,
      markedForDeletion: false
    });
  };

  const handleReplaceBackground = (file) => {
    if (!file) return;
    const preview = createPreview(file);

    setPendingBackground((prev) => ({
      ...prev,
      url: preview,
      file,
      isNew: true,
      markedForDeletion: false,
      // Preserve old publicId for later deletion if it existed
      oldPublicIdToDelete: prev?.publicId && !prev.isNew ? prev.publicId : prev?.oldPublicIdToDelete
    }));
  };

  const handleDeleteBackground = () => {
    setPendingBackground((prev) => ({
      ...prev,
      markedForDeletion: true,
      file: undefined,
      isNew: false
    }));
  };

  // ── Save ───────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    try {
      setSaving(true);

      let backgroundImage = "";
      let backgroundImagePublicId = null;
      const deletedBackgroundPublicIds = [];

      // 1. Handle background image
      if (pendingBackground) {
        // New/replaced image → upload
        if (pendingBackground.file) {
          const formData = new FormData();
          formData.append("image", pendingBackground.file);

          const res = await axios.post(`${API}/api/upload`, formData);
          backgroundImage = res.data.url;
          backgroundImagePublicId = res.data.publicId;
        }
        // Existing (not changed) image
        else if (!pendingBackground.markedForDeletion && !pendingBackground.isNew) {
          backgroundImage = pendingBackground.url;
          backgroundImagePublicId = pendingBackground.publicId;
        }

        // Collect IDs to delete
        if (pendingBackground.markedForDeletion && pendingBackground.publicId) {
          deletedBackgroundPublicIds.push(pendingBackground.publicId);
        }
        if (pendingBackground.oldPublicIdToDelete) {
          deletedBackgroundPublicIds.push(pendingBackground.oldPublicIdToDelete);
        }
      }

      // 2. Prepare payload
      const payload = {
        mapEmbedUrl: contact.mapEmbedUrl || "",
        backgroundImage,
        backgroundImagePublicId,
        heading: contact.heading || {},
        description: contact.description || {},
        contactDetails: contact.contactDetails || [],
        deletedBackgroundPublicIds // for cleanup
      };

      // 3. Save
      await axios.post(`${API}/api/contact-section`, payload);

      alert("Contact section updated successfully!");

      // Reload fresh data
      const res = await axios.get(`${API}/api/contact-section`);
      setContact(res.data);

      // Reset pending background
      if (res.data.backgroundImage) {
        setPendingBackground({
          url: res.data.backgroundImage,
          publicId: res.data.backgroundImagePublicId || null,
          isNew: false,
          markedForDeletion: false
        });
      } else {
        setPendingBackground(null);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update Contact section");
    } finally {
      setSaving(false);
    }
  };

  // ── UI ─────────────────────────────────────────────────────────────

  return (
    <div className="admin-contact">
      <h1>Edit Contact Section</h1>

      {/* BACKGROUND IMAGE */}
      <h2>Background Image</h2>

      <div>
        {pendingBackground && !pendingBackground.markedForDeletion ? (
          <div style={{ position: "relative", display: "inline-block" }}>
            <img
              src={pendingBackground.url}
              alt="Background preview"
              style={{
                maxWidth: "320px",
                maxHeight: "180px",
                objectFit: "cover",
                borderRadius: "6px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
              }}
            />

            <div>
              <button
                type="button"
                onClick={() => document.getElementById("replace-bg-input").click()}
              >
                Replace
              </button>

              <button type="button" style={{ color: "crimson" }} onClick={handleDeleteBackground}>
                Delete
              </button>
            </div>

            <input
              id="replace-bg-input"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => e.target.files?.[0] && handleReplaceBackground(e.target.files[0])}
            />
          </div>
        ) : (
          <input
            type="file"
            accept="image/*"
            onChange={handleBackgroundChange}
         
          />
        )}
      </div>

      {/* HEADING */}
      <h2>Heading</h2>
      <div>
        <select
          value={contact.heading.tag}
          onChange={(e) => handleTextChange("heading", "tag", e.target.value)}
        >
          <option value="h1">H1</option>
          <option value="h2">H2</option>
          <option value="h3">H3</option>
        </select>

        <input
          type="text"
          value={contact.heading.text}
          onChange={(e) => handleTextChange("heading", "text", e.target.value)}
          style={{ flex: 1 }}
          placeholder="Contact Us"
        />
      </div>

      {/* DESCRIPTION */}
      <h2>Description</h2>
      <textarea
        value={contact.description.text}
        onChange={(e) => handleTextChange("description", "text", e.target.value)}
        rows={5}
        style={{ width: "100%" }}
      />

      {/* CONTACT DETAILS */}
      <h2>Contact Details</h2>

      {contact.contactDetails.map((item, i) => (
 <div className="contact-card">
          <div>
            <label>Icon: </label>
            <select
              value={item.icon}
              onChange={(e) => handleIconChange(i, e.target.value)}
            >
              <option value="">Select</option>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="location">Location</option>
            </select>
          </div>

          <input
            type="text"
            placeholder="Label (e.g. Email Address:)"
            value={item.label.text}
            onChange={(e) =>
              handleContactDetailChange(i, "label", "text", e.target.value)
            }
           
          />

          <input
            type="text"
            placeholder="Value (e.g. hello@company.com)"
            value={item.value.text}
            onChange={(e) =>
              handleContactDetailChange(i, "value", "text", e.target.value)
            }
            style={{ display: "block", width: "100%" }}
          />

          <button
            onClick={() => removeContactDetail(i)}
           
          >
            Remove
          </button>
        </div>
      ))}

      <button onClick={addContactDetail}>
        + Add Contact Detail
      </button>

      <br />
      <br />

      <button
        onClick={handleSubmit}
        disabled={saving}
      >
        {saving ? "Saving..." : "Save Contact Section"}
      </button>
    </div>
  );
};

export default AdminContactSection;