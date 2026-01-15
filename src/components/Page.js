import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Page = () => {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const API=process.env.REACT_APP_APIURL; 

  useEffect(() => {
    fetch(`${API}/api/pages/${slug}`)
      .then((res) => res.json())
      .then((data) => setPage(data));
  }, [slug]);

  if (!page) return <p>Loading...</p>;

  return (
    <div>
      <h1>{page.h1}</h1>
      <h2>{page.h2}</h2>
      <div dangerouslySetInnerHTML={{ __html: page.content }} />
    </div>
  );
};

export default Page;
