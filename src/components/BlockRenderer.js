const BlockRenderer = ({ block }) => {
  switch (block.type) {

    case "text-image":
    case "image-text":
      return (
        <div className={`content-wrapper ${block.imagePosition === "left" ? "reverse" : ""}`}>
          <div className="text">
            <DynamicTag tag={block.heading?.tag || "h2"}>
              {block.heading?.text}
            </DynamicTag>

            {block.paragraphs?.map((p, i) => (
              <HtmlContent key={i} html={p} tag="p" />
            ))}
          </div>

          {block.image && (
            <div className="image">
              <img src={block.image} alt="" />
            </div>
          )}
        </div>
      );

    case "full-text":
      return (
        <div>
          <DynamicTag tag={block.heading?.tag || "h2"}>
            {block.heading?.text}
          </DynamicTag>

          {block.paragraphs?.map((p, i) => (
            <HtmlContent key={i} html={p} tag="p" />
          ))}
        </div>
      );

    case "two-cards":
      return (
        <div className="two-cards">
          {block.items.map((item, i) => (
            <div key={i} className="card">
              <img src={item.image} alt={item.title} />
              <h3>{item.title}</h3>

              {/* 👇 rich text here too */}
              <HtmlContent html={item.text} tag="p" />
            </div>
          ))}
        </div>
      );

    case "faq":
      return <FAQBlock faqs={block.faqs} />;

    default:
      return null;
  }
};

export default BlockRenderer;
