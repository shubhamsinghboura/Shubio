import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
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
                    Why This AI?
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                    As a <span className="highlight">React Native</span> developer, I built this AI to guide other developers like me.
                    Whether you’re starting a new project, looking for ideas, or stuck with code,
                    this AI provides you with the best guidance — tailored for <span className="highlight">React Native</span>.
                </motion.p>

                <div className="features">
                    {[
                        {
                            title: "🚀 Project Ideas",
                            text: "Get unique project ideas designed for React Native, from beginner apps to advanced systems."
                        },
                        {
                            title: "💡 Code Guidance",
                            text: "Ask for any React Native code snippet — authentication, UI, APIs, or animations — and get instant help."
                        },
                        {
                            title: "📚 Best Practices",
                            text: "Learn optimized ways of writing React Native apps with clean architecture and performance tips."
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
                    <h2>👨‍💻 Built for Developers, by a Developer</h2>
                    <p>
                        I am <b>Shubham Singh Boura</b>, a <span className="highlight">React Native</span> developer with{" "}
                        <b>3.5 years of hands-on experience</b>.
                        This AI reflects my journey — solving problems, giving direction,
                        and speeding up development for other developers like me.
                        <br /><br />
                        It doesn’t just give answers, it <b>chats the same way I talk</b>,
                        carrying my persona, my guidance style, and my supportive nature.
                        When you interact with this AI, it’s like you are directly talking to me.
                    </p>

                    <div className="button-group">
                        <Link to="/Chat" className="start-btn">
                            Start Using AI
                        </Link>
                    </div>

                    {/* Social Icons */}
                    <div className="social-links">
                        <a href="https://github.com/shubhamsinghboura/Shubio.git" target="_blank" rel="noopener noreferrer">
                            <FaGithub />
                        </a>
                        <a href="https://www.linkedin.com/in/shubham-singh-0a4449200/" target="_blank" rel="noopener noreferrer">
                            <FaLinkedin />
                        </a>
                        <a href="https://x.com/shubhamsin64167?s=21" target="_blank" rel="noopener noreferrer">
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
                background: linear-gradient(90deg, #FF6B6B, #FFD93D, #6BCB77);
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
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
                margin-top: 40px;
            }

            .card {
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

            /* Hover effect with shine */
            .start-btn::before {
                content: "";
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(
                    120deg,
                    transparent,
                    rgba(255,255,255,0.6),
                    transparent
                );
                transition: 0.5s;
            }
            .start-btn:hover::before {
                left: 100%;
            }

            .start-btn:hover {
                background: linear-gradient(90deg, #FF6B6B, #FFD93D, #6BCB77);
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

            /* Social Icons */
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
