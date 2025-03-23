import { useEffect, useState } from 'react';
import axios from '../api';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../utils/Auth';
import '../styles/PublicFeed.css';

export default function PublicFeed() {
  const { user } = useAuth();
  const [placemarks, setPlacemarks] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [comments, setComments] = useState({});
  const [userMap, setUserMap] = useState({});

  useEffect(() => {
    const fetchPublic = async () => {
      try {
        const placemarkRes = await axios.get('/placemarks/public');
        setPlacemarks(placemarkRes.data);

        if (user?.role === 'admin') {
          const userRes = await axios.get('/users', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });

          const map = {};
          userRes.data.forEach(u => {
            map[u.id] = `${u.firstName} ${u.lastName}`;
          });
          setUserMap(map);
        }

        for (const pm of placemarkRes.data) {
          const commentRes = await axios.get(`/placemarks/${pm.id}/comments`);
          setComments(prev => ({ ...prev, [pm.id]: commentRes.data }));
        }
      } catch (err) {
        console.error('Failed to load public placemarks', err);
      }
    };

    fetchPublic();
  }, [user]);

  const handleLike = async (id) => {
    try {
      await axios.post(`/placemarks/${id}/like`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPlacemarks((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, likes: [...(p.likes || []), user.id] } : p
        )
      );
    } catch (err) {
      console.error('Like failed', err);
    }
  };

  const handleUnlike = async (id) => {
    try {
      await axios.delete(`/placemarks/${id}/unlike`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPlacemarks((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, likes: (p.likes || []).filter(uid => uid !== user.id) } : p
        )
      );
    } catch (err) {
      console.error('Unlike failed', err);
    }
  };

  const handleCommentSubmit = async (placemarkId) => {
    const content = commentInputs[placemarkId];
    if (!content) return;

    try {
      // eslint-disable-next-line no-unused-vars
      const res = await axios.post(
        `/placemarks/${placemarkId}/comments`,
        { content },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

      setComments(prev => ({
        ...prev,
        [placemarkId]: [...(prev[placemarkId] || []), {
          userId: user.id,
          content,
          timestamp: new Date().toISOString(),
        }]
      }));
      setCommentInputs(prev => ({ ...prev, [placemarkId]: '' }));
    } catch (err) {
      console.error('Failed to post comment', err);
    }
  };

  const handleDeleteComment = async (placemarkId, commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await axios.delete(`/placemarks/${placemarkId}/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPlacemarks((prev) =>
        prev.map(pm =>
          pm.id === placemarkId
            ? {
              ...pm,
              comments: (pm.comments || []).filter(c => c.id !== commentId)
            }
            : pm
        )
      );
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };


  return (
    <div className="public-feed">
      <h2 style={{ textAlign: 'center' }}>🌍 Public Placemark Feed</h2>
      {placemarks.map(pm => (
        <div key={pm.id} className="placemark-card" style={{ marginBottom: '2rem' }}>
          <h4>{pm.name}</h4>
          {pm.imageUrl && (
            <img
              src={pm.imageUrl}
              alt={pm.name}
              style={{ maxWidth: '100%', borderRadius: '6px', marginBottom: '0.5rem' }}
            />
          )}
          <p><strong>Description:</strong> {pm.description}</p>
          <p><strong>Category:</strong> {pm.category}</p>
          <p><strong>Likes:</strong> {pm.likes?.length || 0}</p>
          {user && (
            pm.likes?.includes(user.id) ? (
              <button onClick={() => handleUnlike(pm.id)}>👎 Unlike</button>
            ) : (
              <button onClick={() => handleLike(pm.id)}>👍 Like</button>
            )
          )}

          <div style={{ marginTop: '1rem' }}>
            <h5>💬 Comments:</h5>
            <div className="placemark-comments">
              {pm.comments?.map((c) => (
                <div className="comment-item" key={c.id}>
                  <span className="comment-author">{userMap[c.userId] || 'Unknown User'}</span>
                  <span>{c.content}</span>
                  <div className="comment-meta">
                    <span>{formatDistanceToNow(new Date(c.timestamp), { addSuffix: true })}</span>
                    {user?.id === c.userId && (
                      <button className="comment-delete" onClick={() => handleDeleteComment(pm.id, c.id)}>
                        🗑️ Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>



            {user && (
              <div style={{ marginTop: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentInputs[pm.id] || ''}
                  onChange={(e) => setCommentInputs(prev => ({ ...prev, [pm.id]: e.target.value }))}
                  style={{ padding: '0.4rem', width: '70%' }}
                />
                <button onClick={() => handleCommentSubmit(pm.id)} style={{ marginLeft: '0.5rem' }}>
                  ➕ Comment
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
