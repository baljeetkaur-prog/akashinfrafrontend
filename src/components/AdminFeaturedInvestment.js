import { useState, useEffect } from "react";
import axios from "axios";
import SimpleEditor from "./SimpleEditor"; // assuming you have this for rich text
import "./FeaturedInvestmentAdmin.css"; 

const defaultData = {
  heading: { tag: "h2", text: "" },
  paragraph: { tag: "p", text: "" },
  viewButton: { text: "", link: "" },
  cards: []
};

const FeaturedInvestmentAdmin = () => {
  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const API = process.env.REACT_APP_APIURL;

  // Pending images for each card: array of arrays (one per card)
  const [pendingCardImages, setPendingCardImages] = useState([]); // [{ id, url, file?, publicId?, isNew?, markedForDeletion? }]

useEffect(() => {
  axios
    .get(`${API}/api/featured-investment`)
    .then((res) => {
      // Fallback to defaultData if res.data is missing
      const fetched = res.data || defaultData;

      // Ensure fetched.cards is always an array
      const safeCards = (fetched.cards || []).map((card) => ({
        ...card,
        // Ensure features is always an array
        features: Array.isArray(card.features) ? card.features : [],
        // Ensure price and title objects exist
        price: card.price || { tag: "p", text: "" },
        title: card.title || { tag: "h3", text: "" },
        image: card.image || { url: "", publicId: "", alt: "" }
      }));

      // Replace cards with safeCards
      const safeData = { ...fetched, cards: safeCards };

      setData(safeData);

      // Initialize pending images safely
      const initialPending = safeCards.map((card) => {
        if (card.image?.url) {
          return {
            id: Math.random().toString(36),
            url: card.image.url,
            publicId: card.image.publicId,
            alt: card.image.alt || "",
            isNew: false,
            markedForDeletion: false
          };
        }
        return null; // no image yet
      });

      setPendingCardImages(initialPending);
      setLoading(false);
    })
    .catch((err) => {
      console.error("Fetch error:", err);
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

  // Add / Replace image for a specific card
  const handleImageChange = (cardIndex, file) => {
    if (!file) return;

    const previewUrl = createPreview(file);

    setPendingCardImages((prev) => {
      const updated = [...prev];
      updated[cardIndex] = {
        id: Math.random().toString(36),
        url: previewUrl,
        file,
        alt: updated[cardIndex]?.alt || "",
        isNew: true,
        markedForDeletion: false
      };
      return updated;
    });
  };

  // Delete image for a specific card
const handleDeleteImage = (cardIndex) => {
  setPendingCardImages((prev) => {
    const updated = [...prev];
    // Explicitly mark as removed (helps logic)
    updated[cardIndex] = null;
    return updated;
  });
};

  // Update alt text
  const handleAltChange = (cardIndex, alt) => {
    setPendingCardImages((prev) => {
      const updated = [...prev];
      if (updated[cardIndex]) updated[cardIndex].alt = alt;
      return updated;
    });
  };

const handleSubmit = async () => {
  try {
    setSaving(true);

    // Function to strip HTML tags
    const stripHtml = (html) => {
      const div = document.createElement("div");
      div.innerHTML = html;
      return div.textContent || div.innerText || "";
    };

    const finalCards = [];
    const imagesToDelete = []; // Collect publicIds for deletion

    for (let i = 0; i < data.cards.length; i++) {
      const originalCard = data.cards[i]; // From current state (before save)
      const pendingImg = pendingCardImages[i];

      let imageObj = { url: "", publicId: "", alt: "" };

      // If there was an existing image on this card
      if (originalCard.image?.publicId) {
        const oldPublicId = originalCard.image.publicId;

        const imageIsBeingChanged =
          pendingImg?.isNew || // new file uploaded
          pendingImg === null || // image explicitly removed
          pendingImg?.markedForDeletion;

        if (imageIsBeingChanged) {
          imagesToDelete.push(oldPublicId);
        }
      }

      // Handle new/current image
      if (pendingImg && pendingImg.isNew && pendingImg.file) {
        const uploaded = await uploadImage(pendingImg.file);
        imageObj = {
          url: uploaded.url,
          publicId: uploaded.publicId,
          alt: pendingImg.alt || ""
        };
      } else if (pendingImg && !pendingImg.isNew && pendingImg.publicId) {
        imageObj = {
          url: pendingImg.url,
          publicId: pendingImg.publicId,
          alt: pendingImg.alt || ""
        };
      }

      finalCards.push({
        ...originalCard,
        image: imageObj
      });
    }

    // Step 1: Clean paragraph and heading text
    const payload = {
      ...data,
      heading: {
        ...data.heading,
        text: stripHtml(data.heading.text)
      },
      paragraph: {
        ...data.paragraph,
        text: stripHtml(data.paragraph.text)
      },
      cards: finalCards
    };

    // Save updated data to MongoDB
    await axios.post(`${API}/api/featured-investment`, payload);

    // Step 2: Delete old images from Cloudinary (if any)
    if (imagesToDelete.length > 0) {
      console.log("Deleting old images:", imagesToDelete);
      await Promise.all(
        imagesToDelete.map((publicId) =>
          axios.post(`${API}/api/delete-image`, { publicId })
        )
      );
    }

    alert("Featured Investment updated successfully!");
    setData(payload); // Update local state

  } catch (err) {
    console.error("Save error:", err);
    alert("Save failed: " + (err.response?.data?.message || err.message));
  } finally {
    setSaving(false);
  }
};

  const handleChange = (field, value, cardIndex = null, subField = null) => {
    setData((prev) => {
      const updated = { ...prev };
      if (cardIndex !== null) {
        if (subField) {
          updated.cards[cardIndex][field][subField] = value;
        } else {
          updated.cards[cardIndex][field] = value;
        }
      } else {
        if (subField) {
          updated[field][subField] = value;
        } else {
          updated[field] = value;
        }
      }
      return updated;
    });
  };
const handleFeatureChange = (cardIndex, featureIndex, key, value) => {
  setData((prev) => {
    const updated = { ...prev };
    const card = { ...updated.cards[cardIndex] };
    const features = [...(card.features || [])];

    features[featureIndex] = { ...features[featureIndex], [key]: value };
    card.features = features;
    updated.cards[cardIndex] = card;

    return updated;
  });
};

const addCard = () => {
  setData((prev) => ({
    ...prev,
    cards: [
      ...prev.cards,
      {
        image: { url: "", publicId: "", alt: "" },
        badge: "",
        price: { tag: "p", text: "" },   // ✅ FIX
        title: { tag: "h3", text: "" },
        location: "",
        features: [],
        arrowLink: ""
      }
    ]
  }));
  setPendingCardImages((prev) => [...prev, null]);
};


  const removeCard = (index) => {
    setData((prev) => ({
      ...prev,
      cards: prev.cards.filter((_, i) => i !== index)
    }));
    setPendingCardImages((prev) => prev.filter((_, i) => i !== index));
  };

const addFeature = (cardIndex) => {
  setData((prev) => {
    const updated = { ...prev };
    
    // ✅ ensure features is always an array
    if (!Array.isArray(updated.cards[cardIndex].features)) {
      updated.cards[cardIndex].features = [];
    }

    updated.cards[cardIndex].features.push({ icon: "FaMapMarkerAlt", text: "" });
    return updated;
  });
};


  if (loading) return <div>Loading...</div>;

  return (
    <div className="featured-investment-admin">
      <h1>Edit Featured Investment Section</h1>

      {/* Heading */}
      <div style={{ marginBottom: "20px" }}>
        <label>Heading Tag</label>
        <select
          value={data.heading.tag}
          onChange={(e) => handleChange("heading", { ...data.heading, tag: e.target.value })}
        >
          <option value="h1">H1</option>
          <option value="h2">H2</option>
          <option value="h3">H3</option>
          <option value="h4">H4</option>
        </select>
        <input
          type="text"
          placeholder="Heading Text"
          value={data.heading.text}
          onChange={(e) => handleChange("heading", { ...data.heading, text: e.target.value })}
          style={{ width: "100%", marginTop: "5px" }}
        />
      </div>

      {/* Paragraph */}
      <div style={{ marginBottom: "20px" }}>
        <label>Paragraph Tag</label>
        <select
          value={data.paragraph.tag}
          onChange={(e) => handleChange("paragraph", { ...data.paragraph, tag: e.target.value })}
        >
          <option value="p">P</option>
          <option value="h3">H3</option>
          <option value="h4">H4</option>
        </select>
<SimpleEditor
  value={data.paragraph?.text || ""}
  onChange={(val) =>
    setData((prev) => ({
      ...prev,
      paragraph: { ...prev.paragraph, text: val } // merge safely
    }))
  }
/>


      </div>

      {/* View All Button */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="View Button Text"
          value={data.viewButton.text}
          onChange={(e) => handleChange("viewButton", { ...data.viewButton, text: e.target.value })}
        />
        <input
          type="text"
          placeholder="View Button Link"
          value={data.viewButton.link}
          onChange={(e) => handleChange("viewButton", { ...data.viewButton, link: e.target.value })}
        />
      </div>

      <hr />

      <h2>Cards</h2>
      {data.cards.map((card, i) => (
        <div key={i} style={{ border: "1px solid #ccc", padding: "15px", marginBottom: "20px" }}>
          <h3>Card {i + 1}</h3>

          {/* Card Image */}
          {/* Card Image */}
<div style={{ marginBottom: "15px" }}>
  <label>Card Image</label><br />
  <input
    type="file"
    accept="image/*"
    onChange={(e) => handleImageChange(i, e.target.files[0])}
    style={{ marginBottom: "10px" }}
  />

  {pendingCardImages[i]?.url && (
    <div style={{ marginTop: "10px" }}>
      <img
        src={pendingCardImages[i].url}
        alt="preview"
        width="200"
        style={{ objectFit: "cover", borderRadius: "8px" }}
      />
      <br />

      {/* Alt Text */}
      <input
        type="text"
        placeholder="Alt text"
        value={pendingCardImages[i].alt || ""}
        onChange={(e) => handleAltChange(i, e.target.value)}
        style={{ marginTop: "8px", width: "200px" }}
      />

      {/* Replace & Remove Buttons */}
      <div style={{ marginTop: "10px" }}>
        <button
          type="button"
          style={{
            marginRight: "10px",
            padding: "6px 12px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
          onClick={() => document.getElementById(`replace-card-image-${i}`).click()}
        >
          Replace
        </button>

        <button
          type="button"
          style={{
            padding: "6px 12px",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
          onClick={() => handleDeleteImage(i)}
        >
          Remove Image
        </button>
      </div>

      {/* Hidden file input for Replace */}
      <input
        id={`replace-card-image-${i}`}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => {
          if (e.target.files[0]) {
            handleImageChange(i, e.target.files[0]);
          }
        }}
      />
    </div>
  )}

  {/* Show message if no image */}
  {!pendingCardImages[i]?.url && (
    <p style={{ color: "#666", fontStyle: "italic" }}>
      No image selected yet.
    </p>
  )}
</div>

          <input
            type="text"
            placeholder="Badge (e.g. New)"
            value={card.badge}
            onChange={(e) => handleChange("badge", e.target.value, i)}
          />
          <select
  value={card.price.tag}
  onChange={(e) =>
    handleChange(
      "price",
      { ...card.price, tag: e.target.value },
      i
    )
  }
>
<option value="p">P</option>
<option value="h3">H3</option>
<option value="h4">H4</option>
<option value="span">Span</option>
</select>

       <input
  type="text"
  placeholder="Price (e.g. ₹6,00,000)"
  value={card.price.text}
  onChange={(e) =>
    handleChange(
      "price",
      { ...card.price, text: e.target.value },
      i
    )
  }
/>

          {/* Title */}
          <select
            value={card.title.tag}
            onChange={(e) => handleChange("title", { ...card.title, tag: e.target.value }, i)}
          >
            <option value="h3">H3</option>
            <option value="h4">H4</option>
            <option value="h5">H5</option>
          </select>
          <input
            type="text"
            placeholder="Title"
            value={card.title.text}
            onChange={(e) => handleChange("title", { ...card.title, text: e.target.value }, i)}
          />

          <input
            type="text"
            placeholder="Location"
            value={card.location}
            onChange={(e) => handleChange("location", e.target.value, i)}
          />
          <input
            type="text"
            placeholder="Arrow Link (internal route)"
            value={card.arrowLink}
            onChange={(e) => handleChange("arrowLink", e.target.value, i)}
          />

          {/* Features */}
          <h4>Features</h4>
{(Array.isArray(card.features) ? card.features : []).map((f, fi) => (
  <div key={fi} style={{ marginBottom: "8px" }}>
    <select
      value={f.icon}
      onChange={(e) =>
        handleFeatureChange(i, fi, "icon", e.target.value)
      }
    >
      <option value="FaMapMarkerAlt">Location</option>
      <option value="FaRoad">Road</option>
      <option value="FaBolt">Bolt</option>
      <option value="FaLink">Link</option>
    </select>
    <input
      type="text"
      value={f.text}
      onChange={(e) =>
        handleFeatureChange(i, fi, "text", e.target.value)
      }
    />
  </div>
))}


          <button onClick={() => addFeature(i)}>Add Feature</button><br/>

          <button style={{  marginTop: "15px" }} onClick={() => removeCard(i)}>
            Remove Card
          </button>
        </div>
      ))}

      <button onClick={addCard} style={{ marginBottom: "30px" }}>
        Add New Card
      </button><br/>
      <button
        onClick={handleSubmit}
        disabled={saving}
      >
        {saving ? "Saving..." : "Save All Changes"}
      </button>
    </div>
  );
};

export default FeaturedInvestmentAdmin;