import { useState, useEffect } from "react";
import axios from "axios";
import SimpleEditor from "./SimpleEditor"; // ← assuming you have this component
import './ConnectivitiesAdmin.css';

const defaultData = {
  leftCards: [],
  rightContent: {
    subtitle: { tag: "p", text: "" },
    mainHeading: { tag: "h2", text: "" },
    paragraph: { tag: "p", text: "" },
    statNumber: { tag: "p", text: "" },
    statText: { tag: "p", text: "" },
    button: { text: { tag: "p", text: "" }, link: "" }
  },
  gallery: []
};

const TAG_OPTIONS = ["h1", "h2", "h3", "h4", "h5", "h6", "p", "span", "strong"];

const AdminConnectivities = () => {
  const API = process.env.REACT_APP_APIURL;
  const [deletedImagePublicIds] = useState(new Set());
  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [pendingLeftCards, setPendingLeftCards] = useState([]);
  const [pendingGallery, setPendingGallery] = useState([]);

  useEffect(() => {
    axios
      .get(`${API}/api/connectivities`)
      .then((res) => {
        if (res.data) {
          setData(res.data);

          setPendingLeftCards(
            (res.data.leftCards || []).map((card) => ({
              ...card,
              id: Math.random().toString(36).slice(2),
              image: {
                ...card.image,
                preview: card.image?.url || "",
                publicId: card.image?.publicId || "",
                isNew: false,
                file: null,
                oldPublicIdToDelete: null
              }
            }))
          );

          setPendingGallery(
            (res.data.gallery || []).map((item) => ({
              ...item,
              id: Math.random().toString(36).slice(2),
              image: {
                ...item.image,
                preview: item.image?.url || "",
                publicId: item.image?.publicId || "",
                isNew: false,
                file: null,
                oldPublicIdToDelete: null
              }
            }))
          );
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [API]);

  if (loading) return <div>Loading...</div>;

  const createPreview = (file) => URL.createObjectURL(file);

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await axios.post(`${API}/api/upload`, formData);
    return res.data; // { url, publicId }
  };

  // ─── Helpers for Left Cards ─────────────────────────────────────
  const addLeftCard = () => {
    setPendingLeftCards((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).slice(2),
        title: { tag: "h4", text: "" },
        image: {
          preview: "",
          publicId: "",
          isNew: false,
          file: null,
          oldPublicIdToDelete: null,
          alt: ""
        }
      }
    ]);
  };

  // ─── Helpers for Gallery ────────────────────────────────────────
  const addGalleryItem = () => {
    setPendingGallery((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).slice(2),
        title: { tag: "h4", text: "" },
        link: "",
        image: {
          preview: "",
          publicId: "",
          isNew: false,
          file: null,
          oldPublicIdToDelete: null,
          alt: ""
        }
      }
    ]);
  };

  const handleReplaceImage = (listSetter, index, file) => {
    const preview = createPreview(file);
    listSetter((prev) => {
      const updated = [...prev];
      const old = updated[index].image;

      updated[index].image = {
        ...old,
        preview,
        file,
        publicId: null,
        isNew: true,
        oldPublicIdToDelete: old.publicId && !old.isNew ? old.publicId : old.oldPublicIdToDelete || null
      };
      return updated;
    });
  };

  const removeLeftCard = (index) => {
    setPendingLeftCards((prev) => {
      const removed = prev[index];
      if (removed?.image?.publicId) {
        deletedImagePublicIds.add(removed.image.publicId);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const removeGalleryItem = (index) => {
    setPendingGallery((prev) => {
      const removed = prev[index];
      if (removed?.image?.publicId) {
        deletedImagePublicIds.add(removed.image.publicId);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  // ─── Main Save Logic (same as before, just cleaned up a bit) ────
  const handleSubmit = async () => {
    setSaving(true);
    try {
      // 1. Collect images to delete (removed + replaced)
      const toDelete = new Set(deletedImagePublicIds);

      pendingLeftCards.forEach((c) => {
        if (c.image?.oldPublicIdToDelete) toDelete.add(c.image.oldPublicIdToDelete);
      });
      pendingGallery.forEach((g) => {
        if (g.image?.oldPublicIdToDelete) toDelete.add(g.image.oldPublicIdToDelete);
      });

      // Delete old images
      await Promise.allSettled(
        [...toDelete].map((publicId) =>
          axios.post(`${API}/api/delete-image`, { publicId }).catch(console.warn)
        )
      );

      // 2. Upload new/replaced images
      const finalLeftCards = await Promise.all(
        pendingLeftCards.map(async (card) => {
          let image = { ...card.image };
          if (image.isNew && image.file) {
            const uploaded = await uploadImage(image.file);
            image = { url: uploaded.url, publicId: uploaded.publicId, alt: image.alt || "" };
          } else if (!image.isNew && image.publicId) {
            image = { url: image.preview, publicId: image.publicId, alt: image.alt || "" };
          } else {
            image = { url: "", publicId: "", alt: "" };
          }
          return { ...card, image };
        })
      );

      const finalGallery = await Promise.all(
        pendingGallery.map(async (item) => {
          let image = { ...item.image };
          if (image.isNew && image.file) {
            const uploaded = await uploadImage(image.file);
            image = { url: uploaded.url, publicId: uploaded.publicId, alt: image.alt || "" };
          } else if (!image.isNew && image.publicId) {
            image = { url: image.preview, publicId: image.publicId, alt: image.alt || "" };
          } else {
            image = { url: "", publicId: "", alt: "" };
          }
          return { ...item, image };
        })
      );

      // 3. Prepare & send payload
      const payload = {
        ...data,
        leftCards: finalLeftCards,
        gallery: finalGallery
      };

      await axios.post(`${API}/api/connectivities`, payload);

      // 4. Refresh
      const fresh = await axios.get(`${API}/api/connectivities`);
      setData(fresh.data);

      setPendingLeftCards(
        fresh.data.leftCards.map((c) => ({
          ...c,
          id: Math.random().toString(36).slice(2),
          image: {
            preview: c.image?.url || "",
            publicId: c.image?.publicId || "",
            alt: c.image?.alt || "",
            isNew: false,
            file: null,
            oldPublicIdToDelete: null
          }
        }))
      );

      setPendingGallery(
        fresh.data.gallery.map((g) => ({
          ...g,
          id: Math.random().toString(36).slice(2),
          image: {
            preview: g.image?.url || "",
            publicId: g.image?.publicId || "",
            alt: g.image?.alt || "",
            isNew: false,
            file: null,
            oldPublicIdToDelete: null
          }
        }))
      );

      alert("Connectivities section updated successfully!");
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save changes. Check console.");
    } finally {
      setSaving(false);
    }
  };

  // ─── RENDER ──────────────────────────────────────────────────────
  return (
      <div className="connectivities-admin">
      <h1>Edit Connectivities Section</h1>

      {/* ================= RIGHT CONTENT ================= */}
      <section style={{ margin: "40px 0" }}>
        <h2>Right Content</h2>

        {["subtitle", "mainHeading", "paragraph", "statNumber", "statText"].map((key) => {
          const field = data.rightContent[key];

          const isRich = key === "paragraph"; // ← only paragraph is rich

          return (
            <div key={key} style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>
                {key.replace(/([A-Z])/g, " $1").toUpperCase()}
              </label>

              <select
                value={field.tag}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    rightContent: {
                      ...prev.rightContent,
                      [key]: { ...field, tag: e.target.value }
                    }
                  }))
                }
                style={{ marginBottom: "8px" }}
              >
                {TAG_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t.toUpperCase()}
                  </option>
                ))}
              </select>

              {isRich ? (
                <SimpleEditor
                  value={field.text}
                  onChange={(html) =>
                    setData((prev) => ({
                      ...prev,
                      rightContent: {
                        ...prev.rightContent,
                        [key]: { ...field, text: html }
                      }
                    }))
                  }
                />
              ) : (
                <input
                  type="text"
                  value={field.text || ""}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      rightContent: {
                        ...prev.rightContent,
                        [key]: { ...field, text: e.target.value }
                      }
                    }))
                  }
                  placeholder={`Enter ${key} text...`}
                  style={{ width: "100%", padding: "10px" }}
                />
              )}
            </div>
          );
        })}

        {/* Button – usually plain */}
        <div style={{ marginTop: "16px" }}>
          <label>Button Text</label>
          <input
            type="text"
            value={data.rightContent.button.text.text || ""}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                rightContent: {
                  ...prev.rightContent,
                  button: {
                    ...prev.rightContent.button,
                    text: { ...prev.rightContent.button.text, text: e.target.value }
                  }
                }
              }))
            }
            style={{ width: "100%", marginTop: 6 }}
          />

          <label style={{ display: "block", margin: "16px 0 8px" }}>Button Link</label>
          <input
            type="text"
            value={data.rightContent.button.link || ""}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                rightContent: {
                  ...prev.rightContent,
                  button: { ...prev.rightContent.button, link: e.target.value }
                }
              }))
            }
            placeholder="Button Link"
            style={{ width: "100%" }}
          />
        </div>
      </section>

      {/* ================= LEFT CARDS ================= */}
      {/* <section>
        <h2>Left Cards</h2>

        {pendingLeftCards.map((card, i) => (
          <div
            key={card.id}
            style={{
              border: "1px solid #e0e0e0",
              padding: "16px",
              marginBottom: "20px",
              borderRadius: "8px",
              background: "#fafafa"
            }}
          >
          
            <div style={{ marginBottom: "16px" }}>
              {card.image?.preview ? (
                <img
                  src={card.image.preview}
                  alt={card.image.alt || "card"}
                  width={200}
                  style={{ borderRadius: 6, objectFit: "cover" }}
                />
              ) : (
                <div
                  style={{
                    width: 200,
                    height: 130,
                    background: "#eee",
                    borderRadius: 6,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  No image
                </div>
              )}

              <div style={{ marginTop: 12 }}>
                <button onClick={() => document.getElementById(`left-img-${i}`).click()}>
                  {card.image?.preview ? "Replace Image" : "Upload Image"}
                </button>
                <button
                  onClick={() => removeLeftCard(i)}
                  style={{ marginLeft: 12, color: "#d32f2f" }}
                >
                  Remove Card
                </button>
              </div>

              <input
                type="file"
                accept="image/*"
                id={`left-img-${i}`}
                style={{ display: "none" }}
                onChange={(e) => e.target.files?.[0] && handleReplaceImage(setPendingLeftCards, i, e.target.files[0])}
              />
            </div>

         
            <div style={{ margin: "16px 0 12px" }}>
              <label>Title Tag</label>
              <select
                value={card.title.tag || "h4"}
                onChange={(e) => {
                  setPendingLeftCards((prev) => {
                    const next = [...prev];
                    next[i].title.tag = e.target.value;
                    return next;
                  });
                }}
                style={{ marginLeft: 12 }}
              >
                {TAG_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <input
              type="text"
              placeholder="Card title"
              value={card.title.text || ""}
              onChange={(e) => {
                setPendingLeftCards((prev) => {
                  const next = [...prev];
                  next[i].title.text = e.target.value;
                  return next;
                });
              }}
              style={{ width: "100%", padding: "10px" }}
            />

      
            <input
              type="text"
              placeholder="Image alt text (important for accessibility)"
              value={card.image?.alt || ""}
              onChange={(e) => {
                setPendingLeftCards((prev) => {
                  const next = [...prev];
                  next[i].image.alt = e.target.value;
                  return next;
                });
              }}
              style={{ width: "100%", marginTop: 16, padding: "10px" }}
            />
          </div>
        ))}

        <button onClick={addLeftCard} style={{ margin: "16px 0" }}>
          + Add Left Card
        </button>
      </section> */}

      {/* ================= GALLERY ================= */}
      {/* <section style={{ marginTop: "60px" }}>
        <h2>Gallery</h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "20px" }}>
          {pendingGallery.map((item, i) => (
            <div
              key={item.id}
              style={{
                border: "1px solid #e0e0e0",
                padding: 16,
                borderRadius: 8,
                background: "#fafafa"
              }}
            >
              {item.image?.preview ? (
                <img
                  src={item.image.preview}
                  alt={item.image.alt}
                  width="100%"
                  style={{ borderRadius: 6, aspectRatio: "4/3", objectFit: "cover" }}
                />
              ) : (
                <div
                  style={{
                    aspectRatio: "4/3",
                    background: "#eee",
                    borderRadius: 6,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  No image
                </div>
              )}

              <div style={{ margin: "12px 0" }}>
                <button onClick={() => document.getElementById(`gallery-img-${i}`).click()}>
                  {item.image?.preview ? "Replace" : "Upload"}
                </button>
                <button
                  onClick={() => removeGalleryItem(i)}
                  style={{ marginLeft: 12, color: "#d32f2f" }}
                >
                  Delete
                </button>
              </div>

              <input
                type="file"
                accept="image/*"
                id={`gallery-img-${i}`}
                style={{ display: "none" }}
                onChange={(e) => e.target.files?.[0] && handleReplaceImage(setPendingGallery, i, e.target.files[0])}
              />

          
              <div style={{ marginTop: 12 }}>
                <label>Title Tag</label>
                <select
                  value={item.title.tag || "h4"}
                  onChange={(e) => {
                    setPendingGallery((prev) => {
                      const next = [...prev];
                      next[i].title.tag = e.target.value;
                      return next;
                    });
                  }}
                  style={{ marginLeft: 12 }}
                >
                  {TAG_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <input
                type="text"
                placeholder="Gallery item title"
                value={item.title.text || ""}
                onChange={(e) => {
                  setPendingGallery((prev) => {
                    const next = [...prev];
                    next[i].title.text = e.target.value;
                    return next;
                  });
                }}
                style={{ width: "100%", marginTop: 8, padding: "10px" }}
              />

              <input
                type="text"
                placeholder="Image alt text"
                value={item.image?.alt || ""}
                onChange={(e) => {
                  setPendingGallery((prev) => {
                    const next = [...prev];
                    next[i].image.alt = e.target.value;
                    return next;
                  });
                }}
                style={{ width: "100%", marginTop: 12, padding: "10px" }}
              />

              <input
                type="text"
                placeholder="Link (optional)"
                value={item.link || ""}
                onChange={(e) => {
                  setPendingGallery((prev) => {
                    const next = [...prev];
                    next[i].link = e.target.value;
                    return next;
                  });
                }}
                style={{ width: "100%", marginTop: 12, padding: "10px" }}
              />
            </div>
          ))}
        </div>

        <button onClick={addGalleryItem} style={{ marginTop: 24 }}>
          + Add Gallery Image
        </button>
      </section><br/> */}
      <div>
        <button
          onClick={handleSubmit}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save All Changes"}
        </button>
      </div>
    </div>
  );
};

export default AdminConnectivities;