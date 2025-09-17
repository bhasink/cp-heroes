import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const Header = () => {
  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`site-header topmain ${isFixed ? 'navfixed' : 'norm'}`}>
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container p-0">
          <Link href="/" className="navbar-brand">
              <img src="/images/century-heroes-logo.png" className="navbar-brand-img" alt="logo" />
          </Link>

          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarCollapse">
            <ul className="navbar-nav ml-auto position-relative" id="menu-center">
              <li className="nav-item">
                <Link href="/centuryheroes" className="nav-link active">
                  2022
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/centuryheroes/beautyiswhatbeautydoes/?v=2" className="nav-link active">
                  2023
                </Link>
              </li>
              <li className="nav-item">
                <Link href="https://www.centuryply.com/centuryheroes/inclusivitypriority" className="nav-link active">
                  2024
                </Link>
              </li>
              <li className="nav-item">
                <Link href="" className="nav-link active">
                  2025
                </Link>
              </li>
              <li className="nav-item">
                <a className="navbar-brand" href="https://www.centuryply.com/" target="_blank" rel="noopener noreferrer">
                  <img src="/images/cplogo.png" className="navbar-brand-img" alt="logo" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;