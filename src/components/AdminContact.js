import { useState, useEffect } from "react";
import axios from "axios";
import "./ContactAdmin.css"; 

/* ================= UTILITIES ================= */
const block = (value, tag = "p") => {
  if (!value) return { tag, text: "" };
  if (typeof value === "string") return { tag, text: value };
  return { tag: value.tag || tag, text: value.text || "" };
};

/* ================= COMPONENT ================= */
const AdminContact = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const API = process.env.REACT_APP_APIURL;
  const [saving, setSaving] = useState(false);

  /* ================= FETCH ================= */
  useEffect(() => {
    axios.get(`${API}/api/contact`).then(res => {
      const d = res.data || {};

      d.seo ||= { title: "", description: "", keywords: "" };
      d.breadcrumb ||= { parent: "", current: "" };
      d.banner ||= { heading: {} };
      d.formSection ||= { button: { text: {} } };
      d.infoSection ||= {
        heading: {},
        paragraph: {},
        phoneText: "",
        emailText: "",
        address1: "",
        address2: ""
      };

      d.banner.heading = block(d.banner.heading, "h1");
      d.formSection.button.text = block(d.formSection.button.text, "p");
      d.infoSection.heading = block(d.infoSection.heading, "h2");
      d.infoSection.paragraph = block(d.infoSection.paragraph, "p");

      setData(d);
      setLoading(false);
    });
  }, [API]);

  if (loading || !data) return <div>Loading...</div>;

  /* ================= UPDATE HELPER ================= */
  const update = (path, value) => {
    setData(prev => {
      const updated = structuredClone(prev);
      let ref = updated;
      for (let i = 0; i < path.length - 1; i++) ref = ref[path[i]];
      ref[path[path.length - 1]] = value;
      return updated;
    });
  };

  /* ================= SAVE ================= */
const save = async () => {
  try {
    setSaving(true); // ✅ start saving
    await axios.post(`${API}/api/contact`, data);
    alert("Contact page updated successfully!");
  } catch (err) {
    console.error(err);
    alert("Save failed");
  } finally {
    setSaving(false); // ✅ stop saving
  }
};


  return (
    <div className="contact-admin">
      <h1>Admin – Contact Page</h1>

      {/* ================= SEO ================= */}
    <h2>SEO</h2>

<label>Meta Title</label>
<input
  type="text"
  value={data.seo.title}
  onChange={e => update(["seo", "title"], e.target.value)}
/>

<label>Meta Description</label>
<textarea
  className="seo-long"
  value={data.seo.description}
  onChange={e => update(["seo", "description"], e.target.value)}
/>

<label>Meta Keywords</label>
<textarea
  className="seo-long"
  value={data.seo.keywords}
  onChange={e => update(["seo", "keywords"], e.target.value)}
/>



      {/* ================= BREADCRUMB ================= */}
      <h2>Breadcrumb</h2>
      <input placeholder="Parent" value={data.breadcrumb.parent}
        onChange={e => update(["breadcrumb", "parent"], e.target.value)} />
      <input placeholder="Current" value={data.breadcrumb.current}
        onChange={e => update(["breadcrumb", "current"], e.target.value)} />

      {/* ================= BANNER ================= */}
      <h2>Banner</h2>
      <select
        value={data.banner.heading.tag}
        onChange={e => update(["banner", "heading", "tag"], e.target.value)}
      >
        <option value="h1">H1</option>
        <option value="h2">H2</option>
        <option value="h3">H3</option>
      </select>
      <input
        placeholder="Banner Heading"
        value={data.banner.heading.text}
        onChange={e => update(["banner", "heading", "text"], e.target.value)}
      />

      {/* ================= FORM BUTTON ================= */}
      <h2>Contact Form Button</h2>
      <select
        value={data.formSection.button.text.tag}
        onChange={e =>
          update(["formSection", "button", "text", "tag"], e.target.value)
        }
      >
        <option value="p">P</option>
        <option value="h4">H4</option>
        <option value="h5">H5</option>
      </select>
      <input
        placeholder="Submit Button Text"
        value={data.formSection.button.text.text}
        onChange={e =>
          update(["formSection", "button", "text", "text"], e.target.value)
        }
      />

      {/* ================= INFO SECTION ================= */}
      <h2>Right Side – Get in Touch</h2>

      <select
        value={data.infoSection.heading.tag}
        onChange={e =>
          update(["infoSection", "heading", "tag"], e.target.value)
        }
      >
        <option value="h2">H2</option>
        <option value="h3">H3</option>
        <option value="h4">H4</option>
      </select>
      <input
        placeholder="Heading"
        value={data.infoSection.heading.text}
        onChange={e =>
          update(["infoSection", "heading", "text"], e.target.value)
        }
      />

      <select
        value={data.infoSection.paragraph.tag}
        onChange={e =>
          update(["infoSection", "paragraph", "tag"], e.target.value)
        }
      >
        <option value="p">P</option>
        <option value="h5">H5</option>
        <option value="h6">H6</option>
      </select>
      <textarea
        placeholder="Paragraph"
        value={data.infoSection.paragraph.text}
        onChange={e =>
          update(["infoSection", "paragraph", "text"], e.target.value)
        }
      />

      <input placeholder="Phone" value={data.infoSection.phoneText}
        onChange={e => update(["infoSection", "phoneText"], e.target.value)} />
      <input placeholder="Email" value={data.infoSection.emailText}
        onChange={e => update(["infoSection", "emailText"], e.target.value)} />
      <input placeholder="Address 1" value={data.infoSection.address1}
        onChange={e => update(["infoSection", "address1"], e.target.value)} />
      <input placeholder="Address 2" value={data.infoSection.address2}
        onChange={e => update(["infoSection", "address2"], e.target.value)} />

      <br /><br />
   <button
  onClick={save}
  disabled={saving}
>
  {saving ? "Saving..." : "Save Contact Page"}
</button>

    </div>
  );
};

export default AdminContact;
