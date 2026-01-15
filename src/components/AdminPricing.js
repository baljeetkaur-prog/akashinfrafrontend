import { useState, useEffect, useRef } from "react";
import axios from "axios";
import SimpleEditor from "./SimpleEditor";
import "./AdminPricing.css";

const block = (value, tag = "p") => {
  if (!value) return { tag, text: "" };
  if (typeof value === "string") return { tag, text: value };
  return { tag: value.tag || tag, text: value.text || "" };
};

const AdminPricing = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const API = process.env.REACT_APP_APIURL;
  const [pendingIntroImage, setPendingIntroImage] = useState(null);
    const [saving, setSaving] = useState(false);

  const bannerImageRef = useRef(null);
  const introImageRef = useRef(null);
   useEffect(() => {
  const img = data?.introSection?.image;

  if (img && img.url) {
    setPendingIntroImage({
      url: img.url,
      publicId: img.publicId || "",
      alt: img.alt || "",
      isNew: false
    });
  } else {
    // ❗ No image → no preview
    setPendingIntroImage(null);
  }
}, [data]);

  const uploadImage = async (file, path, inputRef) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(`${API}/api/upload`, formData);
      const url = res.data.url + `?t=${Date.now()}`;

      const updated = structuredClone(data);
      let ref = updated;
      for (let i = 0; i < path.length - 1; i++) {
        ref = ref[path[i]];
      }
      ref[path[path.length - 1]] = url;

      setData(updated);
      await axios.post(`${API}/api/pricing`, updated);

      if (inputRef?.current) inputRef.current.value = null;
    } catch (err) {
      console.error(err);
      alert("Image upload failed");
    }
  };

  useEffect(() => {
    axios.get(`${API}/api/pricing`).then(res => {
      const d = res.data || {};

      d.seo ||= { title: "", description: "", keywords: "" };
      d.breadcrumb ||= { parent: "", current: "" };

      d.banner ||= { heading: {}, image: "" };
      d.banner.heading = block(d.banner.heading, "h1");

      d.introSection ||= {
        smallHeading: {},
        bigHeading: {},
        paragraphs: [],
        image: ""
      };
      d.introSection.smallHeading = block(d.introSection.smallHeading, "p");
      d.introSection.bigHeading = block(d.introSection.bigHeading, "h2");
      d.introSection.paragraphs = (d.introSection.paragraphs || []).map(p =>
        block(p, "p")
      );

      d.pricingCards ||= [];
      d.pricingCards = d.pricingCards.map(c => ({
        ...c,
        title: block(c.title, "h3"),
        planName: block(c.planName, "h3"),
        points: (c.points || []).map(p => block(p, "p")),
        button: {
          text: block(c.button?.text, "p"),
          link: c.button?.link || ""
        }
      }));

      d.ctaSection ||= { heading: {}, paragraph: {}, buttons: [] };
      d.ctaSection.heading = block(d.ctaSection.heading, "h2");
      d.ctaSection.paragraph = block(d.ctaSection.paragraph, "p");
      d.ctaSection.buttons = (d.ctaSection.buttons || []).map(b => ({
        text: block(b.text, "p"),
        link: b.link || ""
      }));

      setData(d);
      setLoading(false);
    });
  }, [API]);

  if (loading || !data) return <div>Loading...</div>;

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
  if (saving) return; // 🚫 block double clicks

  try {
    setSaving(true); // ✅ START SAVING

    let finalIntroImage = null;

    // ---- image logic (UNCHANGED) ----
    if (pendingIntroImage) {
      if (pendingIntroImage.markedForDeletion && pendingIntroImage.publicId) {
        await axios.post(`${API}/api/delete-image`, {
          publicId: pendingIntroImage.publicId
        });
        finalIntroImage = { url: "", publicId: "", alt: "" };
      } 
      else if (pendingIntroImage.isNew && pendingIntroImage.file) {
        const formData = new FormData();
        formData.append("image", pendingIntroImage.file);
        const res = await axios.post(`${API}/api/upload`, formData);

        finalIntroImage = {
          url: res.data.url,
          publicId: res.data.publicId,
          alt: pendingIntroImage.alt || ""
        };

        if (data.introSection.image?.publicId) {
          await axios.post(`${API}/api/delete-image`, {
            publicId: data.introSection.image.publicId
          });
        }
      } 
      else {
        finalIntroImage = {
          url: pendingIntroImage.url,
          publicId: pendingIntroImage.publicId,
          alt: pendingIntroImage.alt || ""
        };
      }
    } else {
      finalIntroImage = { url: "", publicId: "", alt: "" };
    }

    const payload = {
      ...data,
      introSection: {
        ...data.introSection,
        image: finalIntroImage
      }
    };

    await axios.post(`${API}/api/pricing`, payload);

    alert("Pricing page updated successfully!");

    setData(payload);

    setPendingIntroImage(
      finalIntroImage.url
        ? { ...finalIntroImage, isNew: false }
        : null
    );

  } catch (err) {
    console.error(err);
    alert("Save failed");
  } finally {
    setSaving(false); // ✅ END SAVING
  }
};



  return (
  <div className="pricing-admin">
      <h1>Admin – Pricing Page</h1>

      {/* SEO */}
  {/* ================= SEO SETTINGS ================= */}
<h2>SEO Settings</h2>

<label>Meta Title</label>
<input
  type="text"
  value={data.seo.title}
  placeholder="Enter meta title (shown in browser tab)"
  onChange={e => update(["seo", "title"], e.target.value)}
/>

<label>Meta Description</label>
<textarea
  rows={3}
  value={data.seo.description}
  placeholder="Enter meta description for search engines"
  onChange={e => update(["seo", "description"], e.target.value)}
/>

<label>Meta Keywords</label>
<input
  type="text"
  value={data.seo.keywords}
  placeholder="keyword1, keyword2, keyword3"
  onChange={e => update(["seo", "keywords"], e.target.value)}
/>


      {/* Breadcrumb */}
      <h2>Breadcrumb</h2>
      <input value={data.breadcrumb.parent}
        onChange={e => update(["breadcrumb","parent"], e.target.value)} />
      <input value={data.breadcrumb.current}
        onChange={e => update(["breadcrumb","current"], e.target.value)} />

      {/* Banner */}
<label>Banner Heading Tag</label>
<select
  value={data.banner.heading.tag}
  onChange={e =>
    update(["banner", "heading"], {
      ...data.banner.heading,
      tag: e.target.value
    })
  }
>
  <option value="h1">H1</option>
  <option value="h2">H2</option>
  <option value="h3">H3</option>
  <option value="p">P</option>
</select>

<input
  value={data.banner.heading.text}
  placeholder="Banner Heading Text"
  onChange={e =>
    update(["banner", "heading"], {
      ...data.banner.heading,
      text: e.target.value
    })
  }
/>


     

      {/* Intro */}
      <h2>Intro Section</h2>
      <label>Small Heading Tag</label>
<select
  value={data.introSection.smallHeading.tag}
  onChange={e =>
    update(["introSection","smallHeading"], {
      ...data.introSection.smallHeading,
      tag: e.target.value
    })
  }
>
  <option value="p">P</option>
  <option value="h4">H4</option>
  <option value="h3">H3</option>
</select>

<input
  value={data.introSection.smallHeading.text}
  onChange={e =>
    update(["introSection","smallHeading"], {
      ...data.introSection.smallHeading,
      text: e.target.value
    })
  }
/>

     <label>Big Heading Tag</label>
<select
  value={data.introSection.bigHeading.tag}
  onChange={e =>
    update(["introSection","bigHeading"], {
      ...data.introSection.bigHeading,
      tag: e.target.value
    })
  }
>
  <option value="h1">H1</option>
  <option value="h2">H2</option>
  <option value="h3">H3</option>
</select>

<input
  value={data.introSection.bigHeading.text}
  onChange={e =>
    update(["introSection","bigHeading"], {
      ...data.introSection.bigHeading,
      text: e.target.value
    })
  }
/>


{data.introSection.paragraphs.map((p, i) => (
  <div key={i} style={{ marginBottom: 10 }}>
    <select
      value={p.tag}
      onChange={e => {
        const arr = [...data.introSection.paragraphs];
        arr[i].tag = e.target.value;
        update(["introSection","paragraphs"], arr);
      }}
    >
      <option value="p">P</option>
      <option value="h3">H3</option>
      <option value="h4">H4</option>
    </select>

<SimpleEditor
  value={p.text}
  onChange={(val) => {
    const arr = [...data.introSection.paragraphs];
    arr[i].text = val;
    update(["introSection","paragraphs"], arr);
  }}
/>

  </div>
))}

      <button onClick={() =>
        update(["introSection","paragraphs"], [...data.introSection.paragraphs,{tag:"p",text:""}])
      }>Add Paragraph</button>

  {/* Intro Image - Cloudinary Managed */}
<h2>Intro Image</h2>

<input
  type="file"
  accept="image/*"
  hidden
  ref={introImageRef}
  onChange={(e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setPendingIntroImage({
      url: previewUrl,
      file,
      alt: pendingIntroImage?.alt || "",
      isNew: true,
      markedForDeletion: false
    });

    if (introImageRef.current) introImageRef.current.value = null;
  }}
/>

<div style={{ margin: "20px 0" }}>
  {!pendingIntroImage ? (
    <button onClick={() => introImageRef.current?.click()}>
      Upload Intro Image
    </button>
  ) : (
    <div style={{ textAlign: "center" }}>
      <img
        src={pendingIntroImage.url}
        alt={pendingIntroImage.alt || "Intro preview"}
        width={300}
        style={{ borderRadius: "8px", objectFit: "cover" }}
      />

      <div style={{ marginTop: "10px" }}>
        <input
          type="text"
          placeholder="Alt text"
          value={pendingIntroImage.alt || ""}
          onChange={(e) =>
            setPendingIntroImage(prev => ({ ...prev, alt: e.target.value }))
          }
          style={{ marginBottom: "10px", width: "300px" }}
        />

        <br />

        <button
          onClick={() => introImageRef.current?.click()}
          style={{ marginRight: "10px" }}
        >
          Replace Image
        </button>

        <button
          onClick={() => {
            // If it was newly uploaded, just remove preview
            if (pendingIntroImage.isNew) {
              setPendingIntroImage(null);
            } else if (pendingIntroImage.publicId) {
              // Mark old Cloudinary image for deletion on save
              setPendingIntroImage({
                ...pendingIntroImage,
                markedForDeletion: true,
                url: ""
              });
            } else {
              setPendingIntroImage(null);
            }
          }}
          style={{ color: "red" }}
        >
          Delete Image
        </button>
      </div>
    </div>
  )}
</div>

      {/* Pricing Cards */}
     {/* Pricing Cards */}
<h2>Pricing Cards (Icons are static)</h2>
{data.pricingCards.map((c, i) => (
  <div key={i} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
    <h3>Card {i + 1}</h3>

    {/* Title Tag */}
    <label>Title Tag</label>
    <select
      value={c.title.tag || "h3"}
      onChange={(e) => {
        const arr = [...data.pricingCards];
        arr[i].title.tag = e.target.value;
        update(["pricingCards"], arr);
      }}
    >
      <option value="h2">H2</option>
      <option value="h3">H3</option>
      <option value="h4">H4</option>
      <option value="p">P</option>
    </select>

    {/* Title Text */}
    <input
      value={c.title.text || ""}
      placeholder="Card Title"
      onChange={(e) => {
        const arr = [...data.pricingCards];
        arr[i].title.text = e.target.value;
        update(["pricingCards"], arr);
      }}
    />

    {/* Price Label */}
    <input
      value={c.price?.label || ""}
      placeholder="Price Label (e.g. 'Starts from')"
      onChange={(e) => {
        const arr = [...data.pricingCards];
        arr[i].price.label = e.target.value;
        update(["pricingCards"], arr);
      }}
    />

    {/* Price Value */}
    <input
      value={c.price?.value || ""}
      placeholder="Price Value"
      onChange={(e) => {
        const arr = [...data.pricingCards];
        arr[i].price.value = e.target.value;
        update(["pricingCards"], arr);
      }}
    />

    {/* Plan Name Tag */}
    <label>Plan Name Tag</label>
    <select
      value={c.planName.tag || "h3"}
      onChange={(e) => {
        const arr = [...data.pricingCards];
        arr[i].planName.tag = e.target.value;
        update(["pricingCards"], arr);
      }}
    >
      <option value="h3">H3</option>
      <option value="h4">H4</option>
      <option value="p">P</option>
    </select>

    {/* Plan Name Text */}
    <input
      value={c.planName.text || ""}
      placeholder="Plan Name"
      onChange={(e) => {
        const arr = [...data.pricingCards];
        arr[i].planName.text = e.target.value;
        update(["pricingCards"], arr);
      }}
    />

    {/* Points */}
    <div>
      <label>Points</label>
      {c.points.map((p, pi) => (
        <input
          key={pi}
          value={p.text || ""}
          placeholder={`Point ${pi + 1}`}
          onChange={(e) => {
            const arr = [...data.pricingCards];
            arr[i].points[pi].text = e.target.value;
            update(["pricingCards"], arr);
          }}
        />
      ))}
      <button
        onClick={() => {
          const arr = [...data.pricingCards];
          arr[i].points.push({ tag: "p", text: "" });
          update(["pricingCards"], arr);
        }}
      >
        Add Point
      </button>
    </div>

    {/* Button Tag (optional if you want a tag selector) */}
    {/* Button Text */}
    <input
      value={c.button?.text?.text || ""}
      placeholder="Button Text"
      onChange={(e) => {
        const arr = [...data.pricingCards];
        arr[i].button.text.text = e.target.value;
        update(["pricingCards"], arr);
      }}
    />

    {/* Button Link */}
    <input
      value={c.button?.link || ""}
      placeholder="Button Link"
      onChange={(e) => {
        const arr = [...data.pricingCards];
        arr[i].button.link = e.target.value;
        update(["pricingCards"], arr);
      }}
    />
  </div>
))}



      {/* CTA */}
      <h2>CTA Section</h2>
   <label>CTA Heading Tag</label>
<select
  value={data.ctaSection.heading.tag}
  onChange={e =>
    update(["ctaSection","heading"], {
      ...data.ctaSection.heading,
      tag: e.target.value
    })
  }
>
  <option value="h2">H2</option>
  <option value="h3">H3</option>
  <option value="h4">H4</option>
</select>

<input
  value={data.ctaSection.heading.text}
  onChange={e =>
    update(["ctaSection","heading"], {
      ...data.ctaSection.heading,
      text: e.target.value
    })
  }
/>

    <select
  value={data.ctaSection.paragraph.tag}
  onChange={e =>
    update(["ctaSection","paragraph"], {
      ...data.ctaSection.paragraph,
      tag: e.target.value
    })
  }
>
  <option value="p">P</option>
  <option value="h4">H4</option>
</select>

<SimpleEditor
  value={data.ctaSection.paragraph.text}
  onChange={(val) =>
    update(["ctaSection","paragraph"], {
      ...data.ctaSection.paragraph,
      text: val
    })
  }
/>



      {data.ctaSection.buttons.map((b,i)=>(
        <div key={i}>
          <input value={b.text.text}
            onChange={e=>{
              const arr=[...data.ctaSection.buttons];
              arr[i].text.text=e.target.value;
              update(["ctaSection","buttons"],arr);
            }} />
          <input value={b.link}
            onChange={e=>{
              const arr=[...data.ctaSection.buttons];
              arr[i].link=e.target.value;
              update(["ctaSection","buttons"],arr);
            }} />
        </div>
      ))}

      <br /><br />
 <button
  onClick={save}
  disabled={saving}
>
  {saving ? "Saving..." : "Save Pricing Page"}
</button>

    </div>
  );
};

export default AdminPricing;
