import Navbar from "../components/Navbar"

function Home() {
 return (
  <>
    <Navbar />
    <div style={styles.container}>
      <h1 style={styles.title}>Pinterest Clone</h1>
      <p style={styles.subtitle}>Bienvenida al proyecto 🚀</p>
    </div>
  </>
)
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    fontSize: "40px",
    fontWeight: "bold"
  },
  subtitle: {
    fontSize: "18px",
    color: "#555"
  }
}

export default Home

