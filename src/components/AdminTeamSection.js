import { useState, useEffect } from "react";
import axios from "axios";
import SimpleEditor from "./SimpleEditor";
import "./AdminTeamSection.css"; 

const defaultTeam = {
  heading: { tag: "h2", text: "Meet Our Team" },
  description: { tag: "p", text: "" },
  members: []
};

const tagOptions = ["h1","h2","h3","h4","h5","h6","p","span"];

const AdminTeamSection = () => {
  const API = process.env.REACT_APP_APIURL;
  const [team, setTeam] = useState(defaultTeam);
  const [pendingMembers, setPendingMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    axios.get(`${API}/api/team-section`)
      .then(res => {
        const data = res.data || defaultTeam;

        setTeam({
          heading: data.heading || defaultTeam.heading,
          description: data.description || defaultTeam.description
        });

        setPendingMembers(
          (data.members || []).map(m => ({
            ...m,
            _localId: Math.random().toString(36).slice(2),
            image: m.image ? { ...m.image, isNew: false, markedForDeletion: false } : null
          }))
        );

        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [API]);

  if (loading) return <div>Loading admin panel...</div>;

  // ── Helpers ────────────────────────────────────────────
  const createPreview = file => URL.createObjectURL(file);

  const uploadImage = async file => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await axios.post(`${API}/api/upload`, formData);
    return res.data; // { url, publicId }
  };

  const addMember = () => {
    setPendingMembers(prev => [
      ...prev,
      {
        _localId: Math.random().toString(36).slice(2),
        name: { tag: "h3", text: "" },
        role: { tag: "p", text: "" },
        button: { text: { tag: "span", text: "Contact Now" }, link: "/contact" },
        image: null
      }
    ]);
  };

  const updateMemberField = (index, field, value) => {
    setPendingMembers(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const removeMember = index => {
    setPendingMembers(prev => prev.filter((_, i) => i !== index));
  };

  // ── IMAGE HANDLING ────────────────────────────────────
  const handleImageSelect = (index, file) => {
    if (!file) return;
    const preview = createPreview(file);
    setPendingMembers(prev => {
      const copy = [...prev];
      const oldImage = copy[index].image;
      copy[index].image = {
        url: preview,
        file,
        alt: oldImage?.alt || "",
        isNew: true,
        markedForDeletion: false,
        oldPublicIdToDelete: oldImage?.isNew ? null : oldImage?.publicId || null
      };
      return copy;
    });
  };

const handleReplaceImage = (index, file) => {
  if (!file) return;

  const preview = createPreview(file);

  setPendingMembers(prev => {
    const copy = [...prev];
    const oldImage = copy[index].image;

    copy[index].image = {
      url: preview,
      file,                   // ← will trigger upload on save
      alt: oldImage?.alt || "",
      isNew: true,
      markedForDeletion: false,
      // Crucial: remember old Cloudinary publicId to delete it later
      oldPublicIdToDelete: oldImage && !oldImage.isNew ? oldImage.publicId : null
    };

    return copy;
  });
};
  const removeImage = index => {
    setPendingMembers(prev => {
      const copy = [...prev];
      const img = copy[index].image;
      if (img?.publicId && !img.isNew) {
        copy[index].image = { ...img, markedForDeletion: true };
      } else {
        copy[index].image = null;
      }
      return copy;
    });
  };

  // ── SAVE ─────────────────────────────────────────────
 const handleSave = async () => {
  try {
    setSaving(true);

    // 1. Collect ALL publicIds that need to be deleted
    const deletedPublicIds = new Set();

    pendingMembers.forEach(member => {
      // Explicitly removed images
      if (member.image?.markedForDeletion && member.image?.publicId) {
        deletedPublicIds.add(member.image.publicId);
      }
      // Replaced images (old version)
      if (member.image?.oldPublicIdToDelete) {
        deletedPublicIds.add(member.image.oldPublicIdToDelete);
      }
    });

    // 2. Process each member
    const finalMembers = await Promise.all(
      pendingMembers.map(async (m) => {
        let image = null;

        if (m.image?.file) {
          // New upload (either brand new or replacement)
          const uploaded = await uploadImage(m.image.file);
          image = {
            url: uploaded.url,
            publicId: uploaded.publicId,
            alt: m.image.alt?.trim() || ""
          };
        } else if (m.image && !m.image.markedForDeletion) {
          // Keep existing image
          image = {
            url: m.image.url,
            publicId: m.image.publicId,
            alt: m.image.alt?.trim() || ""
          };
        }

        return {
          name: { tag: m.name?.tag || "h3", text: m.name?.text?.trim() || "" },
          role: { tag: m.role?.tag || "p", text: m.role?.text?.trim() || "" },
          button: {
            text: {
              tag: m.button?.text?.tag || "span",
              text: m.button?.text?.text?.trim() || "Contact Now"
            },
            link: m.button?.link?.trim() || ""
          },
          image
        };
      })
    );

    // 3. Send to server
    await axios.post(`${API}/api/team-section`, {
      heading: team.heading,
      description: team.description,
      members: finalMembers,
      deletedPublicIds: [...deletedPublicIds]
    });

    alert("Team section saved successfully!");
    window.location.reload();
  } catch (err) {
    console.error(err);
    alert("Save failed: " + (err.response?.data?.message || err.message));
  } finally {
    setSaving(false);
  }
};

  // ── RENDER ───────────────────────────────────────────
  return (
    <div className="team-admin">
      <h1>Edit Team Section</h1>

      {/* Heading */}
      <h3>Section Heading</h3>
      <select
        value={team.heading.tag}
        onChange={e => setTeam(p => ({ ...p, heading: { ...p.heading, tag: e.target.value } }))}
      >
        {tagOptions.map(tag => <option key={tag} value={tag}>{tag.toUpperCase()}</option>)}
      </select>
      <input
        value={team.heading.text}
        onChange={e => setTeam(p => ({ ...p, heading: { ...p.heading, text: e.target.value } }))}
        placeholder="Main heading..."
        style={{ display: "block", width: "100%", margin: "8px 0" }}
      />

      {/* Description */}
      <h3>Description</h3>
      <SimpleEditor
        value={team.description.text}
        onChange={val => setTeam(p => ({ ...p, description: { ...p.description, text: val } }))}
      />

      <hr style={{ margin: "30px 0" }} />

      <h2>Team Members</h2>

      {pendingMembers.map((member, index) => (
        <div key={member._localId} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16, marginBottom: 20, background: "#fafafa" }}>
          
          {/* Name */}
          <div style={{ marginBottom: 12 }}>
            <label>Name</label>
            <select
              value={member.name?.tag}
              onChange={e => updateMemberField(index, "name", { ...member.name, tag: e.target.value })}
            >
              {tagOptions.map(tag => <option key={tag} value={tag}>{tag.toUpperCase()}</option>)}
            </select>
            <input
              value={member.name?.text || ""}
              onChange={e => updateMemberField(index, "name", { ...member.name, text: e.target.value })}
              placeholder="Full name"
              style={{ width: "100%", marginTop: 4 }}
            />
          </div>

          {/* Role */}
          <div style={{ marginBottom: 12 }}>
            <label>Role / Position</label>
            <select
              value={member.role?.tag}
              onChange={e => updateMemberField(index, "role", { ...member.role, tag: e.target.value })}
            >
              {tagOptions.map(tag => <option key={tag} value={tag}>{tag.toUpperCase()}</option>)}
            </select>
            <input
              value={member.role?.text || ""}
              onChange={e => updateMemberField(index, "role", { ...member.role, text: e.target.value })}
              placeholder="Role / Position"
              style={{ width: "100%", marginTop: 4 }}
            />
          </div>

          {/* Button */}
          <div style={{ margin: "16px 0" }}>
            <h4>Contact Button</h4>
            <select
              value={member.button?.text?.tag}
              onChange={e => updateMemberField(index, "button", { ...member.button, text: { ...member.button.text, tag: e.target.value } })}
            >
              {tagOptions.map(tag => <option key={tag} value={tag}>{tag.toUpperCase()}</option>)}
            </select>
            <input
              value={member.button?.text?.text || ""}
              onChange={e => updateMemberField(index, "button", { ...member.button, text: { ...member.button.text, text: e.target.value } })}
              placeholder="Button text"
              style={{ display: "block", marginTop: 4 }}
            />
            <input
              value={member.button?.link || ""}
              onChange={e => updateMemberField(index, "button", { ...member.button, link: e.target.value })}
              placeholder="Link (internal or external)"
              style={{ marginTop: 8 }}
            />
          </div>

          {/* Image */}
          {/* Image */}
<h4>Photo</h4>

{!member.image || member.image.markedForDeletion ? (
  // No image or marked for deletion → show add input
  <input
    type="file"
    accept="image/*"
    onChange={(e) => e.target.files?.[0] && handleReplaceImage(index, e.target.files[0])}
  />
) : (
  // Has image → show preview + controls
  <div style={{ marginTop: 12 }}>
    <img
      src={member.image.url}
      alt={member.image.alt || "team member"}
      width={140}
      style={{ borderRadius: 8, objectFit: "cover" }}
    />

    <div style={{ marginTop: 12, display: "flex", gap: 12, alignItems: "center" }}>
      <button
        type="button"
        onClick={() => document.getElementById(`replace-member-${member._localId}`).click()}
        style={{
          padding: "6px 12px",
          background: "#0d6efd",
          color: "white",
          border: "none",
          borderRadius: 4,
          cursor: "pointer"
        }}
      >
        Replace Photo
      </button>

      <button
        onClick={() => removeImage(index)}
        style={{
          padding: "6px 12px",
          background: "#dc3545",
          color: "white",
          border: "none",
          borderRadius: 4,
          cursor: "pointer"
        }}
      >
        Remove Photo
      </button>
    </div>

    <input
      type="text"
      placeholder="Image alt text"
      value={member.image.alt || ""}
      onChange={(e) =>
        updateMemberField(index, "image", { ...member.image, alt: e.target.value })
      }
      style={{ display: "block", marginTop: 12, width: "100%" }}
    />

    {/* Hidden file input for replace */}
    <input
      id={`replace-member-${member._localId}`}
      type="file"
      accept="image/*"
      style={{ display: "none" }}
      onChange={(e) => e.target.files?.[0] && handleReplaceImage(index, e.target.files[0])}
    />
  </div>
)}

          <button
            onClick={() => removeMember(index)}
          >
            Remove This Member
          </button>
        </div>
      ))}

      <button onClick={addMember}>
        + Add New Team Member
      </button>

      <br /><br />

      <button
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? "Saving..." : "Save All Changes"}
      </button>
    </div>
  );
};

export default AdminTeamSection;
