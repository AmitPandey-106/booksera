import { useState, useEffect } from "react";
import { FaBook } from "react-icons/fa";

export default function SearchAnimation() {
  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {
    const magnifier = document.querySelector(".magnifying-glass");
    if (magnifier) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            setShowLogo(entry.isIntersecting);
          });
        },
        { threshold: 1.0 }
      );
      observer.observe(magnifier);
    }
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "150px",
          height: "200px",
        }}
      >
        {/* Book Icon */}
        <div
          style={{
            position: "absolute",
            width: "100px",
            height: "100px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(45deg, #1E90FF, #FFA500, #4169E1)", // Green gradient
            borderRadius: "10px",
            boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
          }}
        >
          <FaBook size={50} color="white" />
        </div>

        {/* Magnifying Glass */}
        <div
          className="magnifying-glass"
          style={{
            position: "absolute",
            width: "30px",
            height: "30px",
            background: "transparent",
            border: "5px solid black",
            borderRadius: "50%",
            boxShadow: "inset 0 0 8px rgba(0, 0, 0, 0.2)",
            transformOrigin: "center",
            animation: "search 4s ease-in-out infinite alternate",
          }}
        >
          {/* Handle */}
          <div
            style={{
              position: "absolute",
              bottom: "-38px",
              left: "8px",
              width: "6px",
              height: "30px",
              background: "#f4a460",
              borderRadius: "5px",
              transform: "rotate(0deg)",
            }}
          ></div>
        </div>
      </div>

      {/* Inline CSS */}
      <style jsx>{`
        @keyframes search {
          0% {
            transform: rotate(0deg) translate(10px) rotate(-90deg);
          }
          25% {
            transform: rotate(90deg) translate(80px) rotate(50deg);
          }
          50% {
            transform: rotate(180deg) translate(10px) rotate(50deg);
          }
          75% {
            transform: rotate(270deg) translate(10px) rotate(60deg);
          }
          100% {
            transform: rotate(360deg) translate(100px) rotate(-360deg);
          }
        }
      `}</style>
    </div>
  );
}
