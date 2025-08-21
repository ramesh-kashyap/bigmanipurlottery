import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Language = () => {
  const navigate = useNavigate();
  const backClick = () => {
    navigate(-1);
  };

  const { i18n } = useTranslation();
  const [selectedLang, setSelectedLang] = useState(i18n.language);

  const changeLanguage = async (lng) => {
    try {
      await i18n.changeLanguage(lng);
      setSelectedLang(lng);
    } catch (error) {
      console.error(error);
    }
  };

  return (
  <div style={{ display: "flex", flexDirection: "column", gap: "15px", justifyContent: "center", alignItems: "center", marginTop: "20px" }}>
    <div data-v-12a80a3e="" data-v-00fab4aa="" class="navbar"><div data-v-12a80a3e="" class="navbar-fixed"><div data-v-12a80a3e="" class="navbar__content"><div data-v-12a80a3e="" class="navbar__content-left"  onClick={()=>navigate('/account')}><i data-v-12a80a3e="" class="van-badge__wrapper van-icon van-icon-arrow-left"></i></div><div data-v-12a80a3e="" class="navbar__content-center"><div data-v-12a80a3e="" class="navbar__content-title">Language</div></div><div data-v-12a80a3e="" class="navbar__content-right"></div></div></div></div>
  {/* English Option */}
  <label
    className="item"
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "15px",
      padding: "10px 20px",
      borderRadius: "8px",
      border: selectedLang === "en" ? "2px solid #4CAF50" : "1px solid #ccc",
      backgroundColor: selectedLang === "en" ? "#e6ffe6" : "#f1f1f1",
      width: "350px",
      cursor: "pointer",
    }}
    onClick={() => changeLanguage('en')}
  >
    {/* Left: Flag and Label */}
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <img src="https://flagcdn.com/w40/gb.png" alt="English" style={{ width: "20px", height: "15px", borderRadius: "5px" }} />
      <span style={{ fontWeight: "bold",fontSize: "20px" }}>English</span>
    </div>

    {/* Right: Radio Button */}
    <input
      type="radio"
      name="language"
      value="en"
      checked={selectedLang === 'en'}
      onChange={() => changeLanguage('en')}
    />
  </label>

  {/* Hindi Option */}
  <label
    className="item"
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "15px",
      padding: "10px 20px",
      borderRadius: "8px",
      border: selectedLang === "hi" ? "2px solid #4CAF50" : "1px solid #ccc",
      backgroundColor: selectedLang === "hi" ? "#e6ffe6" : "#f1f1f1",
      width: "350px",
      cursor: "pointer",
    }}
    onClick={() => changeLanguage('hi')}
  >
    {/* Left: Flag and Label */}
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <img src="https://flagcdn.com/w40/in.png" alt="Hindi" style={{ width: "20px", height: "15px", borderRadius: "5px" }} />
      <span style={{ fontWeight: "bold",fontSize: "20px" }}>हिंदी</span>
    </div>

    {/* Right: Radio Button */}
    <input
      type="radio"
      name="language"
      value="hi"
      checked={selectedLang === 'hi'}
      onChange={() => changeLanguage('hi')}
    />
  </label>
</div>

  );
};

export default Language;
