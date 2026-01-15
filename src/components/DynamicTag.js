const validTags = ["h1", "h2", "h3", "h4", "h5", "h6", "p"];

const DynamicTag = ({
  tag = "p",
  className = "",
  children,
  html
}) => {
  const Tag = validTags.includes(tag) ? tag : "p";

  // Render HTML if provided
  if (html !== undefined && html !== null) {
    return (
      <Tag
        className={className}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  // Otherwise render normal text
  return <Tag className={className}>{children}</Tag>;
};

export default DynamicTag;
