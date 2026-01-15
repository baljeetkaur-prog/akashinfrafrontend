import { useState, useEffect } from "react";
import axios from "axios";
import "./GalleryAdmin.css";

const block = (value, tag = "p") => {
  if (!value) return { tag, text: "" };
  if (typeof value === "string") return { tag, text: value };
  return { tag: value.tag || tag, text: value.text || "" };
};

const AdminGallery = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const API = process.env.REACT_APP_APIURL;

  // Pending images for preview & upload management
  const [pendingImages, setPendingImages] = useState([]); // { id, url, file?, isNew?, markedForDeletion?, alt }

  useEffect(() => {
    axios
      .get(`${API}/api/gallery`)
      .then(res => {
        const d = res.data || {};

        d.seo ||= { title: "", description: "", keywords: "" };
        d.banner ||= { heading: {}, image: "" };
        d.mainTitle ||= { tag: "h2", text: "The Vision of Dholera Captured" };
        d.images ||= Array.from({ length: 20 }, (_, i) => ({ url: "" }));

        d.banner.heading = block(d.banner.heading, "h1");
        d.mainTitle = block(d.mainTitle, "h2");

        setData(d);

    setPendingImages(
  d.images.map(img => ({
    id: Math.random().toString(36),
    url: img.url,
    publicId: img.publicId || "",   // ✅ add publicId
    file: null,
    isNew: false,
    markedForDeletion: false,
    alt: img.alt || ""
  }))
);

        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [API]);

  const createPreview = (file) => URL.createObjectURL(file);

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await axios.post(`${API}/api/upload`, formData);
    return {
      url: res.data.url,
      publicId: res.data.publicId
    };
  };

  const handleAddImages = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newImgs = files.map(file => ({
      id: Math.random().toString(36),
      url: createPreview(file),
      file,
      alt: "",
      isNew: true,
      markedForDeletion: false
    }));

    setPendingImages(prev => [...prev, ...newImgs].slice(0, 20));
  };

  const handleReplaceImage = (index, file) => {
    const previewUrl = createPreview(file);
    setPendingImages(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        url: previewUrl,
        file,
        isNew: true,
        markedForDeletion: false
      };
      return updated;
    });
  };
const handleDeleteImage = (index) => {
  setPendingImages(prev => {
    const updated = [...prev];
    updated[index].markedForDeletion = true; // mark for deletion
    return updated; // do NOT filter it yet
  });
};

  const updateField = (path, value) => {
    setData(prev => {
      const updated = structuredClone(prev);
      let ref = updated;
      for (let i = 0; i < path.length - 1; i++) ref = ref[path[i]];
      ref[path[path.length - 1]] = value;
      return updated;
    });
  };

const handleSubmit = async () => {
  try {
    setSaving(true);

    // 1️⃣ Delete images marked for deletion from Cloudinary
    const stillPending = [];
    for (const img of pendingImages) {
      if (img.markedForDeletion && img.publicId) {
        await axios.post(`${API}/api/delete-image`, { publicId: img.publicId });
      } else if (!img.markedForDeletion) {
        stillPending.push(img);
      }
    }

    // 2️⃣ Upload new images & prepare final array
    const finalImages = [];
    for (const img of stillPending) {
      if (img.isNew && img.file) {
        const uploaded = await uploadImage(img.file);
        finalImages.push({ ...uploaded, alt: img.alt || "" });
      } else {
        finalImages.push({ url: img.url, publicId: img.publicId, alt: img.alt || "" });
      }
    }

    // 3️⃣ Save final images to backend
    const payload = { ...data, images: finalImages.slice(0, 20) };
    await axios.post(`${API}/api/gallery`, payload);

    setData(payload);
    setPendingImages(finalImages); // update local state
    alert("Gallery updated successfully!");
  } catch (err) {
    console.error(err);
    alert("Save failed");
  } finally {
    setSaving(false);
  }
};


  if (loading || !data) return <div>Loading...</div>;

  return (
   <div className="gallery-admin">
      <h1>Admin - Gallery Page Editor</h1>

      {/* SEO */}
{/* SEO */}
<h2>SEO Settings</h2>

<label>Meta Title</label>
<input
  type="text"
  placeholder="Enter Meta Title (shown in browser tab & Google)"
  value={data.seo.title}
  onChange={e => updateField(["seo", "title"], e.target.value)}
/>

<label>Meta Description</label>
<input
  type="text"
  placeholder="Enter Meta Description (shown in Google search)"
  value={data.seo.description}
  onChange={e => updateField(["seo", "description"], e.target.value)}
/>

<label>Meta Keywords</label>
<input
  type="text"
  placeholder="Enter keywords separated by commas"
  value={data.seo.keywords}
  onChange={e => updateField(["seo", "keywords"], e.target.value)}
/>


      {/* Banner */}
      <h2>Banner</h2>
      <select value={data.banner.heading.tag} onChange={e => updateField(["banner", "heading", "tag"], e.target.value)}>
        <option value="h1">H1</option>
        <option value="h2">H2</option>
        <option value="h3">H3</option>
      </select>
      <input placeholder="Banner Heading Text" value={data.banner.heading.text} onChange={e => updateField(["banner", "heading", "text"], e.target.value)}/>

      {/* Main Title */}
      <h2>Main Title</h2>
      <select value={data.mainTitle.tag} onChange={e => updateField(["mainTitle", "tag"], e.target.value)}>
        <option value="h2">H2</option>
        <option value="h3">H3</option>
      </select>
      <input placeholder="Main Title Text" value={data.mainTitle.text} onChange={e => updateField(["mainTitle", "text"], e.target.value)}/>

      {/* Gallery Images */}
      <h2>Gallery Images (Max 20)</h2>
      <input type="file" accept="image/*" multiple onChange={handleAddImages} />

   <div className="gallery-image-flex">
{pendingImages
  .filter(img => !img.markedForDeletion)
  .map((img, i) => (
   <div key={img.id} className="gallery-image-card">
      <img src={img.url} alt={img.alt || `gallery-${i}`} width="150" />
      <input
        type="text"
        placeholder="Alt text"
        value={img.alt}
        onChange={e => {
          const val = e.target.value;
          setPendingImages(prev => {
            const updated = [...prev];
            const realIndex = prev.findIndex(p => p.id === img.id); // find correct index
            if (realIndex !== -1) updated[realIndex].alt = val;
            return updated;
          });
        }}
      />
      <div>
        <button onClick={() => document.getElementById(`replace-${i}`).click()}>Replace</button>
        <button
          onClick={() => {
            const realIndex = pendingImages.findIndex(p => p.id === img.id);
            if (realIndex !== -1) handleDeleteImage(realIndex);
          }}
        >
          Delete
        </button>
      </div>
      <input
        id={`replace-${i}`}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={e => {
          const file = e.target.files[0];
          if (!file) return;
          const realIndex = pendingImages.findIndex(p => p.id === img.id);
          if (realIndex !== -1) handleReplaceImage(realIndex, file);
        }}
      />
    </div>
  ))}


      </div>
      <button onClick={handleSubmit} disabled={saving}>
        {saving ? "Saving..." : "Save All Changes"}
      </button>
    </div>
  );
};

export default AdminGallery;
