import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-dark text-light py-4 mt-auto border-top border-secondary">
            <div className="container">
                <div className="row text-center text-md-start">
                    {/* Brand / About */}
                    <div className="col-md-4 mb-3">
                        <h5 className="text-warning">Chistay</h5>
                        <p style={{ fontSize: "0.9rem" }}>
                            Bringing comfort to your travel — find unique stays
                            across India with ease and trust.
                        </p>
                    </div>

                    {/* Contact */}
                    <div className="col-md-4 mb-3">
                        <h6>Contact</h6>
                        <p className="mb-1">
                            <i className="bi bi-envelope me-2"></i>
                            support@chistay.com
                        </p>
                        <p className="mb-1">
                            <i className="bi bi-phone me-2"></i>+91 98765 43210
                        </p>
                        <p>
                            <i className="bi bi-geo-alt me-2"></i>Himachal
                            Pradesh, India
                        </p>
                    </div>

                    {/* Links / Social */}
                    <div className="col-md-4 mb-3">
                        <h6>Useful Links</h6>
                        <ul className="list-unstyled">
                            <li>
                                <Link
                                    to="/terms"
                                    className="text-decoration-none text-light"
                                >
                                    Terms & Conditions
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/privacy"
                                    className="text-decoration-none text-light"
                                >
                                    Privacy Policy
                                </Link>
                            </li>
                            <li className="mt-2">
                                <a
                                    href="https://github.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-light me-3"
                                >
                                    <i
                                        className="bi bi-github"
                                        style={{ fontSize: "1.2rem" }}
                                    ></i>
                                </a>
                                <a
                                    href="https://instagram.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-light me-3"
                                >
                                    <i
                                        className="bi bi-instagram"
                                        style={{ fontSize: "1.2rem" }}
                                    ></i>
                                </a>
                                <a
                                    href="https://twitter.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-light"
                                >
                                    <i
                                        className="bi bi-twitter"
                                        style={{ fontSize: "1.2rem" }}
                                    ></i>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <hr className="border-secondary" />
                <div className="text-center" style={{ fontSize: "0.85rem" }}>
                    &copy; {new Date().getFullYear()} Chistay. All rights
                    reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
