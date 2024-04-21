import React from "react";

const Footer = (props) => {
  return (
    <footer
      className={`text-center py-3  ${
        props.mode === "dark" ? "bg-dark text-light" : "bg-light text-dark"
      } ${window.innerWidth < 584 ? "" : "fixed-bottom"}`}
    >
      <p className="mb-0">&copy; 2024 Naman Thapliyal. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
