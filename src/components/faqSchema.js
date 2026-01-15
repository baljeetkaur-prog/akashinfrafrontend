export const buildStaticFaqSchema = (faqs) => {
  if (!faqs || !faqs.length) return null;

  const faqItems = faqs
    .map((faq) => ({
      "@type": "Question",
      name: faq.question?.trim(),
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer?.trim(),
      },
    }))
    .filter((q) => q.name && q.acceptedAnswer.text);

  if (!faqItems.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems,
  };
};
