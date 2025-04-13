import React, { useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { likePost, addComment } from '../redux/actions/postActions'; // Adjust the path to your actions
import { UserAvatar } from './UserAvatar'; // Adjust the path
import { CommunityTag } from './CommunityTag'; // Adjust the path
import { Input } from '@/components/ui/input'; // Assuming you have these
import { Button } from '@/components/ui/button';  // Assuming you have these
import { Heart, MessageCircle } from 'lucide-react'; // Assuming you have these
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Post {
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    community: string;
    title: string;
    content: string;
    likes: string[]; // User IDs who liked the post
    comments: Comment[];
    createdAt: string; // ISO String
}

interface Comment {
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    text: string;
    createdAt: string;
}

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeInOut' } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};

const PostCard = ({ post }: { post: Post }) => {
    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.auth.user); // Adjust 'state.auth.user' to your actual user selector.  Use 'any' to avoid errors, and replace with your actual state type.
    const [commentText, setCommentText] = useState('');

    const handleLike = () => {
        dispatch(likePost(post.id, user.id)); // Dispatch the likePost action
    };

    const handleCommentSubmit = () => {
        if (commentText.trim()) {
            const newComment: Comment = {
                id: `comment-${Date.now()}`, // Generate a unique ID
                userId: user.id,
                userName: user.name, // Get from Redux
                userAvatar: user.avatarUrl, // Get from Redux
                text: commentText,
                createdAt: new Date().toISOString(),
            };
            dispatch(addComment(post.id, newComment)); // Dispatch the addComment action
            setCommentText('');
        }
    };

    const timeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();

        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
        const years = Math.floor(months / 12);

        if (years > 1) return `${years} years ago`;
        if (years === 1) return `1 year ago`;
        if (months > 1) return `${months} months ago`;
        if (months === 1) return `1 month ago`;
        if (days > 1) return `${days} days ago`;
        if (days === 1) return `1 day ago`;
        if (hours > 1) return `${hours} hours ago`;
        if (hours === 1) return `1 hour ago`;
        if (minutes > 1) return `${minutes} minutes ago`;
        if (minutes === 1) return `1 minute ago`;
        return 'Just now';
    };

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-gray-900 rounded-lg shadow-md p-4 mb-4 border border-gray-800"
        >
            <div className="flex items-center mb-4">
                <UserAvatar user={{ id: post.userId, name: post.userName, avatarUrl: post.userAvatar, role: 'mentee' }} size="md" />
                <div className="ml-3">
                    <div className="text-gray-200 font-semibold">{post.userName}</div>
                    <div className="text-gray-400 text-sm">{timeAgo(post.createdAt)}</div>
                </div>
                <div className="ml-auto">
                    <CommunityTag community={post.community} />
                </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-100 mb-2">{post.title}</h2>
            <p className="text-gray-300 mb-4">{post.content}</p>
            <div className="flex items-center justify-between mb-4">
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-300 hover:text-red-400"
                    onClick={handleLike}
                >
                    <Heart className="mr-2 h-4 w-4" />
                    {post.likes.length}
                </Button>
                <span className="text-gray-400 text-sm">{post.comments.length} comments</span>
            </div>
            <div className="mb-4">
                <Input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleCommentSubmit();
                        }
                    }}
                    className="bg-gray-800 text-gray-200 border-gray-700"
                />
                <Button
                    onClick={handleCommentSubmit}
                    className="mt-2 bg-blue-500 hover:bg-blue-600 text-white"
                >
                    Comment
                </Button>
            </div>
            <div>
                {post.comments.map((comment) => (
                    <div key={comment.id} className="mb-2 p-2 rounded-md bg-gray-800 border border-gray-700">
                        <div className="flex items-center mb-1">
                            <UserAvatar user={{ id: comment.userId, name: comment.userName, avatarUrl: comment.userAvatar, role: 'mentee' }} size="sm" />
                            <span className="ml-2 text-gray-200 font-semibold">{comment.userName}</span>
                            <span className="ml-auto text-gray-400 text-xs">{timeAgo(comment.createdAt)}</span>
                        </div>
                        <p className="text-gray-300">{comment.text}</p>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

// Map Redux state to props (if needed) -  In this case, we don't need to map state to props, but if you needed to access posts from the store.
const mapStateToProps = (state: any) => ({ // Replace 'any' with your actual state type
    // posts: state.posts.posts, //  If you needed to get posts from redux
    user: state.auth.user, // get user.
});

export default connect(mapStateToProps)(PostCard); // Connect PostCard to Redux
