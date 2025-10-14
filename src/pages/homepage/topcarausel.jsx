import React, { useState } from "react";

export default function GemInquirySection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gemstone: "",
    details: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation
    if (!formData.name || !formData.email || !formData.gemstone) {
      alert("Please fill in all required fields!");
      return;
    }

    setLoading(true);

    try {
      // Replace this URL with your backend API endpoint
      const response = await fetch("https://your-api.com/gem-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", gemstone: "", details: "" });
      } else {
        alert("Failed to submit. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full min-h-screen bg-cover bg-center relative flex items-center"
      //   style={{ backgroundImage: "url('./gemimages/bluestone.jpeg')" }}
      style={{ backgroundImage: "url('./gemimages/astroquery.jpg')" }}

    >
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <div className="relative z-10 w-full gap-4 flex flex-col lg:flex-row items-center justify-between px-6 lg:px-20 py-16">
        {/* LEFT SIDE - FORM */}
        <div className="lg:w-1/2 w-full bg-white bg-opacity-90 rounded-lg p-8 shadow-lg mb-8 lg:mb-0">
          <h2 className="text-3xl font-bold text-green-700 mb-4 text-center lg:text-left">
            Ask About Your Gem
          </h2>
          <p className="text-gray-700 mb-6 text-center lg:text-left">
            Fill the form and we will get back to you with your dream gemstone.
          </p>

          {submitted ? (
            <div className="text-green-700 font-semibold text-center">
              Thank you! Your inquiry has been submitted.
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <input
                type="text"
                name="gemstone"
                value={formData.gemstone}
                onChange={handleChange}
                placeholder="Gemstone Interested In"
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <textarea
                name="details"
                value={formData.details}
                onChange={handleChange}
                placeholder="Additional Details"
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white p-3 rounded-md font-semibold hover:bg-green-700 transition"
              >
                {loading ? "Submitting..." : "Submit Inquiry"}
              </button>
            </form>
          )}
        </div>

        {/* RIGHT SIDE - CONTENT */}
        <div className="lg:w-1/2 w-full relative overflow-hidden rounded-xl shadow-lg">
  {/* Background Video */}
  <video
    src="./images/gemsvideo.mp4"
    autoPlay
    loop
    muted
    playsInline
    className="w-full h-full object-cover rounded-xl"
  ></video>

  {/* Dark Overlay for Readability */}
  <div className="absolute inset-0 bg-black/50 rounded-xl" />

  {/* Text Content */}
  <div className="absolute inset-0 flex flex-col justify-center px-6 lg:px-10 text-white space-y-4">
    <h2 className="text-4xl font-extrabold tracking-wide">
      Unlock the Beauty of <span className="text-green-400">Natural Gems</span>
    </h2>
    <p className="text-lg text-gray-200 leading-relaxed">
      Each gemstone holds a story — of passion, power, and purity. From rare sapphires to fiery rubies,
      we bring you treasures crafted by nature and polished to perfection.
    </p>
    <p className="text-gray-300">
      Share your desire, and let our gem experts guide you to a piece that reflects your soul.
    </p>
  </div>
</div>

      </div>
    </div>
  );
}
