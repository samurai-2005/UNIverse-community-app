import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/Community.css";

const CommunityPage = () => {
  const { id } = useParams();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [commentText, setCommentText] = useState({});

  // Fetch posts from backend
  useEffect(() => {
    axios.get("http://localhost:5000/api/posts")
      .then((response) => setPosts(response.data))
      .catch((error) => console.error("Error fetching posts:", error));
  }, []);

  // Handle new post submission
  const handlePostSubmit = () => {
    if (newPost.trim() === "") return;
    axios.post("http://localhost:5000/api/posts", {
      author: "You",
      content: newPost,
    }).then((response) => {
      setPosts([response.data, ...posts]);
      setNewPost("");
    }).catch((error) => console.error("Error creating post:", error));
  };

  // Handle like button
  const handleLike = (postId) => {
    axios.post(`http://localhost:5000/api/posts/${postId}/like`)
      .then(() => {
        setPosts(posts.map(post => post.id === postId ? { ...post, likes: post.likes + 1 } : post));
      }).catch((error) => console.error("Error liking post:", error));
  };

  // Handle comment submission
  const handleCommentSubmit = (postId) => {
    if (!commentText[postId] || commentText[postId].trim() === "") return;
    axios.post(`http://localhost:5000/api/posts/${postId}/comment`, {
      comment: commentText[postId]
    }).then(() => {
      setPosts(posts.map(post => post.id === postId ? { ...post, comments: [...post.comments, commentText[postId]] } : post));
      setCommentText({ ...commentText, [postId]: "" });
    }).catch((error) => console.error("Error adding comment:", error));
  };

  return (
    <div className="community-page">
      <h2>🌍 {id.toUpperCase()} Community</h2>
      <div className="create-post">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Write a new post..."
        />
        <button onClick={handlePostSubmit}>Post</button>
      </div>
      <div className="posts">
        {posts.map((post) => (
          <div key={post.id} className="post">
            <h4>{post.author}</h4>
            <p>{post.content}</p>
            <div className="post-actions">
              <button onClick={() => handleLike(post.id)}>👍 {post.likes}</button>
              <button>💬 {post.comments.length}</button>
            </div>
            <div className="comments">
              <h5>Comments:</h5>
              {post.comments.length > 0 ? (
                post.comments.map((comment, index) => <p key={index}>💬 {comment}</p>)
              ) : (
                <p>No comments yet</p>
              )}
              <input
                type="text"
                placeholder="Write a comment..."
                value={commentText[post.id] || ""}
                onChange={(e) => setCommentText({ ...commentText, [post.id]: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCommentSubmit(post.id);
                  }
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityPage;
