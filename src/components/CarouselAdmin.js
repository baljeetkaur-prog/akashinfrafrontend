import { useState, useEffect } from "react";
import axios from "axios";
import SimpleEditor from "./SimpleEditor";
import "./Carouseladmin.css"; 

const defaultCarousel = {
  topSection: {
    heading: { tag: "h1", text: "" },
    paragraph: { tag: "p", text: "" },
    brochureLink: "",
    learnMoreLink: "",
    rating: 5,
    reviewCount: "0",
    profileImages: []
  },
  middleSection: {
    images: [],
    featureCards: [{ icon: "AiOutlineProject", title: "" }]
  },
  bottomStats: [{ value: "", label: "" }]
};

const CarouselAdmin = () => {
  const [carousel, setCarousel] = useState(defaultCarousel);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const API = process.env.REACT_APP_APIURL;

  const [pendingProfileImages, setPendingProfileImages] = useState([]);
  const [pendingSliderImages, setPendingSliderImages] = useState([]);

  useEffect(() => {
    axios.get(`${API}/api/carousel`)
      .then(res => {
        if (res.data) {
          setCarousel(res.data);
          setPendingProfileImages(res.data.topSection.profileImages.map(img => ({
            ...img,
            id: Math.random().toString(36),
            isNew: false,
            markedForDeletion: false
          })));
          setPendingSliderImages(res.data.middleSection.images.map(img => ({
            ...img,
            id: Math.random().toString(36),
            isNew: false,
            markedForDeletion: false
          })));
        }
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
    return { url: res.data.url, publicId: res.data.publicId };
  };

  const handleAddImages = (files, setter, max) => {
    const newImages = Array.from(files).map(file => ({
      id: Math.random().toString(36),
      url: createPreview(file),
      file,
      alt: "",
      isNew: true,
      markedForDeletion: false
    }));
    setter(prev => [...prev, ...newImages].slice(0, max));
  };

  const handleReplaceImage = (setter, index, file) => {
    const previewUrl = createPreview(file);
    setter(prev => {
      const updated = [...prev];
      const oldImage = updated[index];
      updated[index] = {
        ...oldImage,
        url: previewUrl,
        file,
        publicId: oldImage.publicId && !oldImage.isNew ? undefined : oldImage.publicId,
        oldPublicIdToDelete: oldImage.publicId && !oldImage.isNew ? oldImage.publicId : undefined,
        isNew: true,
        markedForDeletion: false
      };
      return updated;
    });
  };

  const handleDeleteImage = (setter, index) => {
    setter(prev => prev.filter((_, i) => i !== index));
  };

const handleChange = (section, key, value, index = null, subKey = null) => {
  setCarousel(prev => {
    const updated = { ...prev };

    if (!updated[section]) {
      updated[section] = key ? { [key]: [] } : [];
    }

    // Nested array/object change
    if (index !== null) {
      if (key) {
        updated[section][key] = updated[section][key] || [];
        updated[section][key][index] = {
          ...updated[section][key][index],
          [subKey]: value
        };
      } else {
        updated[section][index] = {
          ...updated[section][index],
          [subKey]: value
        };
      }
    } else if (key) {
      updated[section][key] = value;
    } else {
      updated[section] = value;
    }

    return updated;
  });
};


  const addItem = (section, key, template) => {
    setCarousel(prev => ({
      ...prev,
      [section]: key
        ? { ...prev[section], [key]: [...prev[section][key], template] }
        : [...prev[section], template]
    }));
  };

  const removeItem = (section, key, index) => {
    setCarousel(prev => ({
      ...prev,
      [section]: key
        ? { ...prev[section], [key]: prev[section][key].filter((_, i) => i !== index) }
        : prev[section].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);

      // Upload new/updated images
      const uploadImages = async (images) => {
        const toUpload = images.filter(img => img.file);
        return await Promise.all(toUpload.map(async img => {
          const { url, publicId } = await uploadImage(img.file);
          return { url, publicId, alt: img.alt || "" };
        }));
      };

      const uploadedProfiles = await uploadImages(pendingProfileImages);
      const uploadedSliders  = await uploadImages(pendingSliderImages);

      // Merge with old images
      const finalProfiles = [
        ...pendingProfileImages.filter(img => !img.file).map(img => ({ url: img.url, publicId: img.publicId, alt: img.alt || "" })),
        ...uploadedProfiles
      ];

      const finalSliders = [
        ...pendingSliderImages.filter(img => !img.file).map(img => ({ url: img.url, publicId: img.publicId, alt: img.alt || "" })),
        ...uploadedSliders
      ];

      // Collect deleted publicIds
      const collectDeletedIds = (pending, oldList) => {
        const deletedIds = new Set();
        pending.forEach(img => img.markedForDeletion && img.publicId && deletedIds.add(img.publicId));
        pending.forEach(img => img.oldPublicIdToDelete && deletedIds.add(img.oldPublicIdToDelete));
        oldList.forEach(old => {
          if (![...finalProfiles, ...finalSliders].some(f => f.publicId === old.publicId) && old.publicId) deletedIds.add(old.publicId);
        });
        return [...deletedIds];
      };

      const payload = {
        ...carousel,
        topSection: { ...carousel.topSection, profileImages: finalProfiles },
        middleSection: { ...carousel.middleSection, images: finalSliders },
        deletedProfilePublicIds: collectDeletedIds(pendingProfileImages, carousel.topSection.profileImages),
        deletedSliderPublicIds: collectDeletedIds(pendingSliderImages, carousel.middleSection.images)
      };

      await axios.post(`${API}/api/carousel`, payload);
      alert("Saved successfully!");
      const res = await axios.get(`${API}/api/carousel`);
      setCarousel(res.data);

      // Reset pending images
      setPendingProfileImages(res.data.topSection.profileImages.map(img => ({
        ...img, id: Math.random().toString(36), isNew: false, markedForDeletion: false
      })));
      setPendingSliderImages(res.data.middleSection.images.map(img => ({
        ...img, id: Math.random().toString(36), isNew: false, markedForDeletion: false
      })));
    } catch (err) {
      console.error(err);
      alert("Save failed: " + (err.response?.data?.message || err.message));
    } finally { setSaving(false); }
  };

  if (loading) return <div>Loading Carousel Admin...</div>;

  return (
    <div className="carousel-admin">
      <h1>Carousel Admin Panel</h1>

      {/* ===== TOP SECTION ===== */}
      <section>
        <h2>Top Section Settings</h2>

        {/* Heading */}
        <label>Heading Tag</label>
        <select value={carousel.topSection.heading.tag} onChange={e => handleChange("topSection", "heading", { ...carousel.topSection.heading, tag: e.target.value })}>
          <option value="h1">H1</option><option value="h2">H2</option><option value="h3">H3</option><option value="h4">H4</option>
        </select>
        <input type="text" placeholder="Heading Text" value={carousel.topSection.heading.text} onChange={e => handleChange("topSection", "heading", { ...carousel.topSection.heading, text: e.target.value })} />

        {/* Paragraph */}
        <label>Paragraph Tag</label>
        <select value={carousel.topSection.paragraph.tag} onChange={e => handleChange("topSection", "paragraph", { ...carousel.topSection.paragraph, tag: e.target.value })}>
          <option value="p">P</option><option value="h1">H1</option><option value="h2">H2</option><option value="h3">H3</option>
        </select>
        <label>Paragraph Content</label>
        <SimpleEditor value={carousel.topSection.paragraph.text} onChange={val => handleChange("topSection", "paragraph", { ...carousel.topSection.paragraph, text: val })} /><br/>

        {/* Links & Ratings */}
        <input type="text" placeholder="Brochure Link" value={carousel.topSection.brochureLink} onChange={e => handleChange("topSection", "brochureLink", e.target.value)} />
        <input type="text" placeholder="Enquiry Form Link" value={carousel.topSection.learnMoreLink} onChange={e => handleChange("topSection", "learnMoreLink", e.target.value)} />
      <label>Rating</label>
<input
  type="number"
  placeholder="Rating (1-5)"
  value={carousel.topSection.rating}
  onChange={e =>
    handleChange("topSection", "rating", Number(e.target.value))
  }
/>

<label>Review Count</label>
<input
  type="text"
  placeholder="Review Count (e.g., 12,500+)"
  value={carousel.topSection.reviewCount}
  onChange={e =>
    handleChange("topSection", "reviewCount", e.target.value)
  }
/>

        {/* Profile Images */}
        <h2>Profile Images (Max 3)</h2>
        <input type="file" accept="image/*" multiple onChange={e => handleAddImages(e.target.files, setPendingProfileImages, 3)} />
        <div className="image-preview-container">
          {pendingProfileImages.map((img, i) => (
            <div key={img.id} className="image-preview">
              <img src={img.url} alt={img.alt || `profile-${i}`} />
              <input type="text" placeholder="Alt text" value={img.alt} onChange={e => {
                const val = e.target.value;
                setPendingProfileImages(prev => { const u = [...prev]; u[i].alt = val; return u; });
              }} />
              <div className="image-actions">
                <button onClick={() => document.getElementById(`replace-profile-${i}`).click()}>Replace</button>
                <button onClick={() => handleDeleteImage(setPendingProfileImages, i)} className="delete-btn">Delete</button>
              </div>
              <input id={`replace-profile-${i}`} type="file" style={{ display: "none" }} onChange={e => e.target.files[0] && handleReplaceImage(setPendingProfileImages, i, e.target.files[0])} />
            </div>
          ))}
        </div>
      </section>

      {/* ===== SLIDER IMAGES ===== */}
      <section>
        <h2>Slider Images (Max 4)</h2>
        <input type="file" accept="image/*" multiple onChange={e => handleAddImages(e.target.files, setPendingSliderImages, 4)} />
        <div className="image-preview-container">
          {pendingSliderImages.map((img, i) => (
            <div key={img.id} className="image-preview">
              <img src={img.url} alt={img.alt || `slider-${i}`} />
              <input type="text" placeholder="Alt text" value={img.alt} onChange={e => {
                const val = e.target.value;
                setPendingSliderImages(prev => { const u = [...prev]; u[i].alt = val; return u; });
              }} />
              <div className="image-actions">
                <button onClick={() => document.getElementById(`replace-slider-${i}`).click()}>Replace</button>
                <button onClick={() => handleDeleteImage(setPendingSliderImages, i)} className="delete-btn">Delete</button>
              </div>
              <input id={`replace-slider-${i}`} type="file" style={{ display: "none" }} onChange={e => e.target.files[0] && handleReplaceImage(setPendingSliderImages, i, e.target.files[0])} />
            </div>
          ))}
        </div>
      </section>

      {/* ===== FEATURE CARDS ===== */}
      <section>
        <h2>Feature Cards</h2>
        {carousel.middleSection.featureCards.map((card, i) => (
          <div key={i} className="feature-card-editor">
            <select value={card.tag || "h3"} onChange={e => handleChange("middleSection", "featureCards", e.target.value, i, "tag")}>
              <option value="h1">H1</option><option value="h2">H2</option><option value="h3">H3</option><option value="h4">H4</option><option value="p">P</option>
            </select>
            <input type="text" placeholder="Feature Title" value={card.title} onChange={e => handleChange("middleSection", "featureCards", e.target.value, i, "title")} />
            <button onClick={() => removeItem("middleSection", "featureCards", i)}>Remove</button>
          </div>
        ))}
        <button onClick={() => addItem("middleSection", "featureCards", { icon: "AiOutlineProject", title: "" })}>Add Feature Card</button>
      </section>

      {/* ===== BOTTOM STATS ===== */}
      <section>
        <h2>Bottom Stats</h2>
        {carousel.bottomStats.map((stat, i) => (
          <div key={i} className="stat-editor">
            <select value={stat.valueTag || "h2"} onChange={e => handleChange("bottomStats", null, e.target.value, i, "valueTag")}>
              <option value="h1">H1</option><option value="h2">H2</option><option value="h3">H3</option><option value="p">P</option>
            </select>
            <input type="text" placeholder="Value" value={stat.value} onChange={e => handleChange("bottomStats", null, e.target.value, i, "value")} />
            <select value={stat.labelTag || "p"} onChange={e => handleChange("bottomStats", null, e.target.value, i, "labelTag")}>
              <option value="h1">H1</option><option value="h2">H2</option><option value="h3">H3</option><option value="p">P</option>
            </select>
            <input type="text" placeholder="Label" value={stat.label} onChange={e => handleChange("bottomStats", null, e.target.value, i, "label")} />
            <button onClick={() => removeItem("bottomStats", null, i)}>Remove</button>
          </div>
        ))}
        <button onClick={() => addItem("bottomStats", null, { value: "", label: "" })}>Add Stat</button>
      </section><br/>

      {/* ===== SAVE BUTTON ===== */}
      <button onClick={handleSubmit} disabled={saving} className={`save-btn ${saving ? "saving" : ""}`}>
        {saving ? "Saving..." : "Save All Changes"}
      </button>
    </div>
  );
};

export default CarouselAdmin;
