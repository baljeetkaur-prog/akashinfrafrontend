import { useState, useEffect, useRef } from "react";
import axios from "axios";
import SimpleEditor from "./SimpleEditor";
import "./AboutMain.css";

const block = (value, tag = "p") => {
  if (!value) return { tag, text: "" };
  if (typeof value === "string") return { tag, text: value };
  return {
    tag: value.tag || tag,
    text: value.text || ""
  };
};

const AboutAdmin = () => {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);
  const API = process.env.REACT_APP_APIURL;
  const [saving, setSaving] = useState(false);
  const getPublicId = (url) => {
  if (!url) return "";
  const parts = url.split("/");
  const filename = parts[parts.length - 1];
  return "carousel/" + filename.split(".")[0]; // match backend folder
};

  // Pending image states (mirroring CarouselAdmin pattern)
  const [pendingAboutImage, setPendingAboutImage] = useState(null); // left image
  const [pendingModiImage, setPendingModiImage] = useState(null);   // right image

  const aboutImageInputRef = useRef(null);
  const modiImageInputRef = useRef(null);

  useEffect(() => {
    axios
      .get(`${API}/api/admin-page`)
      .then(res => {
        const data = res.data || {};

        /* ENSURE BASE STRUCTURE EXISTS */
        data.breadcrumb ||= { parent: "", current: "" };
        data.heroSection ||= {};
        data.aboutSection ||= {};
        data.mission ||= {};
        data.vision ||= {};
        data.modiVision ||= {};
        data.seo ||= { title: "", description: "", keywords: "" };

        /* HERO */
        data.heroSection.pageTitle = block(data.heroSection.pageTitle, "h1");

        /* ABOUT SECTION */
        data.aboutSection.smallHeading = block(data.aboutSection.smallHeading);
        data.aboutSection.bigHeading = block(data.aboutSection.bigHeading, "h2");
        data.aboutSection.paragraphs = (data.aboutSection.paragraphs || []).map(p => block(p));
        data.aboutSection.question ||= "";
        data.aboutSection.phone ||= "";
        data.aboutSection.image ||= "";

        /* MISSION & VISION */
        data.mission.heading = block(data.mission.heading, "h3");
        data.mission.text = block(data.mission.text);
        data.vision.heading = block(data.vision.heading, "h3");
        data.vision.text = block(data.vision.text);

        /* MODI VISION */
        data.modiVision.smallHeading = block(data.modiVision.smallHeading);
        data.modiVision.bigHeading = block(data.modiVision.bigHeading, "h2");
        data.modiVision.paragraphs = (data.modiVision.paragraphs || []).map(p => block(p));
        data.modiVision.image ||= "";

        /* STRENGTHS - ENSURE 3 CARDS */
        const existing = data.strengths || [];
        data.strengths = [0,1,2].map(i => {
          const s = existing[i] || {};
          return {
            title: block(s.title, "h3"),
            description: block(s.description, "p")
          };
        });

        setAbout(data);

        // Initialize pending images from existing URLs
       if (data.aboutSection.image) {
  setPendingAboutImage({
    id: "existing-about",
    url: data.aboutSection.image + `?t=${Date.now()}`,
    file: null,
    alt: data.aboutSection.imageAlt || "", // ✅ use existing alt
    isNew: false,
    markedForDeletion: false
  });
}

if (data.modiVision.image) {
  setPendingModiImage({
    id: "existing-modi",
    url: data.modiVision.image + `?t=${Date.now()}`,
    file: null,
    alt: data.modiVision.imageAlt || "", // ✅ use existing alt
    isNew: false,
    markedForDeletion: false
  });
}

        setLoading(false);
      })
      .catch(err => {
        console.error("ADMIN PAGE LOAD ERROR:", err);
        setLoading(false);
      });
  }, [API]);

  if (loading || !about) return <div>Loading...</div>;

  const update = (path, value) => {
    setAbout(prev => {
      const updated = structuredClone(prev);
      let ref = updated;
      for (let i = 0; i < path.length - 1; i++) {
        ref = ref[path[i]];
      }
      ref[path[path.length - 1]] = value;
      return updated;
    });
  };

  // Helper to create preview URL
  const createPreview = (file) => URL.createObjectURL(file);

  // Upload single image
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await axios.post(`${API}/api/upload`, formData);
    return {
      url: res.data.url + `?t=${Date.now()}`,
      publicId: res.data.publicId // optional, if you want deletion later
    };
  };

  // Handle new/upload image for About Section
  const handleAboutImageChange = (file) => {
    if (!file) return;
    setPendingAboutImage({
      id: Math.random().toString(36),
      url: createPreview(file),
      file,
      alt: "",
      isNew: true,
      markedForDeletion: false
    });
  };

  // Handle new/upload image for Modi Vision
  const handleModiImageChange = (file) => {
    if (!file) return;
    setPendingModiImage({
      id: Math.random().toString(36),
      url: createPreview(file),
      file,
      alt: "",
      isNew: true,
      markedForDeletion: false
    });
  };

  // Replace existing pending image
  const handleReplaceImage = (setter, file) => {
    if (!file) return;
    setter({
      id: Math.random().toString(36),
      url: createPreview(file),
      file,
      alt: "",
      isNew: true,
      markedForDeletion: false
    });
  };

const handleDeleteImage = (setter) => {
  setter(prev => {
    if (!prev) return null;
    return null; // remove from UI immediately
  });
};

  // Final Save
const save = async () => {
  try {
    setSaving(true); // ✅ start saving
    const updatedAbout = structuredClone(about);

    // ===== About Section Image =====
    if (pendingAboutImage) {
      if (pendingAboutImage.isNew && pendingAboutImage.file) {
        if (about.aboutSection.image) {
          await axios.post(`${API}/api/delete-image`, {
            publicId: getPublicId(about.aboutSection.image)
          });
        }
        const uploaded = await uploadImage(pendingAboutImage.file);
        updatedAbout.aboutSection.image = uploaded.url;
      } else if (!pendingAboutImage.isNew) {
        updatedAbout.aboutSection.image = pendingAboutImage.url.split("?")[0];
      }
    } else {
      if (about.aboutSection.image) {
        await axios.post(`${API}/api/delete-image`, {
          publicId: getPublicId(about.aboutSection.image)
        });
      }
      updatedAbout.aboutSection.image = "";
    }

    // ===== Modi Vision Image =====
    if (pendingModiImage) {
      if (pendingModiImage.isNew && pendingModiImage.file) {
        if (about.modiVision.image) {
          await axios.post(`${API}/api/delete-image`, {
            publicId: getPublicId(about.modiVision.image)
          });
        }
        const uploaded = await uploadImage(pendingModiImage.file);
        updatedAbout.modiVision.image = uploaded.url;
      } else if (!pendingModiImage.isNew) {
        updatedAbout.modiVision.image = pendingModiImage.url.split("?")[0];
      }
    } else {
      if (about.modiVision.image) {
        await axios.post(`${API}/api/delete-image`, {
          publicId: getPublicId(about.modiVision.image)
        });
      }
      updatedAbout.modiVision.image = "";
    }

    updatedAbout.aboutSection.imageAlt = pendingAboutImage ? pendingAboutImage.alt : "";
    updatedAbout.modiVision.imageAlt = pendingModiImage ? pendingModiImage.alt : "";

    await axios.post(`${API}/api/admin-page`, updatedAbout);
    setAbout(updatedAbout);
    alert("About page updated successfully!");
  } catch (err) {
    console.error(err);
    alert("Save failed");
  } finally {
    setSaving(false); // ✅ done saving
  }
};



  return (
 <div className="about-main">
   <h1>About Admin Panel</h1>

    <h2>SEO Settings</h2>

<label>Meta Title</label>
<input
  type="text"
  value={about.seo.title}
  onChange={e => update(["seo", "title"], e.target.value)}
  placeholder="Enter meta title"
/>

<label>Meta Description</label>
<textarea
  value={about.seo.description}
  onChange={e => update(["seo", "description"], e.target.value)}
  placeholder="Enter meta description"
/>

<label>Meta Keywords</label>
<textarea
  value={about.seo.keywords}
  onChange={e => update(["seo", "keywords"], e.target.value)}
  placeholder="keyword1, keyword2, keyword3"
/>


      <h1>Edit About Page</h1>

      {/* Breadcrumb */}
      <h2>Breadcrumb</h2>
      <input value={about.breadcrumb.parent} onChange={e => update(["breadcrumb", "parent"], e.target.value)} />
      <input value={about.breadcrumb.current} onChange={e => update(["breadcrumb", "current"], e.target.value)} />

      {/* Hero */}
      <h2>Hero Section</h2>
      <select value={about.heroSection.pageTitle.tag} onChange={e => update(["heroSection", "pageTitle", "tag"], e.target.value)}>
        <option value="h1">H1</option>
        <option value="h2">H2</option>
        <option value="h3">H3</option>
      </select>
      <input placeholder="Page Title Text" value={about.heroSection.pageTitle.text} onChange={e => update(["heroSection", "pageTitle", "text"], e.target.value)} />

      {/* About Section Image (Left) */}
      <h3>About Section Image (Left Side)</h3>
      <input
        type="file"
        accept="image/*"
        ref={aboutImageInputRef}
        style={{ display: "none" }}
        onChange={(e) => e.target.files[0] && handleAboutImageChange(e.target.files[0])}
      />

 <div>
  {pendingAboutImage ? (
    <div>
      <img
        src={pendingAboutImage.url}
        alt="About preview"
        width="250"
        style={{ objectFit: "cover", borderRadius: "8px" }}
      />
      <div style={{ marginTop: "10px" }}>
        <button onClick={() => aboutImageInputRef.current?.click()}>Replace Image</button>
        <button
          style={{ marginLeft: "10px", color: "red" }}
          onClick={() => handleDeleteImage(setPendingAboutImage)}
        >
          Delete Image
        </button>
      </div>
    </div>
  ) : (
    <button onClick={() => aboutImageInputRef.current?.click()}>Upload About Image</button>
    
  )}
  {pendingAboutImage && (
  <div style={{ marginTop: "10px" }}>
    <input
      type="text"
      placeholder="Alt text for About Image"
      value={pendingAboutImage.alt}
      onChange={e =>
        setPendingAboutImage(prev => ({ ...prev, alt: e.target.value }))
      }
      style={{ width: "90%" }}
    />
  </div>
)}
</div>

      {/* About Main Content */}
      <h2>About Section</h2>
      <select value={about.aboutSection.smallHeading.tag} onChange={e => update(["aboutSection", "smallHeading", "tag"], e.target.value)}>
        <option value="p">P</option><option value="h4">H4</option><option value="h5">H5</option>
      </select>
      <input placeholder="Small Heading Text" value={about.aboutSection.smallHeading.text} onChange={e => update(["aboutSection", "smallHeading", "text"], e.target.value)} />

      <select value={about.aboutSection.bigHeading.tag} onChange={e => update(["aboutSection", "bigHeading", "tag"], e.target.value)}>
        <option value="h1">H1</option><option value="h2">H2</option><option value="h3">H3</option>
      </select>
     <label>Big Heading Text</label>
<textarea
  rows={2}
  value={about.aboutSection.bigHeading.text}
  onChange={e =>
    update(["aboutSection", "bigHeading", "text"], e.target.value)
  }
  placeholder="Enter main heading"
/>
Do the same for:

      {about.aboutSection.paragraphs.map((p, i) => (
        <div key={i}>
          <select value={p.tag} onChange={e => {
            const arr = [...about.aboutSection.paragraphs];
            arr[i].tag = e.target.value;
            update(["aboutSection", "paragraphs"], arr);
          }}>
            <option value="p">P</option><option value="h4">H4</option><option value="h5">H5</option>
          </select>
        <SimpleEditor
  value={p.text}
  onChange={(val) => {
    const arr = [...about.aboutSection.paragraphs];
    arr[i].text = val;
    update(["aboutSection", "paragraphs"], arr);
  }}
/>
        </div>
      ))}

      <input placeholder="Question" value={about.aboutSection.question} onChange={e => update(["aboutSection", "question"], e.target.value)} />
      <input placeholder="Phone" value={about.aboutSection.phone} onChange={e => update(["aboutSection", "phone"], e.target.value)} />

      {/* Mission & Vision */}
     <h2>Mission</h2>

{/* Mission Heading */}
<select
  value={about.mission.heading.tag}
  onChange={e =>
    update(["mission","heading","tag"], e.target.value)
  }
>
  <option value="h2">H2</option>
  <option value="h3">H3</option>
  <option value="h4">H4</option>
</select>

<input
  placeholder="Mission Heading Text"
  value={about.mission.heading.text}
  onChange={e =>
    update(["mission","heading","text"], e.target.value)
  }
/>

{/* Mission Text */}
<select
  value={about.mission.text.tag}
  onChange={e =>
    update(["mission","text","tag"], e.target.value)
  }
>
  <option value="p">P</option>
  <option value="h5">H5</option>
</select>

<SimpleEditor
  value={about.mission.text.text}
  onChange={(val) =>
    update(["mission","text","text"], val)
  }
/>

  <h2>Vision</h2>

<select
  value={about.vision.heading.tag}
  onChange={e =>
    update(["vision","heading","tag"], e.target.value)
  }
>
  <option value="h2">H2</option>
  <option value="h3">H3</option>
</select>

<input
  value={about.vision.heading.text}
  onChange={e =>
    update(["vision","heading","text"], e.target.value)
  }
/>

<select
  value={about.vision.text.tag}
  onChange={e =>
    update(["vision","text","tag"], e.target.value)
  }
>
  <option value="p">P</option>
</select>

<SimpleEditor
  value={about.vision.text.text}
  onChange={(val) =>
    update(["vision","text","text"], val)
  }
/>


      {/* Modi Vision */}
 <h2>PM Modi Vision</h2>

{/* Small Heading */}
<select
  value={about.modiVision.smallHeading.tag}
  onChange={e =>
    update(["modiVision","smallHeading","tag"], e.target.value)
  }
>
  <option value="p">P</option>
  <option value="h4">H4</option>
</select>

<input
  value={about.modiVision.smallHeading.text}
  onChange={e =>
    update(["modiVision","smallHeading","text"], e.target.value)
  }
/>

{/* Big Heading */}
<select
  value={about.modiVision.bigHeading.tag}
  onChange={e =>
    update(["modiVision","bigHeading","tag"], e.target.value)
  }
>
  <option value="h2">H2</option>
  <option value="h3">H3</option>
</select>

<input
  value={about.modiVision.bigHeading.text}
  onChange={e =>
    update(["modiVision","bigHeading","text"], e.target.value)
  }
/>

{/* Paragraphs */}
{about.modiVision.paragraphs.map((p, i) => (
  <div key={i}>
    <select
      value={p.tag}
      onChange={e => {
        const arr = [...about.modiVision.paragraphs];
        arr[i].tag = e.target.value;
        update(["modiVision","paragraphs"], arr);
      }}
    >
      <option value="p">P</option>
      <option value="h5">H5</option>
      <option value="h4">H4</option>
    </select>

<SimpleEditor
  value={p.text}
  onChange={(val) => {
    const arr = [...about.modiVision.paragraphs];
    arr[i].text = val;
    update(["modiVision","paragraphs"], arr);
  }}
/>


    <button
      type="button"
      onClick={() => {
        const arr = [...about.modiVision.paragraphs];
        arr.splice(i, 1);
        update(["modiVision","paragraphs"], arr);
      }}
    >
      Delete Paragraph
    </button>
  </div>
))}

<button
  type="button"
  onClick={() => {
    const arr = [...(about.modiVision.paragraphs || [])];
    arr.push({ tag: "p", text: "" });
    update(["modiVision","paragraphs"], arr);
  }}
>
  Add Paragraph
</button>

<h3>PM Modi Vision Image (Right Side)</h3>
      <input
        type="file"
        accept="image/*"
        ref={modiImageInputRef}
        style={{ display: "none" }}
        onChange={(e) => e.target.files[0] && handleModiImageChange(e.target.files[0])}
      />

 <div>
  {pendingModiImage ? (
    <div>
      <img
        src={pendingModiImage.url}
        alt="Modi Vision preview"
        width="250"
        style={{ objectFit: "cover", borderRadius: "8px" }}
      />
      <div>
        <button onClick={() => modiImageInputRef.current?.click()}>Replace Image</button>
        <button
          onClick={() => handleDeleteImage(setPendingModiImage)}
        >
          Delete Image
        </button>
      </div>
    </div>
  ) : (
    <button onClick={() => modiImageInputRef.current?.click()}>Upload Modi Vision Image</button>
  )}
  {pendingModiImage && (
  <div>
    <input
      type="text"
      placeholder="Alt text for Modi Vision Image"
      value={pendingModiImage.alt}
      onChange={e =>
        setPendingModiImage(prev => ({ ...prev, alt: e.target.value }))
      }
      style={{ width: "90%" }}
    />
  </div>
)}

</div>


      {/* Strengths */}
      <h2>Strength Cards</h2>
      {about.strengths.map((s, i) => (
        <div key={i}>
          <h3>Strength {i + 1}</h3>
          <select value={s.title.tag} onChange={e => {
            const arr = [...about.strengths];
            arr[i].title.tag = e.target.value;
            update(["strengths"], arr);
          }}>
            <option value="h3">H3</option><option value="h4">H4</option>
          </select>
         <label>Strength Title</label>
<textarea
  rows={2}
  className="heading-large"
  value={s.title.text}
  onChange={e => {
    const arr = [...about.strengths];
    arr[i].title.text = e.target.value;
    update(["strengths"], arr);
  }}
  placeholder="Enter strength heading"
/>


          <select value={s.description.tag} onChange={e => {
            const arr = [...about.strengths];
            arr[i].description.tag = e.target.value;
            update(["strengths"], arr);
          }}>
            <option value="p">P</option><option value="h5">H5</option>
          </select>
      <SimpleEditor
  value={s.description.text}
  onChange={(val) => {
    const arr = [...about.strengths];
    arr[i].description.text = val;
    update(["strengths"], arr);
  }}
/>

        </div>
      ))}

      <br />
   <button
  onClick={save}
  disabled={saving} // ✅ disable while saving
>
  {saving ? "Saving..." : "Save All Changes"}
</button>
    </div>
  );
};

export default AboutAdmin;