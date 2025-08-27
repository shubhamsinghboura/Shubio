import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaLinkedin, FaTwitter, FaYoutube } from "react-icons/fa";
import { BLACK, WHITE } from "../components/Colors";
import { Waves } from "../components/AsstesImports";

export default function Dashboard() {
    return (
        <div className="why-ai-container">
            <video
                src={Waves}
                autoPlay
                loop
                muted
                playsInline
                className="background-video"
                aria-hidden="true"
            />

            <div className="overlay"></div>

            <div className="content">
                <motion.h1
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    About Hitesh Choudhary
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                    <span className="highlight">Hitesh Choudhary</span> is a renowned Indian tech educator, software engineer, and YouTuber. 
                    He teaches programming, web development, and machine learning in both English and Hindi through his channels 
                    <span className="highlight"> "Hitesh Choudhary" </span> and <span className="highlight"> "Chai Aur Code" </span>. 
                    He is also the co-founder of <span className="highlight">Learnyst</span> and has contributed to cybercrime solutions for the police and army.
                </motion.p>

                <div className="features">
                    {[
                        {
                            title: "🎥 YouTuber & Educator",
                            text: 'Runs tech-focused YouTube channels "Hitesh Choudhary" (1M+ subscribers) & "Chai Aur Code" (700k+ subscribers), teaching programming and development concepts to a wide audience.'
                        },
                        {
                            title: "💻 Software Engineer",
                            text: "Expertise in JavaScript, Python, C++, web development, and machine learning."
                        },
                        {
                            title: "📈 Business & AI",
                            text: "Co-founder of Learnyst and creator of AI-powered apps that generate significant revenue."
                        },
                        {
                            title: "🌍 Traveler & Explorer",
                            text: "Traveled to over 40 countries, bringing a global perspective to his teaching."
                        },
                        {
                            title: "👔 Corporate & Cybercrime Experience",
                            text: "Former corporate professional; contributed skills to police & army in cybercrime prevention; ex-founder of LCO, ex-CTO, and Sr. Director at PW."
                        }
                    ].map((item, i) => (
                        <motion.div
                            className="card"
                            key={i}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + i * 0.2, duration: 0.6 }}
                        >
                            <h3>{item.title}</h3>
                            <p>{item.text}</p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    className="developer-section"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.6 }}
                >
                    <h2>👨‍💻 A Teacher & Mentor for Developers</h2>
                    <p>
                        Hitesh Choudhary has dedicated his career to teaching and guiding developers. 
                        His YouTube channels, platforms, and tech initiatives help students and professionals learn effectively. 
                        With extensive experience in programming, software development, AI, and entrepreneurship, Hitesh inspires learners to explore, experiment, and grow in technology.
                    </p>

                    <div className="button-group">
                        <Link to="/Chat" className="start-btn">
                            Explore AI Guidance
                        </Link>
                    </div>

                    {/* Social Icons */}
                    <div className="social-links">
                        <a href="https://www.youtube.com/@chaiaurcode" target="_blank" rel="noopener noreferrer">
                            <FaYoutube />
                        </a>
                      
                        <a href="https://www.linkedin.com/in/hiteshchoudhary/" target="_blank" rel="noopener noreferrer">
                            <FaLinkedin />
                        </a>
                        <a href="https://x.com/hiteshdotcom" target="_blank" rel="noopener noreferrer">
                            <FaTwitter />
                        </a>
                    </div>
                </motion.div>
            </div>

            <style>{`
                .why-ai-container {
                    background-color: ${BLACK};
                    min-height: 100vh;  
                    width: 100vw;
                    overflow-x: hidden;  
                    overflow-y: auto;   
                    position: relative;
                    justify-content: center;
                    align-items: center;
                    flex-direction: column;
                    display: flex;
                }

                .background-video {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    z-index: 0;
                }

                .overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.4);
                    z-index: 0;
                }

                .content {
                    position: relative;
                    z-index: 1;
                    text-align: center;
                    color: ${WHITE};
                    padding: 20px;
                    max-width: 1000px;
                }

                .content h1 {
                    font-size: clamp(28px, 5vw, 42px);
                    font-weight: bold;
                    margin-bottom: 20px;
                }

                .content p {
                    font-size: clamp(16px, 2.5vw, 18px);
                    line-height: 1.6;
                    max-width: 700px;
                    margin: 0 auto;
                }

                .highlight {
                    background: linear-gradient(90deg, #ff6b6b, #ff9f43, #1dd1a1);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    font-weight: bold;
                    animation: glow 2s infinite alternate;
                }

                @keyframes glow {
                    from { text-shadow: 0 0 5px rgba(255,255,255,0.2); }
                    to   { text-shadow: 0 0 15px rgba(255,255,255,0.6); }
                }

               .features {
    display: flex;
    flex-wrap: wrap;
    justify-content: center; /* Center all rows */
    gap: 20px;
    margin-top: 40px;
}

.card {
    flex: 1 1 250px; /* Minimum width 250px, grow if space */
    max-width: 300px; /* Optional: prevent cards from becoming too wide */
    padding: 20px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    transition: transform 0.3s ease, background 0.3s ease, border 0.3s ease;
}

                .card:hover {
                    transform: translateY(-8px) scale(1.03);
                    background: rgba(255, 255, 255, 0.15);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                }

                .card h3 {
                    font-size: 20px;
                    margin-bottom: 10px;
                }

                .developer-section {
                    margin-top: 50px;
                }

                .developer-section h2 {
                    font-size: clamp(22px, 4vw, 28px);
                    margin-bottom: 15px;
                }

                .developer-section p {
                    font-size: clamp(16px, 2.5vw, 18px);
                    max-width: 850px;
                    margin: 0 auto 30px;
                    line-height: 1.6;
                }

                .button-group {
                    display: flex;
                    gap: 20px;
                    justify-content: center;
                    flex-wrap: wrap;
                }

                .start-btn {
                    padding: 14px 28px;
                    border-radius: 10px;
                    background-color: ${WHITE};
                    color: ${BLACK};
                    text-decoration: none;
                    font-weight: bold;
                    font-size: 18px;
                    transition: all 0.3s ease;
                    box-shadow: 0px 4px 10px rgba(0,0,0,0.3);
                    position: relative;
                    overflow: hidden;
                }

                .start-btn::before {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(120deg, transparent, rgba(255,255,255,0.6), transparent);
                    transition: 0.5s;
                }

                .start-btn:hover::before {
                    left: 100%;
                }

                .start-btn:hover {
                    background: linear-gradient(90deg, #ff6b6b, #ff9f43, #1dd1a1);
                    color: ${BLACK};
                    transform: scale(1.05);
                    box-shadow: 0px 6px 15px rgba(0,0,0,0.4);
                }

                .start-btn:active {
                    transform: scale(0.95);
                    box-shadow: 0px 3px 6px rgba(0,0,0,0.2);
                }

                .start-btn {
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0% { box-shadow: 0 0 10px rgba(255,255,255,0.2); }
                    50% { box-shadow: 0 0 20px rgba(255,255,255,0.6); }
                    100% { box-shadow: 0 0 10px rgba(255,255,255,0.2); }
                }

                .social-links {
                    margin-top: 25px;
                    display: flex;
                    gap: 25px;
                    justify-content: center;
                }

                .social-links a {
                    font-size: 28px;
                    color: ${WHITE};
                    transition: transform 0.3s ease, color 0.3s ease;
                }

                .social-links a:hover {
                    transform: scale(1.2);
                    color: #00f7ff;
                }
            `}</style>
        </div>
    );
}
