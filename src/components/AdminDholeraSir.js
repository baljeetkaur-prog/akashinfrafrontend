import { useState, useEffect } from "react";
import axios from "axios";
import SimpleEditor from "./SimpleEditor";
import "./AdminDholeraSir.css";

const block = (value, tag = "p") => {
  if (!value) return { tag, text: "" };
  if (typeof value === "string") return { tag, text: value };
  return { tag: value.tag || tag, text: value.text || "" };
};

const AdminDholeraSir = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const API = process.env.REACT_APP_APIURL;

  // Pending image states: { url, file?, publicId?, alt?, isNew? }
  const [pendingHeroImage, setPendingHeroImage] = useState(null);
  const [pendingHighlightImage, setPendingHighlightImage] = useState(null);
  const [pendingConnectivityImages, setPendingConnectivityImages] = useState([]); // array of objects per card

  const createPreview = (file) => URL.createObjectURL(file);
  const EditableTextBlock = ({ value, onChange, style }) => {
  return (
    <div style={{ marginBottom: "10px", ...style }}>
      <select
        value={value.tag}
        onChange={(e) => onChange({ ...value, tag: e.target.value })}
        style={{ marginRight: "10px" }}
      >
        <option value="p">P</option>
        <option value="h1">H1</option>
        <option value="h2">H2</option>
        <option value="h3">H3</option>
        <option value="h4">H4</option>
        <option value="h5">H5</option>
      </select>
      <SimpleEditor
        value={value.text}
        onChange={(text) => onChange({ ...value, text })}
        style={{ width: "80%" }}
      />
    </div>
  );
};


  // Upload a single image to Cloudinary
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await axios.post(`${API}/api/upload`, formData);
    return { url: res.data.url, publicId: res.data.publicId };
  };

  // Delete image from Cloudinary
  const deleteFromCloudinary = async (publicId) => {
    if (!publicId) return;
    try {
      await axios.post(`${API}/api/delete-image`, { publicId });
    } catch (err) {
      console.error("Failed to delete image from Cloudinary:", publicId);
    }
  };

  useEffect(() => {
    axios
      .get(`${API}/api/dholera-sir`)
      .then((res) => {
        const d = res.data || {};

        // Default structure initialization
        d.breadcrumb ||= { parent: "", current: "" };
        d.seo ||= { title: "", description: "", keywords: "" };
        d.heroSection ||= {
          smallHeading: {},
          bigHeading: {},
          bannerHeading: {},
          paragraphs: [],
          image: "",
          publicId: "",
          alt: "",
        };
        d.importance ||= { heading: {}, paragraph: {}, cards: [] };
        d.highlight ||= { image: "", publicId: "", alt: "", tickList: [] };
        d.connectivity ||= {
          heading: {},
          paragraph: {},
          cards: [],
          lastCard: { heading1: {}, heading2: {}, buttonText: {}, link: "" },
        };

        // Normalize all text blocks
        d.heroSection.smallHeading = block(d.heroSection.smallHeading, "p");
        d.heroSection.bigHeading = block(d.heroSection.bigHeading, "h1");
        d.heroSection.bannerHeading = block(d.heroSection.bannerHeading, "h1");
        d.heroSection.paragraphs = (d.heroSection.paragraphs || []).map((p) => block(p));

        d.importance.heading = block(d.importance.heading, "h2");
        d.importance.paragraph = block(d.importance.paragraph);
        d.importance.cards = (d.importance.cards || []).map((c) => ({
          text: block(c.text || c, "p"),
          icon: c.icon || "",
        }));

        d.highlight.tickList = (d.highlight.tickList || []).map((t) => block(t));

        d.connectivity.heading = block(d.connectivity.heading, "h2");
        d.connectivity.paragraph = block(d.connectivity.paragraph);
        d.connectivity.cards = (d.connectivity.cards || []).map((c) => ({
          heading: block(c.heading, "h3"),
          text: block(c.text, "p"),
          link: c.link || "",
          image: c.image || "",
          publicId: c.publicId || "",
          alt: c.alt || "", // ← Preserve alt text
        }));
        d.connectivity.lastCard ||= {
          heading1: {},
          heading2: {},
          buttonText: {},
          link: "",
        };
        d.connectivity.lastCard.heading1 = block(d.connectivity.lastCard.heading1, "h3");
        d.connectivity.lastCard.heading2 = block(d.connectivity.lastCard.heading2, "h3");
        d.connectivity.lastCard.buttonText = block(d.connectivity.lastCard.buttonText, "p");

        setData(d);

        // Initialize pending images with publicId and alt
        setPendingHeroImage(
          d.heroSection.image
            ? {
                url: d.heroSection.image,
                publicId: d.heroSection.publicId || "",
                alt: d.heroSection.alt || "",
                isNew: false,
              }
            : null
        );
        setPendingHighlightImage(
          d.highlight.image
            ? {
                url: d.highlight.image,
                publicId: d.highlight.publicId || "",
                alt: d.highlight.alt || "",
                isNew: false,
              }
            : null
        );
        setPendingConnectivityImages(
          d.connectivity.cards.map((card) =>
            card.image
              ? {
                  url: card.image,
                  publicId: card.publicId || "",
                  alt: card.alt || "",
                  isNew: false,
                }
              : null
          )
        );

        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [API]);

  const update = (path, value) => {
    setData((prev) => {
      const updated = structuredClone(prev);
      let ref = updated;
      for (let i = 0; i < path.length - 1; i++) {
        ref = ref[path[i]];
      }
      ref[path[path.length - 1]] = value;
      return updated;
    });
  };

  // Image handlers — preserve existing alt text when replacing
  const handleHeroImageChange = (file) => {
    if (!file) return;
    setPendingHeroImage({
      url: createPreview(file),
      file,
      alt: pendingHeroImage?.alt || "", // keep current alt
      isNew: true,
    });
  };

  const handleHighlightImageChange = (file) => {
    if (!file) return;
    setPendingHighlightImage({
      url: createPreview(file),
      file,
      alt: pendingHighlightImage?.alt || "",
      isNew: true,
    });
  };

  const handleConnectivityImageChange = (index, file) => {
    if (!file) return;
    setPendingConnectivityImages((prev) => {
      const updated = [...prev];
      updated[index] = {
        url: createPreview(file),
        file,
        alt: prev[index]?.alt || "", // preserve alt
        isNew: true,
      };
      return updated;
    });
  };

  const removePendingImage = (setter, index = null) => {
    if (index !== null) {
      setter((prev) => {
        const updated = [...prev];
        updated[index] = null;
        return updated;
      });
    } else {
      setter(null);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const imagesToDelete = [];

    try {
      // === Hero Image ===
      let finalHero = { image: "", publicId: "", alt: "" };
      if (pendingHeroImage) {
        if (pendingHeroImage.isNew && pendingHeroImage.file) {
          if (pendingHeroImage.publicId) imagesToDelete.push(pendingHeroImage.publicId);
          const uploaded = await uploadImage(pendingHeroImage.file);
          finalHero = {
            image: uploaded.url,
            publicId: uploaded.publicId,
            alt: pendingHeroImage.alt || "",
          };
        } else {
          finalHero = {
            image: pendingHeroImage.url,
            publicId: pendingHeroImage.publicId || "",
            alt: pendingHeroImage.alt || "",
          };
        }
      } else {
        if (data.heroSection.publicId) imagesToDelete.push(data.heroSection.publicId);
        finalHero.alt = ""; // clear alt if image removed
      }

      // === Highlight Image ===
      let finalHighlight = { image: "", publicId: "", alt: "" };
      if (pendingHighlightImage) {
        if (pendingHighlightImage.isNew && pendingHighlightImage.file) {
          if (pendingHighlightImage.publicId) imagesToDelete.push(pendingHighlightImage.publicId);
          const uploaded = await uploadImage(pendingHighlightImage.file);
          finalHighlight = {
            image: uploaded.url,
            publicId: uploaded.publicId,
            alt: pendingHighlightImage.alt || "",
          };
        } else {
          finalHighlight = {
            image: pendingHighlightImage.url,
            publicId: pendingHighlightImage.publicId || "",
            alt: pendingHighlightImage.alt || "",
          };
        }
      } else {
        if (data.highlight.publicId) imagesToDelete.push(data.highlight.publicId);
        finalHighlight.alt = "";
      }

      // === Connectivity Cards Images ===
      const finalCards = data.connectivity.cards.map((card, i) => {
        const pending = pendingConnectivityImages[i];
        let image = "";
        let publicId = "";
        let alt = card.alt || "";

        if (pending) {
          if (pending.isNew && pending.file) {
            return { ...card, _pendingFile: pending.file, alt: pending.alt || "" };
          } else {
            image = pending.url;
            publicId = pending.publicId || "";
            alt = pending.alt || "";
          }
        } else {
          if (card.publicId) imagesToDelete.push(card.publicId);
          alt = ""; // clear alt if image deleted
        }

        return { ...card, image, publicId, alt };
      });

      // Upload pending connectivity images
      for (let i = 0; i < finalCards.length; i++) {
        if (finalCards[i]._pendingFile) {
          const uploaded = await uploadImage(finalCards[i]._pendingFile);
          finalCards[i].image = uploaded.url;
          finalCards[i].publicId = uploaded.publicId;
          finalCards[i].alt = finalCards[i].alt; // already set above
          delete finalCards[i]._pendingFile;
        }
      }

      // Delete old images
      await Promise.all(imagesToDelete.map((id) => deleteFromCloudinary(id)));

      // Final payload
      const payload = {
        ...data,
        heroSection: {
          ...data.heroSection,
          image: finalHero.image,
          publicId: finalHero.publicId,
          alt: finalHero.alt,
        },
        highlight: {
          ...data.highlight,
          image: finalHighlight.image,
          publicId: finalHighlight.publicId,
          alt: finalHighlight.alt,
        },
        connectivity: {
          ...data.connectivity,
          cards: finalCards.map((c) => ({
            heading: c.heading,
            text: c.text,
            link: c.link,
            image: c.image,
            publicId: c.publicId,
            alt: c.alt,
          })),
        },
      };

      await axios.post(`${API}/api/dholera-sir`, payload);
      alert("Dholera SIR page updated successfully!");

      // Update local state after save
      setData(payload);
      setPendingHeroImage(
        finalHero.image
          ? { url: finalHero.image, publicId: finalHero.publicId, alt: finalHero.alt, isNew: false }
          : null
      );
      setPendingHighlightImage(
        finalHighlight.image
          ? { url: finalHighlight.image, publicId: finalHighlight.publicId, alt: finalHighlight.alt, isNew: false }
          : null
      );
      setPendingConnectivityImages(
        finalCards.map((c) =>
          c.image
            ? { url: c.image, publicId: c.publicId, alt: c.alt, isNew: false }
            : null
        )
      );
    } catch (err) {
      console.error(err);
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !data) return <div>Loading...</div>;

  return (
    <div className="admin-dholera-sir">
      <h1>Admin - Dholera SIR Page Editor</h1>

      {/* SEO Settings */}
      <h2>SEO Settings</h2>

<label>Meta Title</label>
<input
  type="text"
  value={data.seo.title}
  onChange={e => update(["seo", "title"], e.target.value)}
  placeholder="Enter meta title"
/>

<label>Meta Description</label>
<textarea
  value={data.seo.description}
  onChange={e => update(["seo", "description"], e.target.value)}
  placeholder="Enter meta description"
/>

<label>Meta Keywords</label>
<textarea
  value={data.seo.keywords}
  onChange={e => update(["seo", "keywords"], e.target.value)}
  placeholder="keyword1, keyword2, keyword3"
/>


      <div style={{ marginBottom: "20px" }}>
        <label>Banner Heading Tag: </label>
        <select value={data.heroSection.bannerHeading.tag} onChange={(e) => update(["heroSection", "bannerHeading", "tag"], e.target.value)}>
          <option value="h1">H1</option>
          <option value="h2">H2</option>
          <option value="h3">H3</option>
        </select>
        <input placeholder="Banner Heading Text" value={data.heroSection.bannerHeading.text} onChange={(e) => update(["heroSection", "bannerHeading", "text"], e.target.value)} style={{ width: "70%", marginLeft: "10px" }} />
      </div>

      {/* Breadcrumb */}
    <h2>Breadcrumb</h2>

<label>Parent</label>
<input
  placeholder="Parent (e.g. Home)"
  value={data.breadcrumb.parent}
  onChange={(e) => update(["breadcrumb", "parent"], e.target.value)}
/>

<label>Current Page</label>
<input
  placeholder="Current Page Name"
  value={data.breadcrumb.current}
  onChange={(e) => update(["breadcrumb", "current"], e.target.value)}
/>

      {/* Hero Section */}
      <h2>Hero Section</h2>
      <div style={{ marginBottom: "10px" }}>
        <label>Small Heading Tag: </label>
        <select value={data.heroSection.smallHeading.tag} onChange={(e) => update(["heroSection", "smallHeading", "tag"], e.target.value)}>
          <option value="p">P</option>
          <option value="h4">H4</option>
        </select>
        <input placeholder="Small Heading Text" value={data.heroSection.smallHeading.text} onChange={(e) => update(["heroSection", "smallHeading", "text"], e.target.value)} style={{ width: "70%", marginLeft: "10px" }} />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Big Heading Tag: </label>
        <select value={data.heroSection.bigHeading.tag} onChange={(e) => update(["heroSection", "bigHeading", "tag"], e.target.value)}>
          <option value="h1">H1</option>
          <option value="h2">H2</option>
        </select>
        <input placeholder="Big Heading Text" value={data.heroSection.bigHeading.text} onChange={(e) => update(["heroSection", "bigHeading", "text"], e.target.value)} style={{ width: "70%", marginLeft: "10px" }} />
      </div>

<h3>Paragraphs</h3>
{data.heroSection.paragraphs.map((p, i) => (
  <div key={i}>
    {/* Tag Selector */}
    <select
      value={p.tag}
      onChange={(e) => {
        const arr = [...data.heroSection.paragraphs];
        arr[i].tag = e.target.value;
        update(["heroSection", "paragraphs"], arr);
      }}
    >
      <option value="p">P</option>
      <option value="h5">H5</option>
    </select>

    {/* SimpleEditor for paragraph text */}
    <SimpleEditor
      value={p.text}
      onChange={(val) => {
        const arr = [...data.heroSection.paragraphs];
        arr[i].text = val;
        update(["heroSection", "paragraphs"], arr);
      }}
      style={{ marginTop: "5px", width: "100%" }}
    />

    {/* Delete Paragraph */}
    <button
      onClick={() => {
        const arr = data.heroSection.paragraphs.filter((_, idx) => idx !== i);
        update(["heroSection", "paragraphs"], arr);
      }}
      style={{ marginTop: "5px", color: "red" }}
    >
      Delete
    </button>
  </div>
))}
<button
  onClick={() => update(["heroSection", "paragraphs"], [...data.heroSection.paragraphs, { tag: "p", text: "" }])}
  style={{ marginTop: "10px" }}
>
  Add Paragraph
</button>


      <h3>Hero Image</h3>
      <input type="file" accept="image/*" id="hero-upload" style={{ display: "none" }} onChange={(e) => e.target.files[0] && handleHeroImageChange(e.target.files[0])} />
      <div style={{ margin: "20px 0" }}>
        {pendingHeroImage ? (
          <div style={{ display: "inline-block", textAlign: "center" }}>
            <img src={pendingHeroImage.url} alt="Hero preview" width="300" style={{ objectFit: "cover" }} />
            <div style={{ marginTop: "10px" }}>
              <button onClick={() => document.getElementById("hero-upload").click()}>Replace</button>
              <button onClick={() => setPendingHeroImage(null)} style={{ marginLeft: "10px", color: "red" }}>
                Delete
              </button>
            </div>
            <div style={{ marginTop: "15px" }}>
              <label>Alt Text:</label>
              <input
                type="text"
                placeholder="Describe the hero image (for accessibility)"
                value={pendingHeroImage.alt || ""}
                onChange={(e) => setPendingHeroImage((prev) => ({ ...prev, alt: e.target.value }))}
                style={{ width: "100%", marginTop: "5px" }}
              />
            </div>
          </div>
        ) : (
          <button onClick={() => document.getElementById("hero-upload").click()}>Upload Hero Image</button>
        )}
      </div>

      {/* Importance Section */}
      <h2>Importance Section</h2>
<EditableTextBlock
  value={data.importance.heading}
  onChange={(val) => update(["importance", "heading"], val)}
/>
<EditableTextBlock
  value={data.importance.paragraph}
  onChange={(val) => update(["importance", "paragraph"], val)}
/>

<h3>Cards</h3>
{data.importance.cards.map((c, i) => (
  <div key={i}>
<EditableTextBlock
  value={c.text}
  onChange={(val) => {
    const arr = [...data.importance.cards];
    arr[i].text = val;
    update(["importance", "cards"], arr);
  }}
/>

    <button onClick={() => {
      const arr = data.importance.cards.filter((_, idx) => idx !== i);
      update(["importance", "cards"], arr);
    }} style={{ color: "red", marginTop: "10px" }}>Delete Card</button>
  </div>
))}
<button onClick={() => update(["importance", "cards"], [...data.importance.cards, { text: { tag: "p", text: "" } }])}>
  Add Importance Card
</button>


      {/* Highlight Section */}
      <h2>Highlight Section</h2>
      <input type="file" accept="image/*" id="highlight-upload" style={{ display: "none" }} onChange={(e) => e.target.files[0] && handleHighlightImageChange(e.target.files[0])} />
      <div style={{ margin: "20px 0" }}>
        {pendingHighlightImage ? (
          <div style={{ display: "inline-block", textAlign: "center" }}>
            <img src={pendingHighlightImage.url} alt="Highlight preview" width="300" />
            <div style={{ marginTop: "10px" }}>
              <button onClick={() => document.getElementById("highlight-upload").click()}>Replace</button>
              <button onClick={() => setPendingHighlightImage(null)} style={{ marginLeft: "10px", color: "red" }}>
                Delete
              </button>
            </div>
            <div style={{ marginTop: "15px" }}>
              <label>Alt Text:</label>
              <input
                type="text"
                placeholder="Describe the highlight image"
                value={pendingHighlightImage.alt || ""}
                onChange={(e) => setPendingHighlightImage((prev) => ({ ...prev, alt: e.target.value }))}
                style={{ width: "100%", marginTop: "5px" }}
              />
            </div>
          </div>
        ) : (
          <button onClick={() => document.getElementById("highlight-upload").click()}>Upload Highlight Image</button>
        )}
      </div>

      <h3>Tick List Items</h3>
      {data.highlight.tickList.map((t, i) => (
        <div key={i} style={{ marginBottom: "10px" }}>
          <input value={t.text} onChange={(e) => { const arr = [...data.highlight.tickList]; arr[i].text = e.target.value; update(["highlight", "tickList"], arr); }} style={{ width: "80%" }} />
          <button onClick={() => { const arr = data.highlight.tickList.filter((_, idx) => idx !== i); update(["highlight", "tickList"], arr); }} style={{ marginLeft: "10px", color: "red" }}>
            Delete
          </button>
        </div>
      ))}
      <button onClick={() => update(["highlight", "tickList"], [...data.highlight.tickList, { tag: "p", text: "" }])}>
        Add Tick Item
      </button>

      {/* Connectivity Section */}
      <h2>Connectivity Section</h2>
      <select value={data.connectivity.heading.tag} onChange={(e) => update(["connectivity", "heading", "tag"], e.target.value)}>
        <option value="h2">H2</option>
        <option value="h3">H3</option>
      </select>
      <input placeholder="Section Heading" value={data.connectivity.heading.text} onChange={(e) => update(["connectivity", "heading", "text"], e.target.value)} style={{ width: "80%", marginLeft: "10px" }} />
   <h3>Paragraph</h3>
<EditableTextBlock
  value={data.connectivity.paragraph}
  onChange={(val) => update(["connectivity", "paragraph"], val)}
/>


      <h3>Connectivity Cards</h3>
     {data.connectivity.cards.map((card, i) => (
  <div key={i}>
    <EditableTextBlock
      value={card.heading}
      onChange={(val) => {
        const arr = [...data.connectivity.cards];
        arr[i].heading = val;
        update(["connectivity", "cards"], arr);
      }}
    />
    <EditableTextBlock
      value={card.text}
      onChange={(val) => {
        const arr = [...data.connectivity.cards];
        arr[i].text = val;
        update(["connectivity", "cards"], arr);
      }}
    />
    <input placeholder="Link URL" value={card.link} onChange={(e) => {
      const arr = [...data.connectivity.cards];
      arr[i].link = e.target.value;
      update(["connectivity", "cards"], arr);
    }} style={{ width: "100%", marginBottom: "15px" }} />

          {/* Card Image */}
          <input type="file" accept="image/*" id={`conn-upload-${i}`} style={{ display: "none" }} onChange={(e) => e.target.files[0] && handleConnectivityImageChange(i, e.target.files[0])} />
          <div style={{ marginBottom: "15px" }}>
            {pendingConnectivityImages[i] ? (
              <div style={{ display: "inline-block", textAlign: "center" }}>
                <img src={pendingConnectivityImages[i].url} alt={`Card ${i + 1} preview`} width="200" style={{ objectFit: "cover" }} />
                <div style={{ marginTop: "10px" }}>
                  <button onClick={() => document.getElementById(`conn-upload-${i}`).click()}>Replace</button>
                  <button onClick={() => removePendingImage(setPendingConnectivityImages, i)} style={{ marginLeft: "10px", color: "red" }}>
                    Delete
                  </button>
                </div>
                <div style={{ marginTop: "15px" }}>
                  <label>Alt Text:</label>
                  <input
                    type="text"
                    placeholder="Describe this card image"
                    value={pendingConnectivityImages[i].alt || ""}
                    onChange={(e) => {
                      setPendingConnectivityImages((prev) => {
                        const updated = [...prev];
                        updated[i] = { ...updated[i], alt: e.target.value };
                        return updated;
                      });
                    }}
                    style={{ width: "100%", marginTop: "5px" }}
                  />
                </div>
              </div>
            ) : (
              <button onClick={() => document.getElementById(`conn-upload-${i}`).click()}>Upload Card Image</button>
            )}
          </div>

          <button
            onClick={() => {
              const arr = data.connectivity.cards.filter((_, idx) => idx !== i);
              update(["connectivity", "cards"], arr);
              setPendingConnectivityImages((prev) => prev.filter((_, idx) => idx !== i));
            }}
            style={{ color: "red" }}
          >
            Delete Card
          </button>
        </div>
      ))}
      <button
        onClick={() => {
          update(["connectivity", "cards"], [
            ...data.connectivity.cards,
            {
              heading: { tag: "h3", text: "" },
              text: { tag: "p", text: "" },
              link: "",
              image: "",
              publicId: "",
              alt: "",
            },
          ]);
          setPendingConnectivityImages((prev) => [...prev, null]);
        }}
      >
        Add Connectivity Card
      </button>

      {/* Last Special Card */}
<h3>Last Special Card</h3>
<EditableTextBlock
  value={data.connectivity.lastCard.heading1}
  onChange={(val) => update(["connectivity", "lastCard", "heading1"], val)}
/>
<EditableTextBlock
  value={data.connectivity.lastCard.heading2}
  onChange={(val) => update(["connectivity", "lastCard", "heading2"], val)}
/>
<EditableTextBlock
  value={data.connectivity.lastCard.buttonText}
  onChange={(val) => update(["connectivity", "lastCard", "buttonText"], val)}
/>
<input
  placeholder="Button Link"
  value={data.connectivity.lastCard.link || ""}
  onChange={(e) => update(["connectivity", "lastCard", "link"], e.target.value)}
  style={{ width: "100%" }}
/>


      <br />
      <br />

      <button
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? "Saving..." : "Save All Changes"}
      </button>
    </div>
  );
};

export default AdminDholeraSir;