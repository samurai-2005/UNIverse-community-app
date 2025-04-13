import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import DOMPurify from 'dompurify';
import { useAuth } from '../contexts/AuthProvider';
import "../styles/Community.css";

const CommunityPage = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [newPost, setNewPost] = useState("");
  const [commentText, setCommentText] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch posts for the specific community
  // Community.js - Modify the useEffect for fetching posts
useEffect(() => {
  setLoading(true);
  // Community.js - Update axios call
axios.get(`http://localhost:5000/api/posts?community=${id}`, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  },
  withCredentials: true
})
  .then((response) => {
    const postsWithComments = response.data.map((post) => ({
      ...post,
      comments: post.comments || [],
    }));
    setPosts(postsWithComments.reverse());
    setLoading(false);
  })
  .catch((error) => {
    console.error("Error fetching posts:", error);
    setError("Failed to load posts. Please try again.");
    setLoading(false);
  });
}, [id]);

  // Fetch comments for each post
  useEffect(() => {
    const fetchComments = async (postId) => {
      try {
        const response = await axios.get(`http://localhost:5000/api/posts/${postId}/comments`);
        setComments(prev => ({
          ...prev,
          [postId]: Array.isArray(response.data) ? response.data : [],
        }));
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    posts.forEach(post => fetchComments(post._id));
  }, [posts]);

  // Post submission handler
  const handlePostSubmit = useCallback(() => {
    if (!newPost.trim() || !currentUser) return;

    const tempPost = {
      content: newPost,
      community: id,
      likes: 0,
      comments: [],
    };

    axios.post("http://localhost:5000/api/posts", {
      ...tempPost,
      author: currentUser.id,
    })
    .then((response) => {
      setPosts(prev => [response.data, ...prev]);
      setNewPost("");
    })
    .catch((error) => {
      console.error("Error creating post:", error);
      setError("Failed to create post.");
    });
  }, [newPost, id, currentUser]);

  // Like post handler
  const handleLike = useCallback((postId) => {
    setPosts(prev => prev.map(post => 
      post._id === postId ? { ...post, likes: post.likes + 1 } : post
    ));

    axios.post(`http://localhost:5000/api/posts/${postId}/like`)
      .catch(() => setError("Failed to like post."));
  }, []);

  // Comment submission handler
  const handleCommentSubmit = useCallback((postId) => {
    const text = commentText[postId]?.trim();
    if (!text || !currentUser) return;

    axios.post(`http://localhost:5000/api/posts/${postId}/comment`, {
      text,
      author: currentUser.id,
    })
    .then(response => {
      setComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), response.data]
      }));
      setCommentText(prev => ({ ...prev, [postId]: "" }));
    })
    .catch(() => setError("Failed to add comment."));
  }, [commentText, currentUser]);

  return (
    <div className="community-page">
      <h2>🌍 {id.toUpperCase()} Community</h2>

      {error && <p className="error-message">{error}</p>}
      {loading && <p>Loading posts...</p>}

      <div className="create-post">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Write a new post..."
        />
        <button onClick={handlePostSubmit}>Post</button>
      </div>

      <div className="posts">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id} className="post">
              <h4>{post.author?.name || 'Anonymous'}</h4>
              <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }} />
              
              <div className="post-actions">
                <button onClick={() => handleLike(post._id)}>
                  👍 {post.likes}
                </button>
                <button>💬 {comments[post._id]?.length || 0}</button>
              </div>

              <div className="comments">
                <h5>Comments:</h5>
                {comments[post._id]?.length > 0 ? (
                  comments[post._id].map((comment) => (
                    <p key={comment._id}>
                      💬 <strong>{comment.author?.name}:</strong> {comment.text}
                    </p>
                  ))
                ) : (
                  <p>No comments yet</p>
                )}
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={commentText[post._id] || ""}
                  onChange={(e) => setCommentText({
                    ...commentText,
                    [post._id]: e.target.value
                  })}
                  onKeyDown={(e) => e.key === "Enter" && handleCommentSubmit(post._id)}
                />
              </div>
            </div>
          ))
        ) : (
          !loading && <p>No posts yet in this community.</p>
        )}
      </div>
    </div>
  );
};

export default CommunityPage;