"use client";

import BlogForm from "@/Components/Blog/BlogForm";
import FormWrapper from "@/Utils/HOC/FormWrapper";

const BlogUpdate = ({ params }) => {
  return (
    params?.updateId && (
      <FormWrapper title="UpdateBlog">
        <BlogForm updateId={params?.updateId} />
      </FormWrapper>
    )
  );
};

export default BlogUpdate;
