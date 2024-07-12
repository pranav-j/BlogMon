import React, { useRef, useState, useCallback } from 'react';
import ReactQuill from 'react-quill';
import axios from 'axios';
import TopBar from "./TopBar";


import { useSelector } from 'react-redux';

import 'react-quill/dist/quill.snow.css';
import './createBlog.css';
import { useNavigate } from 'react-router-dom';

const CreateBlog = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState(null);
  const quillRef = useRef(null);
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);

  const handleImageUpload = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      const formData = new FormData();
      formData.append('imageInsertion', file);

      try {
        const response = await axios.post('/content-img-upload', formData, {
        // const response = await axios.post('http://localhost:3535/content-img-upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true
        });

        const quill = quillRef.current.getEditor();
        const range = quill.getSelection(true);
        quill.insertEmbed(range.index, 'image', response.data.url);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    };
  }, []);

  const modules = {
    toolbar: {
      container: [
        [{ 'header': '1' }, { 'header': '2' }, { 'header': '3' }, { 'font': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['bold', 'italic', 'underline'],
        ['image'], // Custom button to insert images
        [{ 'align': [] }],
        ['clean'],
      ],
      handlers: {
        'image': handleImageUpload,
      },
    },
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("TITLE", title);
    console.log("CATEGORY", category);
    console.log("CONTENT", content);
    try {
      await axios.post('/create-article', {
      // await axios.post('http://localhost:3535/create-article', {
        title,
        content,
        category,
        author_id: user.id,
        author_name: user.name,
      }, { withCredentials: true });

      setTitle('');
      setContent('');
      setCategory('');
      navigate('/profile');
    } catch (error) {
      setError('Failed to create article');
    }
  };

  return (
    <>
      <TopBar />
      <div className="create-blog">
        <h2>Create a New Blog</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Article Title"
            required
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)} required>
            <option value="">Select Category</option>
            <option value="Cryptocurrency">Cryptocurrency</option>
            <option value="Cybersecurity">Cybersecurity</option>
            <option value="Artificial Intelligence">Artificial Intelligence</option>
            <option value="Space">Space</option>
            <option value="Machine Learning">Machine Learning</option>
          </select>
          <ReactQuill
            ref={quillRef}
            value={content}
            onChange={setContent}
            modules={modules}
          />
          <button type="submit">Create Article</button>
        </form>
      </div>
    </>
  );
};

export default CreateBlog;
