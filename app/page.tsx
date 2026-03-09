export default function Home() {
  return (
    <main style={{fontFamily: "Arial", padding: "40px"}}>
      
      <h1 style={{fontSize: "48px"}}>
        Shuka AI Marketplace
      </h1>

      <p style={{fontSize: "20px", marginTop: "10px"}}>
        Discover powerful AI tools in one place.
      </p>

      <div style={{marginTop: "40px"}}>
        <button style={{
          padding: "15px 25px",
          fontSize: "16px",
          background: "black",
          color: "white",
          border: "none",
          borderRadius: "8px",
          marginRight: "10px"
        }}>
          Explore Tools
        </button>

        <button style={{
          padding: "15px 25px",
          fontSize: "16px",
          background: "#eee",
          border: "none",
          borderRadius: "8px"
        }}>
          List Your AI Tool
        </button>
      </div>

      <section style={{marginTop: "80px"}}>
        <h2>Featured AI Tools</h2>

        <ul style={{marginTop: "20px"}}>
          <li>AI Image Generator</li>
          <li>AI Code Assistant</li>
          <li>AI Marketing Writer</li>
          <li>AI Video Creator</li>
        </ul>
      </section>

    </main>
  )
}
