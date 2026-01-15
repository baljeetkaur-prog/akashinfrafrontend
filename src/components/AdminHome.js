import { useState, useEffect } from "react";
import axios from "axios";
import "./AdminHome.css";

const AdminHome = () => {
  const [home, setHome] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const API = process.env.REACT_APP_APIURL;

  useEffect(() => {
    axios
      .get(`${API}/api/home-page/seo`)
      .then(res => {
        setHome(res.data || { seo: { title: "", description: "", keywords: "" } });
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [API]);

  if (loading || !home) return <div>Loading Homepage SEO...</div>;

  const update = (field, value) => {
    setHome(prev => ({
      ...prev,
      seo: { ...prev.seo, [field]: value }
    }));
  };

  const save = async () => {
    setSaving(true);
    try {
      await axios.post(`${API}/api/home-page/seo`, { seo: home.seo });
      alert("Homepage SEO saved!");
    } catch (err) {
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="carousel-admin">
      <h1>Home Page SEO</h1>

      <section>
        <h2>SEO Settings</h2>

        <label>Meta Title</label>
        <input
          type="text"
          value={home.seo.title}
          onChange={e => update("title", e.target.value)}
          placeholder="Enter SEO title"
        />

        <label>Meta Description</label>
        <textarea
          rows={4}
          value={home.seo.description}
          onChange={e => update("description", e.target.value)}
          placeholder="Enter meta description"
        />

        <label>Meta Keywords</label>
        <input
          type="text"
          value={home.seo.keywords}
          onChange={e => update("keywords", e.target.value)}
          placeholder="keyword1, keyword2, keyword3"
        />
      </section>

      <button
        onClick={save}
        disabled={saving}
        className={`save-btn ${saving ? "saving" : ""}`}
      >
        {saving ? "Saving..." : "Save SEO"}
      </button>
    </div>
  );
};

export default AdminHome;
