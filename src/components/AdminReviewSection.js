import { useState, useEffect } from "react";
import axios from "axios";
import "./AdminReviewSection.css"; 

const defaultReviews = {
  heading: { tag: "h2", text: "" },
  description: { tag: "p", text: "" },

  reviews: [
    {
      rating: 5,
      reviewText: { tag: "p", text: "" },
      author: "",
      highlighted: false,
    },
  ],

  mainImage: null,
  overlay: {
    ratingText: { tag: "h3", text: "" },
    subText: { tag: "p", text: "" },
    userImages: [],
  },
  brands: [],
};

/* ================= IMAGE UPLOAD ================= */
const uploadImage = async (file, API, alt = "") => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await axios.post(`${API}/api/upload`, formData);

  return {
    url: res.data.url,
    publicId: res.data.publicId,
    alt, // ✅ preserve alt text
  };
};

// Reusable component for editing tag + text
const TextBlockEditor = ({
  label,
  value,
  onChange,
  allowedTags = ["p", "h1", "h2", "h3", "h4", "h5", "h6"],
  multiline = true,
}) => {
  return (
    <div>
      <label>
        {label}
      </label>

      <div>
        <select
          value={value.tag}
          onChange={(e) => onChange({ ...value, tag: e.target.value })}
          style={{
            padding: "8px",
            fontSize: "1rem",
            borderRadius: "4px",
            border: "1px solid #ccc",
            width: "180px",
          }}
        >
          {allowedTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag.toUpperCase()}
            </option>
          ))}
        </select>

        {multiline ? (
          <textarea
            value={value.text}
            onChange={(e) => onChange({ ...value, text: e.target.value })}
            rows={label.includes("Review") ? 5 : 3}
            placeholder="Enter content..."
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              resize: "vertical",
              fontSize: "1rem",
            }}
          />
        ) : (
          <input
            type="text"
            value={value.text}
            onChange={(e) => onChange({ ...value, text: e.target.value })}
            placeholder="Enter heading..."
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              fontSize: "1rem",
            }}
          />
        )}
      </div>
    </div>
  );
};

const AdminReviewSection = () => {
  const [data, setData] = useState(defaultReviews);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Pending image states (with previews + metadata)
  const [pendingMainImage, setPendingMainImage] = useState(null);
  const [pendingOverlayImages, setPendingOverlayImages] = useState([]);
  const [pendingBrands, setPendingBrands] = useState([]);

  const API = process.env.REACT_APP_APIURL;

  // Fetch + initialize pending states
  useEffect(() => {
    axios
      .get(`${API}/api/reviews-section`)
      .then((res) => {
        if (res.data) {
          const serverData = res.data;
          setData(serverData);

          // Initialize pending states from server data
          setPendingMainImage(
            serverData.mainImage
              ? { ...serverData.mainImage, id: "main", isNew: false, markedForDeletion: false }
              : null
          );

          setPendingOverlayImages(
            (serverData.overlay?.userImages || []).map((img) => ({
              ...img,
              id: Math.random().toString(36).slice(2),
              isNew: false,
              markedForDeletion: false,
            }))
          );

          setPendingBrands(
            (serverData.brands || []).map((img) => ({
              ...img,
              id: Math.random().toString(36).slice(2),
              isNew: false,
              markedForDeletion: false,
            }))
          );
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load reviews section:", err);
        setLoading(false);
      });
  }, [API]);

  if (loading) return <div style={{ padding: "40px", textAlign: "center" }}>Loading...</div>;

  const createPreview = (file) => URL.createObjectURL(file);

  // ── Main Image Handlers ───────────────────────────────────────
  const handleMainImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const preview = createPreview(file);

    setPendingMainImage({
      url: preview,
      file,
      alt: pendingMainImage?.alt || "",
      isNew: true,
      oldPublicIdToDelete: pendingMainImage?.publicId || undefined,
    });
  };

  const handleDeleteMainImage = () => {
    if (pendingMainImage?.publicId) {
      setPendingMainImage((prev) => ({
        ...prev,
        markedForDeletion: true,
      }));
    } else {
      setPendingMainImage(null);
    }
  };

  // ── Overlay User Images ──────────────────────────────
  const handleAddOverlayImages = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newImages = files.map((file) => ({
      id: Math.random().toString(36).slice(2),
      url: createPreview(file),
      file,
      alt: "",
      isNew: true,
      markedForDeletion: false,
    }));

    setPendingOverlayImages((prev) => [...prev, ...newImages]);
  };

  const handleReplaceOverlayImage = (index, file) => {
    const preview = createPreview(file);
    setPendingOverlayImages((prev) => {
      const updated = [...prev];
      const old = updated[index];

      updated[index] = {
        ...old,
        url: preview,
        file,
        publicId: undefined,
        isNew: true,
        oldPublicIdToDelete: old.publicId && !old.isNew ? old.publicId : undefined,
      };

      return updated;
    });
  };

  const handleDeleteOverlayImage = (index) => {
    setPendingOverlayImages((prev) => {
      const img = prev[index];
      if (img.publicId && !img.isNew) {
        return prev.map((item, i) =>
          i === index ? { ...item, markedForDeletion: true } : item
        );
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  // ── Brands ───────────────────────────────────────────
  const handleAddBrands = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newImages = files.map((file) => ({
      id: Math.random().toString(36).slice(2),
      url: createPreview(file),
      file,
      alt: "",
      isNew: true,
      markedForDeletion: false,
    }));

    setPendingBrands((prev) => [...prev, ...newImages]);
  };

  const handleReplaceBrand = (index, file) => {
    const preview = createPreview(file);
    setPendingBrands((prev) => {
      const updated = [...prev];
      const old = updated[index];

      updated[index] = {
        ...old,
        url: preview,
        file,
        publicId: undefined,
        isNew: true,
        oldPublicIdToDelete: old.publicId && !old.isNew ? old.publicId : undefined,
      };

      return updated;
    });
  };

  const handleDeleteBrand = (index) => {
    setPendingBrands((prev) => {
      const img = prev[index];
      if (img.publicId && !img.isNew) {
        return prev.map((item, i) =>
          i === index ? { ...item, markedForDeletion: true } : item
        );
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  // ── Alt text changes ─────────────────────────────────
  const updateAlt = (setter, index, value) => {
    setter((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], alt: value };
      return updated;
    });
  };

  // ── SAVE ─────────────────────────────────────────────
  const handleSubmit = async () => {
    try {
      setSaving(true);

      // Helper to upload one image
 const uploadIfNeeded = async (item) => {
  if (item?.file) {
    return await uploadImage(item.file, API, item.alt);
  }

  return item && !item.markedForDeletion
    ? { url: item.url, publicId: item.publicId, alt: item.alt || "" }
    : null;
};

      // 1. Upload new / replaced images
      const finalMainImage = pendingMainImage && !pendingMainImage.markedForDeletion
        ? await uploadIfNeeded(pendingMainImage)
        : null;

      const finalOverlayImages = await Promise.all(
        pendingOverlayImages
          .filter((img) => !img.markedForDeletion)
          .map(uploadIfNeeded)
      );

      const finalBrands = await Promise.all(
        pendingBrands
          .filter((img) => !img.markedForDeletion)
          .map(uploadIfNeeded)
      );

      // 2. Collect ALL public IDs that should be deleted
      const deletedPublicIds = new Set();

      // Replaced images (old version replaced by new upload)
      if (pendingMainImage?.oldPublicIdToDelete) {
        deletedPublicIds.add(pendingMainImage.oldPublicIdToDelete);
      }

      pendingOverlayImages.forEach((img) => {
        if (img.oldPublicIdToDelete) deletedPublicIds.add(img.oldPublicIdToDelete);
        if (img.markedForDeletion && img.publicId) deletedPublicIds.add(img.publicId);
      });

      pendingBrands.forEach((img) => {
        if (img.oldPublicIdToDelete) deletedPublicIds.add(img.oldPublicIdToDelete);
        if (img.markedForDeletion && img.publicId) deletedPublicIds.add(img.publicId);
      });

      // Safety net: images that disappeared completely
      const original = await axios.get(`${API}/api/reviews-section`).then((r) => r.data);

      original?.overlay?.userImages?.forEach((oldImg) => {
        const stillExists = finalOverlayImages.some((f) => f?.publicId === oldImg.publicId);
        if (!stillExists && oldImg.publicId) {
          deletedPublicIds.add(oldImg.publicId);
        }
      });

      original?.brands?.forEach((oldImg) => {
        const stillExists = finalBrands.some((f) => f?.publicId === oldImg.publicId);
        if (!stillExists && oldImg.publicId) {
          deletedPublicIds.add(oldImg.publicId);
        }
      });

      if (original?.mainImage?.publicId) {
        const mainStillExists = finalMainImage?.publicId === original.mainImage.publicId;
        if (!mainStillExists) {
          deletedPublicIds.add(original.mainImage.publicId);
        }
      }

      // 3. Prepare payload
      const payload = {
        ...data,
        heading: data.heading,
        description: data.description,
        reviews: data.reviews,
        mainImage: finalMainImage,
        overlay: {
          ...data.overlay,
          userImages: finalOverlayImages,
        },
        brands: finalBrands,
        deletedPublicIds: [...deletedPublicIds],
      };

      // 4. Send to backend
      await axios.post(`${API}/api/reviews-section`, payload);

      alert("Reviews section saved successfully!");

      // 5. Reload fresh data & reset pending states
      const res = await axios.get(`${API}/api/reviews-section`);
      setData(res.data);

      setPendingMainImage(
        res.data.mainImage
          ? { ...res.data.mainImage, id: "main", isNew: false, markedForDeletion: false }
          : null
      );

      setPendingOverlayImages(
        (res.data.overlay?.userImages || []).map((img) => ({
          ...img,
          id: Math.random().toString(36).slice(2),
          isNew: false,
          markedForDeletion: false,
        }))
      );

      setPendingBrands(
        (res.data.brands || []).map((img) => ({
          ...img,
          id: Math.random().toString(36).slice(2),
          isNew: false,
          markedForDeletion: false,
        }))
      );
    } catch (err) {
      console.error("Save failed:", err);
      alert("Save failed: " + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  // ── Review Handlers ───────────────────────────────────────────
  const addReview = () => {
    setData((prev) => ({
      ...prev,
      reviews: [
        ...prev.reviews,
        {
          rating: 5,
          reviewText: { tag: "p", text: "" },
          author: "",
          highlighted: false,
        },
      ],
    }));
  };

  const removeReview = (index) => {
    setData((prev) => ({
      ...prev,
      reviews: prev.reviews.filter((_, i) => i !== index),
    }));
  };

  const updateReviewField = (index, field, value) => {
    setData((prev) => {
      const reviews = [...prev.reviews];
      reviews[index] = { ...reviews[index], [field]: value };
      return { ...prev, reviews };
    });
  };

  const updateReviewTextBlock = (index, newBlock) => {
    setData((prev) => {
      const reviews = [...prev.reviews];
      reviews[index] = { ...reviews[index], reviewText: newBlock };
      return { ...prev, reviews };
    });
  };

  // ── RENDER ────────────────────────────────────────────────────
  return (
    <div className="review-admin">
      <h1>Edit Reviews Section</h1>

      {/* Section Heading */}
      <TextBlockEditor
        label="Section Heading"
        value={data.heading}
        onChange={(newVal) => setData((p) => ({ ...p, heading: newVal }))}
        allowedTags={["h1", "h2", "h3", "h4"]}
        multiline={false}
      />

      {/* Description */}
      <TextBlockEditor
        label="Description (below heading)"
        value={data.description}
        onChange={(newVal) => setData((p) => ({ ...p, description: newVal }))}
        allowedTags={["p", "div", "h5", "h6"]}
      />

      {/* Customer Reviews */}
      <h2>Customer Reviews</h2>

      {data.reviews.map((review, i) => (
        <div
          key={i}
        >
          <div>
            <div>
              <label>Rating</label>
              <input
                type="number"
                min="1"
                max="5"
                value={review.rating}
                onChange={(e) => updateReviewField(i, "rating", Number(e.target.value))}
                style={{ width: "80px", padding: "8px" }}
              />
            </div>

            <div style={{ flex: 1 }}>
              <label>Author</label>
              <input
                type="text"
                value={review.author}
                onChange={(e) => updateReviewField(i, "author", e.target.value)}
                placeholder="e.g. John D."
                style={{ width: "100%", padding: "8px" }}
              />
            </div>
          </div>

          <TextBlockEditor
            label={`Review Text #${i + 1}`}
            value={review.reviewText}
            onChange={(newVal) => updateReviewTextBlock(i, newVal)}
            allowedTags={["p", "div"]}
          />

          <div>
            <label style={{ userSelect: "none" }}>
              <input
                type="checkbox"
                checked={review.highlighted}
                onChange={(e) => updateReviewField(i, "highlighted", e.target.checked)}
              />
              &nbsp; Highlight this review (featured style)
            </label>
          </div>

          <button
            onClick={() => removeReview(i)}
      
          >
            Remove Review
          </button>
        </div>
      ))}<br/>

      <button
        onClick={addReview}
      >
        + Add New Review
      </button>

      {/* MAIN IMAGE */}
      <h2>Main Image</h2>
      <input type="file" accept="image/*" onChange={handleMainImageChange} />

      {pendingMainImage && !pendingMainImage.markedForDeletion && (
        <div>
          <img
            src={pendingMainImage.url}
            alt={pendingMainImage.alt || "preview"}
            style={{ maxWidth: "360px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
          />
          <div>
            <input
              type="text"
              placeholder="Alt text (important for SEO & accessibility)"
              value={pendingMainImage.alt || ""}
              onChange={(e) =>
                setPendingMainImage((prev) => ({ ...prev, alt: e.target.value }))
              }
            
            />
            <button
              onClick={handleDeleteMainImage}
             
            >
              Remove Main Image
            </button>
          </div>
        </div>
      )}

      {/* OVERLAY CONTENT */}
      <h2>Overlay Content (rating badge)</h2>

      <TextBlockEditor
        label="Main Rating Display (e.g. 4.8 / 5)"
        value={data.overlay?.ratingText || { tag: "h3", text: "" }}
        onChange={(newVal) =>
          setData((p) => ({
            ...p,
            overlay: { ...p.overlay, ratingText: newVal },
          }))
        }
        allowedTags={["h2", "h3", "h4", "strong"]}
        multiline={false}
      />

      <TextBlockEditor
        label="Rating Subtext (e.g. Based on 500+ reviews)"
        value={data.overlay?.subText || { tag: "p", text: "" }}
        onChange={(newVal) =>
          setData((p) => ({
            ...p,
            overlay: { ...p.overlay, subText: newVal },
          }))
        }
        allowedTags={["p", "small", "div"]}
      />

      <h3>Overlay User Images (avatars)</h3>
      <input type="file" multiple accept="image/*" onChange={handleAddOverlayImages} />

      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px"}}>
        {pendingOverlayImages.map(
          (img, i) =>
            !img.markedForDeletion && (
              <div
                key={img.id}
                style={{
                  position: "relative",
                  width: "140px",
                  textAlign: "center",
                }}
              >
                <img
                  src={img.url}
                  alt={img.alt || `user-${i}`}
                  style={{
                    width: "100%",
                    height: "140px",
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                />

                <input
                  type="text"
                  placeholder="Alt text"
                  value={img.alt || ""}
                  onChange={(e) => updateAlt(setPendingOverlayImages, i, e.target.value)}
                 
                />

                <div>
                  <button
                    onClick={() => document.getElementById(`replace-overlay-${i}`).click()}
                    style={{ fontSize: "0.8rem" }}
                  >
                    Replace
                  </button>
                  <button
                    onClick={() => handleDeleteOverlayImage(i)}
                    
                  >
                    Delete
                  </button>
                </div>

                <input
                  id={`replace-overlay-${i}`}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => e.target.files?.[0] && handleReplaceOverlayImage(i, e.target.files[0])}
                />
              </div>
            )
        )}
      </div>

      {/* BRANDS */}
      <h2>Brands / Trusted By (Marquee)</h2>
      <input type="file" multiple accept="image/*" onChange={handleAddBrands} />

      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px"}}>
        {pendingBrands.map(
          (img, i) =>
            !img.markedForDeletion && (
              <div key={img.id} style={{ width: "160px", textAlign: "center" }}>
                <img
                  src={img.url}
                  alt={img.alt || `brand-${i}`}
                  style={{ width: "100%", height: "80px", objectFit: "contain" }}
                />

                <input
                  type="text"
                  placeholder="Alt text"
                  value={img.alt || ""}
                  onChange={(e) => updateAlt(setPendingBrands, i, e.target.value)}
                 
                />

                <div>
                  <button
                    onClick={() => document.getElementById(`replace-brand-${i}`).click()}
                    style={{ fontSize: "0.8rem" }}
                  >
                    Replace
                  </button>
                  <button
                    onClick={() => handleDeleteBrand(i)}
                  
                  >
                    Delete
                  </button>
                </div>

                <input
                  id={`replace-brand-${i}`}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => e.target.files?.[0] && handleReplaceBrand(i, e.target.files[0])}
                />
              </div>
            )
        )}
      </div>

      {/* SAVE BUTTON */}
      <div>
        <button
          onClick={handleSubmit}
          disabled={saving}
        >
          {saving ? "Saving..." : "SAVE ALL CHANGES"}
        </button>
      </div>
    </div>
  );
};

export default AdminReviewSection;