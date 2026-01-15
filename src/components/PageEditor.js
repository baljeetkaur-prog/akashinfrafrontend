import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const PageEditor = () => {
  const { slug } = useParams(); // undefined if new page
  const navigate = useNavigate();
  const API=process.env.REACT_APP_APIURL; 

  const [page, setPage] = useState({
    slug: "",
    title: "",
    metaTitle: "",
    metaDescription: "",
    h1: "",
    h2: "",
    content: "",
    images: [],
    form: {
      subject: "",
      submitUrl: "",
      recaptchaSiteKey: "",
      fields: [],
    },
    contactInfo: [],
    mapEmbed: "",
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      setIsLoading(false); // new page, no fetch
      return;
    }

    fetch(`${API}/api/pages/${slug}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setPage(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, [slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = slug ? "PUT" : "POST";
    const url = slug
      ? `http://localhost:9000/api/pages/${slug}`
      : `http://localhost:9000/api/pages`;

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(page),
    });

    if (res.ok) {
      alert(`Page ${slug ? "updated" : "created"} successfully!`);
      navigate("/admin/pages");
    } else {
      alert("Error saving page");
    }
  };

  const handleChange = (e, index, type, subType) => {
    // type: "form" | "contactInfo" | "images" | "page"
    const { name, value } = e.target;

    if (type === "page") {
      setPage({ ...page, [name]: value });
    } else if (type === "form") {
      const updatedFields = [...page.form.fields];
      updatedFields[index][subType] = value;
      setPage({ ...page, form: { ...page.form, fields: updatedFields } });
    } else if (type === "contactInfo") {
      const updatedInfo = [...page.contactInfo];
      updatedInfo[index][subType] = value;
      setPage({ ...page, contactInfo: updatedInfo });
    }
  };

  const addFormField = () => {
    setPage({
      ...page,
      form: {
        ...page.form,
        fields: [...page.form.fields, { name: "", type: "text", placeholder: "", required: false }],
      },
    });
  };

  const addContactInfo = () => {
    setPage({
      ...page,
      contactInfo: [...page.contactInfo, { icon: "phone", text: "" }],
    });
  };

  const addImage = () => {
    setPage({ ...page, images: [...page.images, ""] });
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h2>{slug ? `Edit Page: ${slug}` : "Add New Page"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="slug"
          value={page.slug}
          placeholder="Slug (unique)"
          onChange={(e) => setPage({ ...page, slug: e.target.value })}
          required
          disabled={slug} // cannot change slug on edit
        />
        <input
          name="title"
          value={page.title}
          placeholder="Title"
          onChange={(e) => handleChange(e, null, "page")}
        />
        <input
          name="metaTitle"
          value={page.metaTitle}
          placeholder="Meta Title"
          onChange={(e) => handleChange(e, null, "page")}
        />
        <input
          name="metaDescription"
          value={page.metaDescription}
          placeholder="Meta Description"
          onChange={(e) => handleChange(e, null, "page")}
        />
        <input
          name="h1"
          value={page.h1}
          placeholder="H1"
          onChange={(e) => handleChange(e, null, "page")}
        />
        <input
          name="h2"
          value={page.h2}
          placeholder="H2"
          onChange={(e) => handleChange(e, null, "page")}
        />
        <textarea
          name="content"
          value={page.content}
          placeholder="Content (HTML allowed)"
          onChange={(e) => handleChange(e, null, "page")}
          rows={6}
        />

        <h3>Images</h3>
        {page.images.map((img, i) => (
          <input
            key={i}
            value={img}
            placeholder="Image URL"
            onChange={(e) => {
              const newImages = [...page.images];
              newImages[i] = e.target.value;
              setPage({ ...page, images: newImages });
            }}
          />
        ))}
        <button type="button" onClick={addImage}>
          + Add Image
        </button>

        <h3>Form (for contact or any form page)</h3>
        <input
          value={page.form.subject}
          placeholder="Form Subject"
          onChange={(e) => setPage({ ...page, form: { ...page.form, subject: e.target.value } })}
        />
        <input
          value={page.form.submitUrl}
          placeholder="Form Submit URL"
          onChange={(e) => setPage({ ...page, form: { ...page.form, submitUrl: e.target.value } })}
        />
        <input
          value={page.form.recaptchaSiteKey}
          placeholder="ReCAPTCHA Site Key"
          onChange={(e) => setPage({ ...page, form: { ...page.form, recaptchaSiteKey: e.target.value } })}
        />
        <h4>Form Fields</h4>
        {page.form.fields.map((field, i) => (
          <div key={i}>
            <input
              value={field.name}
              placeholder="Field Name"
              onChange={(e) => handleChange(e, i, "form", "name")}
            />
            <select
              value={field.type}
              onChange={(e) => handleChange(e, i, "form", "type")}
            >
              <option value="text">Text</option>
              <option value="email">Email</option>
              <option value="textarea">Textarea</option>
              <option value="number">Number</option>
            </select>
            <input
              value={field.placeholder}
              placeholder="Placeholder"
              onChange={(e) => handleChange(e, i, "form", "placeholder")}
            />
            <label>
              Required:
              <input
                type="checkbox"
                checked={field.required}
                onChange={(e) => handleChange({ target: { value: e.target.checked } }, i, "form", "required")}
              />
            </label>
          </div>
        ))}
        <button type="button" onClick={addFormField}>
          + Add Form Field
        </button>

        <h3>Contact Info</h3>
        {page.contactInfo.map((info, i) => (
          <div key={i}>
            <select
              value={info.icon}
              onChange={(e) => handleChange(e, i, "contactInfo", "icon")}
            >
              <option value="phone">Phone</option>
              <option value="email">Email</option>
              <option value="location">Location</option>
            </select>
            <input
              value={info.text}
              placeholder="Text"
              onChange={(e) => handleChange(e, i, "contactInfo", "text")}
            />
          </div>
        ))}
        <button type="button" onClick={addContactInfo}>
          + Add Contact Info
        </button>

        <h3>Map Embed URL</h3>
        <input
          value={page.mapEmbed}
          placeholder="Google Map Embed URL"
          onChange={(e) => handleChange(e, null, "page")}
          name="mapEmbed"
        />

        <br />
        <button type="submit">Save Page</button>
      </form>
    </div>
  );
};

export default PageEditor;
