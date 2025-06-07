// client/src/components/Footer.jsx
import React from "react";

const Footer = () => {
    return (
        <footer className="bg-dark text-light py-4 mt-auto">
            <div className="container text-center">
                <p className="mb-1">
                    &copy; {new Date().getFullYear()} Chistay • All rights
                    reserved.
                </p>
                <p className="mb-0">
                    Made with ❤️ by <strong>Tarun & Team</strong>
                </p>
            </div>
        </footer>
    );
};

export default Footer;
