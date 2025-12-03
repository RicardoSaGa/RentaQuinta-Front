import Header from "../components/Header";
import Footer from "../components/Footer";

function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow mt-20">
        {children}
      </main>

      <Footer />
    </div>
  );
}

export default MainLayout;
