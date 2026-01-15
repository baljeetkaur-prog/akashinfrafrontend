import { useEffect, useState } from "react";
import axios from "axios";
import "./SocialIconsAdmin.css";
const defaultLinks = {
  facebook: "",
  instagram: "",
  whatsapp: ""
};

const AdminSocialIcons = () => {
  const [links, setLinks] = useState(defaultLinks);
  const [loading, setLoading] = useState(true);

  const API = process.env.REACT_APP_APIURL;

  /* ================= FETCH ================= */
  useEffect(() => {
    axios
      .get(`${API}/api/social-links`)
      .then(res => {
        if (res.data) setLinks(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [API]);

  if (loading) return <div>Loading...</div>;

  /* ================= SAVE ================= */
  const handleSave = async () => {
    try {
      await axios.post(`${API}/api/social-links`, links);
      alert("Social links updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update social links");
    }
  };

  /* ================= UI ================= */
  return (
   <div className="social-icons-admin">

      <h1>Social Icons</h1>

      <label>Facebook URL</label>
      <input
        type="text"
        value={links.facebook}
        onChange={e =>
          setLinks(prev => ({ ...prev, facebook: e.target.value }))
        }
        placeholder="https://facebook.com/..."
      />

      <label>Instagram URL</label>
      <input
        type="text"
        value={links.instagram}
        onChange={e =>
          setLinks(prev => ({ ...prev, instagram: e.target.value }))
        }
        placeholder="https://instagram.com/..."
      />

      <label>WhatsApp URL</label>
      <input
        type="text"
        value={links.whatsapp}
        onChange={e =>
          setLinks(prev => ({ ...prev, whatsapp: e.target.value }))
        }
        placeholder="https://wa.me/..."
      />

      <br />
   <button
  className="save-social"
  onClick={handleSave}
>
  Save Social Links
</button>
    </div>
  );
};

export default AdminSocialIcons;
