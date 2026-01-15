import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./PageBuilderAdmin.css";
import SimpleEditor from "./SimpleEditor";

const PageBuilder = () => {
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [seo, setSeo] = useState({ title: "", description: "", keywords: "" });
  const [blocks, setBlocks] = useState([]);
  const [pageType, setPageType] = useState("page");
  const [saving, setSaving] = useState(false);

  const { slug: editSlug } = useParams();

  // Blog related fields
  const [categories, setCategories] = useState(["Uncategorised"]);
  const [tags, setTags] = useState([]);
  const [blogHeading, setBlogHeading] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Uncategorised");

  // ── Image management ──────────────────────────────────────────────
  const [pendingImagesByBlock, setPendingImagesByBlock] = useState([]);

  const API = process.env.REACT_APP_APIURL;

  // Helper - create local preview URL
  const createPreview = (file) => URL.createObjectURL(file);

  // Max images according to layout
  const getMaxImagesForLayout = (layout = "single") => {
    if (layout === "single") return 1;
    if (layout === "two") return 2;
    return 3;
  };

  // Add new files
  const handleAddImagesToBlock = (blockIndex, files) => {
    const max = getMaxImagesForLayout(blocks[blockIndex]?.imageLayout || "single");

    const newLocalImages = Array.from(files).map((file) => ({
      id: Math.random().toString(36).slice(2),
      url: createPreview(file),
      file,
      alt: "",
      isNew: true,
      markedForDeletion: false,
    }));

    setPendingImagesByBlock((prev) => {
      const updated = [...prev];
      const current = updated[blockIndex] || [];
      updated[blockIndex] = [...current, ...newLocalImages].slice(0, max);
      return updated;
    });
  };

  // Replace existing image
  const handleReplaceImageInBlock = (blockIndex, imgIndex, file) => {
    const previewUrl = createPreview(file);

    setPendingImagesByBlock((prev) => {
      const updated = [...prev];
      const blockImgs = [...(updated[blockIndex] || [])];
      const oldImg = blockImgs[imgIndex];

      if (!oldImg) return prev;

      blockImgs[imgIndex] = {
        ...oldImg,
        url: previewUrl,
        file,
        isNew: true,
        oldPublicIdToDelete: oldImg.publicId && !oldImg.isNew ? oldImg.publicId : oldImg.oldPublicIdToDelete,
      };

      updated[blockIndex] = blockImgs;
      return updated;
    });
  };

  // Mark for deletion or remove new image
  const handleDeleteImageFromBlock = (blockIndex, imgIndex) => {
    setPendingImagesByBlock((prev) => {
      const updated = [...prev];
      const blockImgs = [...(updated[blockIndex] || [])];
      const img = blockImgs[imgIndex];

      if (img?.publicId && !img.isNew) {
        blockImgs[imgIndex] = { ...img, markedForDeletion: true };
      } else {
        blockImgs.splice(imgIndex, 1);
      }

      updated[blockIndex] = blockImgs;
      return updated;
    });
  };

  const addBlock = (type) => {
    let block = { type };

    if (type === "section") {
      block = {
        type: "section",
        heading: { tag: "h2", text: "" },
        content: [],
        paragraphs: [],
        images: [],
        imageLayout: "single",
        imagePosition: "right",
      };
    }

    if (type === "banner") {
      block = {
        type: "banner",
        heading: { tag: "h1", text: "" },
        subHeading: "",
      };
    }

    if (type === "faq") {
      block = {
        type: "faq",
        heading: { tag: "h2", text: "" },
        faqs: [],
      };
    }

    setBlocks([...blocks, block]);
    setPendingImagesByBlock((prev) => [...prev, []]);
  };

  const updateBlockData = (index, data) => {
    const newBlocks = [...blocks];
    newBlocks[index] = { ...newBlocks[index], ...data };
    setBlocks(newBlocks);
  };

  const removeBlock = (index) => {
    const newBlocks = [...blocks];
    newBlocks.splice(index, 1);
    setBlocks(newBlocks);

    setPendingImagesByBlock((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  // Load existing page
  useEffect(() => {
    if (!editSlug) return;

    const fetchPage = async () => {
      try {
        const res = await axios.get(`${API}/api/detail-page/${editSlug}`);
        const page = res.data;

        setSlug(page.slug);
        setTitle(page.title);
        setSeo(page.seo || { title: "", description: "", keywords: "" });
        setPageType(page.pageType || "page");
        setCategories(page.categories || ["Uncategorised"]);
        setSelectedCategory(page.category || "Uncategorised");
        setTags(page.tags || []);
        setBlogHeading(page.blogHeading || "");

        const loadedBlocks = page.blocks || [];
        setBlocks(loadedBlocks);

        const pending = loadedBlocks.map((block) =>
          (block.images || []).map((img) => ({
            id: Math.random().toString(36).slice(2),
            url: img.src,
            alt: img.alt || "",
            publicId: img.publicId,
            isNew: false,
            markedForDeletion: false,
          }))
        );

        setPendingImagesByBlock(pending);
      } catch (err) {
        console.error("Failed to load page:", err);
        alert("Failed to load page");
      }
    };

    fetchPage();
  }, [editSlug, API]);

  // ── MAIN SAVE FUNCTION ─────────────────────────────────────────────
  const handleSubmit = async () => {
    if (saving) return; 
    setSaving(true);
    try {
      // 1. Collect all public IDs that need deletion
      const deletedPublicIds = [];
      pendingImagesByBlock.forEach((blockImgs = []) => {
        blockImgs.forEach((img) => {
          if (img.markedForDeletion && img.publicId) {
            deletedPublicIds.push(img.publicId);
          }
          if (img.oldPublicIdToDelete) {
            deletedPublicIds.push(img.oldPublicIdToDelete);
          }
        });
      });

      const uniqueDeletedIds = [...new Set(deletedPublicIds)];

      // 2. Delete images from Cloudinary FIRST (using your existing endpoint)
      if (uniqueDeletedIds.length > 0) {
        console.log("Deleting images from Cloudinary:", uniqueDeletedIds);

        // Delete one by one - safe and simple
        await Promise.all(
          uniqueDeletedIds.map(async (publicId) => {
            try {
              await axios.post(`${API}/api/delete-image`, { publicId });
              console.log(`Deleted: ${publicId}`);
            } catch (deleteErr) {
              console.warn(`Failed to delete ${publicId}:`, deleteErr);
              // We continue anyway - best effort
            }
          })
        );
      }

      // 3. Upload new / replaced images
      const allFinalImages = await Promise.all(
        pendingImagesByBlock.map(async (blockPending = [], blockIndex) => {
          const toUpload = blockPending.filter((img) => img.file);

          const uploadedResults = await Promise.all(
            toUpload.map(async (img) => {
              const formData = new FormData();
              formData.append("image", img.file);

              const res = await axios.post(`${API}/api/upload`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
              });

              return {
                src: res.data.url,
                publicId: res.data.publicId,
                alt: img.alt.trim() || "",
              };
            })
          );

          const keptImages = blockPending
            .filter((img) => !img.file && !img.markedForDeletion)
            .map((img) => ({
              src: img.url,
              publicId: img.publicId,
              alt: img.alt.trim() || "",
            }));

          return [...keptImages, ...uploadedResults];
        })
      );

      // 4. Build final blocks
      const finalBlocks = blocks.map((block, i) => ({
        ...block,
        images: allFinalImages[i] || [],
      }));

      // 5. Prepare payload (no need for deletedImagePublicIds anymore)
      const cleanSlug = slug.trim().replace(/^\//, "");

      const payload = {
        slug: cleanSlug,
        title,
        seo,
        blocks: finalBlocks,
        pageType,
      };

      if (pageType === "blog") {
        payload.categories = categories.length ? categories : ["Uncategorised"];
        payload.category = selectedCategory || "Uncategorised";
        payload.tags = tags;
        payload.blogHeading = blogHeading;
      }

      // 6. Save the page
      if (editSlug) {
        await axios.put(`${API}/api/detail-page/${editSlug}`, payload);
        alert("Page updated successfully!");
      } else {
        await axios.post(`${API}/api/detail-page`, payload);
        alert("Page created successfully!");
      }

      // Optional: Refresh pending state after successful save
      // (helps if user continues editing without reload)
      setPendingImagesByBlock(
        finalBlocks.map((block) =>
          block.images.map((img) => ({
            id: Math.random().toString(36).slice(2),
            url: img.src,
            alt: img.alt || "",
            publicId: img.publicId,
            isNew: false,
            markedForDeletion: false,
          }))
        )
      );

    } catch (err) {
      console.error("Save error:", err);
      alert("Error saving page: " + (err.response?.data?.message || err.message));
    }
    finally {
      setSaving(false);
    }
  };

  // ── RENDER ─────────────────────────────────────────────────────────
  return (
    <div className="page-builder-admin">
      <h1>Page Builder</h1>

      <label>Page Type:</label>
      <select value={pageType} onChange={(e) => setPageType(e.target.value)}>
        <option value="page">Detail Page</option>
        <option value="blog">Blog</option>
      </select>

      {pageType === "blog" && (
        <>
          <h3>Categories</h3>
          <div>
            {categories.map((cat, idx) => (
              <div key={idx}>
                <input
                  value={cat}
                  onChange={(e) => {
                    const newCats = [...categories];
                    newCats[idx] = e.target.value;
                    setCategories(newCats);
                  }}
                />
                <button
                  onClick={() =>
                    setCategories(categories.filter((_, i) => i !== idx))
                  }
                >
                  Remove
                </button>
              </div>
            ))}
            <button onClick={() => setCategories([...categories, ""])}>
              Add Category
            </button>
          </div>

          <div style={{ marginTop: "1rem" }}>
            <h3>Select Blog Category</h3>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((cat, idx) => (
                <option key={idx} value={cat || "Uncategorised"}>
                  {cat || "Uncategorised"}
                </option>
              ))}
            </select>
          </div>

          <h3>Tags</h3>
          <div>
            {tags.map((tag, idx) => (
              <div key={idx}>
                <input
                  value={tag}
                  onChange={(e) => {
                    const newTags = [...tags];
                    newTags[idx] = e.target.value;
                    setTags(newTags);
                  }}
                />
                <button
                  onClick={() => setTags(tags.filter((_, i) => i !== idx))}
                >
                  Remove
                </button>
              </div>
            ))}
            <button onClick={() => setTags([...tags, ""])}>Add Tag</button>
          </div>

          <div>
            <h3>Blog Heading</h3>
            <input
              type="text"
              placeholder="Enter main heading for the blog"
              value={blogHeading}
              onChange={(e) => setBlogHeading(e.target.value)}
              style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
            />
          </div>
        </>
      )}

      {/* Basic Info */}
      <div>
        <label>Slug: </label>
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="page-slug"
        />
      </div>

      <div>
        <label>Title: </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Page Title"
        />
      </div>

      {/* SEO */}
      <h3>SEO Settings</h3>
      <div>
        <label>Meta Title</label>
        <input
          value={seo.title}
          onChange={(e) => setSeo({ ...seo, title: e.target.value })}
          placeholder="Eg: About Us | Dholera Smart City"
          style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
        />
      </div>

      <div>
        <label>Meta Description</label>
        <textarea
          value={seo.description}
          onChange={(e) => setSeo({ ...seo, description: e.target.value })}
          placeholder="Write a short description for search engines"
          style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
        />
      </div>

      <div>
        <label>Meta Keywords</label>
        <input
          value={seo.keywords}
          onChange={(e) => setSeo({ ...seo, keywords: e.target.value })}
          placeholder="real estate, dholera, investment"
          style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
        />
      </div>

      {/* Blocks */}
      <h3>Blocks</h3>
      <button onClick={() => addBlock("banner")}>Add Banner</button>
      <button onClick={() => addBlock("section")}>Add Section</button>
      {pageType !== "blog" && (
        <button onClick={() => addBlock("faq")}>Add FAQ</button>
      )}

      {blocks.map((block, index) => (
        <div key={index} className="block-wrapper">
          <h4>{block.type.toUpperCase()}</h4>
          <button onClick={() => removeBlock(index)}>Remove Block</button>

          {block.type === "banner" && (
            <div>
              <input
                placeholder="Banner Heading"
                value={block.heading?.text || ""}
                onChange={(e) =>
                  updateBlockData(index, {
                    heading: { ...block.heading, text: e.target.value },
                  })
                }
              />
              <input
                placeholder="Breadcrumb Text"
                value={block.subHeading || ""}
                onChange={(e) =>
                  updateBlockData(index, { subHeading: e.target.value })
                }
              />
            </div>
          )}

          {block.type === "section" && (
            <div>
              <h5>Content</h5>

              {block.content?.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    marginBottom: "1rem",
                    border: "1px dashed #ccc",
                    padding: "0.5rem",
                  }}
                >
                  <select
                    value={item.type}
                    onChange={(e) => {
                      const newContent = [...block.content];
                      newContent[idx] = {
                        type: e.target.value,
                        tag: item.tag || "p",
                        text: "",
                        items: [],
                      };
                      updateBlockData(index, { content: newContent });
                    }}
                  >
                    <option value="heading">Heading</option>
                    <option value="paragraph">Paragraph</option>
                    <option value="list">List</option>
                  </select>

                  {(item.type === "heading" || item.type === "paragraph") && (
                    <>
                      <select
                        value={item.tag}
                        onChange={(e) => {
                          const newContent = [...block.content];
                          newContent[idx].tag = e.target.value;
                          updateBlockData(index, { content: newContent });
                        }}
                      >
                        {item.type === "heading" &&
                          ["h1", "h2", "h3", "h4", "h5", "h6"].map((h) => (
                            <option key={h} value={h}>
                              {h.toUpperCase()}
                            </option>
                          ))}
                        {item.type === "paragraph" &&
                          ["p", "span", "small"].map((p) => (
                            <option key={p} value={p}>
                              {p.toUpperCase()}
                            </option>
                          ))}
                      </select>

 <label>Paragraph Content</label>
    <SimpleEditor
      value={item.text || ""}
      onChange={(val) => {
        const newContent = [...block.content];
        newContent[idx].text = val;
        updateBlockData(index, { content: newContent });
      }}
    />
  </>
)}

                  {item.type === "list" && (
                    <>
                      <select
                        value={item.tag || "ul"}
                        onChange={(e) => {
                          const newContent = [...block.content];
                          newContent[idx].tag = e.target.value;
                          updateBlockData(index, { content: newContent });
                        }}
                      >
                        <option value="ul">Unordered List</option>
                        <option value="ol">Ordered List</option>
                      </select>

                      {item.items?.map((li, liIdx) => (
                        <div key={liIdx}>
                          <input
                            value={li}
                            onChange={(e) => {
                              const newContent = [...block.content];
                              newContent[idx].items[liIdx] = e.target.value;
                              updateBlockData(index, { content: newContent });
                            }}
                            placeholder="List item"
                          />
                          <button
                            onClick={() => {
                              const newContent = [...block.content];
                              newContent[idx].items.splice(liIdx, 1);
                              updateBlockData(index, { content: newContent });
                            }}
                          >
                            Remove Item
                          </button>
                        </div>
                      ))}

                      <button
                        onClick={() => {
                          const newContent = [...block.content];
                          newContent[idx].items.push("");
                          updateBlockData(index, { content: newContent });
                        }}
                      >
                        Add List Item
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => {
                      const newContent = [...block.content];
                      newContent.splice(idx, 1);
                      updateBlockData(index, { content: newContent });
                    }}
                  >
                    Remove Content Item
                  </button>
                </div>
              ))}

              <div style={{ margin: "1rem 0" }}>
                <button
                  onClick={() =>
                    updateBlockData(index, {
                      content: [
                        ...(block.content || []),
                        { type: "paragraph", tag: "p", text: "" },
                      ],
                    })
                  }
                >
                  Add Paragraph
                </button>
                <button
                  onClick={() =>
                    updateBlockData(index, {
                      content: [
                        ...(block.content || []),
                        { type: "heading", tag: "h2", text: "" },
                      ],
                    })
                  }
                >
                  Add Heading
                </button>
                <button
                  onClick={() =>
                    updateBlockData(index, {
                      content: [
                        ...(block.content || []),
                        { type: "list", tag: "ul", items: [""] },
                      ],
                    })
                  }
                >
                  Add List
                </button>
              </div>

              {/* Image Controls */}
              <div style={{ marginTop: "2rem" }}>
                <label>Image Layout: </label>
                <select
                  value={block.imageLayout || "single"}
                  onChange={(e) => {
                    const layout = e.target.value;
                    const max = getMaxImagesForLayout(layout);

                    setPendingImagesByBlock((prev) => {
                      const copy = [...prev];
                      let current = copy[index] || [];
                      current = current.slice(0, max);
                      while (current.length < max) {
                        current.push({
                          id: Math.random().toString(36).slice(2),
                          url: "",
                          alt: "",
                          isNew: true,
                          markedForDeletion: false,
                        });
                      }
                      copy[index] = current;
                      return copy;
                    });

                    updateBlockData(index, { imageLayout: layout });
                  }}
                >
                  <option value="single">Single Image</option>
                  <option value="two">Two Images</option>
                  <option value="three">Three Images</option>
                </select>
              </div>

              <div>
                <label>Image Position: </label>
                <select
                  value={block.imagePosition || "right"}
                  onChange={(e) =>
                    updateBlockData(index, { imagePosition: e.target.value })
                  }
                >
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                  <option value="none">None</option>
                </select>
              </div>

              {/* Images Preview & Controls */}
              <div className="images-preview-container" style={{ marginTop: "1.5rem" }}>
             {(pendingImagesByBlock[index] || []).map((img, imgIdx) => {
  if (img.markedForDeletion) return null;

  return (
    <div key={img.id} className="image-preview-item">
      {img.url && <img src={img.url}  />}
      
      <input
        type="text"
        placeholder="Alt text"
        value={img.alt}
        onChange={(e) => {
          const val = e.target.value;
          setPendingImagesByBlock((p) => {
            const copy = [...p];
            if (copy[index]) copy[index][imgIdx].alt = val;
            return copy;
          });
        }}
      />

      {/* Visible file input per image */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          e.target.files?.[0] &&
          handleReplaceImageInBlock(index, imgIdx, e.target.files[0])
        }
      />

      <button onClick={() => handleDeleteImageFromBlock(index, imgIdx)}>Delete</button>
    </div>
  );
})}


                {(pendingImagesByBlock[index]?.filter((i) => !i.markedForDeletion)
                  ?.length || 0) <
                  getMaxImagesForLayout(block.imageLayout) && (
                  <div style={{ marginTop: "1rem" }}>
                    <label>Add more images:</label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) =>
                        e.target.files?.length &&
                        handleAddImagesToBlock(index, e.target.files)
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {block.type === "faq" && pageType !== "blog" && (
            <div>
              <input
                placeholder="FAQ Heading"
                value={block.heading?.text || ""}
                onChange={(e) =>
                  updateBlockData(index, {
                    heading: { ...block.heading, text: e.target.value },
                  })
                }
              />

              {block.faqs?.map((faq, i) => (
                <div key={i} style={{ margin: "1rem 0" }}>
                  <input
                    placeholder="Question"
                    value={faq.question || ""}
                    onChange={(e) => {
                      const faqs = [...(block.faqs || [])];
                      faqs[i].question = e.target.value;
                      updateBlockData(index, { faqs });
                    }}
                  />
                  <input
                    placeholder="Answer"
                    value={faq.answer || ""}
                    onChange={(e) => {
                      const faqs = [...(block.faqs || [])];
                      faqs[i].answer = e.target.value;
                      updateBlockData(index, { faqs });
                    }}
                  />
                </div>
              ))}

              <button
                onClick={() =>
                  updateBlockData(index, {
                    faqs: [...(block.faqs || []), { question: "", answer: "" }],
                  })
                }
              >
                Add FAQ
              </button>
            </div>
          )}
        </div>
      ))}

     <button
        type="button"
        onClick={handleSubmit}
        disabled={saving}
        className={saving ? "saving" : ""}
      >
        {saving ? (
          <>
            Saving... <span className="spinner">↻</span>
          </>
        ) : editSlug ? (
          "Update Page"
        ) : (
          "Create Page"
        )}
      </button>
    </div>
  );
};

export default PageBuilder;