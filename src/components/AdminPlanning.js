import { useState, useEffect } from "react";
import axios from "axios";
import SimpleEditor from "./SimpleEditor";
import { memo } from "react";
import "./AdminPlanning.css";

const block = (value, tag = "p") => {
  if (!value) return { tag, text: "" };
  if (typeof value === "string") return { tag, text: value };
  return { tag: value.tag || tag, text: value.text || "" };
};

const AdminPlanning = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const API = process.env.REACT_APP_APIURL;

  // Pending image state
  const [pendingImages, setPendingImages] = useState({
    introSection: null,
    activationArea: null,
    infrastructure: null,
    investment: null,
    smartCityCarousel: [],
    zoningZones: []
  });

  const createPreview = (file) => URL.createObjectURL(file);
const EditableTextBlock = memo(({ value, onChange, style }) => {
  return (
    <div style={{ marginBottom: "15px", ...style }}>
      <select
        value={value.tag}
        onChange={(e) => onChange({ ...value, tag: e.target.value })}
        style={{ marginRight: "10px", width: "100px" }}
      >
        <option value="p">P</option>
        <option value="div">DIV</option>
        <option value="h3">H3</option>
        <option value="h4">H4</option>
        <option value="h5">H5</option>
      </select>
      <SimpleEditor
        value={value.text}
        onChange={(text) => onChange({ ...value, text })}
        style={{ width: "80%", display: "inline-block" }}
      />
    </div>
  );
});

  // Generic image handlers (unchanged)
  const handleAddImage = (key, file, index = null) => {
    if (!file) return;
    const previewUrl = createPreview(file);
    const newImg = {
      id: Math.random().toString(36),
      url: previewUrl,
      file,
      alt: "",
      isNew: true
    };

    if (index !== null) {
      setPendingImages(prev => {
        const updated = [...prev.zoningZones];
        updated[index] = newImg;
        return { ...prev, zoningZones: updated };
      });
    } else if (key === "smartCityCarousel") {
      setPendingImages(prev => ({
        ...prev,
        smartCityCarousel: [...prev.smartCityCarousel, newImg].slice(0, 5)
      }));
    } else {
      setPendingImages(prev => ({ ...prev, [key]: newImg }));
    }
  };

  const handleReplaceImage = (key, file, index = null) => {
    if (!file) return;
    const previewUrl = createPreview(file);
    const currentAlt = index !== null
      ? (key === "zoningZone"
          ? pendingImages.zoningZones[index]?.alt || ""
          : pendingImages.smartCityCarousel[index]?.alt || "")
      : pendingImages[key]?.alt || "";

    const updatedImg = {
      url: previewUrl,
      file,
      isNew: true,
      alt: currentAlt
    };

    if (index !== null) {
      if (key === "zoningZone") {
        setPendingImages(prev => {
          const arr = [...prev.zoningZones];
          arr[index] = { ...arr[index], ...updatedImg };
          return { ...prev, zoningZones: arr };
        });
      } else {
        setPendingImages(prev => {
          const arr = [...prev.smartCityCarousel];
          arr[index] = { ...arr[index], ...updatedImg };
          return { ...prev, smartCityCarousel: arr };
        });
      }
    } else {
      setPendingImages(prev => ({
        ...prev,
        [key]: { ...prev[key], ...updatedImg }
      }));
    }
  };

  const handleDeleteImage = (key, index = null) => {
    if (index !== null) {
      if (key === "zoningZone") {
        setPendingImages(prev => {
          const arr = [...prev.zoningZones];
          arr[index] = null;
          return { ...prev, zoningZones: arr };
        });
      } else {
        setPendingImages(prev => {
          const arr = [...prev.smartCityCarousel];
          arr.splice(index, 1);
          return { ...prev, smartCityCarousel: arr };
        });
      }
    } else {
      setPendingImages(prev => ({ ...prev, [key]: null }));
    }
  };

  const updateAltText = (key, value, index = null) => {
    if (index !== null) {
      if (key === "zoningZone") {
        setPendingImages(prev => {
          const arr = [...prev.zoningZones];
          if (arr[index]) arr[index].alt = value;
          return { ...prev, zoningZones: arr };
        });
      } else {
        setPendingImages(prev => {
          const arr = [...prev.smartCityCarousel];
          arr[index].alt = value;
          return { ...prev, smartCityCarousel: arr };
        });
      }
    } else {
      setPendingImages(prev => ({
        ...prev,
        [key]: prev[key] ? { ...prev[key], alt: value } : null
      }));
    }
  };

  const uploadSingleImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await axios.post(`${API}/api/upload`, formData);
    return {
      url: res.data.url,
      publicId: res.data.publicId
    };
  };

  useEffect(() => {
    axios
      .get(`${API}/api/planning`)
      .then((res) => {
        let d = res.data || {};

        // Default initialization (unchanged)
        d.seo ||= { title: "", description: "", keywords: "" };
        d.breadcrumb ||= { parent: "Home", current: "Planning" };
        d.banner ||= { heading: {} };
        d.introSection ||= { smallHeading: {}, bigHeading: {}, paragraphs: [], image: null, button: { text: {}, link: "" } };
        d.activationArea ||= { title: {}, paragraph: {}, infoList: [], image: null };
        d.tpSchemes ||= { title: {}, tps: [] };
        d.zoning ||= { heading: {}, description: {}, zones: [] };
        d.infrastructure ||= { heading: {}, paragraph: {}, image: null, stats: [] };
        d.smartCityFeatures ||= { heading: {}, introParagraph: {}, leftFeatures: [], carouselImages: [], rightFeatures: [] };
        d.sustainability ||= { heading: {}, paragraph: {}, topCards: [], bottomCards: [] };
        d.investment ||= {
          heading: {},
          introParagraph: {},
          contentHeading: {},
          contentParagraph: {},
          image: null,
          form: { heading: {}, subject: "", buttonText: "Submit", fields: [] }
        };

        // Normalize all text blocks
        d.banner.heading = block(d.banner.heading, "h1");
        d.introSection.smallHeading = block(d.introSection.smallHeading, "p");
        d.introSection.bigHeading = block(d.introSection.bigHeading, "h2");
        d.introSection.paragraphs = (d.introSection.paragraphs || []).map(p => block(p));
        d.introSection.button.text = block(d.introSection.button.text || {}, "span");
        d.activationArea.title = block(d.activationArea.title, "h2");
        d.activationArea.paragraph = block(d.activationArea.paragraph, "p");
        d.tpSchemes.title = block(d.tpSchemes.title, "h2");
        d.zoning.heading = block(d.zoning.heading, "h2");
        d.zoning.description = block(d.zoning.description, "p");
        d.infrastructure.heading = block(d.infrastructure.heading, "h2");
        d.infrastructure.paragraph = block(d.infrastructure.paragraph, "p");
        d.smartCityFeatures.heading = block(d.smartCityFeatures.heading, "h2");
        d.smartCityFeatures.introParagraph = block(d.smartCityFeatures.introParagraph, "p");
        d.sustainability.heading = block(d.sustainability.heading, "h2");
        d.sustainability.paragraph = block(d.sustainability.paragraph, "p");
        d.investment.heading = block(d.investment.heading, "h2");
        d.investment.introParagraph = block(d.investment.introParagraph, "p");
        d.investment.contentHeading = block(d.investment.contentHeading, "h3");
        d.investment.contentParagraph = block(d.investment.contentParagraph, "p");
        d.investment.form.heading = block(d.investment.form.heading, "h3");
        d.investment.form.buttonText ||= "Submit";


        // Normalize images
        const normalizeImage = (img) => {
          if (!img) return null;
          if (typeof img === "string") {
            return { url: img, publicId: "", alt: "" };
          }
          return { url: img.url || "", publicId: img.publicId || "", alt: img.alt || "" };
        };

        d.introSection.image = normalizeImage(d.introSection.image);
        d.activationArea.image = normalizeImage(d.activationArea.image);
        d.infrastructure.image = normalizeImage(d.infrastructure.image);
        d.investment.image = normalizeImage(d.investment.image);
        d.smartCityFeatures.carouselImages = (d.smartCityFeatures.carouselImages || []).map(normalizeImage).filter(Boolean);
        d.zoning.zones = (d.zoning.zones || []).map(zone => ({
          ...zone,
          image: normalizeImage(zone.image),
          button: zone.button || { text: "Enquire Now", link: "/enquiry-form" }
        }));

        // Initialize pending images (blank)
 setPendingImages({
  introSection: d.introSection.image
    ? { ...d.introSection.image, id: Math.random().toString(36), isNew: false }
    : null,

  activationArea: d.activationArea.image
    ? { ...d.activationArea.image, id: Math.random().toString(36), isNew: false }
    : null,

  infrastructure: d.infrastructure.image
    ? { ...d.infrastructure.image, id: Math.random().toString(36), isNew: false }
    : null,

  investment: d.investment.image
    ? { ...d.investment.image, id: Math.random().toString(36), isNew: false }
    : null,

  smartCityCarousel: d.smartCityFeatures.carouselImages.map(img => ({
    ...img,
    id: Math.random().toString(36),
    isNew: false
  })),

  zoningZones: d.zoning.zones.map(zone =>
    zone.image
      ? { ...zone.image, id: Math.random().toString(36), isNew: false }
      : null
  )
});


        setData(d);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [API]);

  const update = (path, value) => {
    setData(prev => {
      const updated = structuredClone(prev);
      let ref = updated;
      for (let i = 0; i < path.length - 1; i++) {
        ref = ref[path[i]];
      }
      ref[path[path.length - 1]] = value;
      return updated;
    });
  };

  const save = async () => {
    if (saving) return;
    setSaving(true);

    try {
      const finalizeImage = async (pending) => {
        if (!pending) return null;
        if (pending.isNew && pending.file) {
          const uploaded = await uploadSingleImage(pending.file);
          return { url: uploaded.url, publicId: uploaded.publicId, alt: pending.alt || "" };
        }
        return { url: pending.url, publicId: pending.publicId || "", alt: pending.alt || "" };
      };

      const finalizeArray = async (arr) => {
        const result = [];
        for (const img of arr) {
          if (!img) continue;
          const finalized = await finalizeImage(img);
          if (finalized) result.push(finalized);
        }
        return result;
      };

      const updatedData = structuredClone(data);

      updatedData.introSection.image = await finalizeImage(pendingImages.introSection);
      updatedData.activationArea.image = await finalizeImage(pendingImages.activationArea);
      updatedData.infrastructure.image = await finalizeImage(pendingImages.infrastructure);
      updatedData.investment.image = await finalizeImage(pendingImages.investment);
      updatedData.smartCityFeatures.carouselImages = await finalizeArray(pendingImages.smartCityCarousel);

      for (let i = 0; i < updatedData.zoning.zones.length; i++) {
        const pending = pendingImages.zoningZones[i];
        updatedData.zoning.zones[i].image = pending ? await finalizeImage(pending) : updatedData.zoning.zones[i].image;
      }

      await axios.post(`${API}/api/planning`, updatedData);
      alert("Planning page updated successfully!");

      setData(updatedData);
      setPendingImages({
        introSection: updatedData.introSection.image ? { ...updatedData.introSection.image, id: Math.random().toString(36), isNew: false } : null,
        activationArea: updatedData.activationArea.image ? { ...updatedData.activationArea.image, id: Math.random().toString(36), isNew: false } : null,
        infrastructure: updatedData.infrastructure.image ? { ...updatedData.infrastructure.image, id: Math.random().toString(36), isNew: false } : null,
        investment: updatedData.investment.image ? { ...updatedData.investment.image, id: Math.random().toString(36), isNew: false } : null,
        smartCityCarousel: updatedData.smartCityFeatures.carouselImages.map(img => ({
          ...img,
          id: Math.random().toString(36),
          isNew: false
        })),
        zoningZones: updatedData.zoning.zones.map(z => z.image ? { ...z.image, id: Math.random().toString(36), isNew: false } : null)
      });
    } catch (err) {
      console.error(err);
      alert("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !data) return <div>Loading Admin Panel...</div>;

  return (
    <div className="admin-planning">
      <h1>Admin - Planning Page Editor</h1>

      {/* SEO Settings */}
      <h2>SEO Settings</h2>
      <input placeholder="Meta Title" value={data.seo.title} onChange={e => update(["seo", "title"], e.target.value)} style={{ width: "100%", marginBottom: "10px" }} />
      <textarea rows="3" placeholder="Meta Description" value={data.seo.description} onChange={e => update(["seo", "description"], e.target.value)} style={{ width: "100%", marginBottom: "10px" }} />
      <input placeholder="Meta Keywords" value={data.seo.keywords} onChange={e => update(["seo", "keywords"], e.target.value)} style={{ width: "100%", marginBottom: "20px" }} />

      {/* Breadcrumb */}
      <h2>Breadcrumb</h2>
      <input placeholder="Parent" value={data.breadcrumb.parent} onChange={e => update(["breadcrumb", "parent"], e.target.value)} style={{ width: "48%", marginRight: "4%" }} />
      <input placeholder="Current" value={data.breadcrumb.current} onChange={e => update(["breadcrumb", "current"], e.target.value)} style={{ width: "48%" }} />

      {/* Banner */}
      <h2>Banner Heading</h2>
      <div style={{ marginBottom: "10px" }}>
        <select value={data.banner.heading.tag} onChange={e => update(["banner", "heading", "tag"], e.target.value)}>
          <option value="h1">H1</option>
          <option value="h2">H2</option>
        </select>
        <input placeholder="Banner Text" value={data.banner.heading.text} onChange={e => update(["banner", "heading", "text"], e.target.value)} style={{ width: "80%", marginLeft: "10px" }} />
      </div>

      {/* Intro Section */}
      <h2>Intro Section</h2>
      <div style={{ marginBottom: "10px" }}>
        <label>Small Heading: </label>
        <select value={data.introSection.smallHeading.tag} onChange={e => update(["introSection", "smallHeading", "tag"], e.target.value)}>
          <option value="p">P</option>
          <option value="h4">H4</option>
          <option value="h5">H5</option>
        </select>
        <input value={data.introSection.smallHeading.text} onChange={e => update(["introSection", "smallHeading", "text"], e.target.value)} style={{ width: "70%", marginLeft: "10px" }} />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Big Heading: </label>
        <select value={data.introSection.bigHeading.tag} onChange={e => update(["introSection", "bigHeading", "tag"], e.target.value)}>
          <option value="h1">H1</option>
          <option value="h2">H2</option>
          <option value="h3">H3</option>
        </select>
        <input value={data.introSection.bigHeading.text} onChange={e => update(["introSection", "bigHeading", "text"], e.target.value)} style={{ width: "70%", marginLeft: "10px" }} />
      </div>

      <h3>Paragraphs</h3>
{data.introSection.paragraphs.map((p, i) => (
  <div key={i} style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "10px" }}>
    <div style={{ marginBottom: "15px" }}>
      <select
        value={p.tag}
        onChange={(e) => {
          const arr = [...data.introSection.paragraphs];
          arr[i].tag = e.target.value;
          update(["introSection", "paragraphs"], arr);
        }}
        style={{ marginRight: "10px", width: "100px" }}
      >
        <option value="p">P</option>
        <option value="div">DIV</option>
        <option value="h3">H3</option>
        <option value="h4">H4</option>
        <option value="h5">H5</option>
      </select>

      <SimpleEditor
        value={p.text}
        onChange={(text) => {
          const arr = [...data.introSection.paragraphs];
          arr[i].text = text;
          update(["introSection", "paragraphs"], arr);
        }}
        style={{ width: "80%", display: "inline-block" }}
      />
    </div>

    <button
      onClick={() => update(["introSection", "paragraphs"], data.introSection.paragraphs.filter((_, idx) => idx !== i))}
      style={{ color: "red", marginTop: "10px" }}
    >
      Delete
    </button>
  </div>
))}
      <button onClick={() => update(["introSection", "paragraphs"], [...data.introSection.paragraphs, { tag: "p", text: "" }])}>Add Paragraph</button>

      <h3>Button</h3>
      <input placeholder="Button Text" value={data.introSection.button.text.text} onChange={e => update(["introSection", "button", "text"], { ...data.introSection.button.text, text: e.target.value })} />
      <input placeholder="Button Link" value={data.introSection.button.link} onChange={e => update(["introSection", "button", "link"], e.target.value)} />

      <h3>Intro Image</h3>
      <input type="file" accept="image/*" style={{ display: "none" }} id="intro-upload"
        onChange={(e) => e.target.files[0] && handleAddImage("introSection", e.target.files[0])} />
      {pendingImages.introSection ? (
        <div style={{ margin: "10px 0" }}>
          <img src={pendingImages.introSection.url} alt="Preview" width="400" />
          <input placeholder="Alt text" value={pendingImages.introSection.alt || ""} onChange={(e) => updateAltText("introSection", e.target.value)} style={{ width: "100%", margin: "10px 0" }} />
          <button onClick={() => document.getElementById("intro-upload").click()}>Replace</button>
          <button onClick={() => handleDeleteImage("introSection")} style={{ marginLeft: "10px", color: "red" }}>Delete</button>
        </div>
      ) : (
        <button onClick={() => document.getElementById("intro-upload").click()}>Upload Image</button>
      )}

      {/* Activation Area */}
      <h2>Activation Area</h2>
      <div style={{ marginBottom: "10px" }}>
        <label>Title: </label>
        <select value={data.activationArea.title.tag} onChange={e => update(["activationArea", "title", "tag"], e.target.value)}>
          <option value="h2">H2</option>
          <option value="h3">H3</option>
          <option value="h1">H1</option>
        </select>
        <input value={data.activationArea.title.text} onChange={e => update(["activationArea", "title", "text"], e.target.value)} style={{ width: "70%", marginLeft: "10px" }} />
      </div>

<h3>Paragraph</h3>
<div style={{ marginBottom: "15px" }}>
  <select
    value={data.activationArea.paragraph.tag}
    onChange={(e) => update(["activationArea", "paragraph", "tag"], e.target.value)}
    style={{ marginRight: "10px", width: "100px" }}
  >
    <option value="p">P</option>
    <option value="div">DIV</option>
    <option value="h4">H4</option>
    <option value="h5">H5</option>
  </select>
  <SimpleEditor
    value={data.activationArea.paragraph.text}
    onChange={(text) => update(["activationArea", "paragraph", "text"], text)}
    style={{ width: "80%", display: "inline-block" }}
  />
</div>

      <h3>Info List Items</h3>
      {data.activationArea.infoList.map((item, i) => (
        <div key={i} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
          <input placeholder="Label" value={item.label} onChange={e => {
            const arr = [...data.activationArea.infoList];
            arr[i].label = e.target.value;
            update(["activationArea", "infoList"], arr);
          }} style={{ width: "48%", marginRight: "4%" }} />
          <input placeholder="Value" value={item.value} onChange={e => {
            const arr = [...data.activationArea.infoList];
            arr[i].value = e.target.value;
            update(["activationArea", "infoList"], arr);
          }} style={{ width: "48%" }} />
          <button onClick={() => update(["activationArea", "infoList"], data.activationArea.infoList.filter((_, idx) => idx !== i))} style={{ color: "red", marginTop: "10px" }}>Delete</button>
        </div>
      ))}
      <button onClick={() => update(["activationArea", "infoList"], [...data.activationArea.infoList, { label: "", value: "" }])}>Add Info Item</button>

      <h3>Activation Image</h3>
      <input type="file" accept="image/*" style={{ display: "none" }} id="activation-upload"
        onChange={(e) => e.target.files[0] && handleAddImage("activationArea", e.target.files[0])} />
      {pendingImages.activationArea ? (
        <div style={{ margin: "10px 0" }}>
          <img src={pendingImages.activationArea.url} alt="Preview" width="400" />
          <input placeholder="Alt text" value={pendingImages.activationArea.alt || ""} onChange={(e) => updateAltText("activationArea", e.target.value)} style={{ width: "100%", margin: "10px 0" }} />
          <button onClick={() => document.getElementById("activation-upload").click()}>Replace</button>
          <button onClick={() => handleDeleteImage("activationArea")} style={{ marginLeft: "10px", color: "red" }}>Delete</button>
        </div>
      ) : (
        <button onClick={() => document.getElementById("activation-upload").click()}>Upload Image</button>
      )}

      {/* TP Schemes */}
      {/* <h2>TP Schemes</h2>
      <div style={{ marginBottom: "10px" }}>
        <label>Section Title: </label>
        <select value={data.tpSchemes.title.tag} onChange={e => update(["tpSchemes", "title", "tag"], e.target.value)}>
          <option value="h2">H2</option>
          <option value="h3">H3</option>
        </select>
        <input value={data.tpSchemes.title.text} onChange={e => update(["tpSchemes", "title", "text"], e.target.value)} style={{ width: "70%", marginLeft: "10px" }} />
      </div> */}

      {/* <h3>TP Entries (1 to 10)</h3>
      {data.tpSchemes.tps.map((tp, i) => (
        <div key={i} style={{ border: "2px solid #aaa", padding: "15px", marginBottom: "20px" }}>
          <strong>TP{i + 1}</strong>
          <input placeholder="Villages" value={tp.villages} onChange={e => {
            const arr = [...data.tpSchemes.tps];
            arr[i].villages = e.target.value;
            update(["tpSchemes", "tps"], arr);
          }} style={{ width: "100%", margin: "10px 0" }} />
          <input placeholder="Population" value={tp.population} onChange={e => {
            const arr = [...data.tpSchemes.tps];
            arr[i].population = e.target.value;
            update(["tpSchemes", "tps"], arr);
          }} style={{ width: "100%", marginBottom: "10px" }} />

          <h4>Sub-TPs</h4>
          {tp.subTPs.map((sub, j) => (
            <div key={j} style={{ marginLeft: "20px", marginBottom: "5px" }}>
              <input value={sub} onChange={e => {
                const arr = [...data.tpSchemes.tps];
                arr[i].subTPs[j] = e.target.value;
                update(["tpSchemes", "tps"], arr);
              }} style={{ width: "80%" }} />
              <button onClick={() => {
                const arr = [...data.tpSchemes.tps];
                arr[i].subTPs.splice(j, 1);
                update(["tpSchemes", "tps"], arr);
              }} style={{ color: "red", marginLeft: "10px" }}>×</button>
            </div>
          ))}
          <button onClick={() => {
            const arr = [...data.tpSchemes.tps];
            arr[i].subTPs.push("");
            update(["tpSchemes", "tps"], arr);
          }}>Add Sub-TP</button>
        </div>
      ))} */}

      {/* Zoning Section */}
      <h2>Zoning Section</h2>
      <div style={{ marginBottom: "10px" }}>
        <label>Heading: </label>
        <select value={data.zoning.heading.tag} onChange={e => update(["zoning", "heading", "tag"], e.target.value)}>
          <option value="h2">H2</option>
          <option value="h3">H3</option>
        </select>
        <input value={data.zoning.heading.text} onChange={e => update(["zoning", "heading", "text"], e.target.value)} style={{ width: "70%", marginLeft: "10px" }} />
      </div>

<h3>Description</h3>
<div style={{ marginBottom: "15px" }}>
  <select
    value={data.zoning.description.tag}
    onChange={(e) => update(["zoning", "description", "tag"], e.target.value)}
    style={{ marginRight: "10px", width: "100px" }}
  >
    <option value="p">P</option>
    <option value="div">DIV</option>
    <option value="h4">H4</option>
    <option value="h5">H5</option>
  </select>
  <SimpleEditor
    value={data.zoning.description.text}
    onChange={(text) => update(["zoning", "description", "text"], text)}
    style={{ width: "80%", display: "inline-block" }}
  />
</div>

      <h3>Zones</h3>
      {data.zoning.zones.map((zone, i) => (
        <div key={i} style={{ border: "1px solid #ccc", padding: "15px", marginBottom: "15px" }}>
          <h4>Button</h4>
          <input placeholder="Button Text" value={zone.button?.text || ""} onChange={e => {
            const arr = [...data.zoning.zones];
            arr[i].button = { ...arr[i].button, text: e.target.value };
            update(["zoning", "zones"], arr);
          }} style={{ width: "48%", marginRight: "4%" }} />
          <input placeholder="Button Link" value={zone.button?.link || ""} onChange={e => {
            const arr = [...data.zoning.zones];
            arr[i].button = { ...arr[i].button, link: e.target.value };
            update(["zoning", "zones"], arr);
          }} style={{ width: "48%" }} />

          <input placeholder="Title" value={zone.title} onChange={e => {
            const arr = [...data.zoning.zones];
            arr[i].title = e.target.value;
            update(["zoning", "zones"], arr);
          }} style={{ width: "100%", marginBottom: "10px" }} />
          <textarea rows="3" placeholder="Description" value={zone.description} onChange={e => {
            const arr = [...data.zoning.zones];
            arr[i].description = e.target.value;
            update(["zoning", "zones"], arr);
          }} style={{ width: "100%", marginBottom: "10px" }} />

          <div style={{ margin: "15px 0" }}>
            <input type="file" accept="image/*" style={{ display: "none" }} id={`zone-upload-${i}`}
              onChange={(e) => e.target.files[0] && handleAddImage("zoningZone", e.target.files[0], i)} />
            {pendingImages.zoningZones[i] ? (
              <div>
                <img src={pendingImages.zoningZones[i].url} alt="Preview" width="300" style={{ marginBottom: "10px" }} />
                <input placeholder="Alt text" value={pendingImages.zoningZones[i].alt || ""} onChange={(e) => updateAltText("zoningZone", e.target.value, i)} style={{ width: "100%", margin: "5px 0" }} />
                <button onClick={() => document.getElementById(`zone-upload-${i}`).click()}>Replace</button>
                <button onClick={() => handleDeleteImage("zoningZone", i)} style={{ marginLeft: "10px", color: "red" }}>Delete</button>
              </div>
            ) : (
              <button onClick={() => document.getElementById(`zone-upload-${i}`).click()}>Upload Zone Image</button>
            )}
          </div>

          <button onClick={() => update(["zoning", "zones"], data.zoning.zones.filter((_, idx) => idx !== i))} style={{ color: "red", marginTop: "10px" }}>Delete Zone</button>
        </div>
      ))}
      <button onClick={() => update(["zoning", "zones"], [...data.zoning.zones, { image: null, title: "", description: "", button: { text: "Enquire Now", link: "/enquiry-form" } }])}>Add Zone</button>

      {/* Infrastructure Section */}
      <h2>Infrastructure Section</h2>
      <div style={{ marginBottom: "10px" }}>
        <label>Heading: </label>
        <select value={data.infrastructure.heading.tag} onChange={e => update(["infrastructure", "heading", "tag"], e.target.value)}>
          <option value="h2">H2</option>
          <option value="h3">H3</option>
        </select>
        <input value={data.infrastructure.heading.text} onChange={e => update(["infrastructure", "heading", "text"], e.target.value)} style={{ width: "70%", marginLeft: "10px" }} />
      </div>

<h3>Paragraph</h3>
<div style={{ marginBottom: "15px" }}>
  <select
    value={data.infrastructure.paragraph.tag}
    onChange={(e) => update(["infrastructure", "paragraph", "tag"], e.target.value)}
    style={{ marginRight: "10px", width: "100px" }}
  >
    <option value="p">P</option>
    <option value="div">DIV</option>
    <option value="h4">H4</option>
    <option value="h5">H5</option>
  </select>
  <SimpleEditor
    value={data.infrastructure.paragraph.text}
    onChange={(text) => update(["infrastructure", "paragraph", "text"], text)}
    style={{ width: "80%", display: "inline-block" }}
  />
</div>

      <h3>Stats</h3>
      {data.infrastructure.stats.map((stat, i) => (
        <div key={i}>
          <input value={stat.iconText} onChange={e => {
            const arr = [...data.infrastructure.stats];
            arr[i].iconText = e.target.value;
            update(["infrastructure", "stats"], arr);
          }} style={{ width: "80%" }} />
          <button onClick={() => update(["infrastructure", "stats"], data.infrastructure.stats.filter((_, idx) => idx !== i))} style={{ color: "red" }}>Delete</button>
        </div>
      ))}
      <button onClick={() => update(["infrastructure", "stats"], [...data.infrastructure.stats, { iconText: "" }])}>Add Stat</button>

      <h3>Infrastructure Image</h3>
      <input type="file" accept="image/*" style={{ display: "none" }} id="infra-upload"
        onChange={(e) => e.target.files[0] && handleAddImage("infrastructure", e.target.files[0])} />
      {pendingImages.infrastructure ? (
        <div style={{ margin: "10px 0" }}>
          <img src={pendingImages.infrastructure.url} alt="Preview" width="400" />
          <input placeholder="Alt text" value={pendingImages.infrastructure.alt || ""} onChange={(e) => updateAltText("infrastructure", e.target.value)} style={{ width: "100%", margin: "10px 0" }} />
          <button onClick={() => document.getElementById("infra-upload").click()}>Replace</button>
          <button onClick={() => handleDeleteImage("infrastructure")} style={{ marginLeft: "10px", color: "red" }}>Delete</button>
        </div>
      ) : (
        <button onClick={() => document.getElementById("infra-upload").click()}>Upload Image</button>
      )}

      {/* Smart City Features */}
      <h2>Smart City Features</h2>
      <div style={{ marginBottom: "10px" }}>
        <label>Heading: </label>
        <select value={data.smartCityFeatures.heading.tag} onChange={e => update(["smartCityFeatures", "heading", "tag"], e.target.value)}>
          <option value="h2">H2</option>
          <option value="h3">H3</option>
        </select>
        <input value={data.smartCityFeatures.heading.text} onChange={e => update(["smartCityFeatures", "heading", "text"], e.target.value)} style={{ width: "70%", marginLeft: "10px" }} />
      </div>

<h3>Intro Paragraph</h3>
<div style={{ marginBottom: "15px" }}>
  <select
    value={data.smartCityFeatures.introParagraph.tag}
    onChange={(e) => update(["smartCityFeatures", "introParagraph", "tag"], e.target.value)}
    style={{ marginRight: "10px", width: "100px" }}
  >
    <option value="p">P</option>
    <option value="div">DIV</option>
    <option value="h5">H5</option>
  </select>
  <SimpleEditor
    value={data.smartCityFeatures.introParagraph.text}
    onChange={(text) => update(["smartCityFeatures", "introParagraph", "text"], text)}
    style={{ width: "80%", display: "inline-block" }}
  />
</div>
      <h3>Left Features</h3>
      {data.smartCityFeatures.leftFeatures.map((f, i) => (
        <div key={i}>
          <input value={f} onChange={e => {
            const arr = [...data.smartCityFeatures.leftFeatures];
            arr[i] = e.target.value;
            update(["smartCityFeatures", "leftFeatures"], arr);
          }} style={{ width: "90%" }} />
          <button onClick={() => update(["smartCityFeatures", "leftFeatures"], data.smartCityFeatures.leftFeatures.filter((_, idx) => idx !== i))} style={{ color: "red" }}>×</button>
        </div>
      ))}
      <button onClick={() => update(["smartCityFeatures", "leftFeatures"], [...data.smartCityFeatures.leftFeatures, ""])}>Add Left Feature</button>

      <h3>Right Features</h3>
      {data.smartCityFeatures.rightFeatures.map((f, i) => (
        <div key={i}>
          <input value={f} onChange={e => {
            const arr = [...data.smartCityFeatures.rightFeatures];
            arr[i] = e.target.value;
            update(["smartCityFeatures", "rightFeatures"], arr);
          }} style={{ width: "90%" }} />
          <button onClick={() => update(["smartCityFeatures", "rightFeatures"], data.smartCityFeatures.rightFeatures.filter((_, idx) => idx !== i))} style={{ color: "red" }}>×</button>
        </div>
      ))}
      <button onClick={() => update(["smartCityFeatures", "rightFeatures"], [...data.smartCityFeatures.rightFeatures, ""])}>Add Right Feature</button>

      <h3>Carousel Images (Max 5)</h3>
      <input type="file" accept="image/*" multiple style={{ marginBottom: "10px" }}
        onChange={(e) => Array.from(e.target.files).forEach(file => handleAddImage("smartCityCarousel", file))} />
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {pendingImages.smartCityCarousel.map((img, i) => (
          <div key={img.id} style={{ textAlign: "center" }}>
            <img src={img.url} alt="Preview" width="200" style={{ marginBottom: "10px" }} />
            <input placeholder="Alt text" value={img.alt || ""} onChange={(e) => updateAltText("smartCityCarousel", e.target.value, i)} style={{ width: "100%", marginBottom: "5px" }} />
            <div>
              <button onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*";
                input.onchange = (ev) => ev.target.files[0] && handleReplaceImage("smartCityCarousel", ev.target.files[0], i);
                input.click();
              }}>Replace</button>
              <button onClick={() => handleDeleteImage("smartCityCarousel", i)} style={{ marginLeft: "8px", color: "red" }}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Sustainability Highlights */}
      <h2>Sustainability Highlights</h2>
      <div style={{ marginBottom: "10px" }}>
        <label>Heading: </label>
        <select value={data.sustainability.heading.tag} onChange={e => update(["sustainability", "heading", "tag"], e.target.value)}>
          <option value="h2">H2</option>
          <option value="h3">H3</option>
        </select>
        <input value={data.sustainability.heading.text} onChange={e => update(["sustainability", "heading", "text"], e.target.value)} style={{ width: "70%", marginLeft: "10px" }} />
      </div>

<h3>Paragraph</h3>
<div style={{ marginBottom: "15px" }}>
  <select
    value={data.sustainability.paragraph.tag}
    onChange={(e) => update(["sustainability", "paragraph", "tag"], e.target.value)}
    style={{ marginRight: "10px", width: "100px" }}
  >
    <option value="p">P</option>
    <option value="div">DIV</option>
    <option value="h5">H5</option>
  </select>
  <SimpleEditor
    value={data.sustainability.paragraph.text}
    onChange={(text) => update(["sustainability", "paragraph", "text"], text)}
    style={{ width: "80%", display: "inline-block" }}
  />
</div>

      <h3>Top Cards (3)</h3>
      {data.sustainability.topCards.map((card, i) => (
        <div key={i} style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "10px" }}>
          <input placeholder="Icon Type (leaf/solar/water)" value={card.iconType} onChange={e => {
            const arr = [...data.sustainability.topCards];
            arr[i].iconType = e.target.value;
            update(["sustainability", "topCards"], arr);
          }} />
          <input placeholder="Title" value={card.title} onChange={e => {
            const arr = [...data.sustainability.topCards];
            arr[i].title = e.target.value;
            update(["sustainability", "topCards"], arr);
          }} style={{ width: "100%", marginTop: "5px" }} />
          <textarea rows="2" placeholder="Description" value={card.description} onChange={e => {
            const arr = [...data.sustainability.topCards];
            arr[i].description = e.target.value;
            update(["sustainability", "topCards"], arr);
          }} style={{ width: "100%" }} />
        </div>
      ))}

      <h3>Bottom Cards (3)</h3>
      {data.sustainability.bottomCards.map((card, i) => (
        <div key={i} style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "10px" }}>
          <input placeholder="Icon Type (home/building/road)" value={card.iconType} onChange={e => {
            const arr = [...data.sustainability.bottomCards];
            arr[i].iconType = e.target.value;
            update(["sustainability", "bottomCards"], arr);
          }} />
          <input placeholder="Title" value={card.title} onChange={e => {
            const arr = [...data.sustainability.bottomCards];
            arr[i].title = e.target.value;
            update(["sustainability", "bottomCards"], arr);
          }} style={{ width: "100%", marginTop: "5px" }} />
          <textarea rows="2" placeholder="Description" value={card.description} onChange={e => {
            const arr = [...data.sustainability.bottomCards];
            arr[i].description = e.target.value;
            update(["sustainability", "bottomCards"], arr);
          }} style={{ width: "100%" }} />
        </div>
      ))}

      {/* Investment Section */}
      <h2>Investment Section (Why Invest)</h2>
      <div style={{ marginBottom: "10px" }}>
        <label>Main Heading: </label>
        <select value={data.investment.heading.tag} onChange={e => update(["investment", "heading", "tag"], e.target.value)}>
          <option value="h2">H2</option>
          <option value="h3">H3</option>
        </select>
        <input value={data.investment.heading.text} onChange={e => update(["investment", "heading", "text"], e.target.value)} style={{ width: "70%", marginLeft: "10px" }} />
      </div>
<h3>Intro Paragraph</h3>
<div style={{ marginBottom: "15px" }}>
  <select
    value={data.investment.introParagraph.tag}
    onChange={(e) => update(["investment", "introParagraph", "tag"], e.target.value)}
    style={{ marginRight: "10px", width: "100px" }}
  >
    <option value="p">P</option>
    <option value="div">DIV</option>
    <option value="h5">H5</option>
  </select>
  <SimpleEditor
    value={data.investment.introParagraph.text}
    onChange={(text) => update(["investment", "introParagraph", "text"], text)}
    style={{ width: "80%", display: "inline-block" }}
  />
</div>

<h3>Content Paragraph</h3>
<div style={{ marginBottom: "15px" }}>
  <select
    value={data.investment.contentParagraph.tag}
    onChange={(e) => update(["investment", "contentParagraph", "tag"], e.target.value)}
    style={{ marginRight: "10px", width: "100px" }}
  >
    <option value="p">P</option>
    <option value="div">DIV</option>
    <option value="h5">H5</option>
  </select>
  <SimpleEditor
    value={data.investment.contentParagraph.text}
    onChange={(text) => update(["investment", "contentParagraph", "text"], text)}
    style={{ width: "80%", display: "inline-block" }}
  />
</div>

      <h3>Content Box</h3>
      <div style={{ marginBottom: "10px" }}>
        <label>Content Heading: </label>
        <select value={data.investment.contentHeading.tag} onChange={e => update(["investment", "contentHeading", "tag"], e.target.value)}>
          <option value="h3">H3</option>
          <option value="h4">H4</option>
        </select>
        <input value={data.investment.contentHeading.text} onChange={e => update(["investment", "contentHeading", "text"], e.target.value)} style={{ width: "70%", marginLeft: "10px" }} />
      </div>

  <h3>Content Paragraph</h3>
<EditableTextBlock
  value={data.investment.contentParagraph}
  onChange={(val) => update(["investment", "contentParagraph"], val)}
/>

      <h3>Investment Image</h3>
      <input type="file" accept="image/*" style={{ display: "none" }} id="investment-upload"
        onChange={(e) => e.target.files[0] && handleAddImage("investment", e.target.files[0])} />
      {pendingImages.investment ? (
        <div style={{ margin: "10px 0" }}>
          <img src={pendingImages.investment.url} alt="Preview" width="400" />
          <input placeholder="Alt text" value={pendingImages.investment.alt || ""} onChange={(e) => updateAltText("investment", e.target.value)} style={{ width: "100%", margin: "10px 0" }} />
          <button onClick={() => document.getElementById("investment-upload").click()}>Replace</button>
          <button onClick={() => handleDeleteImage("investment")} style={{ marginLeft: "10px", color: "red" }}>Delete</button>
        </div>
      ) : (
        <button onClick={() => document.getElementById("investment-upload").click()}>Upload Image</button>
      )}

      {/* Investment Form Settings */}
            {/* Investment Form Settings - STATIC */}
      <h3>Investment Form Settings (Static Form)</h3>

      <div style={{ marginBottom: "10px" }}>
        <label>Form Heading: </label>
        <select 
          value={data.investment.form.heading.tag} 
          onChange={e => update(["investment", "form", "heading", "tag"], e.target.value)}
        >
          <option value="h3">H3</option>
          <option value="h4">H4</option>
        </select>
        <input 
          value={data.investment.form.heading.text} 
          onChange={e => update(["investment", "form", "heading", "text"], e.target.value)} 
          placeholder="e.g., Get Investment Details"
          style={{ width: "70%", marginLeft: "10px" }} 
        />
      </div>

      <input 
        placeholder="Email Subject (hidden)" 
        value={data.investment.form.subject || ""} 
        onChange={e => update(["investment", "form", "subject"], e.target.value)} 
        style={{ width: "100%", marginBottom: "10px" }} 
      />

      <input 
        placeholder="Submit Button Text" 
        value={data.investment.form.buttonText || "Submit"} 
        onChange={e => update(["investment", "form", "buttonText"], e.target.value)} 
        style={{ width: "100%", marginBottom: "20px" }} 
      />

      <br /><br />
      <button onClick={save} disabled={saving} >
        {saving ? "Saving..." : "Save All Changes"}
      </button>
    </div>
  );
};

export default AdminPlanning;