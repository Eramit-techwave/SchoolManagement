<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Apna School - Central Portal Hub</title>
    
    <style>
        /* --- DESIGN SYSTEM VARIABLES & RESET --- */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }

        :root {
            --primary-color: #1e3a8a;    /* Trust Blue */
            --secondary-color: #10b981;  /* Emerald Green */
            --student-color: #f97316;    /* Academic Orange */
            --text-dark: #111827;
            --text-light: #4b5563;
            --bg-light: #f8fafc;
            --white: #ffffff;
            --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        body {
            background-color: var(--bg-light);
            color: var(--text-dark);
            line-height: 1.6;
            overflow-x: hidden;
        }

        /* --- 1. PREMIUM STICKY NAVBAR --- */
        .navbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.25rem 8%;
            background: var(--white);
            border-bottom: 1px solid #e2e8f0;
            position: sticky;
            top: 0;
            z-index: 1000;
        }

        .logo {
            font-size: 1.4rem;
            font-weight: 700;
            color: var(--primary-color);
            display: flex;
            align-items: center;
            gap: 0.5rem;
            cursor: default;
        }

        .logo span.highlight {
            color: var(--secondary-color);
        }

        .nav-links {
            display: flex;
            gap: 2rem;
        }

        .nav-links a {
            text-decoration: none;
            color: var(--text-light);
            font-weight: 500;
            font-size: 0.95rem;
            transition: var(--transition);
        }

        .nav-links a:hover {
            color: var(--primary-color);
        }

        .btn-nav {
            background-color: var(--primary-color);
            color: var(--white);
            text-decoration: none;
            padding: 0.6rem 1.25rem;
            border-radius: 8px;
            font-weight: 600;
            font-size: 0.9rem;
            transition: var(--transition);
        }

        .btn-nav:hover {
            opacity: 0.9;
        }

        /* --- 2. HERO VISUAL BANNER --- */
        .hero {
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 7rem 1.5rem;
            background: radial-gradient(circle at top, #eff6ff 0%, var(--bg-light) 100%);
        }

        .hero-content {
            max-width: 750px;
        }

        .hero-title {
            font-size: 3rem;
            font-weight: 800;
            line-height: 1.2;
            letter-spacing: -0.02em;
            margin-bottom: 1.5rem;
        }

        .gradient-text {
            background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .hero-subtitle {
            font-size: 1.15rem;
            color: var(--text-light);
            margin-bottom: 2.5rem;
        }

        .btn-main {
            display: inline-block;
            background-color: var(--secondary-color);
            color: var(--white);
            text-decoration: none;
            padding: 0.9rem 2.2rem;
            border-radius: 30px;
            font-weight: 600;
            font-size: 1.05rem;
            box-shadow: 0 10px 20px rgba(16, 185, 129, 0.15);
            transition: var(--transition);
        }

        .btn-main:hover {
            transform: translateY(-2px);
            box-shadow: 0 15px 25px rgba(16, 185, 129, 0.25);
        }

        /* --- 3. THE ROLE GATEWAY GRID --- */
        .portal-section {
            padding: 5rem 8%;
            background: var(--white);
        }

        .section-header {
            text-align: center;
            margin-bottom: 3.5rem;
        }

        .section-title {
            font-size: 2.2rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
        }

        .section-subtitle {
            color: #6b7280;
            font-size: 1.05rem;
        }

        .grid-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 2.5rem;
        }

        /* CARD UX STRUCTURE */
        .portal-card {
            background-color: var(--bg-light);
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            padding: 2.5rem 2rem;
            display: flex;
            flex-direction: column;
            cursor: pointer;
            transition: var(--transition);
        }

        .portal-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            border-color: #cbd5e1;
        }

        .icon-wrapper {
            width: 56px;
            height: 56px;
            border-radius: 12px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 1.6rem;
            margin-bottom: 1.5rem;
        }

        .card-title {
            font-size: 1.3rem;
            font-weight: 600;
            margin-bottom: 0.75rem;
        }

        .card-description {
            color: var(--text-light);
            font-size: 0.95rem;
            line-height: 1.5;
            margin-bottom: 2rem;
            flex-grow: 1;
        }

        .card-btn {
            display: block;
            text-decoration: none;
            color: var(--white);
            padding: 0.75rem 1.25rem;
            border-radius: 8px;
            font-weight: 600;
            font-size: 0.9rem;
            text-align: center;
            transition: var(--transition);
        }

        .card-btn:hover {
            opacity: 0.9;
            transform: scale(1.02);
        }

        /* --- 4. CLEAN FOOTER --- */
        .footer {
            text-align: center;
            padding: 2rem;
            background: var(--bg-light);
            border-top: 1px solid #e2e8f0;
            color: #6b7280;
            font-size: 0.88rem;
        }

        /* RESPONSIVE DESIGN FOR SMARTPHONES */
        @media (max-width: 768px) {
            .nav-links { display: none; }
            .hero-title { font-size: 2.2rem; }
            .portal-section { padding: 4rem 5%; }
        }
    </style>
</head>
<body>

    <header class="navbar">
        <div class="logo">
            <span>🏫 Apna<span class="highlight">School</span></span>
        </div>
        <nav class="nav-links">
            <a href="#features">Features</a>
            <a href="#portal">Portals</a>
            <a href="#about">About</a>
        </nav>
        <div>
            <a href="#portal" class="btn-nav">Quick Access</a>
        </div>
    </header>

    <section class="hero">
        <div class="hero-content">
            <h1 class="hero-title">
                Welcome to the Future of <br>
                <span class="gradient-text">School Management</span>
            </h1>
            <p class="hero-subtitle">
                A centralized, modern digital hub tailored specifically for students, educators, and administrators. Everything you need is just one click away.
            </p>
            <a href="#portal" class="btn-main">Explore Portals ↓</a>
        </div>
    </section>

    <section id="portal" class="portal-section">
        <div class="section-header">
            <h2 class="section-title">Select Your Gateway</h2>
            <p class="section-subtitle">Choose your personalized workspace to manage your day-to-day operations seamlessly.</p>
        </div>

        <div class="grid-container">
            
            <div class="portal-card">
                <div class="icon-wrapper" style="background-color: #eff6ff; color: #1e3a8a;">🔑</div>
                <h3 class="card-title">Admin Terminal</h3>
                <p class="card-description">
                    Complete control center for system configurations, admissions, data management, and financial auditing.
                </p>
                <a href="#" class="card-btn" style="background-color: var(--primary-color);">Access System →</a>
            </div>

            <div class="portal-card">
                <div class="icon-wrapper" style="background-color: #ecfdf5; color: #10b981;">📚</div>
                <h3 class="card-title">Faculty Portal</h3>
                <p class="card-description">
                    Effortlessly track daily attendance, update grading structures, manage class updates, and schedule assignments.
                </p>
                <a href="#" class="card-btn" style="background-color: var(--secondary-color);">Enter Faculty Area →</a>
            </div>

            <div class="portal-card">
                <div class="icon-wrapper" style="background-color: #fff7ed; color: #f97316;">🎓</div>
                <h3 class="card-title">Student Hub</h3>
                <p class="card-description">
                    Your personalized space to view exam schedules, track performance analytics, and submit ongoing academic assignments.
                </p>
                <a href="#" class="card-btn" style="background-color: var(--student-color);">Open Student Space →</a>
            </div>

        </div>
    </section>

    <footer class="footer">
        <p>© 2026 Apna School Platform. Built with Django & clean UI/UX standards.</p>
    </footer>

</body>
</html>