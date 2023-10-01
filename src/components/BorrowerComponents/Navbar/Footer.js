const Footer = () => {
  const footerNavigation = {
    shop: [
      { name: "Bags", href: "#" },
      { name: "Tees", href: "#" },
      { name: "Objects", href: "#" },
      { name: "Home Goods", href: "#" },
      { name: "Accessories", href: "#" },
    ],
    company: [
      { name: "Who we are", href: "#" },
      { name: "Sustainability", href: "#" },
      { name: "Press", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Terms & Conditions", href: "#" },
      { name: "Privacy", href: "#" },
    ],
    account: [
      { name: "Manage Account", href: "#" },
      { name: "Returns & Exchanges", href: "#" },
      { name: "Redeem a Gift Card", href: "#" },
    ],
    connect: [
      { name: "Contact Us", href: "#" },
      { name: "Twitter", href: "#" },
      { name: "Instagram", href: "#" },
      { name: "Pinterest", href: "#" },
    ],
  };
  return (
    <footer aria-labelledby="footer-heading mt-auto" className="bg-gray-900">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border-t border-gray-800 py-10">
          <p className="text-sm text-gray-400">
            Copyright &copy; 2023 Team Herewego, Inc.
          </p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
