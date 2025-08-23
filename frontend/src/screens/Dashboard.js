import { Link } from "react-router-dom";
import { BLACK, WHITE } from "../components/Colors";
import { Waves } from "../components/AsstesImports";

export default function Dashboard() {
    return (
        <div className="why-ai-container">
            <video src={Waves} autoPlay loop muted playsInline className="background-video" />

            <div className="content">
                <h1>Why This AI?</h1>

                <p>
                    As a <span className="highlight">React Native</span> developer, I built this AI to guide other developers like me.
                    Whether you’re starting a new project, looking for ideas, or stuck with code,
                    this AI provides you with the best guidance — tailored for <span className="highlight">React Native</span>.
                </p>

                <div className="features">
                    <div className="card">
                        <h3>🚀 Project Ideas</h3>
                        <p>
                            Get unique project ideas designed for <span className="highlight">React Native</span>, from beginner apps to advanced systems.
                        </p>
                    </div>

                    <div className="card">
                        <h3>💡 Code Guidance</h3>
                        <p>
                            Ask for any <span className="highlight">React Native</span> code snippet — authentication, UI, APIs, or animations — and get instant help.
                        </p>
                    </div>

                    <div className="card">
                        <h3>📚 Best Practices</h3>
                        <p>
                            Learn optimized ways of writing <span className="highlight">React Native</span> apps with clean architecture and performance tips.
                        </p>
                    </div>
                </div>

                <div className="developer-section">
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
                </div>
            </div>

            <style>{`
                .why-ai-container {
                    display: flex;
                    background-color: ${BLACK};
                    height: 100vh;
                    width: 100vw;
                    overflow: hidden;
                    position: relative;
                    justify-content: center;
                    align-items: center;
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

                .content {
                    position: relative;
                    z-index: 1;
                    text-align: center;
                    color: ${WHITE};
                    padding: 20px;
                    max-width: 1000px;
                }

                .content h1 {
                    font-size: 42px;
                    font-weight: bold;
                    margin-bottom: 20px;
                }

                .content p {
                    font-size: 18px;
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
                    transition: transform 0.3s ease, background 0.3s ease;
                }

                .card:hover {
                    transform: translateY(-5px);
                    background: rgba(255, 255, 255, 0.15);
                }

                .card h3 {
                    font-size: 20px;
                    margin-bottom: 10px;
                }

                .developer-section {
                    margin-top: 50px;
                }

                .developer-section h2 {
                    font-size: 28px;
                    margin-bottom: 15px;
                }

                .developer-section p {
                    font-size: 18px;
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

                /* Hover effect */
                .start-btn:hover {
                    background: linear-gradient(90deg, #FF6B6B, #FFD93D, #6BCB77);
                    color: ${BLACK};
                    transform: scale(1.05);
                    box-shadow: 0px 6px 15px rgba(0,0,0,0.4);
                }

                /* Press/Active effect */
                .start-btn:active {
                    transform: scale(0.95);
                    box-shadow: 0px 3px 6px rgba(0,0,0,0.2);
                }

                /* Glow pulse animation */
                .start-btn {
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0% { box-shadow: 0 0 10px rgba(255,255,255,0.2); }
                    50% { box-shadow: 0 0 20px rgba(255,255,255,0.6); }
                    100% { box-shadow: 0 0 10px rgba(255,255,255,0.2); }
                }
            `}</style>
        </div>
    );
}
