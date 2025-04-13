// src/components/Sidebar.js
const Sidebar = ({ type, isCollapsed, setIsCollapsed }) => {
  const { currentUser } = useAuth();

  return (
    <div className={`sidebar ${type} ${isCollapsed ? 'collapsed' : ''}`}>
      <button className="sidebar-toggle" onClick={() => setIsCollapsed(!isCollapsed)}>
        {isCollapsed ? '▶' : '◀'}
      </button>
      
      {!isCollapsed && (
        type === 'left' ? (
          <>
            <h3>Communities</h3>
            <ul>
               <li><Link to="/community/ai">🚀 AI/ML</Link></li> 
              <li><Link to="/community/cybersecurity">🔒 Cybersecurity</Link></li>
              <li><Link to="/community/fullstack">💻 Full Stack</Link></li> 
              <li><Link to="/community/iot">🌐 IoT</Link></li> 
              </ul> 
              <h3>Recommended Communities</h3> 
              <ul> 
              <li><Link to="/community/bca">✈ BCA Community</Link></li> 
              <li><Link to="/community/bba">✈ BBA Community</Link></li> 
              </ul>
          </>
        ) : (
          <>
            <Connections />
            <ChatBox />
          </>
        )
      )}
    </div>
  );
};