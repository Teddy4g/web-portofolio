export const Footer = () => {
  const handleScrollTop = (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="border-t border-neutral-200">
      <div className="max-w-6xl mx-auto px-6 py-10 text-sm text-neutral-500 flex items-center justify-between">
        <p>© {new Date().getFullYear()} Teddy Agustinus</p>
        
        <button 
          onClick={handleScrollTop} 
          className="hover:text-neutral-900 transition font-medium"
        >
          Back to top ↑
        </button>
      </div>
    </footer>
  );
};
