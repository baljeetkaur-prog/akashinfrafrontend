import "./AdminInvestment.css";
import { useState, useEffect } from "react";
import axios from "axios";
import SimpleEditor from "./SimpleEditor";
import "./AdminInvestment.css";

/* Normalize TextBlock */
const block = (value, tag = "p") => {
  if (!value) return { tag, text: "" };
  if (typeof value === "string") return { tag, text: value };
  return { tag: value.tag || tag, text: value.text || "" };
};

const AdminInvestment = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const API = process.env.REACT_APP_APIURL;

  // Unified pending images: flat array with type identifier
  const [pendingImages, setPendingImages] = useState([]);

  /* Load data + initialize pending images */
  useEffect(() => {
    axios
      .get(`${API}/api/investment-opportunities`)
      .then((res) => {
        const d = res.data || {};

        // Normalize all sections
        d.seo ||= { title: "", description: "", keywords: "" };
        d.breadcrumb ||= { parent: "", current: "" };

        d.banner ||= { heading: {}, image: null };
        d.banner.heading = block(d.banner.heading, "h1");
        d.banner.image = normalizeImage(d.banner.image);

        d.opporLeft ||= { title: {}, paragraphs: [], button: { text: {}, link: "" } };
        d.opporLeft.title = block(d.opporLeft.title, "h2");
        d.opporLeft.paragraphs = (d.opporLeft.paragraphs || []).map(p => block(p));
        d.opporLeft.button.text = block(d.opporLeft.button.text);

        d.opporRight ||= [];
        d.opporRight = d.opporRight.map(c => ({
          image: normalizeImage(c.image),
          title: block(c.title, "h3"),
          paragraphs: (c.paragraphs || []).map(p => block(p))
        }));

        d.plottingSection ||= { image: null, smallHeading: {}, bigHeading: {}, rightParagraph: {}, button: { text: {}, link: "" } };
        d.plottingSection.smallHeading = block(d.plottingSection.smallHeading, "h4");
        d.plottingSection.bigHeading = block(d.plottingSection.bigHeading, "h2");
        d.plottingSection.rightParagraph = block(d.plottingSection.rightParagraph);
        d.plottingSection.button.text = block(d.plottingSection.button.text);
        d.plottingSection.image = normalizeImage(d.plottingSection.image);

        d.govtSection ||= { image: null, smallHeading: {}, bigHeading: {}, paragraphs: [] };
        d.govtSection.smallHeading = block(d.govtSection.smallHeading, "h4");
        d.govtSection.bigHeading = block(d.govtSection.bigHeading, "h2");
        d.govtSection.paragraphs = (d.govtSection.paragraphs || []).map(p => block(p));
        d.govtSection.image = normalizeImage(d.govtSection.image);

        d.employmentSection ||= { mainHeading: {}, subText: {}, cards: [] };
        d.employmentSection.mainHeading = block(d.employmentSection.mainHeading, "h2");
        d.employmentSection.subText = block(d.employmentSection.subText);
        d.employmentSection.cards = (d.employmentSection.cards || []).map(c => ({
          heading: block(c.heading, "h3"),
          text: block(c.text)
        }));

        d.sustainabilitySection ||= { image: null, smallHeading: {}, bigHeading: {}, paragraphs: [] };
        d.sustainabilitySection.smallHeading = block(d.sustainabilitySection.smallHeading, "h4");
        d.sustainabilitySection.bigHeading = block(d.sustainabilitySection.bigHeading, "h2");
        d.sustainabilitySection.paragraphs = (d.sustainabilitySection.paragraphs || []).map(p => block(p));
        d.sustainabilitySection.image = normalizeImage(d.sustainabilitySection.image);

        d.ctaSection ||= { heading: {}, paragraphs: [], button: { text: {}, link: "" } };
        d.ctaSection.heading = block(d.ctaSection.heading, "h2");
        d.ctaSection.paragraphs = (d.ctaSection.paragraphs || []).map(p => block(p));
        d.ctaSection.button.text = block(d.ctaSection.button.text);

        setData(d);

        // Initialize pendingImages
        const images = [];

        if (d.banner.image?.url) {
          images.push({ type: "banner", id: "banner", ...d.banner.image, isNew: false });
        }
        if (d.plottingSection.image?.url) {
          images.push({ type: "plotting", id: "plotting", ...d.plottingSection.image, isNew: false });
        }
        if (d.govtSection.image?.url) {
          images.push({ type: "govt", id: "govt", ...d.govtSection.image, isNew: false });
        }
        if (d.sustainabilitySection.image?.url) {
          images.push({ type: "sustain", id: "sustain", ...d.sustainabilitySection.image, isNew: false });
        }

        d.opporRight.forEach((card, i) => {
          if (card.image?.url) {
            images.push({
              type: "opporCard",
              cardIndex: i,
              id: `card-${i}`,
              ...card.image,
              isNew: false
            });
          }
        });

        setPendingImages(images);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [API]);

  // Helper to normalize old string URLs
  const normalizeImage = (img) => {
    if (!img) return null;
    if (typeof img === "string") return { url: img, publicId: null, alt: "" };
    return img;
  };

  const update = (path, value) => {
    setData((prev) => {
      const u = structuredClone(prev);
      let ref = u;
      for (let i = 0; i < path.length - 1; i++) ref = ref[path[i]];
      ref[path[path.length - 1]] = value;
      return u;
    });
  };

  const createPreview = (file) => URL.createObjectURL(file);

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await axios.post(`${API}/api/upload`, formData);
    return { url: res.data.url, publicId: res.data.publicId };
  };

  // Add new or replace existing image
  const handleImageChange = (type, file, cardIndex = null) => {
    if (!file) return;

    const previewUrl = createPreview(file);
    const id = cardIndex !== null ? `card-${cardIndex}` : type;

    setPendingImages(prev => {
      // Remove existing image of same type/cardIndex
      const filtered = prev.filter(img => {
        if (cardIndex !== null) return !(img.type === "opporCard" && img.cardIndex === cardIndex);
        return img.type !== type;
      });

      // Add new one
      const existingAlt = prev.find(img => 
        (cardIndex !== null ? (img.type === "opporCard" && img.cardIndex === cardIndex) : img.type === type)
      )?.alt || "";

      return [...filtered, {
        type,
        cardIndex,
        id,
        url: previewUrl,
        file,
        alt: existingAlt,
        isNew: true
      }];
    });
  };

  // Delete image (and delete from Cloudinary if it had publicId)
  const handleDeleteImage = (type, cardIndex = null) => {
    setPendingImages(prev => {
      const imgToDelete = prev.find(img => 
        (cardIndex !== null ? (img.type === "opporCard" && img.cardIndex === cardIndex) : img.type === type)
      );

      if (imgToDelete?.publicId) {
        axios.post(`${API}/api/delete-image`, { publicId: imgToDelete.publicId }).catch(console.warn);
      }

      return prev.filter(img => 
        !(cardIndex !== null ? (img.type === "opporCard" && img.cardIndex === cardIndex) : img.type === type)
      );
    });
  };

  // Update alt text
  const handleAltChange = (type, value, cardIndex = null) => {
    setPendingImages(prev => prev.map(img => {
      if (cardIndex !== null) {
        if (img.type === "opporCard" && img.cardIndex === cardIndex) return { ...img, alt: value };
      } else if (img.type === type) {
        return { ...img, alt: value };
      }
      return img;
    }));
  };

  // Get pending image by type and optional cardIndex
  const getPendingImage = (type, cardIndex = null) => {
    return pendingImages.find(img => 
      cardIndex !== null ? (img.type === "opporCard" && img.cardIndex === cardIndex) : img.type === type
    );
  };

  // Final Save
  const save = async () => {
    try {
      setSaving(true);
      const imagesToDelete = [];

      const processImage = async (img) => {
        if (!img) return null;
        if (img.file) {
          if (img.publicId) imagesToDelete.push(img.publicId);
          const uploaded = await uploadImage(img.file);
          return { ...uploaded, alt: img.alt || "" };
        }
        return { url: img.url, publicId: img.publicId, alt: img.alt || "" };
      };

      const finalBanner = await processImage(getPendingImage("banner"));
      const finalPlotting = await processImage(getPendingImage("plotting"));
      const finalGovt = await processImage(getPendingImage("govt"));
      const finalSustain = await processImage(getPendingImage("sustain"));

      const finalOpporImages = new Array(data.opporRight.length).fill(null);
      for (const img of pendingImages.filter(i => i.type === "opporCard")) {
        const processed = await processImage(img);
        finalOpporImages[img.cardIndex] = processed;
      }

      // Delete old replaced images
      for (const publicId of imagesToDelete) {
        if (publicId) await axios.post(`${API}/api/delete-image`, { publicId }).catch(console.warn);
      }

      const payload = {
        ...data,
        banner: { ...data.banner, image: finalBanner },
        plottingSection: { ...data.plottingSection, image: finalPlotting },
        govtSection: { ...data.govtSection, image: finalGovt },
        sustainabilitySection: { ...data.sustainabilitySection, image: finalSustain },
        opporRight: data.opporRight.map((card, i) => ({
          ...card,
          image: finalOpporImages[i] || null
        }))
      };

      await axios.post(`${API}/api/investment-opportunities`, payload);
      alert("Saved successfully!");

      // Update pendingImages with final uploaded values
      const newPending = [];
      if (finalBanner) newPending.push({ type: "banner", id: "banner", ...finalBanner, isNew: false });
      if (finalPlotting) newPending.push({ type: "plotting", id: "plotting", ...finalPlotting, isNew: false });
      if (finalGovt) newPending.push({ type: "govt", id: "govt", ...finalGovt, isNew: false });
      if (finalSustain) newPending.push({ type: "sustain", id: "sustain", ...finalSustain, isNew: false });
      finalOpporImages.forEach((img, i) => {
        if (img) newPending.push({ type: "opporCard", cardIndex: i, id: `card-${i}`, ...img, isNew: false });
      });

      setPendingImages(newPending);
      setData(payload);
    } catch (err) {
      console.error(err);
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !data) return <div>Loading...</div>;

  return (
    <div className="admin-investment">
      <h1>Admin – Investment Opportunities Editor</h1>

      {/* SEO */}
      <h2>SEO</h2>
      <input value={data.seo.title} onChange={(e) => update(["seo", "title"], e.target.value)} placeholder="Meta Title"  />
      <input value={data.seo.description} onChange={(e) => update(["seo", "description"], e.target.value)} placeholder="Meta Description" />
      <input value={data.seo.keywords} onChange={(e) => update(["seo", "keywords"], e.target.value)} placeholder="Keywords" />

      {/* Breadcrumb */}
      <h2>Breadcrumb</h2>
      <input value={data.breadcrumb.parent} onChange={(e) => update(["breadcrumb", "parent"], e.target.value)} placeholder="Parent"  />
      <input value={data.breadcrumb.current} onChange={(e) => update(["breadcrumb", "current"], e.target.value)} placeholder="Current"  />

      {/* Banner */}
      <h2>Banner</h2>
      <div>
        <label>Heading Tag: </label>
        <select value={data.banner.heading.tag} onChange={(e) => update(["banner", "heading", "tag"], e.target.value)}>
          <option value="h1">H1</option>
          <option value="h2">H2</option>
          <option value="h3">H3</option>
        </select>
        <input value={data.banner.heading.text} onChange={(e) => update(["banner", "heading", "text"], e.target.value)} placeholder="Banner Heading" />
      </div>
      {getPendingImage("banner") && (
        <div>
          <img src={getPendingImage("banner").url} alt="Preview" width="400" />
          <div>
            <input
              type="text"
              placeholder="Alt text"
              value={getPendingImage("banner").alt}
              onChange={(e) => handleAltChange("banner", e.target.value)}
             
            />
            <br />
            <button onClick={() => document.getElementById("replace-banner").click()}>
              Replace
            </button>
            <button onClick={() => handleDeleteImage("banner")} >
              Delete
            </button>
          </div>
          <input
            id="replace-banner"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => e.target.files[0] && handleImageChange("banner", e.target.files[0])}
          />
        </div>
      )}

      {/* Opportunity Left Section */}
      <h2>Opportunity Left Section</h2>
      <div>
        <label>Title Tag: </label>
        <select value={data.opporLeft.title.tag} onChange={(e) => update(["opporLeft", "title", "tag"], e.target.value)}>
          <option value="h2">H2</option>
          <option value="h3">H3</option>
        </select>
        <input value={data.opporLeft.title.text} onChange={(e) => update(["opporLeft", "title", "text"], e.target.value)}/>
      </div>

      <h3>Paragraphs</h3>
      {data.opporLeft.paragraphs.map((p, i) => (
        <div key={i}>
          <select value={p.tag} onChange={(e) => {
            const arr = [...data.opporLeft.paragraphs];
            arr[i].tag = e.target.value;
            update(["opporLeft", "paragraphs"], arr);
          }}>
            <option value="p">P</option>
            <option value="h5">H5</option>
          </select>
     <SimpleEditor
  value={p.text}
  onChange={(val) => {
    const arr = [...data.opporLeft.paragraphs];
    arr[i].text = val;
    update(["opporLeft", "paragraphs"], arr);
  }}
/>
          <button onClick={() => update(["opporLeft", "paragraphs"], data.opporLeft.paragraphs.filter((_, idx) => idx !== i))}>
            Delete
          </button>
        </div>
      ))}
      <button onClick={() => update(["opporLeft", "paragraphs"], [...data.opporLeft.paragraphs, { tag: "p", text: "" }])}>Add Paragraph</button>

      <h3>Button</h3>
      <input value={data.opporLeft.button.text.text} onChange={(e) => update(["opporLeft", "button", "text"], { ...data.opporLeft.button.text, text: e.target.value })} placeholder="Button Text" />
      <input value={data.opporLeft.button.link} onChange={(e) => update(["opporLeft", "button", "link"], e.target.value)} placeholder="Button Link" />

      {/* Opportunity Right Cards */}
      <h2>Opportunity Right Cards</h2>
      {data.opporRight.map((c, i) => {
        const cardPending = getPendingImage("opporCard", i);
        return (
          <div key={i}>
            <div>
              <label>Title Tag: </label>
              <select value={c.title.tag} onChange={(e) => {
                const arr = [...data.opporRight];
                arr[i].title.tag = e.target.value;
                update(["opporRight"], arr);
              }}>
                <option value="h3">H3</option>
                <option value="h4">H4</option>
              </select>
              <input value={c.title.text} onChange={(e) => {
                const arr = [...data.opporRight];
                arr[i].title.text = e.target.value;
                update(["opporRight"], arr);
              }}/>
            </div>

            <h4>Paragraphs</h4>
            {c.paragraphs.map((p, j) => (
              <div key={j} >
                <select value={p.tag} onChange={(e) => {
                  const arr = [...data.opporRight];
                  arr[i].paragraphs[j].tag = e.target.value;
                  update(["opporRight"], arr);
                }}>
                  <option value="p">P</option>
                </select>
             <SimpleEditor
  value={p.text}
  onChange={(val) => {
    const arr = [...data.opporRight];
    arr[i].paragraphs[j].text = val;
    update(["opporRight"], arr);
  }}
/>

                <button onClick={() => {
                  const arr = [...data.opporRight];
                  arr[i].paragraphs = arr[i].paragraphs.filter((_, k) => k !== j);
                  update(["opporRight"], arr);
                }} >
                  Delete
                </button>
              </div>
            ))}
            <button onClick={() => {
              const arr = [...data.opporRight];
              arr[i].paragraphs.push({ tag: "p", text: "" });
              update(["opporRight"], arr);
            }}>
              Add Paragraph
            </button>

            <h4>Card Image</h4>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files[0] && handleImageChange("opporCard", e.target.files[0], i)}
            />
            {cardPending && (
              <div>
                <img src={cardPending.url} alt="Card Preview" width="250"  />
                <input
                  type="text"
                  placeholder="Alt text"
                  value={cardPending.alt}
                  onChange={(e) => handleAltChange("opporCard", e.target.value, i)}
              
                />
                <br />
                <button onClick={() => document.getElementById(`replace-card-${i}`).click()}>
                  Replace
                </button>
                <button onClick={() => handleDeleteImage("opporCard", i)} >
                  Delete
                </button>
                <input
                  id={`replace-card-${i}`}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => e.target.files[0] && handleImageChange("opporCard", e.target.files[0], i)}
                />
              </div>
            )}

            <button onClick={() => update(["opporRight"], data.opporRight.filter((_, idx) => idx !== i))} >
              Delete Card
            </button>
          </div>
        );
      })}
      <button onClick={() => update(["opporRight"], [...data.opporRight, { image: null, title: { tag: "h3", text: "" }, paragraphs: [] }])}>
        Add New Card
      </button>

      {/* Plotting Section */}
      <h2>Plotting Section</h2>
      <div>
        <label>Small Heading Tag: </label>
        <select value={data.plottingSection.smallHeading.tag} onChange={(e) => update(["plottingSection", "smallHeading", "tag"], e.target.value)}>
          <option value="h4">H4</option>
          <option value="p">P</option>
        </select>
        <input value={data.plottingSection.smallHeading.text} onChange={(e) => update(["plottingSection", "smallHeading", "text"], e.target.value)} />
      </div>
      <div>
        <label>Big Heading Tag: </label>
        <select value={data.plottingSection.bigHeading.tag} onChange={(e) => update(["plottingSection", "bigHeading", "tag"], e.target.value)}>
          <option value="h2">H2</option>
          <option value="h1">H1</option>
        </select>
        <input value={data.plottingSection.bigHeading.text} onChange={(e) => update(["plottingSection", "bigHeading", "text"], e.target.value)}  />
      </div>
<SimpleEditor
  value={data.plottingSection.rightParagraph.text}
  onChange={(val) =>
    update(["plottingSection", "rightParagraph", "text"], val)
  }
/>

      <div>
        <input value={data.plottingSection.button.text.text} onChange={(e) => update(["plottingSection", "button", "text"], { ...data.plottingSection.button.text, text: e.target.value })} placeholder="Button Text" />
        <input value={data.plottingSection.button.link} onChange={(e) => update(["plottingSection", "button", "link"], e.target.value)} placeholder="Button Link"/>
      </div>

      <h3>Plotting Image</h3>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files[0] && handleImageChange("plotting", e.target.files[0])}
      />
      {getPendingImage("plotting") && (
        <div>
          <img src={getPendingImage("plotting").url} alt="Plotting Preview" width="400"/>
          <input
            type="text"
            placeholder="Alt text"
            value={getPendingImage("plotting").alt}
            onChange={(e) => handleAltChange("plotting", e.target.value)}
            
          />
          <br />
          <button onClick={() => document.getElementById("replace-plotting").click()}>
            Replace
          </button>
          <button onClick={() => handleDeleteImage("plotting")}>
            Delete
          </button>
          <input
            id="replace-plotting"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => e.target.files[0] && handleImageChange("plotting", e.target.files[0])}
          />
        </div>
      )}

      {/* Government Section */}
      <h2>Government Section</h2>
      <div >
        <label>Small Heading Tag: </label>
        <select value={data.govtSection.smallHeading.tag} onChange={(e) => update(["govtSection", "smallHeading", "tag"], e.target.value)}>
          <option value="h4">H4</option>
        </select>
        <input value={data.govtSection.smallHeading.text} onChange={(e) => update(["govtSection", "smallHeading", "text"], e.target.value)}  />
      </div>
      <div >
        <label>Big Heading Tag: </label>
        <select value={data.govtSection.bigHeading.tag} onChange={(e) => update(["govtSection", "bigHeading", "tag"], e.target.value)}>
          <option value="h2">H2</option>
        </select>
        <input value={data.govtSection.bigHeading.text} onChange={(e) => update(["govtSection", "bigHeading", "text"], e.target.value)} />
      </div>

      {data.govtSection.paragraphs.map((p, i) => (
  <div key={i}>
    <select value={p.tag} onChange={(e) => {
      const arr = [...data.govtSection.paragraphs];
      arr[i].tag = e.target.value;
      update(["govtSection", "paragraphs"], arr);
    }}>
      <option value="p">P</option>
    </select>
    <SimpleEditor
      value={p.text}
      onChange={(val) => {
        const arr = [...data.govtSection.paragraphs];
        arr[i].text = val;
        update(["govtSection", "paragraphs"], arr);
      }}
    />
    <button onClick={() => update(["govtSection", "paragraphs"], data.govtSection.paragraphs.filter((_, idx) => idx !== i))} >
      Delete
    </button>
  </div>
))}
      <button onClick={() => update(["govtSection", "paragraphs"], [...data.govtSection.paragraphs, { tag: "p", text: "" }])}>
        Add Paragraph
      </button>

      <h3>Government Image</h3>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files[0] && handleImageChange("govt", e.target.files[0])}
      />
      {getPendingImage("govt") && (
        <div>
          <img src={getPendingImage("govt").url} alt="Govt Preview" width="400" />
          <input
            type="text"
            placeholder="Alt text"
            value={getPendingImage("govt").alt}
            onChange={(e) => handleAltChange("govt", e.target.value)}
          
          />
          <br />
          <button onClick={() => document.getElementById("replace-govt").click()}>
            Replace
          </button>
          <button onClick={() => handleDeleteImage("govt")}>
            Delete
          </button>
          <input
            id="replace-govt"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => e.target.files[0] && handleImageChange("govt", e.target.files[0])}
          />
        </div>
      )}

      {/* Employment Section */}
      <h2>Employment Section</h2>
      <div>
        <label>Main Heading Tag: </label>
        <select value={data.employmentSection.mainHeading.tag} onChange={(e) => update(["employmentSection", "mainHeading", "tag"], e.target.value)}>
          <option value="h2">H2</option>
        </select>
        <input value={data.employmentSection.mainHeading.text} onChange={(e) => update(["employmentSection", "mainHeading", "text"], e.target.value)} style={{ width: "70%", marginLeft: "10px" }} />
      </div>
      <div >
        <label>Sub Text Tag: </label>
        <select value={data.employmentSection.subText.tag} onChange={(e) => update(["employmentSection", "subText", "tag"], e.target.value)}>
          <option value="p">P</option>
        </select>
     <SimpleEditor
  value={data.employmentSection.subText.text}
  onChange={(val) =>
    update(["employmentSection", "subText", "text"], val)
  }
/>

      </div>

      <h3>Cards</h3>
      {data.employmentSection.cards.map((c, i) => (
        <div key={i}>
          <div>
            <label>Heading Tag: </label>
            <select value={c.heading.tag} onChange={(e) => {
              const arr = [...data.employmentSection.cards];
              arr[i].heading.tag = e.target.value;
              update(["employmentSection", "cards"], arr);
            }}>
              <option value="h3">H3</option>
              <option value="h4">H4</option>
            </select>
            <input value={c.heading.text} onChange={(e) => {
              const arr = [...data.employmentSection.cards];
              arr[i].heading.text = e.target.value;
              update(["employmentSection", "cards"], arr);
            }} />
          </div>
         <SimpleEditor
  value={c.text.text}
  onChange={(val) => {
    const arr = [...data.employmentSection.cards];
    arr[i].text.text = val;
    update(["employmentSection", "cards"], arr);
  }}
/>

          <button onClick={() => update(["employmentSection", "cards"], data.employmentSection.cards.filter((_, idx) => idx !== i))} >
            Delete Card
          </button>
        </div>
      ))}
      <button onClick={() => update(["employmentSection", "cards"], [...data.employmentSection.cards, { heading: { tag: "h3", text: "" }, text: { tag: "p", text: "" } }])}>
        Add Card
      </button>

      {/* Sustainability Section */}
      <h2>Sustainability Section</h2>
      <div>
        <label>Small Heading Tag: </label>
        <select value={data.sustainabilitySection.smallHeading.tag} onChange={(e) => update(["sustainabilitySection", "smallHeading", "tag"], e.target.value)}>
          <option value="h4">H4</option>
        </select>
        <input value={data.sustainabilitySection.smallHeading.text} onChange={(e) => update(["sustainabilitySection", "smallHeading", "text"], e.target.value)} />
      </div>
      <div>
        <label>Big Heading Tag: </label>
        <select value={data.sustainabilitySection.bigHeading.tag} onChange={(e) => update(["sustainabilitySection", "bigHeading", "tag"], e.target.value)}>
          <option value="h2">H2</option>
        </select>
        <input value={data.sustainabilitySection.bigHeading.text} onChange={(e) => update(["sustainabilitySection", "bigHeading", "text"], e.target.value)}  />
      </div>

      {data.sustainabilitySection.paragraphs.map((p, i) => (
        <div key={i}>
          <select value={p.tag} onChange={(e) => {
            const arr = [...data.sustainabilitySection.paragraphs];
            arr[i].tag = e.target.value;
            update(["sustainabilitySection", "paragraphs"], arr);
          }}>
            <option value="p">P</option>
          </select>
       <SimpleEditor
  value={p.text}
  onChange={(val) => {
    const arr = [...data.sustainabilitySection.paragraphs];
    arr[i].text = val;
    update(["sustainabilitySection", "paragraphs"], arr);
  }}
/>

          <button onClick={() => update(["sustainabilitySection", "paragraphs"], data.sustainabilitySection.paragraphs.filter((_, idx) => idx !== i))}>
            Delete
          </button>
        </div>
      ))}
      <button onClick={() => update(["sustainabilitySection", "paragraphs"], [...data.sustainabilitySection.paragraphs, { tag: "p", text: "" }])}>
        Add Paragraph
      </button>

      <h3>Sustainability Image</h3>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files[0] && handleImageChange("sustain", e.target.files[0])}
      />
      {getPendingImage("sustain") && (
        <div>
          <img src={getPendingImage("sustain").url} alt="Sustainability Preview" width="400"  />
          <input
            type="text"
            placeholder="Alt text"
            value={getPendingImage("sustain").alt}
            onChange={(e) => handleAltChange("sustain", e.target.value)}
         
          />
          <br />
          <button onClick={() => document.getElementById("replace-sustain").click()}>
            Replace
          </button>
          <button onClick={() => handleDeleteImage("sustain")}>
            Delete
          </button>
          <input
            id="replace-sustain"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => e.target.files[0] && handleImageChange("sustain", e.target.files[0])}
          />
        </div>
      )}

      {/* CTA Section */}
      <h2>CTA Section</h2>
      <div>
        <label>Heading Tag: </label>
        <select value={data.ctaSection.heading.tag} onChange={(e) => update(["ctaSection", "heading", "tag"], e.target.value)}>
          <option value="h2">H2</option>
          <option value="h3">H3</option>
        </select>
        <input value={data.ctaSection.heading.text} onChange={(e) => update(["ctaSection", "heading", "text"], e.target.value)}  />
      </div>

      {data.ctaSection.paragraphs.map((p, i) => (
        <div key={i}>
          <select value={p.tag} onChange={(e) => {
            const arr = [...data.ctaSection.paragraphs];
            arr[i].tag = e.target.value;
            update(["ctaSection", "paragraphs"], arr);
          }}>
            <option value="p">P</option>
          </select>
        <SimpleEditor
  value={p.text}
  onChange={(val) => {
    const arr = [...data.ctaSection.paragraphs];
    arr[i].text = val;
    update(["ctaSection", "paragraphs"], arr);
  }}
/>

          <button onClick={() => update(["ctaSection", "paragraphs"], data.ctaSection.paragraphs.filter((_, idx) => idx !== i))}>
            Delete
          </button>
        </div>
      ))}
      <button onClick={() => update(["ctaSection", "paragraphs"], [...data.ctaSection.paragraphs, { tag: "p", text: "" }])}>
        Add Paragraph
      </button>

      <div>
        <input value={data.ctaSection.button.text.text} onChange={(e) => update(["ctaSection", "button", "text"], { ...data.ctaSection.button.text, text: e.target.value })} placeholder="CTA Button Text" />
        <input value={data.ctaSection.button.link} onChange={(e) => update(["ctaSection", "button", "link"], e.target.value)} placeholder="CTA Button Link"/>
      </div>

      <br />
      <br />
      <button
        onClick={save}
        disabled={saving}
      >
        {saving ? "Saving..." : "Save All Changes"}
      </button>
    </div>
  );
};

export default AdminInvestment;