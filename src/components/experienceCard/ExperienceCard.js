import React, { useState, createRef } from "react";
import "./ExperienceCard.scss";
import ColorThief from "colorthief";

export default function ExperienceCard({ cardInfo, isDark }) {
  const [colorArrays, setColorArrays] = useState([]);
  const imgRef = createRef();

  const FALLBACK_RED = [227, 30, 36]; // tweak to your brand red

  function isLight([r, g, b]) {
    // Perceived brightness (HSP-ish). 0..255
    const brightness = Math.sqrt(
      0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b)
    );
    return brightness > 210; // raise/lower if you want
  }

  function getColorArrays() {
    const colorThief = new ColorThief();
    const img = imgRef.current;
    if (!img) return;

    const compute = () => {
      try {
        let rgb = colorThief.getColor(img); // [r, g, b]
        if (isLight(rgb)) rgb = FALLBACK_RED; // force red on light/whitey logos/bg
        setColorArrays(rgb);
      } catch (e) {
        // If ColorThief fails (CORS, etc), use red as a safe default
        setColorArrays(FALLBACK_RED);
      }
    };

    // Make sure the image is loaded before sampling
    if (img.complete) compute();
    else img.addEventListener("load", compute, { once: true });
  }

  function rgb(values) {
    return typeof values === "undefined"
      ? null
      : "rgb(" + values.join(", ") + ")";
  }

  const GetDescBullets = ({ descBullets, isDark }) => {
    return descBullets
      ? descBullets.map((item, i) => (
        <li
          key={i}
          className={isDark ? "subTitle dark-mode-text" : "subTitle"}
        >
          {item}
        </li>
      ))
      : null;
  };

  return (
    <div className={isDark ? "experience-card-dark" : "experience-card"}>
      <div style={{ background: rgb(colorArrays) }} className="experience-banner">
        <div className="experience-blurred_div"></div>
        <div className="experience-div-company">
          <h5 className="experience-text-company">{cardInfo.company}</h5>
        </div>

        <img
          crossOrigin={"anonymous"}
          ref={imgRef}
          className="experience-roundedimg"
          src={cardInfo.companylogo}
          alt={cardInfo.company}
          onLoad={() => getColorArrays()}
        />
      </div>
      <div className="experience-text-details">
        <h5
          className={
            isDark
              ? "experience-text-role dark-mode-text"
              : "experience-text-role"
          }
        >
          {cardInfo.role}
        </h5>
        <h5
          className={
            isDark
              ? "experience-text-date dark-mode-text"
              : "experience-text-date"
          }
        >
          {cardInfo.date}
        </h5>
        <p
          className={
            isDark
              ? "subTitle experience-text-desc dark-mode-text"
              : "subTitle experience-text-desc"
          }
        >
          {cardInfo.desc}
        </p>
        <ul>
          <GetDescBullets descBullets={cardInfo.descBullets} isDark={isDark} />
        </ul>
      </div>
    </div>
  );
}
